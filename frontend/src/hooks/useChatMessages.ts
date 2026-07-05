import { useCallback, useEffect, useRef, useState } from 'react';
import { SocketEvent } from '@/constants/socket.events';
import { useSocket } from '@/providers/SocketContext';
import { getMessages } from '@/api/chat/chat.api';

const PAGE_SIZE = 20;

export function useChatMessages(chatId: string | null) {
	const socket = useSocket();

	const [messages, setMessages] = useState<any[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(false);

	const activeChatRef = useRef<string | null>(null);
	const messageIdsRef = useRef<Set<string>>(new Set());

	// ----------------------------
	// RESET ON CHAT CHANGE
	// ----------------------------
	useEffect(() => {
		if (!chatId) return;
		activeChatRef.current = chatId;
		messageIdsRef.current.clear();
		setMessages([]);
		setPage(1);
		setHasMore(true);
		loadMessages(1);
	}, [chatId]);

	// ----------------------------
	// LOAD MESSAGES (REST)
	// ----------------------------
	const loadMessages = useCallback(
		async (pageToLoad: number) => {
			if (!chatId || loading || !hasMore) return;

			setLoading(true);

			try {
				const res = await getMessages({
					chatId,
					page: pageToLoad,
					limit: PAGE_SIZE,
				});

				const fetched = res.data.data.messages.reverse();

				fetched.forEach((m: any) => {
					messageIdsRef.current.add(m._id);
				});

				setMessages((prev) =>
					pageToLoad === 1 ? fetched : [...fetched, ...prev],
				);

				setTotal(res.data.data.pagination.total);
				setHasMore(res.data.data.pagination.hasNextPage);
				setPage(pageToLoad);
			} finally {
				setLoading(false);
			}
		},
		[chatId, page],
	);

	// ----------------------------
	// LOAD OLDER
	// ----------------------------
	const loadOlder = useCallback(() => {
		if (!loading && hasMore) {
			loadMessages(page + 1);
		}
	}, [page, loading, hasMore]);

	// ----------------------------
	// SOCKET: RECEIVE + SUCCESS
	// ----------------------------
	useEffect(() => {
		const handleIncoming = (payload: any) => {
			const message = payload.data;

			// 🔥 Ignore other chats
			if (message.chatId !== activeChatRef.current) return;

			// 🔥 Prevent duplicates (success + receive)
			if (messageIdsRef.current.has(message._id)) return;

			messageIdsRef.current.add(message._id);

			setMessages((prev) => [...prev, message]);
		};

		socket.on(SocketEvent.CHAT_RECEIVE, handleIncoming);
		socket.on(SocketEvent.CHAT_SUCCESS, handleIncoming);

		return () => {
			socket.off(SocketEvent.CHAT_RECEIVE, handleIncoming);
			socket.off(SocketEvent.CHAT_SUCCESS, handleIncoming);
		};
	}, [socket]);

	return {
		messages,
		loadOlder,
		total,
		loading,
		hasMore,
	};
}
