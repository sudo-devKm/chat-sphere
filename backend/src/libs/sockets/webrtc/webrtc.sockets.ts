import { Server, Socket } from 'socket.io';
import { SocketEvent } from '@/constants/socket.events';
import {
	createSocketError,
	createSocketSuccess,
} from '@/utils/socket-response.util';
import { logger } from '@/libs/logger';

export class WebRTCSocketService {
	constructor(private readonly io: Server) {}

	register(socket: Socket) {
		logger.info(
			`[WEBRTC][REGISTER] socketId=${socket.id} userId=${socket.userId}`,
		);

		socket.on(SocketEvent.WEBRTC_OFFER, (d) => {
			logger.debug(
				`[WEBRTC][OFFER] callId=${d?.callId} sender=${socket.userId}`,
			);
			this.handleOffer(socket, d);
		});

		socket.on(SocketEvent.WEBRTC_ANSWER, (d) => {
			logger.debug(
				`[WEBRTC][ANSWER] callId=${d?.callId} sender=${socket.userId}`,
			);
			this.handleAnswer(socket, d);
		});

		socket.on(SocketEvent.WEBRTC_ICE, (d) => {
			logger.debug(`[WEBRTC][ICE] callId=${d?.callId} sender=${socket.userId}`);
			this.handleIceCandidate(socket, d);
		});
	}

	// ----------------------------
	// OFFER
	// ----------------------------
	private handleOffer(
		socket: Socket,
		data: { callId: string; offer: RTCSessionDescriptionInit },
	) {
		try {
			this.io.to(`call:${data.callId}`).emit(
				SocketEvent.WEBRTC_OFFER,
				createSocketSuccess({
					data: {
						senderId: socket.userId,
						callId: data.callId,
						offer: data.offer,
					},
				}),
			);

			logger.info(
				`[WEBRTC][OFFER_SENT] callId=${data.callId} sender=${socket.userId}`,
			);
		} catch (err) {
			logger.error(
				`[WEBRTC][OFFER_ERROR] callId=${data?.callId} sender=${socket.userId}`,
				err,
			);

			socket.emit(SocketEvent.WEBRTC_ERROR, createSocketError(err));
		}
	}

	// ----------------------------
	// ANSWER
	// ----------------------------
	private handleAnswer(
		socket: Socket,
		data: { callId: string; answer: RTCSessionDescriptionInit },
	) {
		try {
			this.io.to(`call:${data.callId}`).emit(
				SocketEvent.WEBRTC_ANSWER,
				createSocketSuccess({
					data: {
						senderId: socket.userId,
						answer: data.answer,
						callId: data.callId,
					},
				}),
			);

			logger.info(
				`[WEBRTC][ANSWER_SENT] callId=${data.callId} sender=${socket.userId}`,
			);
		} catch (err) {
			logger.error(
				`[WEBRTC][ANSWER_ERROR] callId=${data?.callId} sender=${socket.userId}`,
				err,
			);

			socket.emit(SocketEvent.WEBRTC_ERROR, createSocketError(err));
		}
	}

	// ----------------------------
	// ICE CANDIDATE
	// ----------------------------
	private handleIceCandidate(
		socket: Socket,
		data: { callId: string; candidate: RTCIceCandidateInit },
	) {
		try {
			this.io.to(`call:${data.callId}`).emit(
				SocketEvent.WEBRTC_ICE,
				createSocketSuccess({
					data: {
						senderId: socket.userId,
						candidate: data.candidate,
						callId: data.callId,
					},
				}),
			);

			logger.debug(
				`[WEBRTC][ICE_SENT] callId=${data.callId} sender=${socket.userId}`,
			);
		} catch (err) {
			logger.error(
				`[WEBRTC][ICE_ERROR] callId=${data?.callId} sender=${socket.userId}`,
				err,
			);

			socket.emit(SocketEvent.WEBRTC_ERROR, createSocketError(err));
		}
	}
}
