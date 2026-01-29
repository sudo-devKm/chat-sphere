import { AcceptButton } from './AcceptButton';
import { RejectButton } from './RejectButton';

interface IncomingCallControlsProps {
	callType: 'audio' | 'video';
	accepting: boolean;
	onAccept: () => void;
	onReject: () => void;
	timeLeft: number;
}

export const IncomingCallControls = ({
	callType,
	accepting,
	onAccept,
	onReject,
	timeLeft,
}: IncomingCallControlsProps) => {
	return (
		<div className='flex flex-col items-center gap-4'>
			<div className='flex items-center justify-center gap-20'>
				<RejectButton onClick={onReject} disabled={accepting} size='lg' />

				<AcceptButton
					callType={callType}
					accepting={accepting}
					onClick={onAccept}
					size='lg'
				/>
			</div>

			{/* Time warning */}
			{timeLeft < 10 && (
				<div className='text-orange-300 font-medium text-sm mt-2'>
					Call ending in {timeLeft} seconds
				</div>
			)}
		</div>
	);
};
