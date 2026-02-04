import { useEffect } from "react";

import { useBreadcrumb, BreadcrumbItem } from "@/providers/BreadcrumbProvider";

export function useSetBreadcrumb(items: BreadcrumbItem[]) {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumbs(items);
    // cleanup
    return () => {
      // 다음 페이지로 이동할 때 깜빡임을 방지하거나 초기화 정책에 따라 결정
      // 여기서는 명시적으로 다음 페이지가 덮어씌우도록 둠
    };
  }, [JSON.stringify(items), setBreadcrumbs]); // items 배열 내용이 같으면 재실행 방지
}
