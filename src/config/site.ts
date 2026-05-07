// Single source of truth for contact + URL placeholders.
// Owner edits this one file when real values arrive — no hunting through 4 YAML translations.

export const SITE = {
  url: "https://vila-emes.pages.dev", // until custom domain

  contact: {
    phone: "+355 ___ ___ ___", // PLACEHOLDER
    whatsapp: "+355 ___ ___ ___", // PLACEHOLDER
    email: "vilaemes@gmail.com",
    address: ["Rruga Pavarësia", "Plazh, Durrës 2001", "Albania"],
  },

  hours: {
    front_desk: "24-hour",
    check_in: "12:00 – 18:00",
    check_out: "07:00 – 11:00",
  },

  links: {
    booking_com: "https://www.booking.com/hotel/al/vila-emes.html", // PLACEHOLDER
    instagram: "https://instagram.com/vilaemes", // PLACEHOLDER
    google_maps: "https://maps.app.goo.gl/PLACEHOLDER",
    google_maps_embed: "https://www.google.com/maps/embed?pb=PLACEHOLDER",
  },

  ratings: {
    booking: 9.0,
    google: 4.7,
  },

  distances: [
    { value: "22 mi", label: "Tirana International Airport", blurb: "Door-to-door taxis run all day; ~35 minutes in light traffic." },
    { value: "100 m", label: "Durrës Beach", blurb: "A two-minute walk through the palm-lined avenue." },
    { value: "3.5 km", label: "Centre of Durrës", blurb: "City buses pass the corner every ten minutes." },
    { value: "3 mi", label: "Durres Amphitheatre", blurb: "The 2nd-century Roman amphitheatre is a 10-minute drive." },
  ],
} as const;

export type Site = typeof SITE;
