import { mapIncludedCategoryRowsFromAssignmentResults } from "./usePremiumReportTemplateState";

declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: (actual: unknown) => {
  toEqual: (expected: unknown) => void;
};

// 검증 범위:
// - 성적표 미리보기 행이 assignmentResults만으로 구성되는지 확인.
// - assignmentResults가 없을 때 빈 배열을 반환하는지 확인.
describe("usePremiumReportTemplateState helper", () => {
  it("maps assignmentResults rows for report rendering", () => {
    const rows = mapIncludedCategoryRowsFromAssignmentResults([
      {
        id: "asg_1",
        categoryName: "어휘",
        title: "단어 시험",
        value: "B",
      },
      {
        id: "asg_2",
        categoryName: "문법",
        title: "문장 분석",
        value: "A",
      },
    ]);

    expect(rows).toEqual([
      {
        id: "asg_1",
        name: "어휘 - 단어 시험",
        value: "B",
      },
      {
        id: "asg_2",
        name: "문법 - 문장 분석",
        value: "A",
      },
    ]);
  });

  it("returns empty rows when assignmentResults are absent", () => {
    const rows = mapIncludedCategoryRowsFromAssignmentResults(undefined);
    expect(rows).toEqual([]);
  });
});
