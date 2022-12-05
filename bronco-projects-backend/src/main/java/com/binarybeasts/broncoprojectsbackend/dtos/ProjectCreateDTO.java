package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
 
@Data
public class ProjectCreateDTO {
    private String name;
    private String description;
    private String department;
    private List<String> tags;
    private MultipartFile image;
}
