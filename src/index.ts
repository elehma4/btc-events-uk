import { scrapeBitcoinEvents } from "./services/scraper";
import { log } from "./utils/logger";

async function main() {
    try {
        const events = await scrapeBitcoinEvents();
        console.log(JSON.stringify(events, null, 2));
        log('Scraping completed successfully');
    } catch (error: any) {
        log(`Error occurred: ${error.message}`);
    }
}

main();