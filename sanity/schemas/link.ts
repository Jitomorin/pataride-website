import { description } from "@/lib/demo.data";
import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "link",
  title: "Links",
  type: "document",
  fields: [
    defineField({
      name: "linkedin",
      title: "LinkedIn Link",
      type: "url",
    }),
    defineField({
      name: "instagram",
      title: "Instagram Link",
      type: "url",
    }),
    defineField({
      name: "facebook",
      title: "Facebook Link",
      type: "url",
    }),
    defineField({
      name: "whatsapp",
      title: "Whatsapp Link",
      type: "url",
    }),
    defineField({
      name: "bookWhatsapp",
      title: "Whatsapp Link (Book)",
      type: "url",
    }),
    defineField({
      name: "bookEmail",
      title: "Email (Book)",
      type: "email",
    }),
  ],
  preview: {
    select: {
      title: "URL",
    },
  },
});
