package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.io.InputStream;

@Data
public class PDFFileDTO {
    private String name;
    private InputStream in;
}
