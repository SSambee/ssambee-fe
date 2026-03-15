"use client";

import { useCallback, useEffect, useRef } from "react";

import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import { useDialogAlert } from "@/hooks/useDialogAlert";
import { useModal } from "@/providers/ModalProvider";
import { useMyLearnerProfile } from "@/hooks/profile/useMyLearnerProfile";
import type {
  LearnersProfileUpdateFormData,
  LinkChildFormData,
} from "@/validation/learners-profile.validation";
import { PhoneChangeModal } from "@/app/(dashboard)/educators/profile/_components/modal/PhoneChangeModal";
import { SettingsSecurityModal } from "@/app/(dashboard)/educators/profile/_components/modal/SettingsSecurityModal";

import { LearnersProfileSummary } from "./_components/LearnersProfileSummary";
import { LearnersBasicInfo } from "./_components/LearnersBasicInfo";
import { LearnersRoleInfo } from "./_components/LearnersRoleInfo";
import { LearnersProfileEditModal } from "./_components/modal/LearnersProfileEditModal";

export default function LearnersProfilePage() {
  useSetBreadcrumb([{ label: "프로필" }]);

  const { openModal, closeModal } = useModal();
  const {
    profile,
    isPending,
    isError,
    updateProfile,
    isUpdating,
    linkChild,
    isLinkingChild,
  } = useMyLearnerProfile();
  const { showAlert } = useDialogAlert();

  const profileRef = useRef(profile);
  const isUpdatingRef = useRef(isUpdating);
  const updateProfileRef = useRef(updateProfile);
  const closeModalRef = useRef(closeModal);
  const showAlertRef = useRef(showAlert);
  const linkChildRef = useRef(linkChild);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    isUpdatingRef.current = isUpdating;
  }, [isUpdating]);

  useEffect(() => {
    updateProfileRef.current = updateProfile;
  }, [updateProfile]);

  useEffect(() => {
    closeModalRef.current = closeModal;
  }, [closeModal]);

  useEffect(() => {
    showAlertRef.current = showAlert;
  }, [showAlert]);

  useEffect(() => {
    linkChildRef.current = linkChild;
  }, [linkChild]);

  const handleProfileUpdate = useCallback(
    async (data: LearnersProfileUpdateFormData) => {
      if (!profileRef.current || isUpdatingRef.current) return;

      try {
        await updateProfileRef.current(data);
        closeModalRef.current();
      } catch (error) {
        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        console.error("프로필 업데이트 실패:", normalizedError.message);

        await showAlertRef.current({
          title: "오류",
          description: `프로필 업데이트에 실패했습니다. ${normalizedError.message}`,
        });
      }
    },
    []
  );

  const handleLinkChild = useCallback(async (data: LinkChildFormData) => {
    await linkChildRef.current(data);
  }, []);

  const handleEditClick = () => {
    if (!profile) return;

    openModal(
      <LearnersProfileEditModal
        profile={profile}
        onSubmit={handleProfileUpdate}
      />
    );
  };

  const handleSettingsClick = () => {
    if (!profile) return;

    openModal(
      <SettingsSecurityModal
        email={profile.email}
        onLinkChild={
          profile.userType === "PARENT" ? handleLinkChild : undefined
        }
        isLinkingChild={isLinkingChild}
      />
    );
  };

  const handlePhoneChangeClick = () => {
    if (!profile) return;

    openModal(<PhoneChangeModal currentPhone={profile.phone} />);
  };

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        프로필 정보를 불러오지 못했습니다.
      </div>
    );
  }

  if (isPending || !profile) {
    return <div className="p-8 text-center">프로필을 불러오는 중...</div>;
  }

  return (
    <div className="container mx-auto space-y-8 p-6">
      <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
          내 프로필
        </h1>
        <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
          내 프로필을 확인하고 관리합니다
        </p>
      </section>

      <LearnersProfileSummary
        profile={profile}
        onEditClick={handleEditClick}
        onSettingsClick={handleSettingsClick}
      />

      <LearnersBasicInfo
        profile={profile}
        onPhoneChangeClick={handlePhoneChangeClick}
      />

      <LearnersRoleInfo profile={profile} />
    </div>
  );
}
