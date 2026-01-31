interface MessageTextContentProps {
	content: string;
}

export const MessageTextContent = ({ content }: MessageTextContentProps) => {
	return <p className='whitespace-pre-wrap leading-relaxed'>{content}</p>;
};
