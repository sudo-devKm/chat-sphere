import { ArrowDown } from 'lucide-react';

interface ScrollToBottomButtonProps {
	visible: boolean;
	onClick: () => void;
}

export const ScrollToBottomButton = ({
	visible,
	onClick,
}: ScrollToBottomButtonProps) => {
	if (!visible) return null;

	return (
		<button
			onClick={onClick}
			className='absolute bottom-4 right-4 z-20 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors'
		>
			<ArrowDown className='size-4' />
			<span className='text-sm font-medium'>Scroll to bottom</span>
		</button>
	);
};
