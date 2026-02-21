import { axiosClient } from "@/services/axiosClient";

import {
  getGradeReportFileDownloadUrl,
  uploadGradeReportFile,
} from "./report.service";

type MockFn<TArgs extends unknown[] = unknown[], TResult = unknown> = {
  (...args: TArgs): TResult;
  mockReset: () => void;
  mockResolvedValue: (value: unknown) => void;
};

declare const jest: {
  fn: () => MockFn;
  spyOn: (target: object, method: string) => MockFn;
  restoreAllMocks: () => void;
};

declare const describe: (name: string, fn: () => void) => void;
declare const beforeEach: (fn: () => void) => void;
declare const afterEach: (fn: () => void) => void;
declare const it: (name: string, fn: () => Promise<void> | void) => void;
declare const expect: {
  (actual: unknown): {
    toHaveBeenCalledWith: (...args: unknown[]) => void;
  };
  any: (type: unknown) => unknown;
};

let mockedPost: MockFn<[string, unknown], Promise<unknown>>;
let mockedGet: MockFn<[string], Promise<unknown>>;

// 검증 범위:
// - 성적표 발송 준비 플로우에서 업로드 엔드포인트를 사용하는지 확인.
// - 성적표 발송 준비 플로우에서 다운로드 URL 엔드포인트를 사용하는지 확인.
describe("report service", () => {
  beforeEach(() => {
    mockedPost = jest.spyOn(axiosClient, "post") as MockFn<
      [string, unknown],
      Promise<unknown>
    >;
    mockedGet = jest.spyOn(axiosClient, "get") as MockFn<
      [string],
      Promise<unknown>
    >;
    mockedPost.mockReset();
    mockedGet.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("calls report file upload endpoint", async () => {
    mockedPost.mockResolvedValue({
      data: {
        data: {
          reportUrl: "https://example.com/report.pdf",
        },
      },
    } as never);

    const file = new File(["dummy"], "report.pdf", {
      type: "application/pdf",
    });

    await uploadGradeReportFile("grade_123", file);

    expect(mockedPost).toHaveBeenCalledWith(
      "/grades/grade_123/report/file-upload",
      expect.any(FormData)
    );
  });

  it("calls report file download endpoint", async () => {
    mockedGet.mockResolvedValue({
      data: {
        data: {
          downloadUrl: "https://example.com/report-download.pdf",
        },
      },
    } as never);

    await getGradeReportFileDownloadUrl("grade_456");

    expect(mockedGet).toHaveBeenCalledWith(
      "/grades/grade_456/report/file-download"
    );
  });
});
