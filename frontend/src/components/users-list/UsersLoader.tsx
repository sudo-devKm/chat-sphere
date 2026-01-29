export const UsersLoader = () => {
	return (
		<div className='h-full flex flex-col items-center justify-center gap-3 text-gray-500'>
			<div className='h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600' />
			<span className='text-sm'>Loading users...</span>
		</div>
	);
};
