import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { validateEnv, EnvValidationError } from './src/config/env';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	try {
		validateEnv(env);
	} catch (error) {
		console.error('\n❌ Environment validation failed:\n');

		if (error instanceof EnvValidationError) {
			error.details.forEach((msg) => console.error(`- ${msg}`));
		} else {
			console.error(error);
		}

		console.error('\n🛑 Fix env variables and restart Vite.\n');
		process.exit(1); // ✅ CORRECT PLACE
	}

	return {
		plugins: [
			react({
				babel: {
					plugins: [['babel-plugin-react-compiler']],
				},
			}),
			tailwindcss(),
		],
		server: {
			port: 3000,
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, 'src'),
			},
		},
		build: {
			outDir: 'dist',
			sourcemap: false, // Disable in production
			minify: 'terser',
			rollupOptions: {
				output: {
					manualChunks: {
						vendor: ['react', 'react-dom', 'react-router'],
					},
				},
			},
		},
	};
});
