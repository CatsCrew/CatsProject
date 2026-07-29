import { CatType } from '@/models/cat-type.enum';

export type InlineMark = 'bold' | 'italic' | 'strike' | 'code';

export type BlockType = 'paragraph' | 'quote' | 'heading' | 'divider';

export interface InlineToken {
    text: string;
    marks: InlineMark[];
    /** Name of the cat this run links to, written as [[Name]] or [[Name|label]]. */
    catName?: string;
    /** Set when the link was written as [[type:Name]] to pick between shared names. */
    catType?: CatType;
    /** Set when the link was written as [[id:xxxx]], for names no type can split. */
    catId?: string;
}

export interface StoryBlock {
    type: BlockType;
    tokens: InlineToken[];
    level?: number;
}

interface Delimiter {
    delimiter: string;
    mark: InlineMark;
    // Underscores are common inside file names and call signs, so they only
    // format when they sit at a word boundary. snake_case_stays_literal.
    wordBoundaryOnly?: boolean;
}

// Longest delimiters first so `**` wins over `*`.
const DELIMITERS: Delimiter[] = [
    { delimiter: '**', mark: 'bold' },
    { delimiter: '__', mark: 'bold', wordBoundaryOnly: true },
    { delimiter: '~~', mark: 'strike' },
    { delimiter: '*', mark: 'italic' },
    { delimiter: '_', mark: 'italic', wordBoundaryOnly: true },
];

const DIVIDER = /^(-{3,}|\*{3,}|_{3,})$/;
const QUOTE = /^>\s?(.*)$/;
const HEADING = /^(#{1,3})\s+(.*)$/;

const CAT_TYPES = Object.values(CatType);

/**
 * Splits a link target into what identifies the cat. "aerocat:Bolt" pins the link
 * to one species when several cats share a name, and "id:xxxx" pins it to exactly
 * one cat when even the type is shared. A colon that is not one of those prefixes
 * is left alone, so names containing colons still work.
 */
function parseLinkTarget(target: string): Pick<InlineToken, 'catName' | 'catType' | 'catId'> {
    const separator = target.indexOf(':');

    if (separator !== -1) {
        const prefix = target.slice(0, separator).trim().toLocaleLowerCase();
        const rest = target.slice(separator + 1).trim();

        if (prefix === 'id') {
            return { catId: rest };
        }

        const catType = CAT_TYPES.find(type => type === prefix);
        if (catType) {
            return { catType, catName: rest };
        }
    }

    return { catName: target.trim() };
}

const isWhitespace = (char: string | undefined): boolean => !char || /\s/.test(char);

const isWordCharacter = (char: string | undefined): boolean => !!char && /[\p{L}\p{N}]/u.test(char);

/** A closer may not be preceded by whitespace, so "3 * 4 * 5" stays literal. */
function canClose(text: string, delimiter: Delimiter, index: number): boolean {
    if (isWhitespace(text[index - 1])) {
        return false;
    }

    return !delimiter.wordBoundaryOnly || !isWordCharacter(text[index + delimiter.delimiter.length]);
}

/** An opener needs text right after it, and must start a word for underscores. */
function canOpen(text: string, delimiter: Delimiter, index: number): boolean {
    if (isWhitespace(text[index + delimiter.delimiter.length])) {
        return false;
    }

    return !delimiter.wordBoundaryOnly || !isWordCharacter(text[index - 1]);
}

/**
 * Every position a delimiter occurs at, paired with whether a search starting
 * there ever reaches a position that can close.
 */
interface CloserIndex {
    positions: number[];
    closes: boolean[];
}

/** Index into `positions` of the first entry at or after `from`, or -1 if none. */
function firstAtOrAfter(positions: number[], from: number): number {
    let low = 0;
    let high = positions.length;

    while (low < high) {
        const mid = (low + high) >> 1;
        if (positions[mid] < from) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }

    return low < positions.length ? low : -1;
}

/**
 * Resolves the closer search for every delimiter position in one right-to-left pass.
 * The search itself is unchanged - on a miss it still resumes past the whole
 * delimiter, so overlapping runs like "****" behave exactly as they always have -
 * but each position is now resolved once and reused, rather than every candidate
 * opener rescanning the rest of the block. That rescan was quadratic on input like
 * "*a *a *a " that never closes, which is a hang on a long enough story.
 */
function buildCloserIndex(text: string, delimiter: Delimiter): CloserIndex {
    const positions: number[] = [];
    let index = text.indexOf(delimiter.delimiter);

    while (index !== -1) {
        positions.push(index);
        index = text.indexOf(delimiter.delimiter, index + 1);
    }

    const closes: boolean[] = new Array(positions.length).fill(false);

    for (let i = positions.length - 1; i >= 0; i--) {
        if (canClose(text, delimiter, positions[i])) {
            closes[i] = true;
            continue;
        }

        const next = firstAtOrAfter(positions, positions[i] + delimiter.delimiter.length);
        closes[i] = next !== -1 && closes[next];
    }

    return { positions, closes };
}

/** Whether the delimiter opened before `from` has anything that can close it. */
function hasCloser(indexes: Map<string, CloserIndex>, delimiter: Delimiter, from: number): boolean {
    const index = indexes.get(delimiter.delimiter);
    if (!index) {
        return false;
    }

    const at = firstAtOrAfter(index.positions, from);

    return at !== -1 && index.closes[at];
}

/**
 * Splits a single line into text runs, each carrying the set of marks active over it.
 * Nesting is supported (`**bold with *italic* inside**`), backslash escapes a delimiter.
 */
export function parseInline(text: string): InlineToken[] {
    const tokens: InlineToken[] = [];
    const open: Delimiter[] = [];
    const closerIndexes = new Map(DELIMITERS.map(d => [d.delimiter, buildCloserIndex(text, d)]));
    let buffer = '';

    const flush = () => {
        if (!buffer) {
            return;
        }

        tokens.push({ text: buffer, marks: open.map(d => d.mark) });
        buffer = '';
    };

    let index = 0;
    while (index < text.length) {
        const char = text[index];

        if (char === '\\' && index + 1 < text.length) {
            buffer += text[index + 1];
            index += 2;
            continue;
        }

        // [[Cat Name]], [[type:Cat Name]] or [[Cat Name|what the reader sees]].
        if (text.startsWith('[[', index)) {
            const end = text.indexOf(']]', index + 2);
            if (end !== -1) {
                const [target, label] = text.slice(index + 2, end).split('|');
                const { catName, catType, catId } = parseLinkTarget(target);

                if (catName || catId) {
                    flush();
                    tokens.push({
                        // An id link with no label shows the cat's own name, which
                        // only the store knows, so leave the text for the renderer.
                        text: label?.trim() || catName || '',
                        marks: open.map(d => d.mark),
                        catName,
                        catType,
                        catId
                    });
                    index = end + 2;
                    continue;
                }
            }
        }

        // Code spans are literal: no markup is parsed inside them.
        if (char === '`') {
            const end = text.indexOf('`', index + 1);
            if (end > index + 1) {
                flush();
                tokens.push({ text: text.slice(index + 1, end), marks: [...open.map(d => d.mark), 'code'] });
                index = end + 1;
                continue;
            }
        }

        const match = DELIMITERS.find(d => text.startsWith(d.delimiter, index));
        if (match) {
            const openIndex = open.findIndex(d => d.delimiter === match.delimiter);

            if (openIndex !== -1 && canClose(text, match, index)) {
                flush();
                open.splice(openIndex, 1);
                index += match.delimiter.length;
                continue;
            }

            const opens = openIndex === -1
                && canOpen(text, match, index)
                && hasCloser(closerIndexes, match, index + match.delimiter.length);

            if (opens) {
                flush();
                open.push(match);
                index += match.delimiter.length;
                continue;
            }
        }

        buffer += char;
        index++;
    }

    flush();

    return tokens;
}

/**
 * Parses a story .txt file into blocks.
 *
 * Blocks are separated by blank lines. Single newlines are preserved by the
 * renderer, so plain unformatted text reads exactly as it was written.
 *
 *   # Heading          (up to ###)
 *   > Quoted line      consecutive lines merge into one quote
 *   ---                divider
 *
 * Inline: **bold**, *italic*, ~~strike~~, `code`, \* to escape.
 */
export function parseStory(content: string): StoryBlock[] {
    const lines = (content ?? '').replace(/\r\n/g, '\n').split('\n');
    const blocks: StoryBlock[] = [];

    let paragraph: string[] = [];
    let quote: string[] = [];

    const flushParagraph = () => {
        if (paragraph.length) {
            blocks.push({ type: 'paragraph', tokens: parseInline(paragraph.join('\n')) });
            paragraph = [];
        }
    };

    const flushQuote = () => {
        if (quote.length) {
            blocks.push({ type: 'quote', tokens: parseInline(quote.join('\n')) });
            quote = [];
        }
    };

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            flushQuote();
            flushParagraph();
            continue;
        }

        if (DIVIDER.test(trimmed)) {
            flushQuote();
            flushParagraph();
            blocks.push({ type: 'divider', tokens: [] });
            continue;
        }

        const quoteMatch = QUOTE.exec(trimmed);
        if (quoteMatch) {
            flushParagraph();
            quote.push(quoteMatch[1]);
            continue;
        }

        const headingMatch = HEADING.exec(trimmed);
        if (headingMatch) {
            flushQuote();
            flushParagraph();
            blocks.push({
                type: 'heading',
                level: headingMatch[1].length,
                tokens: parseInline(headingMatch[2])
            });
            continue;
        }

        flushQuote();
        paragraph.push(line);
    }

    flushQuote();
    flushParagraph();

    return blocks;
}
