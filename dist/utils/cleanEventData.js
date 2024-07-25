"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanEventData = cleanEventData;
exports.stripHtmlTags = stripHtmlTags;
exports.isValidDate = isValidDate;
exports.cleanDate = cleanDate;
function cleanEventData(events) {
    return events.map(event => {
        if (!event.url || event.url.includes('Insert URL') || event.url.includes('not provided')) {
            event.url = `https://bitcoinevents.uk/event/${event.name.toLowerCase().replace(/ /g, '-')}`;
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
function stripHtmlTags(str) {
    return str.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, match => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = match;
        return textArea.value;
    });
}
function isValidDate(dateStr) {
    const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
    const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    return isoDatePattern.test(dateStr) || isoDateTimePattern.test(dateStr);
}
function cleanDate(dateStr) {
    const datePattern = /^\d{4}-\d{2}-\d{2}/;
    const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
    const match = dateStr.match(dateTimePattern) || dateStr.match(datePattern);
    return match ? match[0] : '';
}
