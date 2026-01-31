import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
	visible: boolean;
}

export const LoadingIndicator = ({ visible }: LoadingIndicatorProps) => {
	if (!visible) return null;

	return (
		<div className='flex justify-center py-6'>
			<div className='flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 animate-pulse'>
				<Loader2 className='size-5 text-blue-600 animate-spin' />
				<span className='text-sm font-medium text-gray-700'>
					Loading more users...
				</span>
			</div>
		</div>
	);
};
