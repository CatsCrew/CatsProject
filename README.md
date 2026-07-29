# Project C.A.T.S 

Website to host all the cats themed around aircraft, military and civilian ground vehicles, and more. 

Visit site here: https://catsproject.pages.dev/

## Story formatting

Story `.txt` files stay plain text — anything written without the markers below renders
exactly as it always has, line breaks included. The optional markers are:

| Write | Result |
| --- | --- |
| `**bold**` or `__bold__` | bold |
| `*italic*` or `_italic_` | italic |
| `~~struck~~` | strikethrough |
| `` `code` `` | monospace chip, nothing inside is parsed |
| `> quoted line` | quote block in its own font, consecutive `>` lines merge |
| `# Heading` (up to `###`) | heading |
| `---` on its own line | divider |
| `\*` | a literal `*` |

Blank lines separate blocks. A `*` surrounded by spaces (`3 * 4`) is left alone, so
existing stories will not pick up accidental italics.

Fonts live in `src/assets/variables.scss` (`$font-quote`, `$font-mono`); block styling is
in `src/components/formatted-text/formatted-text.scss`.