interface OnlineCounterProps {
	onlineCount: number;
	visible: boolean;
}

export const OnlineCounter = ({ onlineCount, visible }: OnlineCounterProps) => {
	if (!visible) return null;

	return (
		<div className='absolute bottom-6 right-6'>
			<div className='px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 flex items-center gap-2'>
				<div className='size-2 rounded-full bg-green-500 animate-pulse' />
				<span className='text-sm font-medium text-gray-700'>
					{onlineCount} online
				</span>
			</div>
		</div>
	);
};
