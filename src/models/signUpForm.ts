export interface SignUpForm {
  confirmPassword: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export const defaultSignUpForm: SignUpForm = {
  confirmPassword: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
};
