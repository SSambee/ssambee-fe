import { axiosClient } from "@/services/axiosClient";

import {
  upsertAssignmentResultsAPI,
  type UpsertAssignmentResultsPayload,
} from "./assignment-results.service";

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
  not: {
    toHaveBeenCalledWith: (...args: unknown[]) => void;
  };
};

const mockedPut = jest.fn() as MockFn<[string, unknown], Promise<unknown>>;

// 검증 범위:
// - FE가 PUT /assignment-results로 payload를 변형 없이 전송하는지 확인.
// - options를 생략했을 때 클라이언트가 임의 기본값을 주입하지 않는지 확인.
describe("assignment-results service", () => {
  beforeEach(() => {
    mockedPut.mockReset();
    (axiosClient as unknown as { put: typeof mockedPut }).put = mockedPut;
  });

  it("calls PUT /assignment-results with payload as-is", async () => {
    const payload: UpsertAssignmentResultsPayload = {
      options: { strict: false },
      items: [
        {
          assignmentId: "asg_1",
          lectureEnrollmentId: "le_1",
          resultIndex: 2,
        },
      ],
    };

    mockedPut.mockResolvedValue({
      data: {
        status: "success",
        data: { updated: 1 },
      },
    } as never);

    await upsertAssignmentResultsAPI(payload);

    expect(mockedPut).toHaveBeenCalledWith("/assignment-results", payload);
  });

  it("does not inject default options when options are omitted", async () => {
    const payload: UpsertAssignmentResultsPayload = {
      items: [
        {
          assignmentId: "asg_2",
          lectureEnrollmentId: "le_2",
          resultIndex: null,
        },
      ],
    };

    mockedPut.mockResolvedValue({
      data: {
        status: "success",
        data: { deleted: 1 },
      },
    } as never);

    await upsertAssignmentResultsAPI(payload);

    expect(mockedPut).toHaveBeenCalledWith("/assignment-results", payload);
  });
});
