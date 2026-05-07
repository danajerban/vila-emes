// Single source of truth for contact + URL placeholders.
// Owner edits this one file when real values arrive — no hunting through 4 YAML translations.

export const SITE = {
  url: "https://vila-emes.pages.dev", // until custom domain

  contact: {
    phone: "+355 4 867 654",
    whatsapp: "+355 4 867 654",
    email: "vilaemes@gmail.com",
    address: ["Rruga Pavarësia", "Plazh, Durrës 2001", "Albania"],
  },

  hours: {
    front_desk: "24-hour",
    check_in: "12:00 – 18:00",
    check_out: "07:00 – 11:00",
  },

  links: {
    booking_com: "https://www.booking.com/hotel/al/vila-emes.html",
    instagram: "https://instagram.com/vilaemes", // PLACEHOLDER — update when owner provides handle
    google_maps: "https://maps.app.goo.gl/PWWqRPcZb76uutfSA",
    google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4495.525837783402!2d19.48510047719195!3d41.30848697131005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134fd988d042b5b1%3A0xa7caa866087393d0!2sHotel%20Vila%20Emes!5e1!3m2!1sen!2s!4v1778163921675!5m2!1sen!2s",
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
