import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod";

export const FAMILIES = ["apartments", "deluxe", "family", "standard", "economy"] as const;

export const AMENITIES = [
  "air-con",
  "wifi",
  "flat-tv",
  "private-bath",
  "bathtub-shower",
  "sea-view",
  "balcony",
  "terrace",
  "kitchenette",
  "2-bedrooms",
  "mini-fridge",
  "family-friendly",
  "sofa-bed",
  "renovated-2024",
] as const;

export type Family = (typeof FAMILIES)[number];
export type Amenity = (typeof AMENITIES)[number];

const room = z.object({
  id: z.string(),
  family: z.enum(FAMILIES),
  order: z.number().int().positive(),
  name: z.string(),
  size_m2: z.number().positive(),
  sleeps: z.number().int().positive(),
  sleeps_label: z.string(),
  beds: z.string(),
  view: z.string(),
  outdoor: z.string(),
  description: z.string(),
  amenities: z.array(z.enum(AMENITIES)).max(6),
});

const faqItem = z.object({
  q: z.string(),
  a: z.string(),
});

const trustQuote = z.object({
  text: z.string(),
  author: z.string(),
  location: z.string(),
  when: z.string().optional(),
});

export const collections = {
  site: defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./src/content/site" }),
    schema: z.object({
      hotel: z.object({
        name: z.string(),
        tagline: z.string(),
        location: z.string(),
      }),

      home: z.object({
        hero: z.object({
          eyebrow: z.string(),
          welcome_handwritten: z.string(),
          heading: z.string(),
          sub: z.string(),
          tagline_stable: z.string().optional(),
          tagline_rotators: z.array(z.string()).min(2).optional(),
          cta_primary: z.string(),
          cta_secondary: z.string(),
          polaroid_caption_handwritten: z.string(),
        }),
        about: z.object({
          eyebrow: z.string(),
          heading_part_1: z.string(),
          heading_part_2_handwritten: z.string(),
          handwritten_year: z.string(),
          body: z.array(z.string()),
          signature_handwritten: z.string(),
          photo_caption: z.string(),
        }),
        trust: z.object({
          booking_label: z.string(),
          google_label: z.string(),
          quote: trustQuote,
          read_all_reviews_label: z.string().optional(),
          read_all_reviews_url: z.string().optional(),
        }),
        rooms: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          intro: z.string(),
          preview_card_cta: z.string(),
        }),
        gallery: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          intro: z.string(),
          captions: z.record(z.string(), z.string()).optional(),
        }),
        location: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          cta: z.string(),
        }),
        contact_strip: z.object({
          eyebrow: z.string(),
          heading_part_1: z.string(),
          heading_part_2_handwritten: z.string(),
        }),
        faq: z.object({
          eyebrow: z.string(),
          heading_part_1: z.string(),
          heading_part_2_handwritten: z.string(),
          items: z.array(faqItem).length(6),
          footer_cta_handwritten: z.string(),
        }),
        ready_cta: z.object({
          handwritten: z.string(),
          heading: z.string(),
          sub: z.string().optional(),
          book_label: z.string(),
          whatsapp_label: z.string(),
          map_label: z.string(),
        }).optional(),
      }),

      rooms_page: z.object({
        hero_eyebrow: z.string(),
        hero_heading_part_1: z.string(),
        hero_heading_part_2_handwritten: z.string(),
        hero_intro: z.string(),
        includes: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          handwritten: z.string(),
          pastry_note: z.string(),
          list: z.array(z.string()).min(8).max(12),
        }),
        rules: z.object({
          eyebrow: z.string(),
          heading: z.string(),
          check_in: z.object({ label: z.string(), value: z.string(), note: z.string() }),
          check_out: z.object({ label: z.string(), value: z.string(), note: z.string() }),
          notes: z.object({ label: z.string(), value: z.string() }),
        }),
        cta: z.object({
          handwritten: z.string(),
          heading: z.string(),
          button: z.string(),
        }),
      }),

      contact_page: z.object({
        hero_eyebrow: z.string(),
        hero_heading_part_1: z.string(),
        hero_heading_part_2_handwritten: z.string(),
        hero_intro: z.string(),
        form: z.object({
          heading: z.string(),
          intro: z.string(),
          fields: z.object({
            name: z.string(),
            email: z.string(),
            arrival: z.string(),
            guests: z.string(),
            message: z.string(),
          }),
          submit: z.string(),
          success: z.string(),
        }),
        sidebar: z.object({
          address_label: z.string(),
          hours_label: z.string(),
          speak_to_label: z.string(),
          speak_to_name: z.string(),
          speak_to_role: z.string(),
          speak_to_handwritten: z.string(),
        }),
        directions: z.object({
          eyebrow: z.string(),
          heading: z.string(),
        }),
      }),

      ui: z.object({
        nav: z.object({ home: z.string(), rooms: z.string(), contact: z.string() }),
        buttons: z.object({
          book: z.string(),
          book_short: z.string().optional(),
          map: z.string(),
          details: z.string(),
          next_room: z.string(),
          write: z.string(),
        }),
        filter: z.object({
          all: z.string(),
          apartments: z.string(),
          deluxe: z.string(),
          family: z.string(),
          standard: z.string(),
          economy: z.string(),
        }),
        labels: z.object({
          sleeps: z.string(),
          beds: z.string(),
          size: z.string(),
          view: z.string(),
          outdoor: z.string(),
        }),
        family_groups: z.object({
          apartments: z.string(),
          deluxe: z.string(),
          family: z.string(),
          standard: z.string(),
          economy: z.string(),
        }),
        amenity_labels: z.record(z.enum(AMENITIES), z.string()),
        footer: z.object({
          handwritten: z.string(),
          copyright: z.string(),
        }),
      }),

      rooms: z.array(room).length(11),
    }),
  }),
};
