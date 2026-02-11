export type AssistantSignStatus = "PENDING" | "SIGNED" | "REJECTED" | "EXPIRED";

export type AssistantsQueryStatus =
  | "pending"
  | "signed"
  | "expired"
  | "rejected";

export type AssistantSignAction = "approve" | "reject" | "expire";

export type AssistantUserApi = {
  name?: string | null;
  email?: string | null;
};

export type AssistantApi = {
  id: string;
  userId?: string | null;
  instructorId: string;
  name: string;
  phoneNumber?: string | null;
  signupCode?: string | null;
  contract?: string | null;
  memo?: string | null;
  signStatus: AssistantSignStatus;
  createdAt?: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  user?: AssistantUserApi | null;
};

export type AssistantsListApi = {
  assistants: AssistantApi[];
};

export type AssistantUpdatePayload = {
  name?: string;
  phoneNumber?: string;
  contract?: string;
  memo?: string;
};

export type AssistantCodeApi = {
  id: string;
  code: string;
  instructorId: string;
  isUsed: boolean;
  expireAt: string;
  createdAt: string;
};
