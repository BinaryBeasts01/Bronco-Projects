package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequestDTO {
    private String username;
    private String password;
}
