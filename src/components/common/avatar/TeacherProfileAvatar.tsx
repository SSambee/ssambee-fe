import Image from "next/image";

import { cn } from "@/lib/utils";

export type TeacherProfileAvatarSize = "XL" | "Large" | "Medium-2" | "Medium";
export type TeacherProfileAvatarSort = "1" | "2" | "3" | "4";

const AVATAR_SIZE_MAP: Record<TeacherProfileAvatarSize, number> = {
  XL: 64,
  Large: 56,
  "Medium-2": 48,
  Medium: 40,
};
const TEACHER_AVATAR_ICON = "/icons/figma/teacher-avatar.svg";

const FIGMA_NODE_BY_PRESET: Partial<
  Record<`${TeacherProfileAvatarSize}-${TeacherProfileAvatarSort}`, string>
> = {
  "XL-1": "630:61327",
  "Large-1": "630:61109",
  "Large-2": "630:61110",
  "Large-3": "630:61111",
  "Large-4": "630:61112",
  "Medium-2-1": "630:61211",
  "Medium-2-2": "630:61252",
  "Medium-2-3": "630:61233",
  "Medium-2-4": "630:61278",
  "Medium-1": "630:61443",
  "Medium-2": "630:61484",
  "Medium-3": "630:61465",
  "Medium-4": "630:61510",
};

export const TEACHER_PROFILE_AVATAR_PRESETS: Array<{
  sizePreset: TeacherProfileAvatarSize;
  sort: TeacherProfileAvatarSort;
  figmaNodeId: string;
}> = [
  { sizePreset: "XL", sort: "1", figmaNodeId: "630:61327" },
  { sizePreset: "Large", sort: "1", figmaNodeId: "630:61109" },
  { sizePreset: "Large", sort: "2", figmaNodeId: "630:61110" },
  { sizePreset: "Large", sort: "3", figmaNodeId: "630:61111" },
  { sizePreset: "Large", sort: "4", figmaNodeId: "630:61112" },
  { sizePreset: "Medium-2", sort: "1", figmaNodeId: "630:61211" },
  { sizePreset: "Medium-2", sort: "2", figmaNodeId: "630:61252" },
  { sizePreset: "Medium-2", sort: "3", figmaNodeId: "630:61233" },
  { sizePreset: "Medium-2", sort: "4", figmaNodeId: "630:61278" },
  { sizePreset: "Medium", sort: "1", figmaNodeId: "630:61443" },
  { sizePreset: "Medium", sort: "2", figmaNodeId: "630:61484" },
  { sizePreset: "Medium", sort: "3", figmaNodeId: "630:61465" },
  { sizePreset: "Medium", sort: "4", figmaNodeId: "630:61510" },
];

const SORT_OPTIONS: TeacherProfileAvatarSort[] = ["1", "2", "3", "4"];

export function getTeacherAvatarSortFromSeed(
  seedKey: string
): TeacherProfileAvatarSort {
  let hash = 0;
  for (let idx = 0; idx < seedKey.length; idx += 1) {
    hash = (hash * 31 + seedKey.charCodeAt(idx)) >>> 0;
  }

  return SORT_OPTIONS[hash % SORT_OPTIONS.length];
}

type TeacherProfileAvatarProps = {
  sizePreset?: TeacherProfileAvatarSize;
  sort?: TeacherProfileAvatarSort;
  seedKey?: string;
  size?: number;
  className?: string;
  label?: string;
};

const BODY_MAIN_COLOR_BY_SORT: Record<TeacherProfileAvatarSort, string> = {
  "1": "#4C6ED5",
  "2": "#4F8A82",
  "3": "#6A7388",
  "4": "#4C6ED5",
};

const BODY_DARK_COLOR_BY_SORT: Record<TeacherProfileAvatarSort, string> = {
  "1": "#233E8E",
  "2": "#2A6D66",
  "3": "#4A5164",
  "4": "#233E8E",
};

const HAIR_COLOR_BY_SORT: Record<TeacherProfileAvatarSort, string> = {
  "1": "#2B2B2B",
  "2": "#5E4A37",
  "3": "#4A3A31",
  "4": "#7A5E33",
};

const SKIN_COLOR_BY_SORT: Record<TeacherProfileAvatarSort, string> = {
  "1": "#FFDABF",
  "2": "#F6D8BC",
  "3": "#F2D2B5",
  "4": "#F5D7BB",
};

function TeacherAvatarSvg({
  sort,
  nodeId,
}: {
  sort: TeacherProfileAvatarSort;
  nodeId: string;
}) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      data-node-id={nodeId}
    >
      <circle cx="32" cy="32" r="31.5" fill="#DDE9FD" stroke="#E9EBF0" />

      <path
        d="M8 64C8 49.64 19.64 38 34 38H36C50.36 38 62 49.64 62 64H8Z"
        fill={BODY_DARK_COLOR_BY_SORT[sort]}
      />
      <path
        d="M37.68 41.45C47.64 43.94 55 52.89 55 63.41C55 64.42 54.18 65.25 53.16 65.25H10.84C9.82 65.25 9 64.42 9 63.41C9 52.89 16.36 43.94 26.32 41.45L32 50.4L37.68 41.45ZM28.57 59.3L32 62.3L35.43 59.3L32 50.4L28.57 59.3Z"
        fill={BODY_MAIN_COLOR_BY_SORT[sort]}
      />

      <circle cx="32" cy="30" r="13.4" fill={SKIN_COLOR_BY_SORT[sort]} />

      {sort === "1" ? (
        <path
          d="M19.2 27.1C19.2 19.12 25.67 12.64 33.65 12.64H34.35C42.33 12.64 48.8 19.12 48.8 27.1C48.8 28.24 48.67 29.34 48.42 30.39C45.96 26.88 41.99 24.54 37.45 24.54H30.55C26.01 24.54 22.04 26.88 19.58 30.39C19.33 29.34 19.2 28.24 19.2 27.1Z"
          fill={HAIR_COLOR_BY_SORT[sort]}
        />
      ) : null}

      {sort === "2" ? (
        <>
          <path
            d="M19.2 26.95C19.2 18.97 25.67 12.5 33.65 12.5H34.35C42.33 12.5 48.8 18.97 48.8 26.95C48.8 27.93 48.7 28.88 48.49 29.8C46.51 25.95 42.55 23.3 37.74 23.3H30.26C25.45 23.3 21.49 25.95 19.51 29.8C19.3 28.88 19.2 27.93 19.2 26.95Z"
            fill={HAIR_COLOR_BY_SORT[sort]}
          />
          <ellipse
            cx="20.2"
            cy="29.5"
            rx="2.7"
            ry="3.1"
            fill={HAIR_COLOR_BY_SORT[sort]}
          />
          <ellipse
            cx="43.8"
            cy="29.5"
            rx="2.7"
            ry="3.1"
            fill={HAIR_COLOR_BY_SORT[sort]}
          />
        </>
      ) : null}

      {sort === "3" ? (
        <>
          <path
            d="M18.8 28.3C18.8 19.66 25.8 12.66 34.45 12.66C41.5 12.66 47.51 17.34 49.3 23.84C46.55 22.44 43.4 21.62 40.07 21.62C34.9 21.62 30.15 23.58 26.56 26.82C25.18 28.06 23.19 28.45 21.45 27.85L18.8 26.94V28.3Z"
            fill={HAIR_COLOR_BY_SORT[sort]}
          />
          <ellipse
            cx="23.5"
            cy="31.2"
            rx="3"
            ry="3.6"
            fill={HAIR_COLOR_BY_SORT[sort]}
          />
          <ellipse
            cx="40.8"
            cy="31.2"
            rx="3"
            ry="3.6"
            fill={HAIR_COLOR_BY_SORT[sort]}
          />
        </>
      ) : null}

      {sort === "4" ? (
        <>
          <path
            d="M19.1 27.15C19.1 19.16 25.58 12.68 33.57 12.68H34.43C42.42 12.68 48.9 19.16 48.9 27.15C48.9 28.16 48.8 29.15 48.59 30.1C46.74 26.16 42.74 23.42 38.09 23.42H29.91C25.26 23.42 21.26 26.16 19.41 30.1C19.2 29.15 19.1 28.16 19.1 27.15Z"
            fill={HAIR_COLOR_BY_SORT[sort]}
          />
          <path
            d="M21.8 26.75L25.2 37.15H21.6C19.85 33.95 19.9 30.1 21.8 26.75Z"
            fill={HAIR_COLOR_BY_SORT[sort]}
          />
          <path
            d="M42.2 26.75L38.8 37.15H42.4C44.15 33.95 44.1 30.1 42.2 26.75Z"
            fill={HAIR_COLOR_BY_SORT[sort]}
          />
        </>
      ) : null}

      <circle cx="27.4" cy="30.3" r="1.4" fill="#2B2E3A" />
      <circle cx="36.6" cy="30.3" r="1.4" fill="#2B2E3A" />
      <path
        d="M29.1 35.2C29.8 36.1 30.85 36.6 32 36.6C33.15 36.6 34.2 36.1 34.9 35.2"
        stroke="#2B2E3A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      {sort === "1" || sort === "4" ? (
        <>
          <circle
            cx="27.3"
            cy="30.2"
            r="3"
            stroke="#4A4D5C"
            strokeWidth="0.7"
          />
          <circle
            cx="36.7"
            cy="30.2"
            r="3"
            stroke="#4A4D5C"
            strokeWidth="0.7"
          />
          <path
            d="M30.2 30.2H33.8"
            stroke="#4A4D5C"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        </>
      ) : null}
    </svg>
  );
}

export function TeacherProfileAvatar({
  sizePreset = "Medium",
  sort,
  seedKey,
  size,
  className,
  label = "강사 프로필 이미지",
}: TeacherProfileAvatarProps) {
  const resolvedSort =
    sort || (seedKey ? getTeacherAvatarSortFromSeed(seedKey) : "1");
  const resolvedSize = size ?? AVATAR_SIZE_MAP[sizePreset];
  const presetKey = `${sizePreset}-${resolvedSort}` as const;
  const nodeId =
    FIGMA_NODE_BY_PRESET[presetKey] ||
    FIGMA_NODE_BY_PRESET[`${sizePreset}-1`] ||
    "630:61327";

  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "inline-block shrink-0 overflow-hidden rounded-full",
        className
      )}
      style={{ width: resolvedSize, height: resolvedSize }}
      data-node-id={nodeId}
    >
      {resolvedSort === "1" ? (
        <span className="relative block h-full w-full">
          <Image
            src={TEACHER_AVATAR_ICON}
            alt=""
            fill
            aria-hidden
            sizes={`${resolvedSize}px`}
            className="object-cover"
          />
        </span>
      ) : (
        <TeacherAvatarSvg sort={resolvedSort} nodeId={nodeId} />
      )}
    </span>
  );
}
