import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export const toastSuccess = (message: string): void => {
	toast.success(message, {
		icon: <CheckCircle size={18} />,
	});
};

export const toastError = (message: string): void => {
	toast.error(message, {
		icon: <XCircle size={18} />,
	});
};

export const toastInfo = (message: string): void => {
	toast(message, {
		icon: <Info size={18} />,
	});
};
