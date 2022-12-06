package com.binarybeasts.broncoprojectsbackend.dtos;

import lombok.Data;
import java.util.List;

@Data
public class UserInfoDTO {
    private String userId;
    private String name;

    private List<String> createdProjects;
    private List<String> subscribedProjects;
    private List<String> interestedProjects;
    private List<String> notifications;

    private String resumeFileId;
    private String department;
}
