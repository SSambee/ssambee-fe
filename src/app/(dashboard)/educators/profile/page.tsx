"use client";

import { useState } from "react";

import { mockProfile, mockLectures } from "@/data/profile.mock";
import type { ProfileUpdateFormData } from "@/validation/profile.validation";
import { useModal } from "@/providers/ModalProvider";

import { ProfileSummary } from "./_components/ProfileSummary";
import { BasicInfo } from "./_components/BasicInfo";
import { AcademyAndLectures } from "./_components/AcademyAndLectures";
import { ProfileEditModal } from "./_components/modal/ProfileEditModal";
import { SettingsSecurityModal } from "./_components/modal/SettingsSecurityModal";
import { PhoneChangeModal } from "./_components/modal/PhoneChangeModal";

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockProfile);
  const { openModal, closeModal } = useModal();

  const handleEditClick = () => {
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
    openModal(<PhoneChangeModal currentPhone={profile.phone} />);
  };

  const handleProfileUpdate = (
    data: ProfileUpdateFormData & { imageFile: File | null }
  ) => {
    let newImageUrl = profile.image;
    if (data.imageFile) {
      newImageUrl = URL.createObjectURL(data.imageFile);
    }
    setProfile({
      ...profile,
      ...data,
      image: newImageUrl,
      subjects: data.subjects || [],
    });
    closeModal();
  };

  return (
    <div className="space-y-6 p-4 max-w-[1400px] mx-auto w-full">
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
        lectures={mockLectures}
      />
    </div>
  );
}
