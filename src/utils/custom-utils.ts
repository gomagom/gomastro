// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import {fromMarkdown} from 'mdast-util-from-markdown';

import { unified, type Plugin } from "unified";
import remarkParse from "remark-parse";
import rehypeParse from "rehype-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode  from 'rehype-pretty-code';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from "remark-breaks";
import remarkDirective from 'remark-directive';
import rlc from 'remark-link-card';
import remarkDirectiveRehype from 'remark-directive-rehype';
import type { Root, Element } from "hast";
import { visitParents as visit } from "unist-util-visit-parents"
import { getImage } from "astro:assets";

export function remarkReadingTime(data) {
  const textOnPage = toString(fromMarkdown(data.content))
  const readingTime = getReadingTime(textOnPage)
  data.minutes = Math.max(
    1,
    Math.round(readingTime.minutes),
  )
  data.words = readingTime.words
}

const rehypeImageTransform: Plugin<[], Root, Root> = () => {
  return async (tree) => {
    // extract all images url
    const imageUrls = new Map<string, string>();
    visit(tree, "element", (node: Element) => {
      const src = ((node.properties?.src ?? "") as string);
      if (node.tagName === "img" && src.startsWith(import.meta.env.STRAPI_URL)) {
        imageUrls.set(src, "");
      }
    });
    // convert the images
    for (const key of imageUrls.keys()) {
      const img = await cache(key, async () => {
        return (await getImage({ src: key, format: "webp", inferSize: true, quality: 80 })).src;
      });
      imageUrls.set(key, img);
    }

    // replace the images
    visit(tree, "element", (node: Element) => {
      const src = ((node.properties?.src ?? "") as string);
      if (node.tagName === "img" && src.startsWith(import.meta.env.STRAPI_URL)) {
        node.properties.src = imageUrls.get(src) ?? node.properties.src;
        node.properties.decoding = "async";
        node.properties.loading = "lazy";
      }
    });
  }
}

interface LinkOptions {
  domain: string;
}

const rehypeExternalLink: Plugin<[], Root, Root> = (options?: LinkOptions) => {
  const domain = "blog.gomatamago.net";
  const siteDomain = options?.domain ?? domain;

  return async (tree) => {
    visit(tree, "element", (node: Element) => {
      const href = ((node.properties?.href ?? "") as string);
      let adomain: string;
      try {
        adomain = new URL(href).hostname;
      } catch {
        adomain = "";
      }
      if (node.tagName === "a" && adomain !== "" && adomain !== siteDomain) {
        node.properties.target = "_blank";
      }
    });
  };
};

export async function TransformMarkdownToHtml(input: string) {
  const mdcontent = await unified()
    .use(remarkParse)
    .use(rlc, { cache: false, shortenUrl: true })
    .use(remarkDirective)
    .use(remarkDirectiveRehype)
    .use(remarkBreaks)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(remarkMath)
    .use(rehypeImageTransform)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: ["anchor"],
      },
      content: {
        type: "element",
        tagName: "span",
        properties: {
          className: ["anchor-icon"],
          'data-pagefind-ignore': true,
        },
        children: [
          {
            type: "text",
            value: "#",
          },
        ],
      },
    },)
    .use(rehypePrettyCode, {
      theme: 'one-dark-pro', 
      onVisitHighlightedLine(node) {
        node.properties.className?.push('highlighted');
      },
      defaultLang: 'plaintext',
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(input);

  const content = await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeExternalLink)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(mdcontent.toString());
  return content.toString();
}

const cachedData: any = {}

export const cache = async (key: string, handler: () => Promise<any>) => {
  if (!(key in cachedData)) {
    cachedData[key] = await handler()
    console.log("実行！")
  }
  console.log(key)
  return cachedData[key]
}
