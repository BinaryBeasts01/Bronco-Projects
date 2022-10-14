package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class UserCreateDTO {
    private String email;
    private String password;
    private MultipartFile resume;
    private MultipartFile transcript;
}
