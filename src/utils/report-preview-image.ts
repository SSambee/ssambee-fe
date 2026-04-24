"use client";

type ReportPreviewImagePayload = {
  template: "simple" | "premium";
  studentName: string;
  examName: string;
  className: string;
  examDate: string;
  score: number;
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const sanitizeFileName = (value: string) =>
  value.replace(/[/\\?%*:|"<>]/g, "_");

const createSvgMarkup = (payload: ReportPreviewImagePayload) => {
  const templateLabel =
    payload.template === "premium" ? "프리미엄 리포트" : "심플 리포트";
  const safeStudentName = escapeXml(payload.studentName);
  const safeExamName = escapeXml(payload.examName);
  const safeClassName = escapeXml(payload.className);
  const safeExamDate = escapeXml(payload.examDate);
  const safeTemplateLabel = escapeXml(templateLabel);
  const safeScore = escapeXml(String(payload.score));

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4b72f7" />
      <stop offset="100%" stop-color="#2f57e8" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect x="56" y="56" width="1088" height="518" rx="28" fill="#ffffff" fill-opacity="0.96" />
  <text x="96" y="128" font-size="30" font-weight="700" fill="#3863f6">${safeTemplateLabel}</text>
  <text x="96" y="204" font-size="56" font-weight="800" fill="#040405">${safeStudentName}</text>
  <text x="96" y="258" font-size="28" font-weight="600" fill="#6b6f80">${safeClassName}</text>
  <text x="96" y="310" font-size="30" font-weight="700" fill="#4a4d5c">${safeExamName}</text>
  <text x="96" y="356" font-size="24" font-weight="600" fill="#8b90a3">${safeExamDate}</text>
  <text x="96" y="484" font-size="24" font-weight="700" fill="#8b90a3">점수</text>
  <text x="96" y="548" font-size="88" font-weight="800" fill="#3863f6">${safeScore}</text>
  <text x="252" y="548" font-size="42" font-weight="700" fill="#8b90a3">점</text>
</svg>
`.trim();
};

const svgToPngBlob = async (svgBlob: Blob): Promise<Blob | null> => {
  if (typeof window === "undefined") return null;

  const objectUrl = URL.createObjectURL(svgBlob);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () =>
        reject(new Error("리포트 미리보기 이미지 로드에 실패했습니다."));
      nextImage.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;

    const context = canvas.getContext("2d");
    if (!context) return null;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

export const createReportPreviewImageFile = async (
  payload: ReportPreviewImagePayload
) => {
  const fileBaseName = `${sanitizeFileName(payload.studentName)}_${sanitizeFileName(
    payload.examName
  )}_리포트미리보기`;
  const svgMarkup = createSvgMarkup(payload);
  const svgBlob = new Blob([svgMarkup], {
    type: "image/svg+xml;charset=utf-8",
  });

  const pngBlob = await svgToPngBlob(svgBlob);
  if (pngBlob) {
    return new File([pngBlob], `${fileBaseName}.png`, { type: "image/png" });
  }

  return new File([svgBlob], `${fileBaseName}.svg`, {
    type: "image/svg+xml;charset=utf-8",
  });
};
