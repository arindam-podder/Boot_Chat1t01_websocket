package com.arindam.chat_1to1.repository;

import com.arindam.chat_1to1.model.Status;
import com.arindam.chat_1to1.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface UserRepository extends MongoRepository<User, String> {

    List<User> findAllByStatus(Status status);
}
