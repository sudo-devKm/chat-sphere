import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 5 * 60 * 1000, // 5 minutes
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});
