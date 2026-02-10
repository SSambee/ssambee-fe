export type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  image: string | null;
  academyName: string;
  subjects: string[];
  bio: string;
  createdAt: string;
  role: "INSTRUCTOR" | "ASSISTANT";
};

export type Lecture = {
  id: string;
  name: string;
  target: string;
  studentCount: number;
};

export type ProfileUpdateData = {
  name: string;
  email: string;
  subjects: string[];
  academyName: string;
  bio: string;
  image?: string | null;
};
