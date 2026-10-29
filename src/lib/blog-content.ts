/**
 * Converts stored HTML blog content into clean, human-readable plain text
 * for the Admin CMS editor so non-technical users never see HTML tags.
 */
export function htmlToPlainText(content: string): string {
  if (!content) return '';

  // If there are no HTML tags, just normalize indentation
  if (!/<[a-z][\s\S]*>/i.test(content)) {
    return content
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  let text = content;

  // Convert headings to standalone lines
  text = text.replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n\n$1\n');

  // Convert list items to bullet points
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n• $1');

  // Convert paragraph endings and line breaks
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<\/(ul|ol|div|section)>/gi, '\n\n');

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode basic HTML entities
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");

  // Clean up line-by-line whitespace and extra blank lines
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Automatically converts plain text pasted by a non-technical user
 * into structured, semantic HTML (<p>, <h3>, <ul><li>, <strong>) behind the scenes.
 */
export function plainTextToHtml(rawText: string): string {
  if (!rawText) return '';

  // First normalize any existing HTML to clean plain text so we format consistently
  const cleanText = htmlToPlainText(rawText);
  const lines = cleanText.split('\n');

  const htmlParts: string[] = [];
  let currentList: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      htmlParts.push(`<ul>\n${currentList.map((item) => `  <li>${item}</li>`).join('\n')}\n</ul>`);
      currentList = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      flushList();
      continue;
    }

    // Check if line is a bullet point (•, -, *)
    const bulletMatch = line.match(/^(?:[•\-*])\s+(.*)$/);
    if (bulletMatch) {
      let itemContent = bulletMatch[1].trim();
      // If bullet has "Label: description", bold the label automatically
      const colonIdx = itemContent.indexOf(':');
      if (colonIdx > 0 && colonIdx < 45) {
        const label = itemContent.slice(0, colonIdx).trim();
        const rest = itemContent.slice(colonIdx + 1).trim();
        itemContent = `<strong>${label}:</strong> ${rest}`;
      }
      currentList.push(itemContent);
      continue;
    }

    flushList();

    // Check if line is a numbered subheading (e.g. "1. Lipid Profile") or short heading
    const isNumberedHeading = /^\d+\.\s+.+$/.test(line) && line.length <= 80 && !line.endsWith('.');
    const isShortHeading =
      line.length <= 70 &&
      !line.endsWith('.') &&
      !line.endsWith('!') &&
      i + 1 < lines.length &&
      lines[i + 1].trim().length > 0;

    if (isNumberedHeading || isShortHeading) {
      htmlParts.push(`<h3>${line}</h3>`);
    } else {
      htmlParts.push(`<p>${line}</p>`);
    }
  }

  flushList();

  return htmlParts.join('\n');
}

