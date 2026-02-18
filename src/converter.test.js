import { describe, it, expect } from 'vitest';
import { convert } from './converter.js';

describe('inline markup', () => {
  it('bold', () => {
    expect(convert('**bold**')).toBe('*bold*');
  });

  it('italic', () => {
    expect(convert('_italic_')).toBe('_italic_');
  });

  it('strikethrough', () => {
    expect(convert('~~strike~~')).toBe('~strike~');
  });

  it('inline code', () => {
    expect(convert('`code`')).toBe('`code`');
  });

  it('link with https', () => {
    expect(convert('[Slack](https://slack.com)')).toBe('<https://slack.com|Slack>');
  });

  it('link with http', () => {
    expect(convert('[Example](http://example.com)')).toBe('<http://example.com|Example>');
  });

  it('link with unsafe scheme falls back to #', () => {
    expect(convert('[Bad](javascript:alert(1))')).toBe('<#|Bad>');
  });

  it('image renders alt text only', () => {
    expect(convert('![alt text](https://example.com/img.png)')).toBe('alt text');
  });

  it('escapes & < > in plain text', () => {
    expect(convert('a & b < c > d')).toBe('a &amp; b &lt; c &gt; d');
  });

  it('line break', () => {
    expect(convert('line one  \nline two')).toBe('line one\nline two');
  });

  it('combined bold and italic', () => {
    expect(convert('**_bold italic_**')).toBe('*_bold italic_*');
  });
});

describe('block markup', () => {
  it('paragraph adds double newline (trimmed at output)', () => {
    expect(convert('Hello world')).toBe('Hello world');
  });

  it('heading renders as bold', () => {
    expect(convert('# Title')).toBe('*Title*');
  });

  it('h2 heading renders as bold', () => {
    expect(convert('## Section')).toBe('*Section*');
  });

  it('fenced code block', () => {
    expect(convert('```\nconsole.log("hi")\n```')).toBe('```\nconsole.log("hi")\n```');
  });

  it('fenced code block with language', () => {
    expect(convert('```js\nconst x = 1;\n```')).toBe('```\nconst x = 1;\n```');
  });

  it('blockquote prefixes each line with >', () => {
    expect(convert('> hello\n> world')).toBe('>hello\n>world');
  });

  it('horizontal rule', () => {
    expect(convert('---')).toBe('---');
  });

  it('unordered list', () => {
    expect(convert('- foo\n- bar\n- baz')).toBe('- foo\n- bar\n- baz');
  });

  it('ordered list', () => {
    expect(convert('1. first\n2. second\n3. third')).toBe('1. first\n2. second\n3. third');
  });

  it('nested unordered list flattens body', () => {
    const md = '- parent\n  - child';
    const result = convert(md);
    expect(result).toContain('- parent');
    expect(result).toContain('- child');
  });
});

describe('table rendering', () => {
  const tableMarkdown = `
| Name    | Role      |
| ------- | --------- |
| Alice   | Engineer  |
| Bob     | Designer  |
`.trim();

  it('wraps table in code block', () => {
    const result = convert(tableMarkdown);
    expect(result.startsWith('```')).toBe(true);
    expect(result.endsWith('```')).toBe(true);
  });

  it('includes headers', () => {
    const result = convert(tableMarkdown);
    expect(result).toContain('Name');
    expect(result).toContain('Role');
  });

  it('includes separator row', () => {
    const result = convert(tableMarkdown);
    expect(result).toMatch(/\|-[-|]+\|/);
  });

  it('includes data rows', () => {
    const result = convert(tableMarkdown);
    expect(result).toContain('Alice');
    expect(result).toContain('Engineer');
    expect(result).toContain('Bob');
    expect(result).toContain('Designer');
  });

  it('pads columns to equal width', () => {
    const result = convert(tableMarkdown);
    const lines = result.replace(/```\n?/g, '').trim().split('\n');
    const widths = lines.filter((l) => l.startsWith('|')).map((l) => l.length);
    expect(new Set(widths).size).toBe(1);
  });

  it('strips bold markers from header cells', () => {
    const md = `
| **Name** | **Value** |
| -------- | --------- |
| foo      | bar       |
`.trim();
    const result = convert(md);
    expect(result).not.toContain('**');
    expect(result).toContain('Name');
    expect(result).toContain('Value');
  });
});
