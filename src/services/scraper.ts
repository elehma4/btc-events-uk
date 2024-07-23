// src/services/scraper.ts
import puppeteer from 'puppeteer';
import { BitcoinerEventDto } from '../models/BitcoinerEventDto';

export async function scrapeBitcoinEvents(): Promise<BitcoinerEventDto[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://bitcoinevents.uk/events/');

  const events = await page.evaluate(() => {
    const eventElements = document.querySelectorAll('.tribe-events-calendar-list__event-row');
    const eventList: BitcoinerEventDto[] = [];

    eventElements.forEach((eventElement) => {
      const name = eventElement.querySelector('.tribe-events-calendar-list__event-title a')?.textContent?.trim() || '';
      const url = eventElement.querySelector('.tribe-events-calendar-list__event-title a')?.getAttribute('href') || '';
      const startDate = eventElement.querySelector('time')?.getAttribute('datetime') || '';
      const endDate = startDate; // Assuming end date is the same as start date unless specified
      const description = eventElement.querySelector('.tribe-events-calendar-list__event-description')?.textContent?.trim() || '';
      const image = eventElement.querySelector('.tribe-events-calendar-list__event-image img')?.getAttribute('src') || '';

      // Initialize location with empty fields
      const location = {
        name: '',
        description: '',
        url: '',
        address: {
          streetAddress: '',
          addressLocality: '',
          addressRegion: '',
          postalCode: '',
          addressCountry: ''
        },
        geo: {
          latitude: 0,
          longitude: 0
        },
        telephone: ''
      };

      eventList.push({ name, description, image, url, startDate, endDate, location });
    });

    return eventList;
  });

  await browser.close();
  return events;
};