// Single source of truth for contact + URL placeholders.
// Owner edits this one file when real values arrive — no hunting through 4 YAML translations.

export const SITE = {
  url: "https://www.vilaemes.com",

  contact: {
    phone: "+355 69 486 7654",
    whatsapp: "+355 69 486 7654",
    email: "vilaemes@gmail.com",
    address: ["Rruga Pavarësia", "Plazh, Durrës 2001", "Albania"],
  },

  hours: {
    check_in: "12:00 – 18:00",
    check_out: "07:00 – 11:00",
  },

  links: {
    booking_com: "https://www.booking.com/hotel/al/vila-emes.html",
    instagram: "https://www.instagram.com/vilaemes/",
    google_maps: "https://maps.app.goo.gl/PWWqRPcZb76uutfSA",
    google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4495.525837783402!2d19.48510047719195!3d41.30848697131005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134fd988d042b5b1%3A0xa7caa866087393d0!2sHotel%20Vila%20Emes!5e0!3m2!1sen!2s!4v1778163921675!5m2!1sen!2s",
  },

  ratings: {
    booking: 9.0,
    google: 4.7,
    // Reference snapshots only — neither count is surfaced in JSON-LD anymore
    // (aggregateRating was removed: a business rating itself is self-serving and
    // ineligible for Google's star feature). The visible TrustStrip uses the
    // `booking` / `google` scores above, not these counts. Refresh ~every 2
    // months from booking.com/hotel/al/vila-emes.html and the Google profile.
    booking_review_count: 111, // snapshot 2026-05-09
    google_review_count: 37,   // snapshot 2026-05-09
  },

  // value + label are language-neutral; the per-locale prose blurb for each
  // entry lives in contact_page.directions.blurbs in src/content/site/*.yaml,
  // index-aligned to this array.
  distances: [
    { value: "35 km", label: "Tirana International Airport" },
    { value: "100 m", label: "Durrës Beach" },
    { value: "3 km", label: "Durrës Port" },
    { value: "3.5 km", label: "Centre of Durrës" },
    { value: "5 km", label: "Durrës Amphitheatre" },
  ],
} as const;

export type Site = typeof SITE;
