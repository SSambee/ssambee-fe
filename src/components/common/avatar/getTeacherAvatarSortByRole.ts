import type { TeacherProfileAvatarSort } from "./TeacherProfileAvatar";

const INSTRUCTOR_SORT_OPTIONS: TeacherProfileAvatarSort[] = ["1", "2"];
const ASSISTANT_SORT_OPTIONS: TeacherProfileAvatarSort[] = ["3", "4"];

const getSeedHash = (seedKey: string) => {
  let hash = 0;

  for (let idx = 0; idx < seedKey.length; idx += 1) {
    hash = (hash * 31 + seedKey.charCodeAt(idx)) >>> 0;
  }

  return hash;
};

export const getTeacherAvatarSortByRole = (
  role: "INSTRUCTOR" | "ASSISTANT",
  seedKey: string
): TeacherProfileAvatarSort => {
  const options =
    role === "INSTRUCTOR" ? INSTRUCTOR_SORT_OPTIONS : ASSISTANT_SORT_OPTIONS;

  return options[getSeedHash(seedKey) % options.length];
};
