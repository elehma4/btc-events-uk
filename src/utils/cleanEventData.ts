// src/utils/cleanEventData.ts
import { BitcoinerEventDto } from '../models/BitcoinerEventDto';

export function cleanEventData(events: BitcoinerEventDto[]): BitcoinerEventDto[] {
  return events.map(event => {
    if (!event.url || event.url.includes('Insert URL') || event.url.includes('not provided')) {
      const formattedName = event.name.toLowerCase().replace(/[\s&–]+/g, '-');
      const formattedDate = event.startDate.split('T')[0];
      event.url = `https://bitcoinevents.uk/event/${formattedName}/${formattedDate}`;
    }

    event.startDate = cleanDate(event.startDate);
    event.endDate = cleanDate(event.endDate);

    if (!event.location.address.streetAddress || event.location.address.streetAddress.includes('Specific street address')) {
      event.location.address.streetAddress = '';
    }
    if (event.location.geo && (event.location.geo.latitude === 0 || event.location.geo.longitude === 0)) {
      event.location.geo.latitude = 0;
      event.location.geo.longitude = 0;
    }

    // Strip HTML tags from descriptions
    event.description = stripHtmlTags(event.description);

    return event;
  });
}

export function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, match => {
    switch (match) {
      case '&amp;': return '&';
      case '&lt;': return '<';
      case '&gt;': return '>';
      case '&quot;': return '"';
      case '&#39;': return "'";
      default: return match;
    }
  });
}

export function isValidDate(dateStr: string): boolean {
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
  const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  return isoDatePattern.test(dateStr) || isoDateTimePattern.test(dateStr);
}

export function cleanDate(dateStr: string): string {
  const datePattern = /^\d{4}-\d{2}-\d{2}/;
  const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
  
  const match = dateStr.match(dateTimePattern) || dateStr.match(datePattern);
  
  return match ? match[0] : '';
}