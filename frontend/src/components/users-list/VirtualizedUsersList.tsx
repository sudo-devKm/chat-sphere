import { useRef, useCallback, useState, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { UserResponse } from '@/types/auth.types';
import { UserRow } from './UserRow';
import { ListContainer } from './ListContainer';
import { ScrollIndicator } from './ScrollIndicator';
import { LoadingIndicator } from './LoadingIndicator';
import { EmptyState } from './EmptyState';
import { OnlineCounter } from './OnlineCounter';
import { GradientOverlay } from './GradientOverlay';
import { VirtualRowWrapper } from './VirtualRowWrapper';

interface VirtualizedUsersListProps {
	userIds: string[];
	onlineIds: Set<string>;
	users: Record<string, UserResponse>;
	onLoadNextPage: () => void;
	onSelectUser: React.Dispatch<React.SetStateAction<string | null>>;
	selectedUserId: string | null;
	hasMore?: boolean;
	loading?: boolean;
}

export const VirtualizedUsersList: React.FC<VirtualizedUsersListProps> = ({
	userIds,
	onlineIds,
	users,
	onLoadNextPage,
	onSelectUser,
	selectedUserId,
	hasMore = true,
	loading = false,
}) => {
	const parentRef = useRef<HTMLDivElement>(null);
	const [isScrolling, setIsScrolling] = useState(false);
	const scrollTimeoutRef = useRef<any>(null);

	const rowVirtualizer = useVirtualizer({
		count: userIds.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 72,
		overscan: 10,
	});

	// Clean up timeout on unmount
	useEffect(() => {
		return () => {
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, []);

	const onScroll = useCallback(() => {
		const el = parentRef.current;
		if (!el || loading) return;

		setIsScrolling(true);
		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current);
		}
		scrollTimeoutRef.current = setTimeout(() => {
			setIsScrolling(false);
		}, 150);

		const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
		if (nearBottom && hasMore) {
			onLoadNextPage();
		}
	}, [onLoadNextPage, hasMore, loading]);

	const virtualItems = rowVirtualizer.getVirtualItems();

	return (
		<div className='relative h-full'>
			<ScrollIndicator visible={isScrolling && userIds.length > 5} />

			<ListContainer ref={parentRef} onScroll={onScroll}>
				<GradientOverlay position='top' />

				<div
					style={{
						height: rowVirtualizer.getTotalSize(),
						position: 'relative',
					}}
					className='pb-8'
				>
					{virtualItems.map((virtualRow) => {
						const userId = userIds[virtualRow.index];
						const user = users[userId];

						if (!user) return null;

						return (
							<VirtualRowWrapper
								key={userId}
								virtualRow={virtualRow}
								rowVirtualizer={rowVirtualizer}
							>
								<UserRow
									index={virtualRow.index}
									userId={userId}
									user={user}
									isOnline={onlineIds.has(userId)}
									onSelectUser={onSelectUser}
									selectedUserId={selectedUserId}
								/>
							</VirtualRowWrapper>
						);
					})}
				</div>

				<LoadingIndicator visible={loading && hasMore} />
				<EmptyState visible={userIds.length === 0 && !loading} />

				<GradientOverlay position='bottom' />
			</ListContainer>

			<OnlineCounter
				onlineCount={onlineIds.size}
				visible={onlineIds.size > 0 && userIds.length > 0}
			/>
		</div>
	);
};
