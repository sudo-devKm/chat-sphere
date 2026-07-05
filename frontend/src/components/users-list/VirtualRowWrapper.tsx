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
			// tanstack-virtual's documented API for dynamic row measurement;
			// this assigns a callback ref, not a render-time ref read.
			// eslint-disable-next-line react-hooks/refs
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
