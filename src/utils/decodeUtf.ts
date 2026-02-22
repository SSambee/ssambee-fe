export const decodeUtf8 = (str: string) => {
  if (str.split("").some((c) => c.charCodeAt(0) > 255)) return str;
  try {
    const bytes = new Uint8Array(str.split("").map((c) => c.charCodeAt(0)));
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return str;
  }
};
