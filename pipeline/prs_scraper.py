#!/usr/bin/env python3
"""
prs_scraper.py: PRS Legislative Research Data Scraper for LokaSent
Fetches real bill summaries, category classifications, introduction dates, and legislative analysis
directly from prsindia.org to ground our legislative topic models and bill metadata in verifiable public records.
"""

import os
import json
import time
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional

class PRSLegislativeScraper:
    BASE_URL = "https://prsindia.org"
    BILLTRACK_URL = "https://prsindia.org/billtrack"
    
    def __init__(self, cache_dir: str = "cache_prs"):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
        }
        self.cache_dir = cache_dir
        os.makedirs(self.cache_dir, exist_ok=True)

    def _get_page(self, url: str) -> Optional[BeautifulSoup]:
        """Fetches and parses a page with local caching to prevent rate-limiting."""
        cache_file = os.path.join(self.cache_dir, url.replace("https://", "").replace("/", "_") + ".html")
        if os.path.exists(cache_file):
            with open(cache_file, "r", encoding="utf-8") as f:
                return BeautifulSoup(f.read(), "html.parser")
        try:
            time.sleep(0.5) # Polite delay
            resp = requests.get(url, headers=self.headers, timeout=15)
            if resp.status_code == 200:
                with open(cache_file, "w", encoding="utf-8") as f:
                    f.write(resp.text)
                return BeautifulSoup(resp.text, "html.parser")
            else:
                print(f"[PRS Scraper] Error fetching {url}: HTTP {resp.status_code}")
                return None
        except Exception as e:
            print(f"[PRS Scraper] Exception fetching {url}: {e}")
            return None

    def get_major_bills_index(self) -> List[Dict[str, str]]:
        """Scrapes all tracked bills from the main PRS Bills Track directory."""
        soup = self._get_page(self.BILLTRACK_URL)
        if not soup:
            return []
            
        bills = []
        links = soup.find_all('a', href=True)
        seen_slugs = set()
        
        for a in links:
            href = a['href']
            if '/billtrack/' in href and not href.endswith('/billtrack') and not href.endswith('/all'):
                if any(c in href for c in ['category', 'field_bill_category']):
                    continue
                title = a.get_text(strip=True)
                if len(title) > 5 and href not in seen_slugs:
                    seen_slugs.add(href)
                    full_url = self.BASE_URL + href if href.startswith('/') else href
                    bills.append({
                        "title": title,
                        "slug": href.split('/')[-1],
                        "url": full_url
                    })
        print(f"[PRS Scraper] Successfully indexed {len(bills)} unique bills from prsindia.org.")
        return bills

    def parse_bill_details(self, bill_url: str) -> Dict[str, Any]:
        """Scrapes comprehensive summaries, key issues, and metadata for a specific bill."""
        soup = self._get_page(bill_url)
        if not soup:
            return {}
            
        title_el = soup.find('h1') or soup.find('h2')
        title = title_el.get_text(strip=True) if title_el else "Unknown Bill Title"
        
        metadata = {
            "ministry": "Unknown Ministry",
            "introduced_date": "Unknown Date",
            "status": "Unknown Status",
            "house": "Parliament of India"
        }
        
        for dt in soup.find_all(['dt', 'strong', 'b']):
            dt_text = dt.get_text(strip=True).lower()
            dd = dt.find_next(['dd', 'span', 'p'])
            if dd:
                dd_text = dd.get_text(strip=True)
                if 'ministry' in dt_text:
                    metadata["ministry"] = dd_text
                elif 'introduced' in dt_text or 'date' in dt_text:
                    metadata["introduced_date"] = dd_text
                elif 'status' in dt_text:
                    metadata["status"] = dd_text

        paragraphs = []
        for p in soup.find_all('p'):
            p_text = p.get_text(strip=True)
            if len(p_text) > 40 and not any(skip in p_text for skip in ['Creative Commons', 'contact us', 'error occurred']):
                paragraphs.append(p_text)
                
        return {
            "title": title,
            "url": bill_url,
            "metadata": metadata,
            "summary_paragraphs": paragraphs,
            "total_summary_words": sum(len(p.split()) for p in paragraphs),
            "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

if __name__ == "__main__":
    scraper = PRSLegislativeScraper()
    print("Testing PRS Legislative Scraper on major landmark bills...")
    target_slugs = [
        "digital-personal-data-protection-bill-2023",
        "the-farmers-produce-trade-and-commerce-promotion-and-facilitation-bill-2020",
        "the-bharatiya-nyaya-sanhita-2023",
        "the-citizenship-amendment-bill-2019"
    ]
    for slug in target_slugs:
        url = f"https://prsindia.org/billtrack/{slug}"
        details = scraper.parse_bill_details(url)
        if details:
            print(f"\n[BILL] {details['title']} ({details['total_summary_words']} summary words)")
            print(f"       Ministry: {details['metadata'].get('ministry')}")
            if details['summary_paragraphs']:
                print(f"       Summary Preview: {details['summary_paragraphs'][0][:150]}...")
