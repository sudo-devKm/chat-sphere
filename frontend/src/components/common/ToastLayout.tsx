import toast from 'react-hot-toast';

interface ToastLayoutProps {
	icon: React.ReactNode;
	message: string;
	bg: string;
	t: any;
}

export function ToastLayout({ icon, message, bg, t }: ToastLayoutProps) {
	return (
		<div
			className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg ${bg}
      ${t.visible ? 'animate-enter' : 'animate-leave'}`}
		>
			{icon}
			<span className='text-sm'>{message}</span>

			<button
				className='ml-auto text-white/80 hover:text-white'
				onClick={() => toast.dismiss(t.id)}
			>
				✕
			</button>
		</div>
	);
}
