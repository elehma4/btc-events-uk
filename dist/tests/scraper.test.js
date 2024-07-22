"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("../services/scraper");
describe('Bitcoin Events Scraper', () => {
    it('should scrape events and return an array of objects', async () => {
        const events = await (0, scraper_1.scrapeBitcoinEvents)();
        console.log("Events: ", events);
        expect(events).toBeInstanceOf(Array);
        expect(events.length).toBeGreaterThan(0);
        events.forEach(event => {
            expect(event).toHaveProperty('name');
            expect(event).toHaveProperty('description');
            expect(event).toHaveProperty('image');
            expect(event).toHaveProperty('url');
            expect(event).toHaveProperty('startDate');
            expect(event).toHaveProperty('endDate');
            expect(event.location).toHaveProperty('name');
            expect(event.location).toHaveProperty('description');
            expect(event.location).toHaveProperty('url');
            expect(event.location.address).toHaveProperty('streetAddress');
            expect(event.location.address).toHaveProperty('addressLocality');
            expect(event.location.address).toHaveProperty('addressRegion');
            expect(event.location.address).toHaveProperty('postalCode');
            expect(event.location.address).toHaveProperty('addressCountry');
            expect(event.location.geo).toHaveProperty('latitude');
            expect(event.location.geo).toHaveProperty('longitude');
            expect(event.location).toHaveProperty('telephone');
        });
    }, 30000);
});
