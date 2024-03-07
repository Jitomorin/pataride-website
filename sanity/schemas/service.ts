import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [
        {
          type: "block",
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    // defineField({
    //   name: "image",
    //   title: "Icon",
    //   type: "string",
    //   components: {
    //     input: FontAwesomeIconInput,
    //   }, // Use your custom input component here
    //   validation: (rule) => rule.required(),
    // }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      // You can customize the icon preview here if needed
    },
  },
});
