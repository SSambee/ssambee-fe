/**
 * @param text 분할할 텍스트
 * @param chunkSize 분할 단위 (기본값: 25)
 * @returns 분할된 텍스트 배열 또는 "-"
 */
export const formatTextWithLineBreaks = (
  text: string | null | undefined,
  chunkSize = 25
): string | string[] => {
  if (!text || text.trim() === "") return "-";

  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
};
