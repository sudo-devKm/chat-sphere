import { RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { router } from './App.routes';

function App() {
	return (
		<>
			<Toaster
				position='top-right'
				toastOptions={{
					duration: 4000,
				}}
			/>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
