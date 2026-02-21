export type IncludedAssignment = {
  id: string;
  title: string;
  categoryName: string;
  presets: string[];
};

export type SelectionByStudent = Record<string, Record<string, number | null>>;

export type MiniTestStudent = {
  id: string;
  name: string;
  gradeId?: string;
};

export type MiniTestResultRow = {
  id: string;
  name: string;
  values: string[];
};
