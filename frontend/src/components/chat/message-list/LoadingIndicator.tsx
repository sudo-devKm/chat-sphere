import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
	text?: string;
}

export const LoadingIndicator = ({
	text = 'Loading...',
}: LoadingIndicatorProps) => {
	return (
		<div className='flex justify-center py-4 px-4'>
			<div className='flex items-center gap-3 px-4 py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-100 animate-pulse'>
				<Loader2 className='size-4 text-blue-600 animate-spin' />
				<span className='text-sm font-medium text-gray-700'>{text}</span>
			</div>
		</div>
	);
};
