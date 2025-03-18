export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

export enum ToastVariant {
  ERROR,
  INFO,
  SUCCESS,
  WARNING,
}
