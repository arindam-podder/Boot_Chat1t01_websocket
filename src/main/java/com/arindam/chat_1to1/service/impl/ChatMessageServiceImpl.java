package com.arindam.chat_1to1.service.impl;

import com.arindam.chat_1to1.model.ChatMessage;
import com.arindam.chat_1to1.repository.ChatMessageRepository;
import com.arindam.chat_1to1.service.ChatMessageService;
import com.arindam.chat_1to1.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;


    @Override
    public ChatMessage save(ChatMessage chatMessage) {
        String chatId = chatRoomService.getChatId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
                .orElseThrow();
        chatMessage.setChatId(chatId);
        chatMessageRepository.save(chatMessage);
        return chatMessage;

    }

    @Override
    public List<ChatMessage> findChatMessages(String senderId, String receipientId) {
        var chatIdOptional = chatRoomService.getChatId(senderId, receipientId, false);

        return chatIdOptional.map(chatMessageRepository::findByChatId)
                .orElseGet(List::of);

    }
}
