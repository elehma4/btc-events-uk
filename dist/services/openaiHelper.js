"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeEventDetails = completeEventDetails;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function completeEventDetails(event) {
    await delay(2000); // 2-second delay to avoid rate limits
    const prompt = `
  Given the following event details, fill in any missing information:

  Name: ${event.name}
  Description: ${event.description}
  Image: ${event.image || "N/A"}
  URL: ${event.url}
  Start Date: ${event.startDate}
  End Date: ${event.endDate}
  Location:
    Name: ${event.location.name}
    Description: ${event.location.description}
    URL: ${event.location.url}
    Address:
      Street Address: ${event.location.address.streetAddress}
      Address Locality: ${event.location.address.addressLocality}
      Address Region: ${event.location.address.addressRegion}
      Postal Code: ${event.location.address.postalCode}
      Address Country: ${event.location.address.addressCountry}
    Geo:
      Latitude: ${event.location.geo.latitude}
      Longitude: ${event.location.geo.longitude}
    Telephone: ${event.location.telephone}
  `;
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'You are an assistant that specializes in completing event details based on partial information provided.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        model: 'gpt-4-turbo',
        temperature: 0.7,
        max_tokens: 3000,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
    });
    if (response && response.choices && response.choices.length > 0) {
        const content = response.choices[0].message?.content || '';
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        lines.forEach(line => {
            const [key, ...value] = line.split(':');
            const valueStr = value.join(':').trim();
            switch (key.toLowerCase()) {
                case 'name':
                    event.name = valueStr;
                    break;
                case 'description':
                    event.description = valueStr;
                    break;
                case 'image':
                    event.image = valueStr !== "N/A" ? valueStr : event.image;
                    break;
                case 'url':
                    event.url = valueStr;
                    break;
                case 'start date':
                    event.startDate = valueStr;
                    break;
                case 'end date':
                    event.endDate = valueStr;
                    break;
                case 'location name':
                    event.location.name = valueStr;
                    break;
                case 'location description':
                    event.location.description = valueStr;
                    break;
                case 'location url':
                    event.location.url = valueStr;
                    break;
                case 'street address':
                    event.location.address.streetAddress = valueStr;
                    break;
                case 'address locality':
                    event.location.address.addressLocality = valueStr;
                    break;
                case 'address region':
                    event.location.address.addressRegion = valueStr;
                    break;
                case 'postal code':
                    event.location.address.postalCode = valueStr;
                    break;
                case 'address country':
                    event.location.address.addressCountry = valueStr;
                    break;
                case 'latitude':
                    event.location.geo.latitude = parseFloat(valueStr);
                    break;
                case 'longitude':
                    event.location.geo.longitude = parseFloat(valueStr);
                    break;
                case 'telephone':
                    event.location.telephone = valueStr;
                    break;
            }
        });
    }
    else {
        console.error('No valid response received from OpenAI.');
    }
    return event;
}
;
