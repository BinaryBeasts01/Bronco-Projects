package com.binarybeasts.broncoprojectsbackend.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document
@Data
public class Notification {
    @Id
    private String uuid;
    private String message;
    private Date sent;
}
