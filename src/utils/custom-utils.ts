import { toString } from 'mdast-util-to-string';
import getReadingTime from 'reading-time';
import {fromMarkdown} from 'mdast-util-from-markdown';

export function remarkReadingTime(data) {
    const textOnPage = toString(fromMarkdown(data.content))
    const readingTime = getReadingTime(textOnPage)
    data.minutes = Math.max(
      1,
      Math.round(readingTime.minutes),
    )
    data.words = readingTime.words
}
