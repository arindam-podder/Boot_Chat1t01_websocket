package com.arindam.chat_1to1.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Setter
@Getter
@Document
public class User {
    @Id
    private String nickName;
    private String fullName;
    private Status status;
}
