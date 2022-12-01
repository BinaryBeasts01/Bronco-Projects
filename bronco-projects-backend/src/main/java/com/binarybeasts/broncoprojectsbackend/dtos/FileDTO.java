package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.Data;

@Data
public class FileDTO {
    private String name;
    private String type;
    private String size;
    private byte[] file;
}
