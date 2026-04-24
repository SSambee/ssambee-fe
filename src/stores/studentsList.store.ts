import { create } from "zustand";

type SelectedStudent = {
  enrollmentId: string;
  name: string;
  phoneNumber?: string;
  parentPhone?: string;
  title: string;
};

type StudentSelectionState = {
  selectedStudentIds: string[];
  selectedStudents: SelectedStudent[]; // 모달 표시용 데이터

  toggleStudent: (student: SelectedStudent) => void; // 개별 토글
  addStudents: (students: SelectedStudent[]) => void; // 여러 명 일괄 추가 (전체 선택용)
  removeStudents: (ids: string[]) => void; // 여러 명 일괄 삭제 (전체 선택 해제용)
  removeStudent: (id: string) => void; // 단일 삭제 (모달 내부 x 버튼용)
  resetSelection: () => void; // 초기화
};

export const useStudentSelectionStore = create<StudentSelectionState>(
  (set) => ({
    selectedStudentIds: [],
    selectedStudents: [],

    toggleStudent: (student) =>
      set((state) => {
        const isSelected = state.selectedStudentIds.includes(
          student.enrollmentId
        );
        if (isSelected) {
          return {
            selectedStudentIds: state.selectedStudentIds.filter(
              (id) => id !== student.enrollmentId
            ),
            selectedStudents: state.selectedStudents.filter(
              (s) => s.enrollmentId !== student.enrollmentId
            ),
          };
        }
        return {
          selectedStudentIds: [
            ...state.selectedStudentIds,
            student.enrollmentId,
          ],
          selectedStudents: [...state.selectedStudents, student],
        };
      }),

    addStudents: (students) =>
      set((state) => {
        // 이미 선택된 학생 제외하고 새로운 학생만 필터링
        const newStudents = students.filter(
          (s) => !state.selectedStudentIds.includes(s.enrollmentId)
        );
        return {
          selectedStudentIds: [
            ...state.selectedStudentIds,
            ...newStudents.map((s) => s.enrollmentId),
          ],
          selectedStudents: [...state.selectedStudents, ...newStudents],
        };
      }),

    removeStudents: (ids) =>
      set((state) => ({
        selectedStudentIds: state.selectedStudentIds.filter(
          (id) => !ids.includes(id)
        ),
        selectedStudents: state.selectedStudents.filter(
          (s) => !ids.includes(s.enrollmentId)
        ),
      })),

    removeStudent: (id) =>
      set((state) => ({
        selectedStudentIds: state.selectedStudentIds.filter(
          (sid) => sid !== id
        ),
        selectedStudents: state.selectedStudents.filter(
          (s) => s.enrollmentId !== id
        ),
      })),

    resetSelection: () => set({ selectedStudentIds: [], selectedStudents: [] }),
  })
);
