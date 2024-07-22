"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./services/scraper");
const logger_1 = require("./utils/logger");
async function main() {
    try {
        const events = await (0, scraper_1.scrapeBitcoinEvents)();
        console.log(JSON.stringify(events, null, 2));
        (0, logger_1.log)('Scraping completed successfully');
    }
    catch (error) {
        (0, logger_1.log)(`Error occurred: ${error.message}`);
    }
}
main();
