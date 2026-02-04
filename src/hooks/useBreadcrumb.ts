import { useEffect, useRef } from "react";

import { useBreadcrumb, BreadcrumbItem } from "@/providers/BreadcrumbProvider";

export function useSetBreadcrumb(items: BreadcrumbItem[]) {
  const { setBreadcrumbs } = useBreadcrumb();

  const prevItemsRef = useRef<string>("");

  useEffect(() => {
    const itemsJson = JSON.stringify(items);

    if (prevItemsRef.current !== itemsJson) {
      setBreadcrumbs(items);
      prevItemsRef.current = itemsJson;
    }
  }, [items, setBreadcrumbs]);
}
