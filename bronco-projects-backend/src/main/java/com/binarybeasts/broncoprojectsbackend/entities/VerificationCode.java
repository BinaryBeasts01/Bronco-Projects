package com.binarybeasts.broncoprojectsbackend.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Data
@AllArgsConstructor
public class VerificationCode {
    @Id
    private String email;
    private int code;
}
