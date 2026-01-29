export enum SocketEvent {
	// ---- Connection ----
	CONNECT = 'connection',
	DISCONNECT = 'disconnect',

	// ---- User ----
	USERS_SYNC = 'users:sync',
	USERS_ONLINE = 'users:online',
	USER_STATUS = 'user:status',

	// ---- Chat ----
	CHAT_SEND = 'chat:send',
	CHAT_RECEIVE = 'chat:receive',
	CHAT_READ = 'chat:read',
	CHAT_SUCCESS = 'chat:success',
	CHAT_ERROR = 'chat:error',

	// ---- Call Core ----
	CALL_INITIATE = 'call:initiate',
	CALL_INCOMING = 'call:incoming',
	CALL_INITIATED = 'call:initiated',
	CALL_ANSWER = 'call:answer',
	CALL_ANSWERED = 'call:answered',
	CALL_REJECT = 'call:reject',
	CALL_END = 'call:end',
	CALL_ERROR = 'call:error',

	// ---- WebRTC ----
	WEBRTC_OFFER = 'webrtc:offer',
	WEBRTC_ANSWER = 'webrtc:answer',
	WEBRTC_ICE = 'webrtc:ice-candidate',
	WEBRTC_ERROR = 'webrtc:error',
}
