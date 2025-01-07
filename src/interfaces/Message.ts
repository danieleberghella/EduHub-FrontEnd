export default interface IMessage {
    senderId: string;
    senderName: string;
    senderRole: string;
    receiverId: string;
    receiverName: string;
    messageSubject: string;
    text: string;
    sentAt: string;
};