import { SITE } from "../config/site";

// Hotel JSON-LD blob for the Vila Emes site, emitted on every locale page.
// Coords/address/contact/amenities are language-neutral; description is
// pulled from the per-locale `siteData.hotel.tagline` so the Google hotel
// panel surfaces localized copy.
//
// Owner decisions baked in:
//   - `starRating` is OMITTED — no official Albanian Ministry of Tourism
//     classification on file.
//   - `aggregateRating` is OMITTED — Booking.com review count not yet
//     confirmed; fabricated counts are penalized by Google's review-snippet
//     guidelines.
export function hotelJsonLd(name: string, tagline: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": name,
    "description": tagline,
    "url": SITE.url,
    "image": `${SITE.url}/og-image.png`,
    "telephone": SITE.contact.phone,
    "email": SITE.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rruga Pavarësia, Plazh",
      "addressLocality": "Durrës",
      "addressRegion": "Durrës County",
      "postalCode": "2001",
      "addressCountry": "AL",
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.308487,
      "longitude": 19.485100,
    },
    "hasMap": SITE.links.google_maps,
    "checkinTime": "12:00",
    "checkoutTime": "11:00",
    "petsAllowed": false,
    "priceRange": "€€",
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "Free Wi-Fi", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Air conditioning", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "24-hour front desk", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Free parking", "value": true },
      { "@type": "LocationFeatureSpecification", "name": "Family rooms", "value": true },
    ],
    "sameAs": [
      SITE.links.booking_com,
      SITE.links.instagram,
    ],
  };
}
