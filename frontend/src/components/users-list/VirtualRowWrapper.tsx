import type { ReactNode } from 'react';
import type { VirtualItem } from '@tanstack/react-virtual';

interface VirtualRowWrapperProps {
	virtualRow: VirtualItem;
	rowVirtualizer: any;
	children: ReactNode;
}

export const VirtualRowWrapper = ({
	virtualRow,
	rowVirtualizer,
	children,
}: VirtualRowWrapperProps) => {
	return (
		<div
			data-index={virtualRow.index}
			ref={rowVirtualizer.measureElement}
			style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				transform: `translateY(${virtualRow.start}px)`,
			}}
			className='transition-opacity duration-300'
		>
			{children}
		</div>
	);
};
