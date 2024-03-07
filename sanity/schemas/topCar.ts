import { description } from "@/lib/demo.data";
import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "topCar",
  title: "Top Car",
  type: "document",
  fields: [
    defineField({
      name: "uid",
      title: "Uid",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "make",
      title: "Make",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "model",
      title: "Model",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "fuel",
      title: "Fuel",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seats",
      title: "Seats",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      description: "price",
    },
  },
});
