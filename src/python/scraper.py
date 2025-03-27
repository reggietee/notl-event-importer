#!/usr/bin/env python3
"""
Event Scraper for Niagara-on-the-Lake Events

This script extracts event details from a provided URL, supporting various event websites
in the Niagara-on-the-Lake area.

Usage:
    Called via API from the Next.js application
"""

import re
import json
import argparse
from datetime import datetime
from typing import Dict, Any, Optional, Union, List

import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse


class EventScraper:
    """Main class for scraping event details from websites"""

    def __init__(self, url: str):
        """Initialize with the event URL"""
        self.url = url
        self.domain = urlparse(url).netloc
        self.soup = None
        self.event_data = {
            "eventName": None,
            "date": None,
            "time": None,
            "location": None,
            "description": None,
            "host": None,
            "isFree": True,
            "price": None,
            "imageUrl": None
        }

    def scrape(self) -> Dict[str, Any]:
        """Main method to scrape event details"""
        try:
            # Fetch the page content
            response = requests.get(self.url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            })
            response.raise_for_status()
            
            # Parse HTML
            self.soup = BeautifulSoup(response.content, 'html.parser')
            
            # Determine which scraper to use based on domain
            if "facebook.com" in self.domain:
                self._scrape_facebook_event()
            elif "eventbrite" in self.domain:
                self._scrape_eventbrite_event()
            elif "niagaraonthelake.com" in self.domain:
                self._scrape_notl_official_event()
            else:
                # Generic scraper for unknown sites
                self._scrape_generic_event()
            
            # Clean and validate the data
            self._clean_data()
            
            return self.event_data
            
        except requests.RequestException as e:
            raise Exception(f"Failed to fetch the event page: {str(e)}")
        except Exception as e:
            raise Exception(f"Error scraping event details: {str(e)}")

    def _scrape_facebook_event(self):
        """Extract event details from Facebook event pages"""
        # Facebook events have specific structures
        try:
            # Event name is usually in the title
            title_tag = self.soup.find('title')
            if title_tag:
                self.event_data["eventName"] = title_tag.text.replace(" | Facebook", "").strip()
            
            # Date and time
            date_time_elements = self.soup.select('span[content]')
            for element in date_time_elements:
                if element.has_attr('content') and 'T' in element['content']:
                    try:
                        dt = datetime.fromisoformat(element['content'].replace('Z', '+00:00'))
                        self.event_data["date"] = dt.strftime("%Y-%m-%d")
                        self.event_data["time"] = dt.strftime("%H:%M")
                        break
                    except ValueError:
                        pass
            
            # Location
            location_elements = self.soup.select('a[href*="maps"]')
            if location_elements:
                self.event_data["location"] = location_elements[0].text.strip()
            
            # Description
            desc_elements = self.soup.select('div[data-testid="event-description-text"]')
            if desc_elements:
                self.event_data["description"] = desc_elements[0].text.strip()
            
            # Host
            host_elements = self.soup.select('a[href*="facebook.com"][role="link"]')
            for element in host_elements:
                if element.text and not element.text.startswith("http"):
                    self.event_data["host"] = element.text.strip()
                    break
            
            # Price (Facebook usually mentions if it's free)
            if self.soup.find(string=re.compile(r'free', re.IGNORECASE)):
                self.event_data["isFree"] = True
            else:
                price_elements = self.soup.find(string=re.compile(r'\$\d+'))
                if price_elements:
                    self.event_data["isFree"] = False
                    self.event_data["price"] = price_elements.strip()
            
            # Image
            image_elements = self.soup.select('img[data-imgperflogname="profileCoverPhoto"]')
            if image_elements and image_elements[0].has_attr('src'):
                self.event_data["imageUrl"] = image_elements[0]['src']
                
        except Exception as e:
            print(f"Error in Facebook scraper: {str(e)}")
            # Fall back to generic scraper
            self._scrape_generic_event()

    def _scrape_eventbrite_event(self):
        """Extract event details from Eventbrite event pages"""
        try:
            # Event name
            title_element = self.soup.select('h1.event-title')
            if title_element:
                self.event_data["eventName"] = title_element[0].text.strip()
            
            # Date and time
            date_elements = self.soup.select('span[data-automation="event-details-time-date"]')
            if date_elements:
                date_text = date_elements[0].text.strip()
                # Parse date and time from text like "Saturday, April 15, 2023 at 7:00 PM"
                date_match = re.search(r'(\w+, \w+ \d+, \d{4})', date_text)
                time_match = re.search(r'(\d+:\d+ [AP]M)', date_text)
                
                if date_match:
                    try:
                        date_obj = datetime.strptime(date_match.group(1), "%A, %B %d, %Y")
                        self.event_data["date"] = date_obj.strftime("%Y-%m-%d")
                    except ValueError:
                        pass
                
                if time_match:
                    self.event_data["time"] = time_match.group(1)
            
            # Location
            location_elements = self.soup.select('div[data-automation="event-details-location"]')
            if location_elements:
                self.event_data["location"] = location_elements[0].text.strip()
            
            # Description
            desc_elements = self.soup.select('div[data-automation="listing-event-description"]')
            if desc_elements:
                self.event_data["description"] = desc_elements[0].text.strip()
            
            # Host
            host_elements = self.soup.select('a[data-automation="listing-organizer-name"]')
            if host_elements:
                self.event_data["host"] = host_elements[0].text.strip()
            
            # Price
            price_elements = self.soup.select('div[data-automation="event-details-price"]')
            if price_elements:
                price_text = price_elements[0].text.strip()
                if "free" in price_text.lower():
                    self.event_data["isFree"] = True
                else:
                    price_match = re.search(r'\$\d+(\.\d+)?', price_text)
                    if price_match:
                        self.event_data["isFree"] = False
                        self.event_data["price"] = price_match.group(0)
            
            # Image
            image_elements = self.soup.select('picture img')
            if image_elements and image_elements[0].has_attr('src'):
                self.event_data["imageUrl"] = image_elements[0]['src']
                
        except Exception as e:
            print(f"Error in Eventbrite scraper: {str(e)}")
            # Fall back to generic scraper
            self._scrape_generic_event()

    def _scrape_notl_official_event(self):
        """Extract event details from the official Niagara-on-the-Lake website"""
        try:
            # Event name
            title_element = self.soup.select('h1.entry-title')
            if title_element:
                self.event_data["eventName"] = title_element[0].text.strip()
            
            # Date and time
            date_elements = self.soup.select('.event-date')
            if date_elements:
                date_text = date_elements[0].text.strip()
                # Try to extract date and time
                date_match = re.search(r'(\w+ \d+, \d{4})', date_text)
                time_match = re.search(r'(\d+:\d+ [ap]m)', date_text, re.IGNORECASE)
                
                if date_match:
                    try:
                        date_obj = datetime.strptime(date_match.group(1), "%B %d, %Y")
                        self.event_data["date"] = date_obj.strftime("%Y-%m-%d")
                    except ValueError:
                        pass
                
                if time_match:
                    self.event_data["time"] = time_match.group(1)
            
            # Location
            location_elements = self.soup.select('.event-location')
            if location_elements:
                self.event_data["location"] = location_elements[0].text.strip()
            
            # Description
            desc_elements = self.soup.select('.event-description')
            if desc_elements:
                self.event_data["description"] = desc_elements[0].text.strip()
            
            # Host
            host_elements = self.soup.select('.event-organizer')
            if host_elements:
                self.event_data["host"] = host_elements[0].text.strip()
            
            # Price
            price_elements = self.soup.select('.event-cost')
            if price_elements:
                price_text = price_elements[0].text.strip()
                if "free" in price_text.lower():
                    self.event_data["isFree"] = True
                else:
                    price_match = re.search(r'\$\d+(\.\d+)?', price_text)
                    if price_match:
                        self.event_data["isFree"] = False
                        self.event_data["price"] = price_match.group(0)
            
            # Image
            image_elements = self.soup.select('.event-featured-image img')
            if image_elements and image_elements[0].has_attr('src'):
                self.event_data["imageUrl"] = image_elements[0]['src']
                
        except Exception as e:
            print(f"Error in NOTL official scraper: {str(e)}")
            # Fall back to generic scraper
            self._scrape_generic_event()

    def _scrape_generic_event(self):
        """Generic scraper for unknown event websites"""
        # Try to extract event details using common patterns
        
        # Event name - usually in the title or main heading
        if not self.event_data["eventName"]:
            title_tag = self.soup.find('title')
            if title_tag:
                self.event_data["eventName"] = title_tag.text.split('|')[0].strip()
            
            h1_tags = self.soup.find_all('h1')
            if h1_tags and not self.event_data["eventName"]:
                self.event_data["eventName"] = h1_tags[0].text.strip()
        
        # Look for date patterns in the text
        if not self.event_data["date"]:
            # Common date formats
            date_patterns = [
                r'(\d{1,2}/\d{1,2}/\d{2,4})',  # MM/DD/YYYY
                r'(\d{4}-\d{1,2}-\d{1,2})',    # YYYY-MM-DD
                r'(\w+ \d{1,2}, \d{4})',       # Month DD, YYYY
                r'(\d{1,2} \w+ \d{4})'         # DD Month YYYY
            ]
            
            for pattern in date_patterns:
                date_match = re.search(pattern, self.soup.text)
                if date_match:
                    self.event_data["date"] = date_match.group(1)
                    break
        
        # Look for time patterns
        if not self.event_data["time"]:
            time_patterns = [
                r'(\d{1,2}:\d{2} [AP]M)',      # 7:00 PM
                r'(\d{1,2} [AP]M)',            # 7 PM
                r'(\d{2}:\d{2})'               # 19:00
            ]
            
            for pattern in time_patterns:
                time_match = re.search(pattern, self.soup.text, re.IGNORECASE)
                if time_match:
                    self.event_data["time"] = time_match.group(1)
                    break
        
        # Look for location information
        if not self.event_data["location"]:
            location_keywords = ['location', 'venue', 'place', 'where']
            for keyword in location_keywords:
                location_elements = self.soup.find_all(string=re.compile(f"{keyword}:", re.IGNORECASE))
                if location_elements:
                    # Try to get the text after the keyword
                    location_text = location_elements[0].find_parent().text
                    location_match = re.search(f"{keyword}:(.*?)(?:\n|$)", location_text, re.IGNORECASE)
                    if location_match:
                        self.event_data["location"] = location_match.group(1).strip()
                        break
        
        # Description - look for common description containers
        if not self.event_data["description"]:
            desc_selectors = [
                '.event-description', '.description', '#description',
                '[itemprop="description"]', '.about', '.details'
            ]
            
            for selector in desc_selectors:
                desc_elements = self.soup.select(selector)
                if desc_elements:
                    self.event_data["description"] = desc_elements[0].text.strip()
                    break
            
            # If still no description, use the first substantial paragraph
            if not self.event_data["description"]:
                paragraphs = self.soup.find_all('p')
                for p in paragraphs:
                    if len(p.text.strip()) > 100:  # Substantial paragraph
                        self.event_data["description"] = p.text.strip()
                        break
        
        # Host/organizer
        if not self.event_data["host"]:
            host_keywords = ['organizer', 'host', 'presented by', 'by']
            for keyword in host_keywords:
                host_elements = self.soup.find_all(string=re.compile(f"{keyword}:", re.IGNORECASE))
                if host_elements:
                    host_text = host_elements[0].find_parent().text
                    host_match = re.search(f"{keyword}:(.*?)(?:\n|$)", host_text, re.IGNORECASE)
                    if host_match:
                        self.event_data["host"] = host_match.group(1).strip()
                        break
        
        # Price information
        price_keywords = ['price', 'cost', 'fee', 'ticket', 'admission']
        for keyword in price_keywords:
            price_elements = self.soup.find_all(string=re.compile(f"{keyword}:", re.IGNORECASE))
            if price_elements:
                price_text = price_elements[0].find_parent().text.lower()
                if "free" in price_text:
                    self.event_data["isFree"] = True
                    break
                
                price_match = re.search(r'\$\d+(\.\d+)?', price_text)
                if price_match:
                    self.event_data["isFree"] = False
                    self.event_data["price"] = price_match.group(0)
                    break
        
        # Image - look for event images
        if not self.event_data["imageUrl"]:
            image_selectors = [
                '.event-image img', '.featured-image img', 
                '[itemprop="image"]', '.hero-image img',
                '.banner img', 'img.event'
            ]
            
            for selector in image_selectors:
                image_elements = self.soup.select(selector)
                if image_elements and image_elements[0].has_attr('src'):
                    self.event_data["imageUrl"] = image_elements[0]['src']
                    break
            
            # If still no image, try to find the largest image on the page
            if not self.event_data["imageUrl"]:
                images = self.soup.find_all('img')
                largest_image = None
                max_size = 0
                
                for img in images:
                    if img.has_attr('src') and img.has_attr('width') and img.has_attr('height'):
                        try:
                            width = int(img['width'])
                            height = int(img['height'])
                            size = width * height
                            if size > max_size and size > 10000:  # Minimum size threshold
                                max_size = size
                                largest_image = img
                        except (ValueError, TypeError):
                            pass
                
                if largest_image and largest_image.has_attr('src'):
                    self.event_data["imageUrl"] = largest_image['src']

    def _clean_data(self):
        """Clean and validate the extracted data"""
        # Ensure all fields have at least a default value
        for key in self.event_data:
            if self.event_data[key] is None:
                if key == "isFree":
                    self.event_data[key] = True  # Default to free if not specified
                elif key in ["eventName", "date", "time", "location", "description", "host"]:
                    self.event_data[key] = ""  # Empty string for text fields
        
        # Truncate overly long descriptions
        if self.event_data["description"] and len(self.event_data["description"]) > 5000:
            self.event_data["description"] = self.event_data["description"][:5000] + "..."
        
        # Ensure image URL is absolute
        if self.event_data["imageUrl"] and not self.event_data["imageUrl"].startswith(('http://', 'https://')):
            base_url = f"{urlparse(self.url).scheme}://{urlparse(self.url).netloc}"
            if self.event_data["imageUrl"].startswith('/'):
                self.event_data["imageUrl"] = base_url + self.event_data["imageUrl"]
            else:
                self.event_data["imageUrl"] = base_url + '/' + self.event_data["imageUrl"]


def main():
    """Command line interface for the scraper"""
    parser = argparse.ArgumentParser(description='Scrape event details from a URL')
    parser.add_argument('url', help='URL of the event page')
    args = parser.parse_args()
    
    try:
        scraper = EventScraper(args.url)
        event_data = scraper.scrape()
        print(json.dumps(event_data, indent=2))
    except Exception as e:
        print(f"Error: {str(e)}")
        exit(1)


if __name__ == "__main__":
    main()
