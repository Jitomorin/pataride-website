import { apiVersion, dataset, projectId, useCdn } from "@/sanity/env";
import {
  indexQuery,
  type Post,
  postAndMoreStoriesQuery,
  postBySlugQuery,
  postSlugsQuery,
  type Settings,
  settingsQuery,
  employeesQuery,
  Employee,
  serviceBySlugQuery,
  Category,
  categoriesQuery,
  postByCategoriesQuery,
  categorySlugsQuery,
  Service,
  servicesQuery,
  serviceSlugsQuery,
  partnersQuery,
  Partner,
  privacyPolicyQuery,
  PrivacyPolicy,
  Testimonial,
  testimonialsQuery,
  topCarsQuery,
  TopCar,
  linksQuery,
  Link,
  aboutQuery,
  AboutInterface,
} from "./queries";
import { createClient, type SanityClient } from "next-sanity";

export function getClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: "published",
  });
  if (preview) {
    if (!preview.token) {
      throw new Error("You must provide a token to preview drafts");
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: "previewDrafts",
    });
  }
  return client;
}

export const getSanityImageConfig = () => getClient();

export async function getSettings(client: SanityClient): Promise<Settings> {
  return (await client.fetch(settingsQuery)) || {};
}

export async function getAllPosts(client: SanityClient): Promise<Post[]> {
  return (await client.fetch(indexQuery)) || [];
}
export async function getAllPartners(client: SanityClient): Promise<Partner[]> {
  return (await client.fetch(partnersQuery)) || [];
}
export async function getAllLinks(client: SanityClient): Promise<Link[]> {
  return (await client.fetch(linksQuery)) || [];
}
export async function getAllAbout(
  client: SanityClient
): Promise<AboutInterface[]> {
  return (await client.fetch(aboutQuery)) || [];
}
export async function getAllServices(client: SanityClient): Promise<Service[]> {
  return (await client.fetch(servicesQuery)) || [];
}
export async function getAllTopCars(client: SanityClient): Promise<TopCar[]> {
  return (await client.fetch(topCarsQuery)) || [];
}
export async function getAllCategories(
  client: SanityClient
): Promise<Category[]> {
  return (await client.fetch(categoriesQuery)) || [];
}
export async function getAllEmployees(
  client: SanityClient
): Promise<Employee[]> {
  return (await client.fetch(employeesQuery)) || [];
}
export async function getAllTestimonials(
  client: SanityClient
): Promise<Testimonial[]> {
  return (await client.fetch(testimonialsQuery)) || [];
}
export async function getPrivacyPolicy(
  client: SanityClient
): Promise<PrivacyPolicy[]> {
  return (await client.fetch(privacyPolicyQuery)) || [];
}

export async function getAllPostsSlugs(): Promise<Pick<Post, "slug">[]> {
  const client = getClient();
  const slugs = (await client.fetch<string[]>(postSlugsQuery)) || [];
  return slugs.map((slug) => ({ slug }));
}
export async function getAllCategorySlugs(): Promise<Pick<Category, "slug">[]> {
  const client = getClient();
  const slugs = (await client.fetch<string[]>(categorySlugsQuery)) || [];
  return slugs.map((slug) => ({ slug }));
}
export async function getAllServiceSlugs(): Promise<Pick<Service, "slug">[]> {
  const client = getClient();
  const slugs = (await client.fetch<string[]>(serviceSlugsQuery)) || [];
  return slugs.map((slug) => ({ slug }));
}

export async function getPostBySlug(
  client: SanityClient,
  slug: string
): Promise<Post> {
  return (await client.fetch(postBySlugQuery, { slug })) || ({} as any);
}
export async function getPostByCategory(
  client: SanityClient,
  categories: string
): Promise<Post[]> {
  return (
    (await client.fetch(postByCategoriesQuery, { categories })) || ({} as any)
  );
}
export async function getServiceBySlug(
  client: SanityClient,
  slug: string
): Promise<Service> {
  return (await client.fetch(serviceBySlugQuery, { slug })) || ({} as any);
}

export async function getPostAndMoreStories(
  client: SanityClient,
  slug: string
): Promise<{ post: Post; morePosts: Post[] }> {
  return await client.fetch(postAndMoreStoriesQuery, { slug });
}

// export async function getBlogs() {
//   const blogs = await client.fetch(`*[_type == "post"]`);
//   // console.log("Sanity Client:", blogs);
//   return blogs;
// }
