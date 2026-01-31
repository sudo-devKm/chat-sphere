import { type ReactNode } from 'react';

interface MessageBubbleProps {
	isMine: boolean;
	children: ReactNode;
}

export const MessageBubble = ({ isMine, children }: MessageBubbleProps) => {
	return (
		<div
			className={`
				max-w-[75%] min-w-32
				px-4 py-3
				rounded-2xl
				text-sm
				relative
				transition-all duration-300
				hover:shadow-lg
				${
					isMine
						? 'bg-linear-to-br from-indigo-500 to-indigo-600 text-white shadow-[0_2px_12px_rgba(99,102,241,0.2)]'
						: 'bg-white text-gray-900 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.05)]'
				}
			`}
		>
			{children}
		</div>
	);
};
