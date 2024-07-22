export type BitcoinerEventDto = {
    name: string;
    description: string;
    image?: string;
    url: string;
    startDate: string;
    endDate: string;
    location: BitcoinerEventLocationDto;
};

export type BitcoinerEventLocationDto = {
    name: string;
    description: string;
    url: string;
    address: BitcoinerEventAddressDto;
    geo: BitcoinerEventGeoDto;
    telephone: string;
};

export type BitcoinerEventGeoDto = {
    latitude: number;
    longitude: number;
};

export type BitcoinerEventAddressDto = {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
};