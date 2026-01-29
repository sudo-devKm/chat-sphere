import {
	useQuery,
	useQueryClient,
	type UseQueryOptions,
} from '@tanstack/react-query';
import { getDownloadUrl } from '@/api/file/file.api';

// Cache duration
const URL_EXPIRY_BUFFER = 4.5 * 60 * 1000;

// Main query function that can be used independently
export const fetchPresignedUrl = async ({
	chatId,
	fileKey,
}: {
	chatId: string;
	fileKey: string;
}): Promise<string> => {
	return await getDownloadUrl(chatId, fileKey);
};

// Query key factory for better type safety
export const presignedUrlKeys = {
	all: ['presignedUrl'] as const,
	detail: (chatId: string, fileKey: string) =>
		[...presignedUrlKeys.all, chatId, fileKey] as const,
};

// React Query options that can be reused
export const presignedUrlQueryOptions = (
	chatId: string,
	fileKey?: string,
	autoLoad: boolean = true,
): UseQueryOptions<string | null, Error> => ({
	queryKey: presignedUrlKeys.detail(chatId, fileKey || ''),
	queryFn: () =>
		fileKey ? fetchPresignedUrl({ chatId, fileKey }) : Promise.resolve(null),
	enabled: autoLoad && !!fileKey,
	staleTime: URL_EXPIRY_BUFFER,
	gcTime: 5 * 60 * 1000,
	refetchInterval: URL_EXPIRY_BUFFER,
	refetchIntervalInBackground: true,
	refetchOnWindowFocus: false,
});

type UseS3PrivateFileArgs = {
	chatId: string;
	fileKey?: string;
	autoLoad?: boolean;
	queryOptions?: Partial<UseQueryOptions<string | null, Error>>;
};

export const useS3PrivateFile = ({
	chatId,
	fileKey,
	autoLoad = true,
	queryOptions = {},
}: UseS3PrivateFileArgs) => {
	const queryClient = useQueryClient();

	const {
		data: url,
		isLoading,
		isFetching,
		refetch,
		isError,
		error,
	} = useQuery({
		...presignedUrlQueryOptions(chatId, fileKey, autoLoad),
		...queryOptions,
	});

	const download = async () => {
		if (!fileKey) return;

		// Check current cache state
		const queryKey = presignedUrlKeys.detail(chatId, fileKey);
		const queryState = queryClient.getQueryState(queryKey);

		// If we have a valid cached URL, use it
		if (
			url &&
			queryState &&
			Date.now() < queryState.dataUpdatedAt + URL_EXPIRY_BUFFER
		) {
			window.open(url, '_blank');
			return;
		}

		// Otherwise fetch fresh URL
		try {
			const freshUrl = await fetchPresignedUrl({ chatId, fileKey });
			// Update cache immediately
			queryClient.setQueryData(queryKey, freshUrl);
			window.open(freshUrl, '_blank');
		} catch (error) {
			console.error('Failed to fetch download URL:', error);
			throw error;
		}
	};

	const refreshUrl = async () => {
		if (!fileKey) return;
		await queryClient.invalidateQueries({
			queryKey: presignedUrlKeys.detail(chatId, fileKey),
		});
		return await refetch();
	};

	return {
		previewUrl: url || null,
		loading: isLoading || isFetching,
		download,
		refreshUrl,
		isError,
		error,
	};
};
