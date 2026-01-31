import { Popover } from '@mui/material';
import EmojiPicker, {
	EmojiStyle,
	type EmojiClickData,
} from 'emoji-picker-react';

interface EmojiPickerPopoverProps {
	open: boolean;
	anchorEl: HTMLButtonElement | null;
	onClose: () => void;
	onEmojiClick: (emoji: string) => void;
}

export const EmojiPickerPopover = ({
	open,
	anchorEl,
	onClose,
	onEmojiClick,
}: EmojiPickerPopoverProps) => {
	const handleEmojiClick = (emojiData: EmojiClickData) => {
		onEmojiClick(emojiData.emoji);
	};

	return (
		<Popover
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			sx={{
				'& .MuiPopover-paper': {
					borderRadius: '16px',
					overflow: 'hidden',
					boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
				},
			}}
		>
			<EmojiPicker
				onEmojiClick={handleEmojiClick}
				emojiStyle={EmojiStyle.NATIVE}
				lazyLoadEmojis
				previewConfig={{ showPreview: false }}
				width={350}
				height={400}
			/>
		</Popover>
	);
};
