import type { ReactNode } from 'react';

interface InputContainerProps {
	children: ReactNode;
}

export const InputContainer = ({ children }: InputContainerProps) => {
	return (
		<div className='shrink-0 border-t border-gray-100 bg-white px-6 py-4'>
			<div className='flex flex-col gap-3 rounded-2xl bg-gray-50 px-4 py-3 shadow-sm border border-gray-100'>
				{children}
			</div>
		</div>
	);
};
