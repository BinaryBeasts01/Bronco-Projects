package com.binarybeasts.broncoprojectsbackend.dtos;

import com.binarybeasts.broncoprojectsbackend.entities.Project;
import lombok.Data;
import java.util.List;

@Data
public class ProjectPageReturnDTO {
    private int totalPages;
    private int currentPage;
    private long totalElements;
    private List<Project> projects;
}
