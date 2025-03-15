import { toast } from "~/components/toast";

const getErrorMessage = (error: any) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "An error occurred";
};

export function withToast<T>(
  promise: Promise<T>,
  options?: {
    loading?: string;
    success?: string;
    error?: string;
  },
) {
  toast.promise(promise, {
    loading: options?.loading,
    success: options?.success,
    error: (error) => options?.error || getErrorMessage(error),
  });

  return promise;
}
