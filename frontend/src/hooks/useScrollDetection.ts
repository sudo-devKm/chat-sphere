import { useState, useCallback, useRef, useEffect } from 'react';

interface UseScrollDetectionProps {
	onLoadMore: () => void;
	hasMore: boolean;
	loading: boolean;
}

export const useScrollDetection = ({
	onLoadMore,
	hasMore,
	loading,
}: UseScrollDetectionProps) => {
	const [isScrolling, setIsScrolling] = useState(false);
	const scrollTimeoutRef = useRef<any>(null);

	useEffect(() => {
		return () => {
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, []);

	const onScroll = useCallback(
		(element: HTMLDivElement | null) => {
			if (!element || loading) return;

			setIsScrolling(true);
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
			scrollTimeoutRef.current = setTimeout(() => {
				setIsScrolling(false);
			}, 150);

			const nearBottom =
				element.scrollTop + element.clientHeight >= element.scrollHeight - 100;
			if (nearBottom && hasMore) {
				onLoadMore();
			}
		},
		[onLoadMore, hasMore, loading],
	);

	return {
		isScrolling,
		onScroll,
	};
};
