package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.Data;

@Data
public class NotificationReturnDTO {
    private String message;
    private String from;
    private String title;
    private String date;
}
