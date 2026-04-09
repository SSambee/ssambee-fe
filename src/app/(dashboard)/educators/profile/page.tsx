"use client";

import { mapProfileUpdateFormToApi } from "@/mappers/profile.mapper";
import { useMyProfile } from "@/hooks/profile/useMyProfile";
import { useSetBreadcrumb } from "@/hooks/useBreadcrumb";
import type { ProfileUpdateFormData } from "@/validation/profile.validation";
import { useModal } from "@/app/providers/ModalProvider";

import { ProfileSummary } from "./_components/ProfileSummary";
import { AcademyAndLectures } from "./_components/AcademyAndLectures";
import { ProfileEditModal } from "./_components/modal/ProfileEditModal";
import { SettingsSecurityModal } from "./_components/modal/SettingsSecurityModal";
import { PhoneChangeModal } from "./_components/modal/PhoneChangeModal";

export default function ProfilePage() {
  useSetBreadcrumb([{ label: "프로필" }]);

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
    if (!profile) return;

    openModal(<SettingsSecurityModal email={profile.email} />);
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
      <section className="-mx-6 -mt-6 border-b border-[#e9ebf0] bg-white px-6 py-6 sm:px-8 sm:py-7">
        <h1 className="text-[30px] font-bold leading-[1.2] tracking-[-0.03em] text-[#040405] sm:text-[36px] sm:leading-[48px]">
          내 프로필
        </h1>
        <p className="text-[16px] font-medium leading-6 tracking-[-0.01em] text-[rgba(22,22,27,0.4)] sm:text-[20px] sm:leading-7 sm:tracking-[-0.02em]">
          내 프로필을 확인하고 관리합니다
        </p>
      </section>

      <ProfileSummary
        profile={profile}
        onEditClick={handleEditClick}
        onSettingsClick={handleSettingsClick}
        onPhoneChangeClick={handlePhoneChangeClick}
      />

      <AcademyAndLectures
        academyName={profile.academyName}
        teacherName={
          profile.role === "ASSISTANT" && profile.instructorName
            ? profile.instructorName
            : profile.name
        }
        lectures={lectures}
      />
    </div>
  );
}
