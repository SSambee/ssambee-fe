import { axiosClient } from "@/services/axiosClient";

import {
  createAssignmentAPI,
  deleteAssignmentAPI,
  fetchAssignmentsAPI,
} from "./assignments.service";

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

const mockedGet = jest.fn() as MockFn<[string, unknown?], Promise<unknown>>;
const mockedPost = jest.fn() as MockFn<[string, unknown?], Promise<unknown>>;
const mockedDelete = jest.fn() as MockFn<[string], Promise<unknown>>;

describe("assignments service", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
    mockedDelete.mockReset();
    (axiosClient as unknown as { get: typeof mockedGet }).get = mockedGet;
    (axiosClient as unknown as { post: typeof mockedPost }).post = mockedPost;
    (axiosClient as unknown as { delete: typeof mockedDelete }).delete =
      mockedDelete;
  });

  it("calls GET /assignments with lectureId query", async () => {
    mockedGet.mockResolvedValue({
      data: {
        status: "success",
        data: [],
      },
    } as never);

    await fetchAssignmentsAPI("lecture_1");

    expect(mockedGet).toHaveBeenCalledWith("/assignments", {
      params: { lectureId: "lecture_1" },
    });
  });

  it("calls GET /assignments without params when lectureId omitted", async () => {
    mockedGet.mockResolvedValue({
      data: {
        status: "success",
        data: null,
      },
    } as never);

    const result = await fetchAssignmentsAPI();

    expect(mockedGet).toHaveBeenCalledWith("/assignments", {
      params: undefined,
    });
    expect(result).toEqual([]);
  });

  it("calls POST /lectures/:lectureId/assignments with payload", async () => {
    mockedPost.mockResolvedValue({
      data: {
        status: "success",
        data: {
          id: "asg_1",
          title: "단어 1회차",
          lectureId: "lecture_1",
          categoryId: "cat_1",
        },
      },
    } as never);

    await createAssignmentAPI("lecture_1", {
      title: "단어 1회차",
      categoryId: "cat_1",
    });

    expect(mockedPost).toHaveBeenCalledWith("/lectures/lecture_1/assignments", {
      title: "단어 1회차",
      categoryId: "cat_1",
    });
  });

  it("calls DELETE /assignments/:assignmentId", async () => {
    mockedDelete.mockResolvedValue({
      data: {
        status: "success",
      },
    } as never);

    await deleteAssignmentAPI("asg_9");

    expect(mockedDelete).toHaveBeenCalledWith("/assignments/asg_9");
  });
});
