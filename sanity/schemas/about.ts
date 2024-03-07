import { description } from "@/lib/demo.data";
import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "about",
  title: "About",
  icon: UsersIcon,
  type: "document",
  fields: [
    defineField({
      name: "mission",
      title: "Mission",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "aboutText",
      title: "About Text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "mission",
    },
  },
});
