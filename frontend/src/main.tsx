import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthBootstrapProvider } from '@/providers/AuthBootstrapProvider.tsx';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/react.query.client';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthBootstrapProvider>
				<App />
			</AuthBootstrapProvider>
		</QueryClientProvider>
	</StrictMode>,
);
