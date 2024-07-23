"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeEventDetails = scrapeEventDetails;
const puppeteer_1 = __importDefault(require("puppeteer"));
async function scrapeEventDetails(events) {
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    for (const event of events) {
        if (event.url) {
            await page.goto(event.url);
            // Extract relevant details from the event page
            const eventDetails = await page.evaluate(() => {
                const locationName = document.querySelector('.tribe-venue a')?.textContent?.trim() || '';
                const locationDescription = ''; // Assuming no description is available
                const locationUrl = document.querySelector('.tribe-venue-url a')?.getAttribute('href') || '';
                const streetAddress = document.querySelector('.tribe-street-address')?.textContent?.trim() || '';
                const addressLocality = document.querySelector('.tribe-locality')?.textContent?.trim() || '';
                const addressRegion = ''; // Not available in the given HTML
                const postalCode = document.querySelector('.tribe-postal-code')?.textContent?.trim() || '';
                const addressCountry = document.querySelector('.tribe-country-name')?.textContent?.trim() || '';
                let geoLat = 0; // Default value
                let geoLng = 0; // Default value
                const telephone = ''; // Assuming no telephone information is available
                const iframeSrc = document.querySelector('.tribe-events-venue-map iframe')?.getAttribute('src') || '';
                const geoMatch = iframeSrc.match(/q=([^&]+)/);
                if (geoMatch && geoMatch[1]) {
                    const geoParts = geoMatch[1].split(',');
                    if (geoParts.length === 2) {
                        geoLat = parseFloat(geoParts[0].trim());
                        geoLng = parseFloat(geoParts[1].trim());
                    }
                }
                const name = document.querySelector('.tribe-events-single-event-title')?.textContent?.trim() || '';
                const description = document.querySelector('.tribe-events-single-event-description')?.innerHTML.trim() || '';
                const image = document.querySelector('.tribe-events-event-image img')?.getAttribute('src') || '';
                const startDate = document.querySelector('.tribe-event-date-start')?.getAttribute('title') || '';
                const endDate = startDate; // Assuming end date is the same as start date unless specified
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
                };
            });
            // Assign the extracted details to the event
            Object.assign(event, eventDetails);
        }
    }
    await browser.close();
    return events;
}
;
