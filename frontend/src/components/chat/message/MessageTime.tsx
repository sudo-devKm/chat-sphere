interface MessageTimeProps {
	time: string;
	isMine: boolean;
}

export const MessageTime = ({ time }: MessageTimeProps) => {
	return (
		<div className='mt-2 flex items-center justify-end gap-1.5 select-none'>
			<span className='text-xs opacity-75 font-medium tracking-tight'>
				{time}
			</span>
		</div>
	);
};
