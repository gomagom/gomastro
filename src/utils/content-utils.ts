import I18nKey from '@i18n/i18nKey'
import { i18n } from '@i18n/translation'
import { getCollection } from 'astro:content'
import { fetchApi, transformData } from '../library/strapi';
import type {Blog} from '../interfaces/blog';

export async function getSortedPosts() {
  const allBlogPosts = await transformData<AstroBlog[]>({
    data: await fetchApi<Blog[]>({
        endpoint: 'blogs?populate=*', // the content type to fetch
        wrappedByKey: 'data', // the key to unwrap the response
    }),
    type: 'blog',
  });
  const sorted = allBlogPosts.sort((a, b) => {
    const dateA = new Date(a.data.published)
    const dateB = new Date(b.data.published)
    return dateA > dateB ? -1 : 1
  })

  for (let i = 1; i < sorted.length; i++) {
    sorted[i].data.nextSlug = sorted[i - 1].slug
    sorted[i].data.nextTitle = sorted[i - 1].data.title
  }
  for (let i = 0; i < sorted.length - 1; i++) {
    sorted[i].data.prevSlug = sorted[i + 1].slug
    sorted[i].data.prevTitle = sorted[i + 1].data.title
  }

  return sorted
}

export type Tag = {
  name: string
  count: number
}

export async function getTagList(): Promise<Tag[]> {
  const allBlogPosts = await transformData<AstroBlog[]>({
    data: await fetchApi<Blog[]>({
        endpoint: 'blogs?populate=*', // the content type to fetch
        wrappedByKey: 'data', // the key to unwrap the response
    }),
    type: 'blog',
  });

  const countMap: { [key: string]: number } = {}
  allBlogPosts.map(post => {
    post.data.tags.map((tag: string) => {
      if (!countMap[tag]) countMap[tag] = 0
      countMap[tag]++
    })
  })

  // sort tags
  const keys: string[] = Object.keys(countMap).sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })

  return keys.map(key => ({ name: key, count: countMap[key] }))
}

export type Category = {
  name: string
  count: number
}

export async function getCategoryList(): Promise<Category[]> {
  const allBlogPosts = await transformData<AstroBlog[]>({
    data: await fetchApi<Blog[]>({
        endpoint: 'blogs?populate=*', // the content type to fetch
        wrappedByKey: 'data', // the key to unwrap the response
    }),
    type: 'blog',
  });
  const count: { [key: string]: number } = {}
  allBlogPosts.map(post => {
    if (!post.data.category) {
      const ucKey = i18n(I18nKey.uncategorized)
      count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1
      return
    }
    count[post.data.category] = count[post.data.category]
      ? count[post.data.category] + 1
      : 1
  })

  const lst = Object.keys(count).sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })

  const ret: Category[] = []
  for (const c of lst) {
    ret.push({ name: c, count: count[c] })
  }
  return ret
}
