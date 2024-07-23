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

## Example Output

The final output for each event includes all the required information such as name, description, image, URL, dates, and detailed location information including geographical coordinates. Here is an example of the output:

```json
[
  {
    "name": "Carlton Town Football Club",
    "description": "Carlton Town Football Club is a community-based football club located in Gedling. Known for its welcoming atmosphere and active local involvement, it serves as a venue for various local events including sports and meetings.",
    "image": "https://i0.wp.com/bitcoinevents.uk/wp-content/uploads/2023/01/3-favicon-512x512-1-e1675457255113.png?fit=300%2C300&ssl=1",
    "url": "https://www.carltontownfc.co.uk",
    "startDate": "Wednesday 24th July 2023",
    "endDate": "Wednesday 24th July 2023",
    "location": {
      "name": "Carlton Town Football Club",
      "description": "",
      "url": "https://www.carltontownfc.co.uk",
      "address": {
        "streetAddress": "Stoke Lane",
        "addressLocality": "Gedling",
        "addressRegion": "Nottinghamshire",
        "postalCode": "NG4 2QS",
        "addressCountry": "United Kingdom"
      },
      "geo": {
        "latitude": 52.9814,
        "longitude": -1.0876
      },
      "telephone": "+44 XXXX XXXXXX (exact number would need to be verified from official sources)"
    }
  },
  ...
]