import { Users } from 'lucide-react';

interface EmptyStateProps {
	visible: boolean;
}

export const EmptyState = ({ visible }: EmptyStateProps) => {
	if (!visible) return null;

	return (
		<div className='flex flex-col items-center justify-center h-full py-16 px-6 text-center'>
			<div className='size-24 mb-6 rounded-full bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center'>
				<div className='size-16 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center'>
					<Users className='size-8 text-blue-600' />
				</div>
			</div>
			<h3 className='text-xl font-semibold text-gray-800 mb-2'>
				No users found
			</h3>
			<p className='text-gray-500 max-w-sm'>
				Start conversations by connecting with people
			</p>
		</div>
	);
};
