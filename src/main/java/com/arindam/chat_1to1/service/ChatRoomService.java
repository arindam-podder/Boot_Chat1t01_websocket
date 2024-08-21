package com.arindam.chat_1to1.service;


import java.util.Optional;

public interface ChatRoomService {

    Optional<String> getChatId(String senderId, String recipientId, boolean createIfNotExist);

}
