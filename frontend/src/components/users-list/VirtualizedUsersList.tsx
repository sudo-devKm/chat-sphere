import { useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { UserResponse } from '@/types/auth.types';
import UserRow from './UserRow';

export const VirtualizedUsersList: React.FC<{
	userIds: string[];
	onlineIds: Set<string>; // ✅ use Set
	users: Record<string, UserResponse>;
	onLoadNextPage: () => void;
	onSelectUser: React.Dispatch<React.SetStateAction<string | null>>;
	selectedUserId: string | null;
}> = ({
	userIds,
	onlineIds,
	users,
	onLoadNextPage,
	onSelectUser,
	selectedUserId,
}) => {
	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: userIds.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 64, // average user row height
		overscan: 8,
	});

	const onScroll = useCallback(() => {
		const el = parentRef.current;
		if (!el) return;

		const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

		if (nearBottom) {
			onLoadNextPage();
		}
	}, [onLoadNextPage]);

	return (
		<div ref={parentRef} className='h-full overflow-y-auto' onScroll={onScroll}>
			<div
				style={{
					height: rowVirtualizer.getTotalSize(),
					position: 'relative',
				}}
			>
				{rowVirtualizer.getVirtualItems().map((virtualRow) => {
					const userId = userIds[virtualRow.index];
					const user = users[userId];

					return (
						<div
							key={userId}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								transform: `translateY(${virtualRow.start}px)`,
							}}
						>
							<UserRow
								index={virtualRow.index}
								userId={userId}
								user={user}
								isOnline={onlineIds.has(userId)}
								onSelectUser={onSelectUser}
								selectedUserId={selectedUserId}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};
