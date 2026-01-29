import { Chat } from '@/models/chat.model';
import { Types } from 'mongoose';

export async function getOrCreateChat(userA: string, userB: string) {
	const participants = [
		new Types.ObjectId(userA),
		new Types.ObjectId(userB),
	].sort(); // IMPORTANT for uniqueness

	let chat = await Chat.findOne({ participants });

	if (!chat) {
		chat = await Chat.create({ participants });
	}

	return chat;
}
