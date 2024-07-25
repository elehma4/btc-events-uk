"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const scraper_1 = require("./services/scraper");
const detailScraper_1 = require("./services/detailScraper");
const openaiHelper_1 = require("./services/openaiHelper");
const cleanEventData_1 = require("./utils/cleanEventData");
const logger_1 = require("./utils/logger");
const fs = __importStar(require("fs"));
async function main() {
    try {
        // Step 1: Scrape the original URL for general information
        let events = await (0, scraper_1.scrapeBitcoinEvents)();
        console.log("Events at Step 1: ", events);
        (0, logger_1.log)('Step 1: General information scraping completed.');
        for (let i = 0; i < events.length; i++) {
            console.log(`Event before Step 2: ${events[i].name}, Start Date: ${events[i].startDate}, End Date: ${events[i].endDate}`);
            // Step 2: Scrape the specific event URL for detailed information
            let detailedEvent = await (0, detailScraper_1.scrapeEventDetails)([events[i]]);
            events[i] = detailedEvent[0];
            console.log(`Event after Step 2: ${events[i].name}, Start Date: ${events[i].startDate}, End Date: ${events[i].endDate}`);
            (0, logger_1.log)(`Step 2: Detailed information scraping completed for event: ${events[i].name}`);
            // Step 3: Use OpenAI API to fill in any missing information
            events[i] = await (0, openaiHelper_1.completeEventDetails)(events[i]);
            console.log(`Event after Step 3: ${events[i].name}, Start Date: ${events[i].startDate}, End Date: ${events[i].endDate}`);
            (0, logger_1.log)(`Step 3: Completing missing event details using OpenAI API completed for event: ${events[i].name}`);
        }
        // Step 4: Clean up final event data
        events = (0, cleanEventData_1.cleanEventData)(events);
        // Save the final result to a JSON file
        const outputPath = './events.json';
        fs.writeFileSync(outputPath, JSON.stringify(events, null, 2));
        (0, logger_1.log)(`Final data successfully saved to ${outputPath}`);
        // Output the final result
        console.log(JSON.stringify(events, null, 2));
        (0, logger_1.log)('Scraping completed successfully');
    }
    catch (error) {
        (0, logger_1.log)(`Error occurred: ${error.message}`);
    }
}
main();
