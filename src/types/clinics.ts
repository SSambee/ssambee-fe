export type CompleteGradingPayload = {
  title?: string;
  deadline?: string;
  memo?: string;
};

export type CompleteGradingResponse = {
  count: number;
  message: string;
};

export type ClinicStatusApi = "PENDING" | "SENT" | "COMPLETED";

export type ClinicStudentApi = {
  id: string;
  name: string;
  school: string;
  schoolYear: string;
  phone: string;
};

export type ClinicExamApi = {
  id: string;
  title: string;
  cutoffScore: number;
  score: number;
  date: string | null;
};

export type ClinicInfoApi = {
  createdAt: string;
  deadline: string | null;
  status: ClinicStatusApi;
};

export type ClinicListItemApi = {
  id: string;
  student: ClinicStudentApi;
  exam: ClinicExamApi;
  clinic: ClinicInfoApi;
};

export type ClinicStudent = {
  id: string;
  name: string;
  initial: string;
  color: string;
  class: string;
  examName: string;
  score: number;
  cutoff: number;
  failedDate: string;
  failedDateSort: number;
  status: "알림 예정" | "알림 발송" | "완료";
  phone: string;
  parentPhone: string;
};

export type FetchClinicsQuery = {
  lectureId?: string;
  examId?: string;
};

export type UpdateClinicsPayload = {
  clinicIds: string[];
  updates: {
    status?: ClinicStatusApi;
    deadline?: string | null;
    memo?: string | null;
  };
};
