import { useCallback, useEffect, useMemo, useState } from "react";

import {
  type ApprovalStatus,
  type AssistantApprovalApplication,
  mapAssistantsApiToApprovalApplications,
} from "@/services/assistants/assistants.mapper";
import {
  createAssistantCodeAPI,
  fetchAssistantCodesAPI,
} from "@/services/assistants/assistantCodes.service";
import {
  fetchAssistantsAPI,
  signAssistantAPI,
} from "@/services/assistants/assistants.service";

const approvalStats: readonly ApprovalStatus[] = [
  "승인 대기",
  "승인 완료",
  "반려됨",
] as const;

const statusColorMap: Record<ApprovalStatus, "blue" | "green" | "gray"> = {
  "승인 대기": "blue",
  "승인 완료": "green",
  반려됨: "gray",
};

const initialApplicationsByStatus: Record<
  ApprovalStatus,
  AssistantApprovalApplication[]
> = {
  "승인 대기": [],
  "승인 완료": [],
  반려됨: [],
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "요청 처리 중 오류가 발생했습니다.";
};

export const useAssistantsApprovalPage = () => {
  const [activeStatusFilter, setActiveStatusFilter] =
    useState<ApprovalStatus>("승인 대기");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [approvalCode, setApprovalCode] = useState("-");
  const [isCodeCreating, setIsCodeCreating] = useState(false);
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);
  const [processingApplicationId, setProcessingApplicationId] = useState<
    string | null
  >(null);
  const [applicationsByStatus, setApplicationsByStatus] = useState(
    initialApplicationsByStatus
  );

  const loadApplications = useCallback(async () => {
    setIsApplicationsLoading(true);

    try {
      const [pendingAssistants, signedAssistants, rejectedAssistants] =
        await Promise.all([
          fetchAssistantsAPI("pending"),
          fetchAssistantsAPI("signed"),
          fetchAssistantsAPI("rejected"),
        ]);

      setApplicationsByStatus({
        "승인 대기": mapAssistantsApiToApprovalApplications(
          pendingAssistants,
          "승인 대기"
        ),
        "승인 완료": mapAssistantsApiToApprovalApplications(
          signedAssistants,
          "승인 완료"
        ),
        반려됨: mapAssistantsApiToApprovalApplications(
          rejectedAssistants,
          "반려됨"
        ),
      });
    } catch (error) {
      setActionNotice(getErrorMessage(error));
    } finally {
      setIsApplicationsLoading(false);
    }
  }, []);

  const loadAssistantCode = useCallback(async () => {
    try {
      const codes = await fetchAssistantCodesAPI();
      setApprovalCode(codes[0]?.code ?? "-");
    } catch (error) {
      setActionNotice(getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    void Promise.all([loadApplications(), loadAssistantCode()]);
  }, [loadApplications, loadAssistantCode]);

  const filteredApplications = useMemo(
    () => applicationsByStatus[activeStatusFilter],
    [activeStatusFilter, applicationsByStatus]
  );

  const sortedApplications = useMemo(() => {
    const applications = [...filteredApplications];

    applications.sort((a, b) => {
      if (sortOrder === "latest") {
        return b.appliedAtTimestamp - a.appliedAtTimestamp;
      }

      return a.appliedAtTimestamp - b.appliedAtTimestamp;
    });

    return applications;
  }, [filteredApplications, sortOrder]);

  const handleCreateApprovalCode = async () => {
    setIsCodeCreating(true);

    try {
      const createdCode = await createAssistantCodeAPI();
      setApprovalCode(createdCode.code);
      setActionNotice("인증 코드가 생성되었습니다.");
      await loadAssistantCode();
    } catch (error) {
      setActionNotice(getErrorMessage(error));
    } finally {
      setIsCodeCreating(false);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!approvalCode || approvalCode === "-") {
      setActionNotice("복사할 인증 코드가 없습니다.");
      return;
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    const inviteLink = `${appUrl}/signup/assistant?code=${approvalCode}`;

    try {
      await navigator.clipboard.writeText(inviteLink);
      setActionNotice("가입 링크가 클립보드에 복사되었습니다.");
    } catch {
      setActionNotice("브라우저에서 클립보드 복사를 지원하지 않습니다.");
    }
  };

  const handleSignAction = async (
    application: AssistantApprovalApplication,
    sign: "approve" | "reject"
  ) => {
    setProcessingApplicationId(application.id);

    try {
      await signAssistantAPI(application.id, sign);
      setActionNotice(
        sign === "approve"
          ? `${application.name} 승인 처리가 완료되었습니다.`
          : `${application.name} 반려 처리가 완료되었습니다.`
      );
      await loadApplications();
    } catch (error) {
      setActionNotice(getErrorMessage(error));
    } finally {
      setProcessingApplicationId(null);
    }
  };

  return {
    approvalStats,
    statusColorMap,
    activeStatusFilter,
    setActiveStatusFilter,
    sortOrder,
    setSortOrder,
    actionNotice,
    approvalCode,
    isCodeCreating,
    isApplicationsLoading,
    processingApplicationId,
    applicationsByStatus,
    sortedApplications,
    handleCreateApprovalCode,
    handleCopyInviteLink,
    handleSignAction,
  };
};
