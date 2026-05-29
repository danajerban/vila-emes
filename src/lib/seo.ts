import { SITE } from "../config/site";

// Hotel JSON-LD blob for the Vila Emes site, emitted on every locale page.
// Coords/address/contact/amenities are language-neutral; description is
// pulled from the per-locale `siteData.seo.hotel_description` so the Google
// hotel panel surfaces localized copy.
//
// Owner decisions baked in:
//   - `starRating` is OMITTED — no official Albanian Ministry of Tourism
//     classification on file.
//   - `aggregateRating` is OMITTED — the property itself is valid, but a
//     SELF-SUPPLIED rating (a business marking up a rating of itself,
//     LocalBusiness/Hotel) is not eligible to generate Google's star rich
//     result and risks a review-snippet manual action, so it can't earn a
//     snippet here. The real Booking 9.0 / Google 4.7 scores stay VISIBLE in
//     the TrustStrip instead (plain content, no schema — which Google permits).
export function hotelJsonLd(name: string, tagline: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": name,
    "description": tagline,
    "url": SITE.url,
    "image": `${SITE.url}/og-image.jpg`,
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
    "numberOfRooms": 17,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SITE.contact.phone,
      "email": SITE.contact.email,
      "contactType": "reservations",
      "availableLanguage": ["English", "Albanian", "Italian"],
    },
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

export function faqPageJsonLd(items: ReadonlyArray<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a },
    })),
  };
}

export function breadcrumbListJsonLd(crumbs: ReadonlyArray<{ name: string; path: string }>) {
  const toAbs = (p: string) => new URL(p.endsWith("/") ? p : `${p}/`, SITE.url).href;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((c, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": c.name,
      "item": toAbs(c.path),
    })),
  };
}

// HotelRoom blocks for /rooms — emitted as a single @graph so Google sees
// every layout as a distinct entity. Offers/priceRange are deliberately
// OMITTED: bookings happen on Booking.com, so any local price would be a
// placeholder and Google penalises those harder than missing prices.
type RoomLdInput = {
  name: string;
  description: string;
  size_m2: number;
  sleeps: number;
  beds: string;
  amenities: ReadonlyArray<string>;
};

export function hotelRoomJsonLd(room: RoomLdInput) {
  return {
    "@type": "HotelRoom",
    "name": room.name,
    "description": room.description,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": room.size_m2,
      "unitCode": "MTK", // ISO 80000 — square metre
    },
    "occupancy": {
      "@type": "QuantitativeValue",
      "maxValue": room.sleeps,
    },
    "bed": room.beds,
    "amenityFeature": room.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      "name": a,
      "value": true,
    })),
  };
}

export function hotelRoomGraphJsonLd(rooms: ReadonlyArray<RoomLdInput>) {
  return {
    "@context": "https://schema.org",
    "@graph": rooms.map(hotelRoomJsonLd),
  };
}

// `<` inside any string field would terminate the surrounding <script> tag
// early when emitted via set:html. Escape to < — JSON.parse decodes it
// back to `<` on the browser side.
export function jsonLdScriptBody(jsonLd: object): string {
  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}
