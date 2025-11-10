
'use client';

import { useToast } from '@/hooks/use-toast';

type ActionHandler<T> = () => Promise<T>;
type ToastOptions = {
    toast: ReturnType<typeof useToast>['toast'];
    successMessage?: string;
    errorMessage?: string;
};

/**
 * A higher-order function to wrap server actions with centralized error handling.
 * @param action - The async server action to execute.
 * @param options - Configuration for toast messages.
 * @returns The result of the action or null if an error occurred.
 */
export async function handleAction<T>(
  action: ActionHandler<T>,
  options: ToastOptions
): Promise<T | null> {
  const { toast, successMessage, errorMessage } = options;

  try {
    const result = await action();
    if (successMessage) {
      toast({
        title: 'Success!',
        description: successMessage,
      });
    }
    return result;
  } catch (error) {
    console.error("Action Error:", error);
    
    let message = errorMessage || 'An unexpected error occurred. Please try again.';
    if (error instanceof Error) {
        // Use the specific error message if it exists, otherwise fall back.
        message = error.message || message;
    }
    
    toast({
      variant: 'destructive',
      title: 'Uh oh! Something went wrong.',
      description: message,
    });
    
    return null;
  }
}
