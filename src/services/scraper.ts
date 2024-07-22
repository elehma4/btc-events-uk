import puppeteer from 'puppeteer';
import { BitcoinerEventDto, BitcoinerEventLocationDto } from '../models/BitcoinerEventDto';

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

      // Navigate to the event details page to get more information
      const location: BitcoinerEventLocationDto = {
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

  // Enrich event data by visiting each event's URL
  for (const event of events) {
    if (event.url) {
      await page.goto(event.url);

      // Extract location details from the event page
      const locationDetails = await page.evaluate(() => {
        const locationName = document.querySelector('.tribe-events-venue__name')?.textContent?.trim() || '';
        const locationDescription = document.querySelector('.tribe-venue-description')?.textContent?.trim() || '';
        const locationUrl = document.querySelector('.tribe-events-venue__url a')?.getAttribute('href') || '';
        const address = document.querySelector('.tribe-events-venue__address')?.textContent?.trim().split('\n').map(line => line.trim()).filter(line => line) || [];
        const streetAddress = address[0] || '';
        const addressLocality = address[1] || '';
        const addressRegion = address[2] || '';
        const postalCode = address[3] || '';
        const addressCountry = address[4] || '';
        const geoLat = parseFloat(document.querySelector('.tribe-events-venue__geo .latitude')?.textContent || '0');
        const geoLng = parseFloat(document.querySelector('.tribe-events-venue__geo .longitude')?.textContent || '0');
        const telephone = document.querySelector('.tribe-events-venue__phone')?.textContent?.trim() || '';

        return {
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
        };
      });

      event.location = locationDetails;
    }
  }

  await browser.close();
  return events;
};