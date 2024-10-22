// src/services/detailScraper.ts
import puppeteer from 'puppeteer';
import { BitcoinerEventDto } from '../models/BitcoinerEventDto';

export async function scrapeEventDetails(events: BitcoinerEventDto[]): Promise<BitcoinerEventDto[]> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const event of events) {
    if (event.url) {
      await page.goto(event.url);

      // Extract relevant details from the event page
      const eventDetails = await page.evaluate(() => {
        const locationName = document.querySelector('.tribe-venue a')?.textContent?.trim() || '';
        const locationDescription = '';
        const locationUrl = document.querySelector('.tribe-venue-url a')?.getAttribute('href') || '';
        const streetAddress = document.querySelector('.tribe-street-address')?.textContent?.trim() || '';
        const addressLocality = document.querySelector('.tribe-locality')?.textContent?.trim() || '';
        const addressRegion = '';
        const postalCode = document.querySelector('.tribe-postal-code')?.textContent?.trim() || '';
        const addressCountry = document.querySelector('.tribe-country-name')?.textContent?.trim() || '';
        let geoLat = '';
        let geoLng = '';
        const telephone = '';

        const iframeSrc = document.querySelector('.tribe-events-venue-map iframe')?.getAttribute('src') || '';
        const geoMatch = iframeSrc.match(/q=([^&]+)/);

        if (geoMatch && geoMatch[1]) {
          const geoParts = geoMatch[1].split(',');
          if (geoParts.length === 2) {
            geoLat = geoParts[0].trim();
            geoLng = geoParts[1].trim();
          }
        }

        const name = document.querySelector('.tribe-events-single-event-title')?.textContent?.trim() || '';
        const description = document.querySelector('.tribe-events-single-event-description')?.innerHTML.trim() || '';
        const image = document.querySelector('.tribe-events-event-image img')?.getAttribute('src') || '';
        const startDate = document.querySelector('.tribe-event-date-start')?.getAttribute('title') || '';
        const endDate = startDate;

        return {
          name,
          description,
          image,
          url: window.location.href,
          startDate,
          endDate,
          location: {
            name: locationName,
            description: locationDescription,
            url: locationUrl,
            address: {
              streetAddress,
              addressLocality,
              addressRegion,
              postalCode,
              addressCountry
            },
            geo: {
              latitude: geoLat,
              longitude: geoLng
            },
            telephone
          }
        } as BitcoinerEventDto;
      });

      // Ensure that dates are not overwritten if they are already set
      if (eventDetails.startDate && eventDetails.startDate !== '') {
        event.startDate = eventDetails.startDate;
      } else {
        eventDetails.startDate = event.startDate;
      }
      
      if (eventDetails.endDate && eventDetails.endDate !== '') {
        event.endDate = eventDetails.endDate;
      } else {
        eventDetails.endDate = event.endDate;
      }

      if (eventDetails.location.url.includes('google.com')) {
        eventDetails.location.url = '';
      }

      // Assign the extracted details to the event
      Object.assign(event, eventDetails);

      console.log(`Event after Step 2: ${event.name}, Start Date: ${event.startDate}, End Date: ${event.endDate}`);
    }
  }

  await browser.close();
  return events;
};