import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertCircle, X, Loader2 } from 'lucide-react';

// Progress Bar Component
const ProgressBar = ({ duration }: { duration: number }) => (
	<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-current/10 overflow-hidden'>
		<div
			className='h-full bg-current/30 animate-progress'
			style={{ animationDuration: `${duration}ms` }}
		/>
	</div>
);

// Close Button Component
const CloseButton = ({ t }: { t: any }) => (
	<button
		onClick={() => toast.dismiss(t.id)}
		className='absolute top-3 right-3 p-1 rounded-full hover:bg-black/5
               transition-colors duration-200 focus:outline-none
               focus:ring-2 focus:ring-offset-1 focus:ring-current/30'
		aria-label='Close notification'
	>
		<X className='w-3.5 h-3.5 opacity-60 hover:opacity-100' />
	</button>
);

// Custom toast style function
const getToastStyle = (
	type: 'success' | 'error' | 'info' | 'warning' | 'loading',
): string => {
	const baseClasses = `
    flex items-center gap-3 p-4 pr-10 rounded-xl shadow-lg
    backdrop-blur-sm border transform transition-all duration-300
    max-w-md min-w-[300px] relative overflow-hidden
  `;

	const typeClasses = {
		success:
			'bg-gradient-to-r from-emerald-50 to-white border-emerald-100 text-emerald-800',
		error:
			'bg-gradient-to-r from-rose-50 to-white border-rose-100 text-rose-800',
		info: 'bg-gradient-to-r from-blue-50 to-white border-blue-100 text-blue-800',
		warning:
			'bg-gradient-to-r from-amber-50 to-white border-amber-100 text-amber-800',
		loading:
			'bg-gradient-to-r from-slate-50 to-white border-slate-100 text-slate-800',
	};

	return `${baseClasses} ${typeClasses[type]}`;
};

// Success Toast Component
export const SuccessToast = ({
	message,
	t,
	duration,
}: {
	message: string;
	t: any;
	duration: number;
}) => (
	<div
		className={`
      ${getToastStyle('success')}
      ${t.visible ? 'animate-slideIn' : 'animate-fadeOut'}
    `}
	>
		<div className='relative'>
			<CheckCircle className='w-5 h-5 text-emerald-500' strokeWidth={2.5} />
			<div className='absolute inset-0 animate-pingSlow opacity-20'>
				<CheckCircle className='w-5 h-5 text-emerald-400' />
			</div>
		</div>
		<div className='flex-1'>
			<p className='text-sm font-semibold'>Success</p>
			<p className='text-sm opacity-90 mt-0.5'>{message}</p>
		</div>
		<ProgressBar duration={duration} />
		<CloseButton t={t} />
	</div>
);

// Error Toast Component
export const ErrorToast = ({
	message,
	t,
	duration,
}: {
	message: string;
	t: any;
	duration: number;
}) => (
	<div
		className={`
      ${getToastStyle('error')}
      ${t.visible ? 'animate-slideIn' : 'animate-fadeOut'}
    `}
	>
		<div className='relative'>
			<XCircle className='w-5 h-5 text-rose-500' strokeWidth={2.5} />
			<div className='absolute inset-0 animate-pulse opacity-20'>
				<XCircle className='w-5 h-5 text-rose-400' />
			</div>
		</div>
		<div className='flex-1'>
			<p className='text-sm font-semibold'>Error</p>
			<p className='text-sm opacity-90 mt-0.5'>{message}</p>
		</div>
		<ProgressBar duration={duration} />
		<CloseButton t={t} />
	</div>
);

// Info Toast Component
export const InfoToast = ({
	message,
	t,
	duration,
}: {
	message: string;
	t: any;
	duration: number;
}) => (
	<div
		className={`
      ${getToastStyle('info')}
      ${t.visible ? 'animate-slideIn' : 'animate-fadeOut'}
    `}
	>
		<div className='relative'>
			<Info className='w-5 h-5 text-blue-500' strokeWidth={2.5} />
			<div className='absolute inset-0 animate-pulse opacity-20'>
				<Info className='w-5 h-5 text-blue-400' />
			</div>
		</div>
		<div className='flex-1'>
			<p className='text-sm font-semibold'>Info</p>
			<p className='text-sm opacity-90 mt-0.5'>{message}</p>
		</div>
		<ProgressBar duration={duration} />
		<CloseButton t={t} />
	</div>
);

// Warning Toast Component
export const WarningToast = ({
	message,
	t,
	duration,
}: {
	message: string;
	t: any;
	duration: number;
}) => (
	<div
		className={`
      ${getToastStyle('warning')}
      ${t.visible ? 'animate-slideIn' : 'animate-fadeOut'}
    `}
	>
		<div className='relative'>
			<AlertCircle className='w-5 h-5 text-amber-500' strokeWidth={2.5} />
			<div className='absolute inset-0 animate-pulse opacity-20'>
				<AlertCircle className='w-5 h-5 text-amber-400' />
			</div>
		</div>
		<div className='flex-1'>
			<p className='text-sm font-semibold'>Warning</p>
			<p className='text-sm opacity-90 mt-0.5'>{message}</p>
		</div>
		<ProgressBar duration={duration} />
		<CloseButton t={t} />
	</div>
);

// Loading Toast Component
export const LoadingToast = ({ message, t }: { message: string; t: any }) => (
	<div
		className={`
      ${getToastStyle('loading')}
      ${t.visible ? 'animate-slideIn' : 'animate-fadeOut'}
    `}
	>
		<Loader2 className='w-5 h-5 text-slate-500 animate-spin' />
		<div className='flex-1'>
			<p className='text-sm font-semibold'>Loading</p>
			<p className='text-sm opacity-90 mt-0.5'>{message}</p>
		</div>
		<CloseButton t={t} />
	</div>
);
