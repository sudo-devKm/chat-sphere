// src/pages/HomePage.tsx
import { Box } from '@mui/material';
import { Navbar } from '@/components/common/Navbar';
import {
	HeroSection,
	StatsSection,
	FeaturesSection,
	HowItWorksSection,
	TestimonialsSection,
	FinalCTASection,
} from '@/components/home';

export const HomePage = () => {
	return (
		<Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
			<Navbar />
			<HeroSection />
			<StatsSection />
			<FeaturesSection />
			<HowItWorksSection />
			<TestimonialsSection />
			<FinalCTASection />
		</Box>
	);
};
