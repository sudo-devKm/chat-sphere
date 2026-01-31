import React, { forwardRef } from 'react';

interface ListContainerProps {
	children: React.ReactNode;
	onScroll: () => void;
}

export const ListContainer = forwardRef<HTMLDivElement, ListContainerProps>(
	({ children, onScroll }, ref) => {
		return (
			<div
				ref={ref}
				className='h-full overflow-y-auto scroll-smooth bg-linear-to-b from-white to-gray-50'
				onScroll={onScroll}
			>
				{children}
			</div>
		);
	},
);

ListContainer.displayName = 'ListContainer';
