import { useEffect, useRef, useState, useCallback } from 'react';
import { useSocket } from '@/providers/SocketContext';
import { SocketEvent } from '@/constants/socket.events';
import { audioService } from '@/utils/audioService';

type CallType = 'audio' | 'video';
type CallState = 'idle' | 'calling' | 'connecting' | 'connected';
type CallDirection = 'incoming' | 'outgoing';

export const useCall = (_selfUserId: string) => {
	const socket = useSocket();

	const pcRef = useRef<RTCPeerConnection | null>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const remoteStreamRef = useRef<MediaStream | null>(null);
	const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);

	const [callId, setCallId] = useState<string | null>(null);
	const [peerId, setPeerId] = useState<string | null>(null);
	const [peerInfo, setPeerInfo] = useState<{
		peerName: string;
		peerId: string;
	} | null>(null);
	const [callType, setCallType] = useState<CallType>('audio');
	const [callState, setCallState] = useState<CallState>('idle');
	const [incoming, setIncoming] = useState(false);
	const [localStream, setLocalStream] = useState<MediaStream | null>(null);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [isAudioMuted, setIsAudioMuted] = useState(false);
	const [isVideoOff, setIsVideoOff] = useState(false);
	const [isSpeakerOff, setIsSpeakerOff] = useState(false);
	const [isScreenSharing, setIsScreenSharing] = useState(false);

	// Get call direction based on incoming state
	const callDirection: CallDirection = incoming ? 'incoming' : 'outgoing';

	const getPeerConnection = useCallback(() => {
		if (pcRef.current) return pcRef.current;

		const pc = new RTCPeerConnection({
			iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
		});

		pc.onicecandidate = (e) => {
			if (e.candidate && callId) {
				socket.emit(SocketEvent.WEBRTC_ICE, {
					callId,
					candidate: e.candidate,
				});
			}
		};

		pc.oniceconnectionstatechange = () => {
			console.log('ICE STATE:', pc.iceConnectionState);
		};

		pc.onconnectionstatechange = () => {
			console.log('PC STATE:', pc.connectionState);
		};

		pc.ontrack = (e) => {
			console.log('REMOTE TRACK:', e.track.kind);

			if (!remoteStreamRef.current) {
				remoteStreamRef.current = new MediaStream();
				setRemoteStream(remoteStreamRef.current);
			}

			// Add track to remote stream
			if (
				!remoteStreamRef.current.getTracks().find((t) => t.id === e.track.id)
			) {
				remoteStreamRef.current.addTrack(e.track);
			}
		};

		pcRef.current = pc;
		return pc;
	}, [callId, socket]);

	const toggleSpeaker = useCallback(() => {
		setIsSpeakerOff((prev) => !prev);
		// Implement actual speaker toggle logic
	}, []);

	const toggleScreenShare = useCallback(async () => {
		if (isScreenSharing) {
			// Stop screen sharing
			setIsScreenSharing(false);
		} else {
			try {
				await navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: true,
				});
				// Add screen track to peer connection
				setIsScreenSharing(true);
			} catch (error) {
				console.error('Screen sharing failed:', error);
			}
		}
	}, [isScreenSharing]);

	// Add this function to play ringtone
	const playCallRingtone = useCallback(
		(type: 'incoming' | 'outgoing') => {
			if (!callId) return;

			audioService.playRingtone(callId, type);
		},
		[callId],
	);

	// Add this function to stop ringtone
	const stopCallRingtone = useCallback(() => {
		audioService.stopRingtone();
	}, []);

	const toggleAudio = useCallback(() => {
		const stream = localStreamRef.current;
		if (!stream) return;

		stream.getAudioTracks().forEach((track) => {
			track.enabled = !track.enabled;
			setIsAudioMuted(!track.enabled);
		});
	}, []);

	const toggleVideo = useCallback(() => {
		const stream = localStreamRef.current;
		if (!stream) return;

		stream.getVideoTracks().forEach((track) => {
			track.enabled = !track.enabled;
			setIsVideoOff(!track.enabled);
		});
	}, []);

	const startCall = useCallback(
		(peerId: string, type: CallType, peerName?: string) => {
			setCallType(type);
			setPeerId(peerId);
			setPeerInfo({
				peerName: peerName || 'Unknown',
				peerId,
			});
			setCallState('calling');
			setIncoming(false);

			socket.emit(SocketEvent.CALL_INITIATE, {
				receiverId: peerId,
				callType: type,
			});
		},
		[socket],
	);

	const attachLocalTracks = (pc: RTCPeerConnection, stream: MediaStream) => {
		const senders = pc.getSenders();

		stream.getTracks().forEach((track) => {
			const alreadyAdded = senders.some(
				(s) => s.track && s.track.id === track.id,
			);
			if (!alreadyAdded) {
				pc.addTrack(track, stream);
			}
		});
	};

	const clearAll = useCallback(() => {
		localStreamRef.current?.getTracks().forEach((t) => t.stop());
		remoteStreamRef.current?.getTracks().forEach((t) => t.stop());

		pcRef.current?.close();
		pcRef.current = null;

		localStreamRef.current = null;
		remoteStreamRef.current = null;
		pendingIceCandidatesRef.current = [];

		setLocalStream(null);
		setRemoteStream(null);
		setCallState('idle');
		setCallId(null);
		setPeerId(null);
		setPeerInfo(null);
		setIncoming(false);
		setIsAudioMuted(false);
		setIsVideoOff(false);
	}, []);

	const endCall = useCallback(() => {
		// Stop ringtone when call ends
		audioService.stopRingtone();
		if (callId) {
			socket.emit(SocketEvent.CALL_END, { callId });
		}
		clearAll();
	}, [callId, socket, clearAll]);

	const initializeLocalStream = useCallback(async () => {
		if (localStreamRef.current) {
			return localStreamRef.current;
		}

		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: callType === 'video',
		});

		const audioTrack = stream.getAudioTracks()[0];
		audioTrack.enabled = true;

		localStreamRef.current = stream;
		setLocalStream(stream);
		setIsAudioMuted(false);
		setIsVideoOff(callType === 'video' ? false : true);

		return stream;
	}, [callType]);

	const acceptCall = useCallback(async () => {
		if (!callId) return;

		try {
			// Stop ringtone when call is accepted
			audioService.stopRingtone();
			const stream = await initializeLocalStream();
			const pc = getPeerConnection();
			attachLocalTracks(pc, stream);

			socket.emit(SocketEvent.CALL_ANSWER, { callId });
			setCallState('connected');
		} catch (error) {
			console.error('Failed to accept call:', error);
			endCall();
		}
	}, [callId, socket, initializeLocalStream, getPeerConnection, endCall]);

	useEffect(() => {
		const handleCallIncoming = ({ data }: any) => {
			setCallId(data.callId);
			setCallType(data.callType);
			setIncoming(true);
			setPeerId(data.peerId);
			setPeerInfo({
				peerName: data.peerName,
				peerId: data.peerId,
			});
			setCallState('calling');
			// Play incoming ringtone
			audioService.playRingtone(data.callId, 'incoming');
		};

		const handleCallAnswered = async ({ data }: any) => {
			// Stop ringtone when call is accepted
			audioService.stopRingtone();
			console.log('ANSWERED');
			setCallState('connected');

			try {
				const stream = await initializeLocalStream();
				const pc = getPeerConnection();

				// State guard
				if (pc.signalingState !== 'stable') {
					console.warn('Not creating OFFER in state', pc.signalingState);
					return;
				}

				attachLocalTracks(pc, stream);

				const offer = await pc.createOffer();
				await pc.setLocalDescription(offer);

				socket.emit(SocketEvent.WEBRTC_OFFER, { callId: data.callId, offer });
			} catch (error) {
				console.error('Failed to handle call answer:', error);
				endCall();
			}
		};

		const handleCallInitiated = ({ data }: any) => {
			setCallId(data.callId);
			setCallState('connecting');
			setIncoming(data.isIncoming || false);
			audioService.playRingtone(data.callId, 'outgoing');
		};

		const handleWebRTCOffer = async ({ data }: any) => {
			try {
				await initializeLocalStream();
				const pc = getPeerConnection();

				if (pc.signalingState !== 'stable') {
					console.warn('Ignoring OFFER in state', pc.signalingState);
					return;
				}

				await pc.setRemoteDescription(data.offer);

				for (const c of pendingIceCandidatesRef.current) {
					await pc.addIceCandidate(c);
				}
				pendingIceCandidatesRef.current = [];

				const answer = await pc.createAnswer();
				await pc.setLocalDescription(answer);

				socket.emit(SocketEvent.WEBRTC_ANSWER, { callId: data.callId, answer });
			} catch (error) {
				console.error('Failed to handle WebRTC offer:', error);
				endCall();
			}
		};

		const handleWebRTCAnswer = async ({ data }: any) => {
			const pc = getPeerConnection();

			if (pc.signalingState !== 'have-local-offer') {
				console.warn('Ignoring ANSWER in state', pc.signalingState);
				return;
			}

			try {
				await pc.setRemoteDescription(data.answer);

				for (const c of pendingIceCandidatesRef.current) {
					await pc.addIceCandidate(c);
				}
				pendingIceCandidatesRef.current = [];
			} catch (error) {
				console.error('Failed to handle WebRTC answer:', error);
				endCall();
			}
		};

		const handleWebRTCIce = async ({ data }: any) => {
			const pc = getPeerConnection();

			if (!pc.remoteDescription) {
				pendingIceCandidatesRef.current.push(data.candidate);
				return;
			}

			try {
				await pc.addIceCandidate(data.candidate);
			} catch (error) {
				console.error('Failed to add ICE candidate:', error);
			}
		};

		const handleCallEnd = () => {
			audioService.stopRingtone();
			clearAll();
		};

		// Event listeners
		socket.on(SocketEvent.CALL_INCOMING, handleCallIncoming);
		socket.on(SocketEvent.CALL_ANSWERED, handleCallAnswered);
		socket.on(SocketEvent.CALL_INITIATED, handleCallInitiated);
		socket.on(SocketEvent.WEBRTC_OFFER, handleWebRTCOffer);
		socket.on(SocketEvent.WEBRTC_ANSWER, handleWebRTCAnswer);
		socket.on(SocketEvent.WEBRTC_ICE, handleWebRTCIce);
		socket.on(SocketEvent.CALL_END, handleCallEnd);

		return () => {
			socket.off(SocketEvent.CALL_INCOMING, handleCallIncoming);
			socket.off(SocketEvent.CALL_ANSWERED, handleCallAnswered);
			socket.off(SocketEvent.CALL_INITIATED, handleCallInitiated);
			socket.off(SocketEvent.WEBRTC_OFFER, handleWebRTCOffer);
			socket.off(SocketEvent.WEBRTC_ANSWER, handleWebRTCAnswer);
			socket.off(SocketEvent.WEBRTC_ICE, handleWebRTCIce);
			socket.off(SocketEvent.CALL_END, handleCallEnd);
		};
	}, [socket, callType, initializeLocalStream, clearAll, endCall]);

	return {
		// Call state
		callState,
		callType,
		callDirection,
		callId,
		peerId,
		peerInfo,
		incoming,

		// Media streams
		localStream,
		remoteStream,

		// Media controls
		isAudioMuted,
		isVideoOff,
		toggleAudio,
		toggleVideo,

		// Call actions
		startCall,
		acceptCall,
		endCall,

		isSpeakerOff,
		isScreenSharing,
		toggleSpeaker,
		toggleScreenShare,
		playCallRingtone,
		stopCallRingtone,
	};
};
