# BTC Events UK Scraper

This project is designed to scrape and gather detailed information about Bitcoin events in the UK from the website [Bitcoin Events UK](https://bitcoinevents.uk/). The process involves scraping URLs from the main events page, gathering detailed information from each event page, and using OpenAI to fill in any missing details.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Process Summary](#process-summary)
- [Key Files and Their Functions](#key-files-and-their-functions)
- [Example Output](#example-output)

## Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/elehma4/btc-events-uk.git
    cd btc-events-uk
    ```

2. **Install the dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add your OpenAI API key:
    ```plaintext
    OPENAI_API_KEY=your_openai_api_key
    ```

## Usage

1. **Build the project**:
    ```bash
    npm run build
    ```

2. **Run the scraper**:
    ```bash
    npm run start
    ```

## Process Summary

1. **Scraping Event URLs**:
   - Extract URLs from the main events page.

2. **Scraping Event Details**:
   - Navigate to each specific event URL.
   - Gather detailed information about each event (name, description, location, etc.).
   - Extract geographical data from the embedded Google Maps iframe.

3. **Completing Event Details with OpenAI**:
   - Use OpenAI to fill in any missing information for the event details.
   - Update the DTO (Data Transfer Object) for each event with the completed information.

4. **Cleaning Up Event Data**:
   - Remove invalid placeholders for URLs, dates, addresses, and geo data.
   - Ensure that fields are left missing if data is not available.
   - Validate and clean data for proper formatting.
   - Strip HTML entities and tags from descriptions.

## Key Files and Their Functions

1. **src/index.ts**:
   - Orchestrates the entire scraping and completion process.
   - Logs each step of the process.

2. **services/scraper.ts**:
   - Scrapes the main events page to get the event URLs and basic information.

3. **services/detailScraper.ts**:
   - Scrapes detailed information from each specific event page.
   - Extracts geographical coordinates from the Google Maps iframe.

4. **services/openaiHelper.ts**:
   - Uses OpenAI API to complete any missing event details.

5. **utils/cleanEventData.ts**:
   - Cleans up the final event data by removing invalid placeholders and ensuring proper formatting.

## Example Output

The final output for each event includes all the required information such as name, description, image, URL, dates, and detailed location information including geographical coordinates. Here is an example of the output:

```json
[
  {
    "name": "Bitcoin Walk – Edinburgh",
    "description": "Join the Bitcoin community for a lively walk around Arthur’s Seat every Saturday at 12 PM, where discussions are centered around Bitcoin.",
    "image": "https://i0.wp.com/bitcoinevents.uk/wp-content/uploads/2022/08/img_3490-e1710667635321.jpg?fit=300%2C300&ssl=1",
    "url": "https://bitcoinwalk.org",
    "startDate": "2024-08-03T12:00",
    "endDate": "2024-08-03",
    "location": {
      "name": "Arthur’s Seat",
      "description": "",
      "url": "https://bitcoinwalk.org",
      "address": {
        "streetAddress": "",
        "addressLocality": "Edinburgh",
        "addressRegion": "",
        "postalCode": "EH8 8AZ",
        "addressCountry": "United Kingdom"
      },
      "geo": {
        "latitude": 55.944083,
        "longitude": -3.161833
      },
      "telephone": ""
    }
  },
  ...
]