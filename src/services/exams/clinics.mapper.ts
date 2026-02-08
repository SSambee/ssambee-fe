import type { ClinicListItemApi, ClinicStudent } from "@/types/clinics";

const COLOR_CLASSES = [
  "bg-indigo-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-purple-500",
];

const getInitial = (name: string) => name.trim().slice(0, 1) || "?";

const formatDate = (iso?: string | null) => {
  if (!iso) return "-";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "-";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const parseDateToTimestamp = (iso?: string | null) => {
  if (!iso) return 0;
  const date = new Date(iso);
  const time = date.getTime();
  return Number.isNaN(time) ? 0 : time;
};

const mapStatusLabel = (
  status: ClinicListItemApi["clinic"]["status"]
): ClinicStudent["status"] => {
  switch (status) {
    case "SENT":
      return "알림 발송";
    case "COMPLETED":
      return "완료";
    default:
      return "알림 예정";
  }
};

export const mapClinicApiToStudent = (
  clinic: ClinicListItemApi,
  index: number
): ClinicStudent => {
  const fallbackClassName = clinic.exam.title || "-";
  const statusLabel = mapStatusLabel(clinic.clinic.status);

  return {
    id: clinic.id,
    name: clinic.student.name,
    initial: getInitial(clinic.student.name),
    color: COLOR_CLASSES[index % COLOR_CLASSES.length],
    class: fallbackClassName,
    examName: clinic.exam.title,
    score: clinic.exam.score,
    cutoff: clinic.exam.cutoffScore,
    failedDate: formatDate(clinic.exam.date || clinic.clinic.createdAt),
    failedDateSort: parseDateToTimestamp(
      clinic.exam.date || clinic.clinic.createdAt
    ),
    status: statusLabel,
    phone: clinic.student.phone,
    parentPhone: "",
  };
};
