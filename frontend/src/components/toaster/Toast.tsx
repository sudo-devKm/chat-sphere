import toast, { type ToastOptions } from 'react-hot-toast';
import {
	SuccessToast,
	ErrorToast,
	InfoToast,
	WarningToast,
	LoadingToast,
} from './ToastVariants';

// Toast configuration
const toastConfig: ToastOptions = {
	position: 'top-right',
	duration: 4000,
};

// Export toast functions
export const toastSuccess = (message: string, options?: ToastOptions): void => {
	toast.custom(
		(t) => (
			<SuccessToast
				message={message}
				t={t}
				duration={options?.duration || toastConfig.duration || 4000}
			/>
		),
		{
			...toastConfig,
			...options,
		},
	);
};

export const toastError = (message: string, options?: ToastOptions): void => {
	toast.custom(
		(t) => (
			<ErrorToast
				message={message}
				t={t}
				duration={options?.duration || toastConfig.duration || 4000}
			/>
		),
		{
			...toastConfig,
			...options,
		},
	);
};

export const toastInfo = (message: string, options?: ToastOptions): void => {
	toast.custom(
		(t) => (
			<InfoToast
				message={message}
				t={t}
				duration={options?.duration || toastConfig.duration || 4000}
			/>
		),
		{
			...toastConfig,
			...options,
		},
	);
};

export const toastWarning = (message: string, options?: ToastOptions): void => {
	toast.custom(
		(t) => (
			<WarningToast
				message={message}
				t={t}
				duration={options?.duration || toastConfig.duration || 4000}
			/>
		),
		{
			...toastConfig,
			...options,
		},
	);
};

export const toastLoading = (
	message: string,
	options?: ToastOptions,
): string => {
	return toast.custom((t) => <LoadingToast message={message} t={t} />, {
		...toastConfig,
		duration: Infinity,
		...options,
	});
};

export const toastPromise = <T,>(
	promise: Promise<T>,
	messages: {
		loading: string;
		success: string;
		error: string;
	},
	options?: ToastOptions,
): Promise<T> => {
	const loadingId = toastLoading(messages.loading, options);

	return promise
		.then((result) => {
			toast.dismiss(loadingId);
			toastSuccess(messages.success, options);
			return result;
		})
		.catch((error) => {
			toast.dismiss(loadingId);
			toastError(messages.error, options);
			throw error;
		});
};

// Export CSS as a string to be added to your global CSS
export const toastCSS = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  @keyframes progress {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes pingSlow {
    0%, 100% {
      transform: scale(1);
      opacity: 0.2;
    }
    50% {
      transform: scale(1.5);
      opacity: 0;
    }
  }

  .animate-slideIn {
    animation: slideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  }

  .animate-fadeOut {
    animation: fadeOut 0.5s ease-in forwards;
  }

  .animate-progress {
    animation: progress linear forwards;
    animation-play-state: running;
  }

  .animate-pingSlow {
    animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;
