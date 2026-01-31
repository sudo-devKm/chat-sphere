import { RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { router } from './App.routes';
import { toastCSS } from './components/toaster/Toast';

function App() {
	return (
		<>
			<Toaster
				position='top-right'
				gutter={16}
				containerStyle={{
					top: 24,
					right: 24,
				}}
				toastOptions={{
					duration: 4000,
					style: {
						background: 'transparent',
						padding: 0,
						margin: 0,
						boxShadow: 'none',
					},
				}}
			/>
			<RouterProvider router={router} />
			{/* Add toast animations to the document */}
			<style>{toastCSS}</style>
		</>
	);
}

export default App;
