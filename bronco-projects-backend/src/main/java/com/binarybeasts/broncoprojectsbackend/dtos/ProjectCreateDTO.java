package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.Data;
import java.util.List;
 
@Data
public class ProjectCreateDTO {
    private String uuid;
    private String name;
    private String description;
    private String department;
    private List<String> tags;
}
