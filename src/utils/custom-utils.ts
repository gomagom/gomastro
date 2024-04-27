import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import {fromMarkdown} from 'mdast-util-from-markdown';

import { unified, Plugin } from "unified";
import remarkParse from "remark-parse";
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
import remarkDirectiveRehype from 'remark-directive-rehype';
// import { Root, Element, Text } from "hast";
// import { visitParents as visit } from "unist-util-visit-parents"
// import { getImage } from "@astrojs/image";

export function remarkReadingTime(data) {
  const textOnPage = toString(fromMarkdown(data.content))
  const readingTime = getReadingTime(textOnPage)
  data.minutes = Math.max(
    1,
    Math.round(readingTime.minutes),
  )
  data.words = readingTime.words
}

export async function TransformMarkdownToHtml(input: string) {
  const content = await unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkDirectiveRehype)
    .use(remarkBreaks)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    // .use(rehypeImageTransform)
    .use(remarkMath)
    .use(rehypeKatex)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypePrettyCode, {
      theme: 'one-dark-pro', 
      onVisitHighlightedLine(node) {
        node.properties.className?.push('highlighted');
      },
      defaultLang: 'plaintext',
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(input);

  return content.toString();
}
