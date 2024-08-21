package com.arindam.chat_1to1.service;


import com.arindam.chat_1to1.model.ChatMessage;

import java.util.List;

public interface ChatMessageService {
    ChatMessage save(ChatMessage chatMessage);
    List<ChatMessage> findChatMessages(String senderId, String receiverId);
}
