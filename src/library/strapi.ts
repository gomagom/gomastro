import type { Blog, Category } from '../interfaces/blog';

interface Props {
  endpoint: string;
  query?: Record<string, string>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

interface Transform {
  data: Blog[] | Category[];
  type: string;
}

/**
 * Fetches data from the Strapi API
 * @param endpoint - The endpoint to fetch from
 * @param query - The query parameters to add to the url
 * @param wrappedByKey - The key to unwrap the response from
 * @param wrappedByList - If the response is a list, unwrap it
 * @returns
 */
export async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const url = new URL(`${import.meta.env.STRAPI_URL}/api/${endpoint}`);
  const headers = new Headers();
  headers.set('Authorization', `Bearer ${import.meta.env.STRAPI_TOKEN}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  const res = await fetch(url.toString(), { headers });
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data as T;
}

/**
 * Transform the response from the Strapi API
 * @param data - The data to transform
 * @param type - The type of data from the Strapi API
 * @returns
 */

export async function transformData<T>({
  data,
  type,
}: Transform): Promise<T> {
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let transformed;
  switch (type) {
    case 'blog': {
      transformed = data.map((content: any, index: number, array: Array<any>) => {
        let thumbnail_url = content.attributes.thumbnail.data?.attributes.url;
        if (thumbnail_url != null) {
          thumbnail_url = `${import.meta.env.STRAPI_URL}${thumbnail_url}`;
        }
        return {
          id: String(content.id),
          slug: content.attributes.slug,
          data: {
              title: content.attributes.title,
              tags: content.attributes.tags.data.map((tag:any) => tag.attributes.name),
              category: content.attributes.category.data.attributes.name,
              published: new Date(content.attributes.publishedAt),
              image: thumbnail_url,
              description: content.attributes.description,
              content: content.attributes.content,
              draft: true,
              nextSlug: array[index - 1]?.attributes.slug,
              nextTitle: array[index - 1]?.attributes.title,
              prevSlug: array[index + 1]?.attributes.slug,
              prevTitle: array[index + 1]?.attributes.title,
          },
        }
      });
      break;
    }
    case 'category': {
      transformed = data.map((content: any) => ({
          id: String(content.id),
          name: content.attributes.name,
      }));
      break;
    }
  }
  return transformed as T;
}
