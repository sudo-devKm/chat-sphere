import { formatDistanceToNow, parseISO } from 'date-fns';

export const formatLastSeen = (isoDate?: string): string => {
	if (!isoDate) return 'recently';

	try {
		const date = parseISO(isoDate);
		const now = new Date();
		const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

		if (diffInMinutes < 2) return 'just now';
		return `${formatDistanceToNow(date, { addSuffix: false })} ago`;
	} catch (error) {
		return 'recently';
	}
};
