const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const HTML_TAG_PATTERN = /<[^>]+>/;

const decodeBasicEntities = (value: string) =>
  value
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'");

export const normalizeReportMessageHtml = (value: string) => {
  if (!value.trim()) {
    return "<p></p>";
  }

  if (HTML_TAG_PATTERN.test(value)) {
    return value;
  }

  return plainTextToHtml(value);
};

export const plainTextToHtml = (text: string) => {
  if (!text.trim()) {
    return "<p></p>";
  }

  return text
    .split("\n")
    .map((line) => `<p>${line ? escapeHtml(line) : "<br/>"}</p>`)
    .join("");
};

export const htmlToPlainText = (html: string) => {
  const normalizedHtml = html.replace(/<\s*br\s*\/?>/gi, "\n");

  if (typeof window === "undefined") {
    return decodeBasicEntities(
      normalizedHtml.replace(/<[^>]*>/g, "")
    ).replaceAll("\u00A0", " ");
  }

  const parsed = new DOMParser().parseFromString(normalizedHtml, "text/html");
  return (parsed.body.textContent || "").replaceAll("\u00A0", " ");
};

export const htmlToReadableText = (value: string) => {
  if (!value.trim()) {
    return "";
  }

  if (!HTML_TAG_PATTERN.test(value)) {
    return value
      .replaceAll("\u00A0", " ")
      .split("\n")
      .map((line) => line.trimEnd())
      .filter((line) => line.trim().length > 0)
      .join("\n")
      .trim();
  }

  const html = value
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "• ")
    .replace(/<\s*\/li\s*>/gi, "\n")
    .replace(/<\s*\/p\s*>/gi, "\n")
    .replace(/<\s*\/div\s*>/gi, "\n")
    .replace(/<\s*\/ul\s*>/gi, "")
    .replace(/<\s*\/ol\s*>/gi, "");

  const plain = htmlToPlainText(html);

  return decodeBasicEntities(plain)
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .join("\n")
    .trim();
};
