// src/utils/cleanEventData.ts
import { BitcoinerEventDto } from '../models/BitcoinerEventDto';

export function cleanEventData(events: BitcoinerEventDto[]): BitcoinerEventDto[] {
  return events.map(event => {
    if (!event.url || event.url.includes('Insert URL') || event.url.includes('not provided')) {
      event.url = `https://bitcoinevents.uk/event/${event.name.toLowerCase().replace(/ /g, '-')}`;
    }
    if (!event.startDate || event.startDate.includes('Missing')) {
      delete event.startDate;
    }
    if (!event.endDate || event.endDate.includes('Missing')) {
      delete event.endDate;
    }
    if (!event.location.address.streetAddress || event.location.address.streetAddress.includes('Specific street address')) {
      delete event.location.address.streetAddress;
    }
    if (event.location.geo && (event.location.geo.latitude === 0 || event.location.geo.longitude === 0)) {
      delete event.location.geo;
    }
    // Strip HTML tags from descriptions
    event.description = stripHtmlTags(event.description);
    return event;
  });
}

export function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, match => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = match;
    return textArea.value;
  });
}

export function isValidDate(dateStr: string): boolean {
  return !isNaN(Date.parse(dateStr));
}