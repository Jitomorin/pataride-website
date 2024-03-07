import { description } from "@/lib/demo.data";
import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonials",
  icon: UsersIcon,
  type: "document",
  fields: [
    defineField({
      name: "clientName",
      title: "Client Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "clientImage",
      title: "Client image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "testimonial",
      title: "Testimonial",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "clientName",
      media: "clientImage",
      description: "testimonial",
    },
  },
});
