export const EmptyState = () => {
	return (
		<div className='flex flex-col items-center justify-center h-full py-16 px-6 text-center'>
			<div className='size-24 mb-6 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
				<div className='size-16 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center'>
					<svg
						className='size-8 text-blue-600'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={1.5}
							d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
						/>
					</svg>
				</div>
			</div>
			<h3 className='text-xl font-semibold text-gray-800 mb-2'>
				No messages yet
			</h3>
			<p className='text-gray-500 max-w-sm'>
				Start the conversation by sending your first message below
			</p>
		</div>
	);
};
