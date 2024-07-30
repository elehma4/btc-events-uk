"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeBitcoinEvents = scrapeBitcoinEvents;
const puppeteer_1 = __importDefault(require("puppeteer"));
async function scrapeBitcoinEvents() {
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://bitcoinevents.uk/events/');
    const events = await page.evaluate(() => {
        const eventElements = document.querySelectorAll('.tribe-events-calendar-list__event-row');
        const eventList = [];
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
}
;
