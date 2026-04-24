import type {
  AuthCodeFormData,
  LoginFormData,
  RegisterFormData,
  SchoolInfoFormData,
} from "@/types/auth.type";

export const LOGIN_FORM_DEFAULTS: LoginFormData = {
  email: "",
  password: "",
  rememberMe: false,
};

export const REGISTER_FORM_DEFAULTS: RegisterFormData = {
  name: "",
  phoneNumber: "",
  email: "",
  password: "",
  passwordConfirm: "",
  agreePrivacy: false,
};

export const AUTH_CODE_FORM_DEFAULTS: AuthCodeFormData = {
  signupCode: "",
};

export const SCHOOL_INFO_FORM_DEFAULTS: SchoolInfoFormData = {
  school: "",
  schoolYear: "",
};
