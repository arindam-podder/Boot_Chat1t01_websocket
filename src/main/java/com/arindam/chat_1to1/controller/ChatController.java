package com.arindam.chat_1to1.controller;


import com.arindam.chat_1to1.model.ChatMessage;
import com.arindam.chat_1to1.model.ChatNotification;
import com.arindam.chat_1to1.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedChatMsg = chatMessageService.save(chatMessage);
        messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(),
                "/queue/messages",
                ChatNotification.builder()
                        .id(savedChatMsg.getChatId())
                        .senderId(savedChatMsg.getSenderId())
                        .recipientId(savedChatMsg.getRecipientId())
                        .content(savedChatMsg.getContent())
                        .build()
                );
    }

    @GetMapping("/messages/{senderId}/{receipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable String senderId,
                                                              @PathVariable String receipientId) {
        return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, receipientId));
    }

}
