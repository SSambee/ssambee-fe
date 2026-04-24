import { cn } from "@/lib/utils";

export type StudentProfileAvatarSize = "Large" | "Medium" | "Medium-2" | "XL";
export type StudentProfileAvatarSort = "1" | "2" | "3" | "4";

const AVATAR_SIZE_MAP: Record<StudentProfileAvatarSize, number> = {
  Large: 56,
  Medium: 40,
  "Medium-2": 48,
  XL: 64,
};

const FIGMA_NODE_BY_PRESET: Record<
  `${StudentProfileAvatarSize}-${StudentProfileAvatarSort}`,
  string
> = {
  "Large-1": "39:10846",
  "Large-2": "154:32550",
  "Large-3": "154:32733",
  "Large-4": "154:32700",
  "Medium-1": "49:14425",
  "Medium-2": "154:32595",
  "Medium-3": "154:32770",
  "Medium-4": "154:32699",
  "Medium-2-1": "484:46014",
  "Medium-2-2": "484:45992",
  "Medium-2-3": "484:45957",
  "Medium-2-4": "484:45975",
  "XL-1": "315:38523",
  "XL-2": "315:38523",
  "XL-3": "315:38523",
  "XL-4": "315:38523",
};

type StudentProfileAvatarProps = {
  sizePreset?: StudentProfileAvatarSize;
  sort?: StudentProfileAvatarSort;
  seedKey?: string;
  size?: number;
  className?: string;
  label?: string;
};

const SORT_OPTIONS: StudentProfileAvatarSort[] = ["1", "2", "3", "4"];

export function getStudentAvatarSortFromSeed(
  seedKey: string
): StudentProfileAvatarSort {
  let hash = 0;
  for (let idx = 0; idx < seedKey.length; idx += 1) {
    hash = (hash * 31 + seedKey.charCodeAt(idx)) >>> 0;
  }

  return SORT_OPTIONS[hash % SORT_OPTIONS.length];
}

export const STUDENT_PROFILE_AVATAR_PRESETS: Array<{
  sizePreset: StudentProfileAvatarSize;
  sort: StudentProfileAvatarSort;
  figmaNodeId: string;
}> = [
  { sizePreset: "Large", sort: "3", figmaNodeId: "154:32733" },
  { sizePreset: "Large", sort: "4", figmaNodeId: "154:32700" },
  { sizePreset: "Medium-2", sort: "4", figmaNodeId: "484:45975" },
  { sizePreset: "Medium", sort: "4", figmaNodeId: "154:32699" },
  { sizePreset: "Medium", sort: "3", figmaNodeId: "154:32770" },
  { sizePreset: "Medium-2", sort: "3", figmaNodeId: "484:45957" },
  { sizePreset: "Medium-2", sort: "2", figmaNodeId: "484:45992" },
  { sizePreset: "Medium", sort: "2", figmaNodeId: "154:32595" },
  { sizePreset: "Medium", sort: "1", figmaNodeId: "49:14425" },
  { sizePreset: "Medium-2", sort: "1", figmaNodeId: "484:46014" },
  { sizePreset: "Large", sort: "2", figmaNodeId: "154:32550" },
  { sizePreset: "Large", sort: "1", figmaNodeId: "39:10846" },
  { sizePreset: "XL", sort: "1", figmaNodeId: "315:38523" },
];

const SHIRT_COLOR_BY_SORT: Record<StudentProfileAvatarSort, string> = {
  "1": "#5E80F8",
  "2": "#8B7FD6",
  "3": "#7FCFC4",
  "4": "#0CC16A",
};

const SKIN_COLOR_BY_SORT: Record<StudentProfileAvatarSort, string> = {
  "1": "#F4D8B4",
  "2": "#F3D4B5",
  "3": "#E8CCA8",
  "4": "#F0D2A9",
};

export function StudentProfileAvatar({
  sizePreset = "Medium",
  sort,
  seedKey,
  size,
  className,
  label = "학생 프로필 이미지",
}: StudentProfileAvatarProps) {
  const resolvedSort: StudentProfileAvatarSort =
    sizePreset === "XL"
      ? "1"
      : sort || (seedKey ? getStudentAvatarSortFromSeed(seedKey) : "1");
  const presetSize = AVATAR_SIZE_MAP[sizePreset];
  const pixelSize = size ?? presetSize;
  const figmaNodeId = FIGMA_NODE_BY_PRESET[`${sizePreset}-${resolvedSort}`];

  return (
    <span
      role="img"
      aria-label={label}
      data-node-id={figmaNodeId}
      className={cn(
        "inline-block shrink-0 overflow-hidden rounded-full",
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="32" cy="32" r="32" fill="#2B2E3A" />

        <path
          d="M8 64C8 49.64 19.64 38 34 38H36C50.36 38 62 49.64 62 64H8Z"
          fill={SHIRT_COLOR_BY_SORT[resolvedSort]}
        />

        <circle
          cx="32"
          cy="29"
          r="14"
          fill={SKIN_COLOR_BY_SORT[resolvedSort]}
        />

        {resolvedSort === "1" ? (
          <path
            d="M18 26.8C18 18.63 24.63 12 32.8 12H33.2C41.37 12 48 18.63 48 26.8C48 27.97 47.87 29.1 47.62 30.2C45.1 26.48 40.84 24 36 24H29C24.16 24 19.9 26.48 17.38 30.2C17.13 29.1 17 27.97 17 26.8H18Z"
            fill="#F4BD35"
          />
        ) : null}

        {resolvedSort === "2" ? (
          <>
            <path
              d="M18 26.6C18 18.54 24.54 12 32.6 12H33.4C41.46 12 48 18.54 48 26.6C48 27.58 47.9 28.55 47.7 29.5C45.5 25.5 41.24 22.8 36.36 22.8H28.64C23.76 22.8 19.5 25.5 17.3 29.5C17.1 28.55 17 27.58 17 26.6H18Z"
              fill="#FF962E"
            />
            <circle cx="19" cy="28.8" r="3.5" fill="#FF962E" />
            <circle cx="45" cy="28.8" r="3.5" fill="#FF962E" />
          </>
        ) : null}

        {resolvedSort === "3" ? (
          <>
            <path
              d="M18 28C18 19.16 25.16 12 34 12C41.42 12 47.66 17.04 49.46 23.88C46.62 22.38 43.24 21.5 39.66 21.5C34.14 21.5 29.06 23.58 25.24 27.02C23.78 28.34 21.66 28.74 19.82 28.08L18 27.42V28Z"
              fill="#B89D79"
            />
            <ellipse cx="23.2" cy="31.2" rx="3.4" ry="4" fill="#B89D79" />
            <ellipse cx="40.8" cy="31.2" rx="3.4" ry="4" fill="#B89D79" />
          </>
        ) : null}

        {resolvedSort === "4" ? (
          <>
            <path
              d="M18 26.8C18 18.63 24.63 12 32.8 12H33.2C41.37 12 48 18.63 48 26.8C48 27.86 47.89 28.9 47.66 29.9C45.72 25.72 41.5 22.8 36.6 22.8H29.4C24.5 22.8 20.28 25.72 18.34 29.9C18.11 28.9 18 27.86 18 26.8Z"
              fill="#F3D363"
            />
            <path
              d="M20.5 26.5L24.8 38.6H20C17.8 35 17.8 30.4 20.5 26.5Z"
              fill="#F3D363"
            />
            <path
              d="M43.5 26.5L39.2 38.6H44C46.2 35 46.2 30.4 43.5 26.5Z"
              fill="#F3D363"
            />
          </>
        ) : null}

        <circle cx="26.5" cy="30" r="1.7" fill="#2B2E3A" />
        <circle cx="37.5" cy="30" r="1.7" fill="#2B2E3A" />
        <path
          d="M28.5 35.2C29.32 36.22 30.59 36.8 32 36.8C33.41 36.8 34.68 36.22 35.5 35.2"
          stroke="#2B2E3A"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
