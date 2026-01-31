import type { UserResponse } from '@/types/auth.types';

export type MessageResponse = any[];

export interface ChatHeaderUser extends UserResponse {
	lastSeen?: string;
}

export interface CallActions {
	onAudioCall: () => void;
	onVideoCall: () => void;
}

export interface UserStatusInfo {
	isOnline: boolean;
	lastSeen?: string;
}
