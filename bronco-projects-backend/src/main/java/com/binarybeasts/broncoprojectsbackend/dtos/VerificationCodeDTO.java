package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@AllArgsConstructor
public class VerificationCodeDTO {
        private String email;
        private int code;
}
