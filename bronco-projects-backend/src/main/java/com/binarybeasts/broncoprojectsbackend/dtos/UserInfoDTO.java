package com.binarybeasts.broncoprojectsbackend.dtos;

import com.binarybeasts.broncoprojectsbackend.entities.Project;
import lombok.Data;
import java.util.List;

@Data
public class UserInfoDTO {
    private String userId;
    private String name;

    private List<Project> createdProjects;
    private List<Project> subscribedProjects;
    private List<Project> interestedProjects;

    private String resumeFileId;
    private String department;
}
