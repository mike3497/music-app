import type { Toast, ToastVariant } from '@/models/toast';
import { useToastsStore } from '@/stores/toastsStore';
import { nanoid } from 'nanoid';

export const useToast = () => {
  const toastsStore = useToastsStore();

  const open = (message: string, variant: ToastVariant): Toast => {
    const toast: Toast = {
      id: nanoid(),
      message,
      variant,
    };

    toastsStore.toasts.push(toast);

    setTimeout(() => close(toast), 1000);

    return toast;
  };

  const close = (toast: Toast) => {
    toastsStore.toasts = toastsStore.toasts.filter((item) => item.id !== toast.id);
  };

  return {
    open,
  };
};
