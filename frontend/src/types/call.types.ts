export type CallState =
	| 'idle'
	| 'calling'
	| 'connecting'
	| 'connected'
	| 'ended';
export type CallDirection = 'incoming' | 'outgoing';
export type CallType = 'audio' | 'video';

export interface PeerInfo {
	peerName: string;
	peerId: string;
	avatar?: string;
	status?: 'online' | 'offline' | 'away';
}

export interface CallSession {
	callId: string;
	direction: CallDirection;
	type: CallType;
	state: CallState;
	peerInfo: PeerInfo;
	startTime?: Date;
	localStream?: MediaStream | null;
	remoteStream?: MediaStream | null;
	isAudioMuted: boolean;
	isVideoOff: boolean;
}
