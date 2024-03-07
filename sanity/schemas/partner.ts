import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "partners",
  title: "Partners",
  icon: UsersIcon,
  type: "document",
  fields: [
    defineField({
      name: "company",
      title: "Company Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "website",
      title: "Website Link",
      type: "url",
    }),
  ],
  preview: {
    select: {
      media: "image",
    },
  },
});
