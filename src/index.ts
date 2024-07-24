import { scrapeBitcoinEvents } from "./services/scraper";
import { scrapeEventDetails } from "./services/detailScraper";
import { completeEventDetails } from "./services/openaiHelper";
import { cleanEventData } from "./utils/cleanEventData";
import { log } from "./utils/logger";
import * as fs from 'fs';

async function main() {
  try {
    // Step 1: Scrape the original URL for general information
    let events = await scrapeBitcoinEvents();
    console.log("Events at Step 1: ", events);
    log('Step 1: General information scraping completed.');

    for (let i = 0; i < events.length; i++) {
      // Step 2: Scrape the specific event URL for detailed information
      let detailedEvent = await scrapeEventDetails([events[i]]);
      events[i] = detailedEvent[0];
      log(`Step 2: Detailed information scraping completed for event: ${events[i].name}`);

      // Step 3: Use OpenAI API to fill in any missing information
      events[i] = await completeEventDetails(events[i]);
      log(`Step 3: Completing missing event details using OpenAI API completed for event: ${events[i].name}`);
    }

    console.log("events before clean up:", events);

    // Step 4: Clean up final event data
    events = cleanEventData(events);

    console.log("events after clean up:", events);

    // Save the final result to a JSON file
    const outputPath = './events.json';
    fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
    log(`Final data successfully saved to ${outputPath}`);

    // Output the final result
    console.log(JSON.stringify(events, null, 2));
    log('Scraping completed successfully');
  } catch (error: any) {
    log(`Error occurred: ${error.message}`);
  }
}

main();