export const FullScreenLoader = () => {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm'>
			<div className='flex flex-col items-center gap-4'>
				{/* Spinner */}
				<div className='h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary' />

				{/* Text */}
				<p className='text-sm text-gray-600'>Loading, please wait...</p>
			</div>
		</div>
	);
};
