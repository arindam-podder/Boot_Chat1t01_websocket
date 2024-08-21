package com.arindam.chat_1to1.service.impl;

import com.arindam.chat_1to1.model.Status;
import com.arindam.chat_1to1.model.User;
import com.arindam.chat_1to1.repository.UserRepository;
import com.arindam.chat_1to1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public void saveUser(User user) {
        user.setStatus(Status.ONLINE);
        userRepository.save(user);
    }

    @Override
    public void disconnect(User user) {
        var userOptional = userRepository.findById(user.getNickName()).orElse(null);
        if (userOptional != null) {
            userOptional.setStatus(Status.OFFLINE);
            userRepository.save(userOptional);
        }
    }

    @Override
    public List<User> findConnectedUsers() {
        List<User> all = userRepository.findAll();
        return all;
        //return userRepository.findAllByStatus(Status.ONLINE);
    }
}


