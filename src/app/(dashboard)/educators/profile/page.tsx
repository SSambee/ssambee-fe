"use client";

import { mapProfileUpdateFormToApi } from "@/mappers/profile.mapper";
import { useMyProfile } from "@/hooks/profile/useMyProfile";
import type { ProfileUpdateFormData } from "@/validation/profile.validation";
import { useModal } from "@/providers/ModalProvider";

import { ProfileSummary } from "./_components/ProfileSummary";
import { BasicInfo } from "./_components/BasicInfo";
import { AcademyAndLectures } from "./_components/AcademyAndLectures";
import { ProfileEditModal } from "./_components/modal/ProfileEditModal";
import { SettingsSecurityModal } from "./_components/modal/SettingsSecurityModal";
import { PhoneChangeModal } from "./_components/modal/PhoneChangeModal";

export default function ProfilePage() {
  const { openModal, closeModal } = useModal();
  const { profile, lectures, isPending, isError, updateProfile, isUpdating } =
    useMyProfile();

  const handleEditClick = () => {
    if (!profile) return;

    openModal(
      <ProfileEditModal
        profile={profile}
        onSubmit={(data) =>
          handleProfileUpdate(
            data as ProfileUpdateFormData & { imageFile: File | null }
          )
        }
      />
    );
  };

  const handleSettingsClick = () => {
    openModal(<SettingsSecurityModal />);
  };

  const handlePhoneChangeClick = () => {
    if (!profile) return;

    openModal(<PhoneChangeModal currentPhone={profile.phone} />);
  };

  const handleProfileUpdate = (
    data: ProfileUpdateFormData & { imageFile: File | null }
  ) => {
    if (!profile || isUpdating) return;

    const { imageFile, ...formData } = data;
    if (imageFile) {
      console.info("이미지 업로드는 아직 API 연동 전입니다.");
    }

    updateProfile(mapProfileUpdateFormToApi(formData, profile))
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        const normalizedError =
          error instanceof Error ? error : new Error(String(error));
        console.error("프로필 업데이트 실패:", normalizedError.message);
      });
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
      <ProfileSummary
        profile={profile}
        onEditClick={handleEditClick}
        onSettingsClick={handleSettingsClick}
      />

      <BasicInfo
        profile={profile}
        onPhoneChangeClick={handlePhoneChangeClick}
      />

      <AcademyAndLectures
        academyName={profile.academyName}
        lectures={lectures}
      />
    </div>
  );
}
