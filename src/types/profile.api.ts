export type ProfileApiLecture = {
  id: string;
  title: string;
  schoolYear?: string | null;
  enrollmentCount?: number | null;
  status?: string | null;
};

export type MyProfileApiResponse = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  userType: string;
  academy?: string | null;
  subject?: string | null;
  createdAt?: string | null;
  image?: string | null;
  bio?: string | null;
  phoneVerified?: boolean | null;
  lectures?: ProfileApiLecture[];
  instructorLectures?: ProfileApiLecture[];
  instructor?: { id: string; name: string } | null;
};

export type UpdateMyProfilePayload = {
  name?: string;
  phoneNumber?: string;
  academy?: string;
  subject?: string;
};
