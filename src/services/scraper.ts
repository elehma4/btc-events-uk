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
      const endDate = startDate;
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
          latitude: '',
          longitude: ''
        },
        telephone: ''
      };

      const formattedName = name.toLowerCase().replace(/[\s&–]+/g, '-');
      const formattedDate = startDate.split('T')[0];
      const finalUrl = url ? url : `https://bitcoinevents.uk/event/${formattedName}/${formattedDate}`;

      eventList.push({ name, description, image, url: finalUrl, startDate, endDate, location });
    });

    return eventList;
  });

  await browser.close();
  return events;
};