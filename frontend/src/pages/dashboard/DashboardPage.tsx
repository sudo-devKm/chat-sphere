import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar';
import { VirtualizedUsersList } from '@/components/users-list/VirtualizedUsersList';
import { useDashboardPresence } from '@/hooks/useDashboardPresence';
import { useDashboardUsers } from '@/hooks/useDashboardUsers';
import { useEffect, useState, useCallback } from 'react';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { UsersLoader } from '@/components/users-list/UsersLoader';
import { useCall } from '@/hooks/useCall';
import { useAuthStore } from '@/store/auth.store';
import { CallModal } from '@/components/call/CallModal';
import { useChatSession } from '@/hooks/useChatSession';

export const DashboardPage = () => {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
	const selfUserId = useAuthStore((s) => s.user?._id!);
	const { users, loadMore, order, isLoading, setPage } = useDashboardUsers();
	const { chatId, loading } = useChatSession(selectedUserId ?? '');
	const [callStartTime, setCallStartTime] = useState<Date>();

	const {
		callState,
		callType,
		callDirection,
		startCall,
		endCall,
		acceptCall,
		localStream,
		remoteStream,
		peerInfo,
		isAudioMuted,
		isVideoOff,
		toggleAudio,
		toggleVideo,
	} = useCall(selfUserId);

	useDashboardPresence((ids) => {
		setOnlineIds(new Set(ids));
	});

	useEffect(() => {
		loadMore();
	}, [loadMore]);

	// Track when call becomes active
	useEffect(() => {
		if (callState === 'connected' && !callStartTime) {
			setCallStartTime(new Date());
		} else if (callState !== 'connected') {
			setCallStartTime(undefined);
		}
	}, [callState, callStartTime]);

	const handleStartCall = useCallback(
		(type: 'audio' | 'video') => {
			if (selectedUserId && users[selectedUserId]) {
				const user = users[selectedUserId];
				startCall(selectedUserId, type, user.name || user.username);
			}
		},
		[selectedUserId, users, startCall],
	);

	const handleEndCall = useCallback(() => {
		setCallStartTime(undefined);
		endCall();
	}, [endCall]);

	const handleAcceptCall = useCallback(async () => {
		await acceptCall();
		setCallStartTime(new Date());
	}, [acceptCall]);

	const handleRejectCall = useCallback(() => {
		setCallStartTime(undefined);
		endCall();
	}, [endCall]);

	// Determine if call modal should be open
	const isCallActive =
		callState === 'calling' ||
		callState === 'connecting' ||
		callState === 'connected';

	// Get peer avatar from users data
	const peerAvatar = peerInfo?.peerId
		? users[peerInfo.peerId]?.avatar
		: undefined;
	const peerName = peerInfo?.peerName || 'Unknown';

	return (
		<div className='h-screen flex flex-col bg-gray-100 overflow-hidden'>
			{/* UNIFIED CALL MODAL */}
			<CallModal
				open={isCallActive}
				callDirection={callDirection}
				callType={callType}
				callState={callState}
				localStream={localStream}
				remoteStream={remoteStream}
				peerName={peerName}
				peerAvatar={peerAvatar}
				peerStatus={
					peerInfo?.peerId && onlineIds.has(peerInfo.peerId)
						? 'online'
						: 'offline'
				}
				onAccept={callDirection === 'incoming' ? handleAcceptCall : undefined}
				onEnd={handleEndCall}
				onReject={callDirection === 'incoming' ? handleRejectCall : undefined}
				toggleAudio={toggleAudio}
				toggleVideo={callType === 'video' ? toggleVideo : undefined}
				isAudioMuted={isAudioMuted}
				isVideoOff={isVideoOff}
				callStartTime={callStartTime}
				timeoutDuration={60}
			/>

			<DashboardNavbar />
			<div className='flex flex-1 min-h-0 overflow-hidden'>
				{/* USERS SIDEBAR */}
				<aside className='w-80 bg-white border-r flex flex-col min-h-0 overflow-hidden'>
					<div className='px-4 py-3 border-b shrink-0'>
						<h2 className='text-lg font-semibold'>Users</h2>
					</div>

					<div className='flex-1 min-h-0 overflow-y-auto'>
						{isLoading ? (
							<UsersLoader />
						) : (
							<VirtualizedUsersList
								onlineIds={onlineIds}
								userIds={order}
								users={users}
								onLoadNextPage={() => setPage((prev) => prev + 1)}
								onSelectUser={setSelectedUserId}
								selectedUserId={selectedUserId}
							/>
						)}
					</div>
				</aside>

				{/* CHAT */}
				<main className='flex-1 bg-gray-50 min-h-0 overflow-hidden'>
					{selectedUserId ? (
						<ChatContainer
							loading={loading}
							chatId={chatId}
							startCall={handleStartCall}
							key={selectedUserId}
							userId={selectedUserId}
							user={users[selectedUserId]}
							isOnline={onlineIds.has(selectedUserId)}
							disableCalls={isCallActive}
						/>
					) : (
						<div className='h-full flex items-center justify-center text-gray-500'>
							Select a user to start chatting
						</div>
					)}
				</main>
			</div>
		</div>
	);
};
