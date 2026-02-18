import { Renderer, parse } from 'marked';

function escapeSlackControlChars(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function sanitizeSlackLinkUrl(url) {
  return url.replace(/\|/g, '%7C').replace(/>/g, '%3E');
}

function sanitizeSlackLinkLabel(label) {
  return escapeSlackControlChars(label).replace(/\|/g, '&#124;');
}

class SlackRenderer extends Renderer {
  text(token) {
    if (token.tokens) {
      return this.parser.parseInline(token.tokens);
    }
    return escapeSlackControlChars(token.text);
  }

  strong(token) {
    return `*${this.parser.parseInline(token.tokens)}*`;
  }

  em(token) {
    return `_${this.parser.parseInline(token.tokens)}_`;
  }

  del(token) {
    return `~${this.parser.parseInline(token.tokens)}~`;
  }

  codespan(token) {
    return `\`${token.text}\``;
  }

  link(token) {
    const label = sanitizeSlackLinkLabel(this.parser.parseInline(token.tokens));
    const href = (token.href || '').trim().toLowerCase();
    const safe = href.startsWith('https://') || href.startsWith('http://');
    const url = safe ? sanitizeSlackLinkUrl(token.href.trim()) : '#';
    return `<${url}|${label}>`;
  }

  image(token) {
    return token.text || '';
  }

  br() {
    return '\n';
  }

  paragraph(token) {
    return `${this.parser.parseInline(token.tokens)}\n\n`;
  }

  heading(token) {
    return `*${this.parser.parseInline(token.tokens)}*\n\n`;
  }

  code(token) {
    return `\`\`\`\n${token.text}\n\`\`\`\n\n`;
  }

  blockquote(token) {
    const body = this.parser.parse(token.tokens);
    return body
      .trim()
      .split('\n')
      .map((line) => `>${line}`)
      .join('\n') + '\n\n';
  }

  list(token) {
    return token.items
      .map((item, index) => this.listitem(item, token.ordered, token.start + index))
      .join('') + '\n';
  }

  listitem(token, ordered = false, index = 1) {
    const body = this.parser.parse(token.tokens).trim();
    const bullet = ordered ? `${index}.` : '-';
    return `${bullet} ${body}\n`;
  }

  table(token) {
    const strip = (cell) => this.parser.parseInline(cell.tokens).replace(/\*([^*]+)\*/g, '$1');
    const headers = token.header.map(strip);
    const rows = token.rows.map((row) => row.map(strip));
    const colWidths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => (r[i] || '').length))
    );
    const pad = (str, width) => str + ' '.repeat(width - str.length);
    const formatRow = (cells) => '| ' + cells.map((c, i) => pad(c, colWidths[i])).join(' | ') + ' |';
    const separator = '|-' + colWidths.map((w) => '-'.repeat(w)).join('-|-') + '-|';
    const lines = [formatRow(headers), separator, ...rows.map(formatRow)];
    return '```\n' + lines.join('\n') + '\n```\n\n';
  }

  hr() {
    return '---\n\n';
  }

  space() {
    return '';
  }
}

export function convert(markdown) {
  return parse(markdown, { renderer: new SlackRenderer() }).trim();
}
