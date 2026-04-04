import { axiosClient } from "@/shared/common/api/axiosClient";

import {
  getExamReportAssignmentsAPI,
  updateExamReportAssignmentsAPI,
  type ExamReportAssignment,
} from "./exam-report-assignments.service";

type MockFn<TArgs extends unknown[] = unknown[], TResult = unknown> = {
  (...args: TArgs): TResult;
  mockReset: () => void;
  mockResolvedValue: (value: unknown) => void;
};

declare const jest: {
  fn: () => MockFn;
};

declare const describe: (name: string, fn: () => void) => void;
declare const beforeEach: (fn: () => void) => void;
declare const it: (name: string, fn: () => Promise<void> | void) => void;
declare const expect: (actual: unknown) => {
  toHaveBeenCalledWith: (...args: unknown[]) => void;
  toEqual: (expected: unknown) => void;
};

const mockedGet = jest.fn() as MockFn<[string], Promise<unknown>>;
const mockedPut = jest.fn() as MockFn<[string, unknown], Promise<unknown>>;

// 검증 범위:
// - 성적표 과제 연동 GET/PUT 엔드포인트와 payload 연결을 확인.
// - GET 응답 data가 비어도 []로 정규화되어 UI 처리가 안정적인지 확인.
describe("exam report assignments service", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPut.mockReset();
    (
      axiosClient as unknown as { get: typeof mockedGet; put: typeof mockedPut }
    ).get = mockedGet;
    (
      axiosClient as unknown as { get: typeof mockedGet; put: typeof mockedPut }
    ).put = mockedPut;
  });

  it("calls GET /exams/:examId/report/assignments and returns rows", async () => {
    const rows: ExamReportAssignment[] = [
      {
        assignmentId: "asg_1",
        assignment: {
          id: "asg_1",
          title: "과제 1",
          categoryId: "cat_1",
          category: {
            id: "cat_1",
            name: "카테고리 A",
          },
        },
      },
    ];

    mockedGet.mockResolvedValue({
      data: {
        status: "success",
        data: rows,
      },
    } as never);

    const result = await getExamReportAssignmentsAPI("exam_1");

    expect(mockedGet).toHaveBeenCalledWith("/exams/exam_1/report/assignments");
    expect(result).toEqual(rows);
  });

  it("returns [] when GET response data is empty", async () => {
    mockedGet.mockResolvedValue({
      data: {
        status: "success",
        data: null,
      },
    } as never);

    const result = await getExamReportAssignmentsAPI("exam_2");

    expect(result).toEqual([]);
  });

  it("calls PUT /exams/:examId/report/assignments with assignments payload", async () => {
    const payload = {
      assignments: ["asg_1", "asg_2"],
    };

    mockedPut.mockResolvedValue({
      data: {
        status: "success",
        data: [],
      },
    } as never);

    await updateExamReportAssignmentsAPI("exam_3", payload);

    expect(mockedPut).toHaveBeenCalledWith(
      "/exams/exam_3/report/assignments",
      payload
    );
  });
});
