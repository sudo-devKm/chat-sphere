import { useCallback, useRef, useState } from 'react';
import { getUsers } from '@/api/users/users.api';

export const useDashboardUsers = () => {
	const [users, setUsers] = useState<Record<string, any>>({});
	const [order, setOrder] = useState<string[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [isLoading, setIsLoading] = useState(false);

	const loadingRef = useRef(false); // 🔒 HARD LOCK
	const loadMore = useCallback(async () => {
		if (loadingRef.current || !hasMore) return;

		loadingRef.current = true;
		setIsLoading(true);

		try {
			const res = await getUsers(page);
			const fetched = res.data.users;
			const { total, limit } = res.data.pagination;

			const more = +page * +limit < total;

			setUsers((prev) => {
				const next = { ...prev };
				fetched.forEach((u: any) => {
					next[u._id] = { ...u, status: 'offline' };
				});
				return next;
			});

			setOrder((prev) => [...prev, ...fetched.map((u: any) => u._id)]);
			setHasMore(more);
		} finally {
			loadingRef.current = false;
			setIsLoading(false);
		}
	}, [page]);

	return {
		users,
		order,
		loadMore,
		hasMore,
		isLoading,
		setPage,
	};
};
