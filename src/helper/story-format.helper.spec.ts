import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { CatType } from '@/models/cat-type.enum';
import { InlineToken, parseInline, parseStory } from './story-format.helper';

/** Collapses tokens to [text, ...marks] tuples so expectations stay readable. */
const runs = (text: string): (string | string[])[][] =>
    parseInline(text).map(token => [token.text, token.marks]);

const plain = (tokens: InlineToken[]): string => tokens.map(token => token.text).join('');

describe('parseInline - marks', () => {
    it('applies each inline marker', () => {
        expect(runs('**bold**')).toEqual([['bold', ['bold']]]);
        expect(runs('__bold__')).toEqual([['bold', ['bold']]]);
        expect(runs('*italic*')).toEqual([['italic', ['italic']]]);
        expect(runs('_italic_')).toEqual([['italic', ['italic']]]);
        expect(runs('~~struck~~')).toEqual([['struck', ['strike']]]);
        expect(runs('`code`')).toEqual([['code', ['code']]]);
    });

    it('nests marks', () => {
        expect(runs('**bold with *italic* inside**')).toEqual([
            ['bold with ', ['bold']],
            ['italic', ['bold', 'italic']],
            [' inside', ['bold']]
        ]);
    });

    it('nests code inside another mark', () => {
        expect(runs('*italic with `code` inside*')).toEqual([
            ['italic with ', ['italic']],
            ['code', ['italic', 'code']],
            [' inside', ['italic']]
        ]);
    });

    it('parses no markup inside code spans', () => {
        expect(runs('`**this stays literal**`')).toEqual([['**this stays literal**', ['code']]]);
    });

    it('marks a run inside a word', () => {
        expect(runs('a*b*c')).toEqual([['a', []], ['b', ['italic']], ['c', []]]);
    });
});

describe('parseInline - things that deliberately do not format', () => {
    it('leaves maths alone, because a marker needs a non-space on both sides', () => {
        expect(runs('3 * 4 * 5 = 60')).toEqual([['3 * 4 * 5 = 60', []]]);
    });

    it('leaves snake_case alone, because underscores need a word boundary', () => {
        expect(runs('snake_case_words_like_this')).toEqual([['snake_case_words_like_this', []]]);
    });

    it('leaves an unclosed marker literal', () => {
        expect(runs('An unclosed **marker stays literal')).toEqual([
            ['An unclosed **marker stays literal', []]
        ]);
    });

    it('honours backslash escapes', () => {
        expect(runs('\\*not italic\\*')).toEqual([['*not italic*', []]]);
        expect(runs('\\*\\*not bold\\*\\*')).toEqual([['**not bold**', []]]);
        expect(runs('\\`not code\\`')).toEqual([['`not code`', []]]);
    });

    // Escaping only the first character of "**" leaves a lone "*" that opens italic,
    // and the trailing pair then closes it a character late. Half-escaping a marker
    // is messy on purpose - the reference tells authors to escape both characters.
    it('escapes exactly one character per backslash', () => {
        expect(runs('\\**still bold**')).toEqual([
            ['*', []],
            ['still bold*', ['italic']]
        ]);
        expect(runs('\\*\\*not bold\\*\\*')).toEqual([['**not bold**', []]]);
    });

    it('passes pipes and punctuation through untouched', () => {
        expect(runs('| Write | Get |')).toEqual([['| Write | Get |', []]]);
    });
});

describe('parseInline - cat links', () => {
    it('links by name', () => {
        expect(parseInline('[[Bolt the Raptor]]')).toEqual([
            { text: 'Bolt the Raptor', marks: [], catName: 'Bolt the Raptor' }
        ]);
    });

    it('uses the author label when given', () => {
        expect(parseInline('[[CDC the Kobra|that Kobra pilot]]')).toEqual([
            { text: 'that Kobra pilot', marks: [], catName: 'CDC the Kobra' }
        ]);
    });

    it('pins a link to one species', () => {
        expect(parseInline('[[aerocat:Bolt]]')).toEqual([
            { text: 'Bolt', marks: [], catName: 'Bolt', catType: CatType.Aerocat }
        ]);
        expect(parseInline('[[landcat:Bolt]]')).toEqual([
            { text: 'Bolt', marks: [], catName: 'Bolt', catType: CatType.Landcat }
        ]);
    });

    it('combines a species with a label', () => {
        expect(parseInline('[[aerocat:Bolt|the one with wings]]')).toEqual([
            { text: 'the one with wings', marks: [], catName: 'Bolt', catType: CatType.Aerocat }
        ]);
    });

    it('links by id, leaving the text for the renderer to fill from the store', () => {
        expect(parseInline('[[id:CzU80J6Euf]]')).toEqual([
            { text: '', marks: [], catId: 'CzU80J6Euf' }
        ]);
    });

    it('links by id with a label', () => {
        expect(parseInline('[[id:6NG0TtaYYQ|the other one]]')).toEqual([
            { text: 'the other one', marks: [], catId: '6NG0TtaYYQ' }
        ]);
    });

    it('keeps a colon that is not a known prefix as part of the name', () => {
        expect(parseInline('[[Cat: The Sequel]]')).toEqual([
            { text: 'Cat: The Sequel', marks: [], catName: 'Cat: The Sequel' }
        ]);
    });

    it('carries surrounding marks onto the link', () => {
        expect(parseInline('**[[Dmitri the Felon]]**')).toEqual([
            { text: 'Dmitri the Felon', marks: ['bold'], catName: 'Dmitri the Felon' }
        ]);
    });

    it('leaves an unclosed bracket literal', () => {
        expect(runs('unclosed [[ bracket')).toEqual([['unclosed [[ bracket', []]]);
    });
});

describe('parseStory - blocks', () => {
    it('splits paragraphs on blank lines and keeps single newlines', () => {
        const blocks = parseStory('one\nstill one\n\ntwo');

        expect(blocks).toHaveLength(2);
        expect(blocks[0].type).toBe('paragraph');
        expect(plain(blocks[0].tokens)).toBe('one\nstill one');
        expect(plain(blocks[1].tokens)).toBe('two');
    });

    it('reads headings up to three levels', () => {
        expect(parseStory('# One').map(b => [b.type, b.level])).toEqual([['heading', 1]]);
        expect(parseStory('## Two').map(b => [b.type, b.level])).toEqual([['heading', 2]]);
        expect(parseStory('### Three').map(b => [b.type, b.level])).toEqual([['heading', 3]]);
        expect(parseStory('#### Four').map(b => b.type)).toEqual(['paragraph']);
    });

    it('merges consecutive quote lines into one block', () => {
        const blocks = parseStory('> one\n> two\n\nafter');

        expect(blocks.map(b => b.type)).toEqual(['quote', 'paragraph']);
        expect(plain(blocks[0].tokens)).toBe('one\ntwo');
    });

    it('formats inside a quote', () => {
        const [quote] = parseStory('> a **bold** word');

        expect(quote.tokens.find(t => t.marks.includes('bold'))?.text).toBe('bold');
    });

    it('reads dividers written any of the three ways', () => {
        expect(parseStory('---').map(b => b.type)).toEqual(['divider']);
        expect(parseStory('___').map(b => b.type)).toEqual(['divider']);
        expect(parseStory('***').map(b => b.type)).toEqual(['divider']);
    });

    it('returns nothing for empty or blank input', () => {
        expect(parseStory('')).toEqual([]);
        expect(parseStory('   \n\n  ')).toEqual([]);
        expect(parseStory(undefined as unknown as string)).toEqual([]);
    });

    it('normalises CRLF line endings', () => {
        expect(parseStory('one\r\n\r\ntwo').map(b => plain(b.tokens))).toEqual(['one', 'two']);
    });
});

/**
 * Runs of three or more identical delimiter characters are the case where the
 * closer search is sensitive to where it starts. These outputs are the long-standing
 * behaviour; a rewrite of the search that changes any of them has changed the format.
 */
describe('parseInline - delimiter runs', () => {
    it.each([
        ['\\______a', [['_', []], ['_a', []]]],
        ['**\\*******', [['*', ['bold']]]],
        ['\\*****', [['*', []]]],
        ['\\id:[[**a\\*******', [['id:[[', []], ['a*', ['bold']]]],
        [
            '_\\*** **a>~~\\______aa**',
            [
                ['*** ', ['italic']],
                ['a>~~_', ['italic', 'bold']],
                ['_aa', ['italic', 'bold']]
            ]
        ],
        [
            '~~___|aerocat: \\aerocat:`*\\***** id:',
            [
                ['~~___|aerocat: aerocat:`', []],
                ['*', ['italic']],
                [' id:', ['italic']]
            ]
        ]
    ])('is stable on %j', (input, expected) => {
        expect(runs(input as string)).toEqual(expected);
    });
});

describe('the shipped formatting reference', () => {
    const reference = readFileSync(
        fileURLToPath(new URL('../../public/stories/FormattingReference.txt', import.meta.url)),
        'utf8'
    );

    it('parses into the blocks it documents', () => {
        const blocks = parseStory(reference);
        const types = new Set(blocks.map(b => b.type));

        expect(types).toEqual(new Set(['heading', 'paragraph', 'quote', 'divider']));
    });

    it('resolves every link it demonstrates', () => {
        const links = parseStory(reference)
            .flatMap(b => b.tokens)
            .filter(t => t.catName || t.catId);

        expect(links.some(t => t.catType === CatType.Aerocat)).toBe(true);
        expect(links.some(t => t.catType === CatType.Landcat)).toBe(true);
        expect(links.filter(t => t.catId).map(t => t.catId)).toEqual(['CzU80J6Euf', '6NG0TtaYYQ']);
    });

    it('leaves its own quick-reference table as plain text', () => {
        const table = parseStory(reference).find(b => plain(b.tokens).includes('| Write'));

        expect(table?.type).toBe('paragraph');
    });
});

/** Deterministic generator, so a failure here is always reproducible. */
function seeded(seed: number): () => number {
    let state = seed >>> 0;

    return () => {
        state = (state + 0x6d2b79f5) >>> 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const ALPHABET = [
    '*', '**', '***', '****', '_', '__', '___', '~~', '`', '\\', '[[', ']]', '|', ':',
    'a', 'b', ' ', '\n', 'id:', 'aerocat:', 'landcat:', '#', '>', '-'
];

function corpus(count: number, seed = 1): string[] {
    const random = seeded(seed);

    return Array.from({ length: count }, () => {
        const length = 1 + Math.floor(random() * 22);

        return Array.from(
            { length },
            () => ALPHABET[Math.floor(random() * ALPHABET.length)]
        ).join('');
    });
}

describe('parseInline - invariants on generated input', () => {
    const inputs = corpus(20000);

    it('never throws', () => {
        expect(() => inputs.forEach(input => parseInline(input))).not.toThrow();
    });

    it('only ever emits known marks', () => {
        const known = new Set(['bold', 'italic', 'strike', 'code']);
        const seen = new Set(inputs.flatMap(input => parseInline(input)).flatMap(t => t.marks));

        expect([...seen].every(mark => known.has(mark))).toBe(true);
    });

    it('never emits an empty run except for an id link the renderer fills in', () => {
        const empty = inputs
            .flatMap(input => parseInline(input))
            .filter(token => token.text === '' && !token.catId);

        expect(empty).toEqual([]);
    });

    it('never invents characters that were not in the input', () => {
        const offender = inputs.find(input => plain(parseInline(input)).length > input.length);

        expect(offender).toBeUndefined();
    });
});

/**
 * Stories are written by other people and fetched at read time, so an input that
 * takes superlinear time to parse freezes the reader's tab. This is the guard: the
 * search below used to be quadratic, and 96 KB of it took roughly ten seconds.
 */
describe('parseStory - adversarial input stays linear', () => {
    it.each([24000, 48000, 96000])('parses %i characters of unclosed markers quickly', size => {
        const text = '*a '.repeat(size / 3);

        const started = performance.now();
        parseStory(text);

        expect(performance.now() - started).toBeLessThan(1000);
    });

    it('parses a block whose only closer is at the very end quickly', () => {
        const text = `${'*a '.repeat(20000)}*x*`;

        const started = performance.now();
        parseStory(text);

        expect(performance.now() - started).toBeLessThan(1000);
    });

    it('parses a long run of delimiter characters quickly', () => {
        const started = performance.now();
        parseStory('**~~__'.repeat(10000));

        expect(performance.now() - started).toBeLessThan(1000);
    });
});
