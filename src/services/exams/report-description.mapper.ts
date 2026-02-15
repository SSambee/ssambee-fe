export type ScopedDescription = {
  commonMessage: string;
  personalMessage: string;
};

export const REPORT_SCOPE_TAG = "[[EDUOPS_REPORT_V1]]";

export const emptyScopedDescription = (): ScopedDescription => ({
  commonMessage: "",
  personalMessage: "",
});

export const parseScopedDescriptionFromRaw = (
  raw: string | null | undefined
): ScopedDescription => {
  if (!raw) {
    return emptyScopedDescription();
  }

  if (!raw.startsWith(REPORT_SCOPE_TAG)) {
    return {
      commonMessage: "",
      personalMessage: raw,
    };
  }

  const payload = raw.slice(REPORT_SCOPE_TAG.length);

  try {
    const parsed = JSON.parse(payload) as Partial<ScopedDescription>;
    return {
      commonMessage:
        typeof parsed.commonMessage === "string" ? parsed.commonMessage : "",
      personalMessage:
        typeof parsed.personalMessage === "string"
          ? parsed.personalMessage
          : "",
    };
  } catch {
    return {
      commonMessage: "",
      personalMessage: raw,
    };
  }
};

export const resolveCommonMessageFromLegacy = (
  rawDescription: string | null | undefined
) => {
  const parsedDescription = parseScopedDescriptionFromRaw(rawDescription);
  const fallbackMessage =
    rawDescription && !rawDescription.startsWith(REPORT_SCOPE_TAG)
      ? rawDescription
      : "";

  return parsedDescription.commonMessage || fallbackMessage;
};
