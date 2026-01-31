interface ScrollIndicatorProps {
	visible: boolean;
}

export const ScrollIndicator = ({ visible }: ScrollIndicatorProps) => {
	if (!visible) return null;

	return (
		<div className='absolute top-4 left-1/2 -translate-x-1/2 z-10'>
			<div className='px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50'>
				<div className='size-2 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 animate-pulse' />
			</div>
		</div>
	);
};
