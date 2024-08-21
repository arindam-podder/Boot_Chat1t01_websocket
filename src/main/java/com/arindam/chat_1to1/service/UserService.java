package com.arindam.chat_1to1.service;

import com.arindam.chat_1to1.model.User;

import java.util.List;

public interface UserService {

    public void saveUser(User user);

    public void disconnect(User user);

    public List<User> findConnectedUsers();
}

