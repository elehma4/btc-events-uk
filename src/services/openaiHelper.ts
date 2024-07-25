// src/services/openaiHelper.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { BitcoinerEventDto } from '../models/BitcoinerEventDto';
import { stripHtmlTags, isValidDate, cleanDate } from '../utils/cleanEventData';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function completeEventDetails(event: BitcoinerEventDto): Promise<BitcoinerEventDto> {
  await delay(2000); // 2-second delay to avoid rate limits

  const prompt = `
  Given the following event details, fill in any missing information. Ensure no important details are lost. If any information is incorrect or nonsensical, set the value to an empty string. Use the specific URL format 'bitcoinevents.uk/event/[event-name]' for the event URL. Do not use Google URLs.

  Name: ${event.name}
  Description: ${event.description}
  Image: ${event.image}
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
      Latitude: ${event.location.geo?.latitude}
      Longitude: ${event.location.geo?.longitude}
    Telephone: ${event.location.telephone}
  `;

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are an assistant that specializes in completing event details based on partial information provided. The data will be used in a Bitcoiner events application (OrangePillApp). If any provided information is nonsensical or incorrect, replace it with an empty string.'
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
          event.name = valueStr || event.name;
          break;
        case 'description':
          event.description = stripHtmlTags(valueStr) || event.description;
          break;
        case 'image':
          event.image = valueStr !== "" ? valueStr : event.image;
          break;
        case 'url':
          if (valueStr.includes('google.com') || !valueStr) {
            event.url = `https://bitcoinevents.uk/event/${event.name.toLowerCase().replace(/ /g, '-')}`;
          } else {
            event.url = valueStr;
          }
          break;
        case 'start date':
          event.startDate = isValidDate(cleanDate(valueStr)) ? cleanDate(valueStr) : event.startDate;
          break;
        case 'end date':
          event.endDate = isValidDate(cleanDate(valueStr)) ? cleanDate(valueStr) : event.endDate;
          break;
        case 'location name':
          event.location.name = valueStr || event.location.name;
          break;
        case 'location description':
          event.location.description = valueStr || event.location.description;
          break;
        case 'location url':
          if (!event.url || !event.url.includes('bitcoinevents.uk')) {
            event.location.url = valueStr.includes('google.com') ? '' : valueStr || event.location.url;
        }
          break;
        case 'street address':
          event.location.address.streetAddress = valueStr.includes('Specific street address') ? '' : valueStr || event.location.address.streetAddress;
          break;
        case 'address locality':
          event.location.address.addressLocality = valueStr || event.location.address.addressLocality;
          break;
        case 'address region':
          event.location.address.addressRegion = valueStr || event.location.address.addressRegion;
          break;
        case 'postal code':
          event.location.address.postalCode = valueStr || event.location.address.postalCode;
          break;
        case 'address country':
          event.location.address.addressCountry = valueStr || event.location.address.addressCountry;
          break;
        case 'latitude':
          event.location.geo = event.location.geo || {};
          event.location.geo.latitude = parseFloat(valueStr) || event.location.geo.latitude;
          break;
        case 'longitude':
          event.location.geo = event.location.geo || {};
          event.location.geo.longitude = parseFloat(valueStr) || event.location.geo.longitude;
          break;
        case 'telephone':
          event.location.telephone = valueStr || event.location.telephone;
          break;
      }
    });
  } else {
    console.error('No valid response received from OpenAI.');
  }

  return event;
};