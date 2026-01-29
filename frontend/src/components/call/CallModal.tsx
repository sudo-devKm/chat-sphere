import React, { useState, useEffect } from 'react';
import { Dialog, Typography } from '@mui/material';
import { CallControls } from './buttons/CallControls';
import { LocalVideo } from './LocalVideo';
import { RemoteVideo } from './RemoteVideo';
import { RemoteAudio } from './RemoteAudio';
import { IncomingCallControls } from './buttons/IncomingCallControls';
import { CallStatusHeader } from './CallStatusHeader';
import { CallPreviewContent } from './CallPreviewContent';
import type { CallState } from '@/types/call.types';

type CallDirection = 'incoming' | 'outgoing';

type CallModalProps = {
	open: boolean;
	callDirection: CallDirection;
	callType: 'audio' | 'video';
	callState: CallState;
	localStream: MediaStream | null;
	remoteStream: MediaStream | null;
	peerName: string;
	peerAvatar?: string;
	peerStatus?: 'online' | 'offline' | 'away';
	// Callbacks
	onAccept?: () => Promise<void>;
	onEnd: () => void;
	onReject?: () => void;
	toggleAudio: () => void;
	toggleVideo?: () => void;
	isAudioMuted: boolean;
	isVideoOff: boolean;
	// Optional: For call duration
	callStartTime?: Date;
	// Optional: For incoming call timeout
	timeoutDuration?: number;
};

export const CallModal: React.FC<CallModalProps> = ({
	open,
	callDirection,
	callType,
	callState,
	localStream,
	remoteStream,
	peerName,
	peerAvatar,
	peerStatus = 'online',
	onAccept,
	onEnd,
	onReject,
	toggleAudio,
	toggleVideo,
	isAudioMuted,
	isVideoOff,
	callStartTime,
	timeoutDuration = 60,
}) => {
	const [timeLeft, setTimeLeft] = useState(timeoutDuration);
	const [accepting, setAccepting] = useState(false);

	// Handle incoming call timeout
	useEffect(() => {
		if (!open || callDirection !== 'incoming') {
			setTimeLeft(timeoutDuration);
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(timer);
	}, [open, callDirection, timeoutDuration]);

	// Auto-reject when time runs out
	useEffect(() => {
		if (timeLeft === 0 && open && callDirection === 'incoming' && onReject) {
			onReject();
		}
	}, [timeLeft, open, callDirection, onReject]);

	const handleAccept = async () => {
		if (!onAccept || accepting) return;

		try {
			setAccepting(true);
			await onAccept();
		} catch (error) {
			console.error('Failed to accept call:', error);
		} finally {
			setAccepting(false);
		}
	};

	const handleEndCall = () => {
		onEnd();
	};

	const handleReject = () => {
		if (accepting) return;

		if (onReject) {
			onReject();
		} else {
			onEnd();
		}
	};

	// Check if we're in active call (connected)
	const isActiveCall = callState === 'connected';

	// Determine if we should show peer avatar/video or local video
	const shouldShowRemoteVideo =
		isActiveCall && remoteStream && callType === 'video';
	const shouldShowLocalVideo =
		localStream && isActiveCall && callType === 'video';

	return (
		<Dialog
			open={open}
			fullScreen
			disableEscapeKeyDown={callDirection === 'incoming' && !isActiveCall}
			hideBackdrop={callDirection === 'incoming' && !isActiveCall}
			slotProps={{
				paper: {
					className: 'relative overflow-hidden',
					style: {
						background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
						zIndex: 9999,
					},
				},
			}}
			onClick={(e) => {
				if (callDirection === 'incoming' && !isActiveCall) {
					e.stopPropagation();
				}
			}}
		>
			{/* Background gradient overlay */}
			<div className='absolute inset-0 bg-linear-to-br from-blue-900/20 via-purple-900/10 to-transparent' />

			<div className='h-full w-full flex flex-col relative z-10'>
				{/* Header - Only show in active calls */}
				{isActiveCall && (
					<CallStatusHeader
						peerName={peerName}
						peerAvatar={peerAvatar}
						callType={callType}
						peerStatus={peerStatus}
						callState={callState}
						callDirection={callDirection}
						callStartTime={callStartTime}
					/>
				)}

				{/* Main Content Area */}
				<div className='flex-1 relative flex items-center justify-center p-6'>
					{callType === 'video' ? (
						<>
							{/* Video Call UI */}
							{shouldShowRemoteVideo ? (
								<div className='relative w-full h-full flex items-center justify-center'>
									<RemoteVideo stream={remoteStream} />

									{/* Peer name overlay for video calls */}
									<div className='absolute top-6 left-6 bg-black/50 rounded-full px-4 py-2'>
										<Typography className='text-white font-medium'>
											{peerName}
										</Typography>
									</div>
								</div>
							) : (
								<CallPreviewContent
									peerName={peerName}
									peerAvatar={peerAvatar}
									peerStatus={peerStatus}
									callType={callType}
									callDirection={callDirection}
									callState={callState}
									timeLeft={timeLeft}
									isActiveCall={isActiveCall}
								/>
							)}

							{/* Local video preview */}
							{shouldShowLocalVideo && (
								<div className='absolute bottom-32 right-6 w-72 h-54 rounded-xl overflow-hidden border-2 border-white/20 bg-black'>
									<div className='absolute top-3 left-3 z-10 px-3 py-1 bg-black/60 rounded-lg text-sm font-medium text-white flex items-center gap-2'>
										<div className='w-2 h-2 rounded-full bg-green-500' />
										You
									</div>
									<LocalVideo
										stream={localStream}
										className='w-full h-full object-cover'
										mirror={true}
									/>
								</div>
							)}
						</>
					) : (
						<>
							{/* Audio Call UI */}
							{isActiveCall && <RemoteAudio stream={remoteStream} />}

							<CallPreviewContent
								peerName={peerName}
								peerAvatar={peerAvatar}
								peerStatus={peerStatus}
								callType={callType}
								callDirection={callDirection}
								callState={callState}
								timeLeft={timeLeft}
								isActiveCall={isActiveCall}
							/>
						</>
					)}
				</div>

				{/* Controls */}
				<div className='p-8 flex flex-col items-center gap-4'>
					{callDirection === 'incoming' && !isActiveCall ? (
						// Incoming call controls
						<IncomingCallControls
							callType={callType}
							accepting={accepting}
							onAccept={handleAccept}
							onReject={handleReject}
							timeLeft={timeLeft}
						/>
					) : (
						// Active call controls
						<CallControls
							onEnd={handleEndCall}
							callType={callType}
							onToggleAudio={toggleAudio}
							onToggleVideo={callType === 'video' ? toggleVideo : undefined}
							isAudioMuted={isAudioMuted}
							isVideoOff={isVideoOff}
							className='mb-2'
						/>
					)}
				</div>

				{/* Progress bar for incoming call timer */}
				{callDirection === 'incoming' && !isActiveCall && (
					<div className='absolute bottom-0 left-0 right-0 h-1 bg-white/10'>
						<div
							className='h-full bg-linear-to-r from-blue-500 via-blue-400 to-blue-300'
							style={{
								width: `${(timeLeft / timeoutDuration) * 100}%`,
							}}
						/>
					</div>
				)}
			</div>
		</Dialog>
	);
};
