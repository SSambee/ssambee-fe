const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

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
  if (typeof window === "undefined") {
    return html.replace(/<[^>]*>/g, "");
  }

  const container = document.createElement("div");
  container.innerHTML = html;
  return (container.innerText || container.textContent || "").replaceAll(
    "\u00A0",
    " "
  );
};
