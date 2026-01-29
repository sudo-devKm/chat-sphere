import { create } from 'zustand';

type IncomingCall = {
	callId: string;
	fromUserId: string;
	fromUsername: string;
	callType: 'audio' | 'video';
};

type CallStore = {
	incomingCall: IncomingCall | null;
	setIncomingCall: (call: IncomingCall) => void;
	clearIncomingCall: () => void;
};

export const useCallStore = create<CallStore>((set) => ({
	incomingCall: null,
	setIncomingCall: (call) => set({ incomingCall: call }),
	clearIncomingCall: () => set({ incomingCall: null }),
}));
