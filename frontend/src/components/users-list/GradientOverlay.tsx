interface GradientOverlayProps {
	position: 'top' | 'bottom';
}

export const GradientOverlay = ({ position }: GradientOverlayProps) => {
	return (
		<div
			className={`sticky ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 h-6 bg-gradient-to-${position === 'top' ? 'b' : 't'} from-white to-transparent z-10 pointer-events-none`}
		/>
	);
};
