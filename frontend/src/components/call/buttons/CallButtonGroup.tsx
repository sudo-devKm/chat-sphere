import type { ReactNode } from 'react';

interface CallButtonGroupProps {
	children: ReactNode;
	className?: string;
}

export const CallButtonGroup = ({
	children,
	className = '',
}: CallButtonGroupProps) => {
	return (
		<div
			className={`
				flex items-center justify-center gap-8
				px-10 py-8
				bg-black/60
				rounded-2xl
				backdrop-blur-sm
        		${className}
      	`}
		>
			{children}
		</div>
	);
};
