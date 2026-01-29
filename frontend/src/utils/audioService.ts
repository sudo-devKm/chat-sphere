class AudioService {
	private audioContext: AudioContext | null = null;
	private ringtoneAudio: HTMLAudioElement | null = null;
	private isPlaying = false;
	private currentCallId: string | null = null;
	private volume = 0.7;

	constructor() {
		this.initAudio();
	}

	private initAudio() {
		// Create audio element for ringtone
		this.ringtoneAudio = new Audio();
		this.ringtoneAudio.loop = true;
		this.ringtoneAudio.volume = this.volume;

		// You can use a built-in ringtone or load from assets
		this.ringtoneAudio.src = '/sounds/ringtone.mp3';

		// Alternatively, use a simple tone generator
		this.ringtoneAudio.onerror = () => {
			console.warn('Could not load ringtone, falling back to generated tone');
			this.createSyntheticRingtone();
		};
	}

	private createSyntheticRingtone() {
		try {
			this.audioContext = new (
				window.AudioContext || (window as any).webkitAudioContext
			)();

			// Create oscillator for ringtone
			const oscillator = this.audioContext.createOscillator();
			const gainNode = this.audioContext.createGain();

			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
			oscillator.connect(gainNode);
			gainNode.connect(this.audioContext.destination);
			gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);

			// Ringtone pattern: beep-beep... pause... beep-beep...
			const pattern = (startTime: number) => {
				const now = startTime;

				// First beep (0.1s)
				gainNode.gain.setValueAtTime(0, now);
				gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.1);
				gainNode.gain.linearRampToValueAtTime(0, now + 0.2);

				// Second beep (0.1s)
				gainNode.gain.setValueAtTime(0, now + 0.2);
				gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.3);
				gainNode.gain.linearRampToValueAtTime(0, now + 0.4);

				// Pause until next cycle (1.6s pause)
				gainNode.gain.setValueAtTime(0, now + 0.4);
			};

			oscillator.start();

			// Schedule the pattern every 2 seconds
			const startTime = this.audioContext.currentTime;
			for (let i = 0; i < 30; i++) {
				// Schedule 30 cycles (60 seconds)
				pattern(startTime + i * 2);
			}

			// Store for cleanup
			(this.ringtoneAudio as any)._oscillator = oscillator;
			(this.ringtoneAudio as any)._startTime = startTime;

			// Auto-stop after 60 seconds (call timeout)
			setTimeout(() => {
				this.stopRingtone();
			}, 60000);
		} catch (error) {
			console.error('Failed to create synthetic ringtone:', error);
		}
	}

	// Play ringtone for specific call
	playRingtone(callId: string, type: 'incoming' | 'outgoing' = 'incoming') {
		if (this.isPlaying && this.currentCallId === callId) return;

		this.stopRingtone();
		this.currentCallId = callId;
		this.isPlaying = true;

		// Different ringtones for incoming vs outgoing
		if (type === 'outgoing') {
			// Optional: Different tone for outgoing calls
			this.playOutgoingRingtone();
		} else {
			this.playIncomingRingtone();
		}

		console.log(`🔔 Playing ${type} ringtone for call: ${callId}`);
	}

	private playIncomingRingtone() {
		if (this.ringtoneAudio) {
			this.ringtoneAudio.currentTime = 0;
			this.ringtoneAudio.play().catch((error) => {
				console.error('Failed to play ringtone:', error);
				// Fallback to synthetic tone
				this.createSyntheticRingtone();
			});
		}
	}

	private playOutgoingRingtone() {
		// Optional: Different tone for outgoing calls
		// For now, use same tone
		this.playIncomingRingtone();
	}

	// Stop ringtone
	stopRingtone() {
		if (this.ringtoneAudio) {
			this.ringtoneAudio.pause();
			this.ringtoneAudio.currentTime = 0;

			// Clean up synthetic ringtone if created
			if ((this.ringtoneAudio as any)._oscillator) {
				(this.ringtoneAudio as any)._oscillator.stop();
				clearInterval((this.ringtoneAudio as any)._interval);
			}
		}

		if (this.audioContext) {
			this.audioContext.close();
			this.audioContext = null;
		}

		this.isPlaying = false;
		this.currentCallId = null;
	}

	// Set volume (0.0 to 1.0)
	setVolume(volume: number) {
		this.volume = Math.max(0, Math.min(1, volume));
		if (this.ringtoneAudio) {
			this.ringtoneAudio.volume = this.volume;
		}
	}

	// Check if playing
	isRingtonePlaying(): boolean {
		return this.isPlaying;
	}

	// Get current call ID
	getCurrentCallId(): string | null {
		return this.currentCallId;
	}

	// Cleanup
	cleanup() {
		this.stopRingtone();
	}
}

export const audioService = new AudioService();
