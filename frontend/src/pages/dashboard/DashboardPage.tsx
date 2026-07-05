// src/pages/DashboardPage.tsx
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
import {
	Box,
	Typography,
	Paper,
	Badge,
	IconButton,
	Stack,
	InputAdornment,
	TextField,
} from '@mui/material';
import {
	Search,
	Filter,
	Users,
	MessageSquare,
	Phone,
	Video,
} from 'lucide-react';

export const DashboardPage = () => {
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
	const selfUserId = useAuthStore((s) => s.user!._id);
	const { users, loadMore, order, isLoading, setPage } = useDashboardUsers();
	const { chatId, loading } = useChatSession(selectedUserId ?? '');
	const [callStartTime, setCallStartTime] = useState<Date>();
	const [searchQuery, setSearchQuery] = useState('');

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

	// Track when call becomes active. Derived from callState during render
	// (rather than an effect) since callStartTime only depends on callState.
	const [prevCallState, setPrevCallState] = useState(callState);
	if (callState !== prevCallState) {
		setPrevCallState(callState);
		if (callState === 'connected' && !callStartTime) {
			setCallStartTime(new Date());
		} else if (callState !== 'connected') {
			setCallStartTime(undefined);
		}
	}

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

	// Calculate online users count
	const onlineCount = onlineIds.size;

	return (
		<Box
			sx={{
				height: '100vh',
				display: 'flex',
				flexDirection: 'column',
				bgcolor: 'background.default',
			}}
		>
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

			<Box sx={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
				{/* USERS SIDEBAR */}
				<Paper
					elevation={0}
					sx={{
						width: { xs: 280, md: 320 },
						display: 'flex',
						flexDirection: 'column',
						borderRight: '1px solid',
						borderColor: 'divider',
						bgcolor: 'background.paper',
						borderRadius: 0,
					}}
				>
					{/* Sidebar Header */}
					<Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
						<Stack
							direction='row'
							justifyContent='space-between'
							alignItems='center'
							sx={{ mb: 2 }}
						>
							<Typography
								variant='h6'
								sx={{
									fontWeight: 600,
									display: 'flex',
									alignItems: 'center',
									gap: 1,
								}}
							>
								<Users size={20} />
								Users
							</Typography>
							<Badge
								badgeContent={onlineCount}
								color='success'
								sx={{ '& .MuiBadge-badge': { fontSize: '0.75rem' } }}
							/>
						</Stack>

						{/* Search Bar */}
						<TextField
							fullWidth
							size='small'
							placeholder='Search users...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							slotProps={{
								input: {
									startAdornment: (
										<InputAdornment position='start'>
											<Search size={18} color='action' />
										</InputAdornment>
									),
									endAdornment: searchQuery && (
										<InputAdornment position='end'>
											<IconButton
												size='small'
												onClick={() => setSearchQuery('')}
											>
												<Filter size={16} />
											</IconButton>
										</InputAdornment>
									),
								},
							}}
							sx={{
								'& .MuiOutlinedInput-root': {
									borderRadius: 2,
									bgcolor: 'grey.50',
									'&:hover': {
										bgcolor: 'grey.100',
									},
								},
							}}
						/>
					</Box>

					{/* Users List */}
					<Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
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
					</Box>

					{/* Sidebar Footer */}
					<Box
						sx={{
							p: 2,
							borderTop: '1px solid',
							borderColor: 'divider',
							bgcolor: 'grey.50',
						}}
					>
						<Typography
							variant='caption'
							sx={{
								color: 'text.secondary',
								display: 'block',
								textAlign: 'center',
							}}
						>
							{onlineCount} online • {order.length} total users
						</Typography>
					</Box>
				</Paper>

				{/* CHAT AREA */}
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						flexDirection: 'column',
						minHeight: 0,
					}}
				>
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
						<Box
							sx={{
								flex: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								p: 3,
								textAlign: 'center',
							}}
						>
							<Box
								sx={{
									width: 120,
									height: 120,
									borderRadius: '50%',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									bgcolor: 'primary.50',
									mb: 3,
								}}
							>
								<MessageSquare size={48} style={{ color: '#6366F1' }} />
							</Box>
							<Typography
								variant='h5'
								sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}
							>
								Welcome to ChatSphere
							</Typography>
							<Typography
								variant='body1'
								sx={{ color: 'text.secondary', maxWidth: 400, mb: 3 }}
							>
								Select a user from the sidebar to start a conversation
							</Typography>
							<Stack direction='row' spacing={1}>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										p: 2,
										borderRadius: 2,
										bgcolor: 'grey.50',
										minWidth: 100,
									}}
								>
									<Phone
										size={24}
										style={{ color: '#10B981', marginBottom: 8 }}
									/>
									<Typography
										variant='caption'
										sx={{ color: 'text.secondary' }}
									>
										Audio Call
									</Typography>
								</Box>
								<Box
									sx={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										p: 2,
										borderRadius: 2,
										bgcolor: 'grey.50',
										minWidth: 100,
									}}
								>
									<Video
										size={24}
										style={{ color: '#3B82F6', marginBottom: 8 }}
									/>
									<Typography
										variant='caption'
										sx={{ color: 'text.secondary' }}
									>
										Video Call
									</Typography>
								</Box>
							</Stack>
						</Box>
					)}
				</Box>
			</Box>
		</Box>
	);
};
