package com.binarybeasts.broncoprojectsbackend.dtos;

import com.binarybeasts.broncoprojectsbackend.entities.Project;
import lombok.Data;

import java.text.SimpleDateFormat;
import java.util.List;

@Data
public class ProjectReturnDTO {
    private String uuid;
    private String name;
    private String description;
    private String createdBy;
    private String department;
    private String status;
    private String image;
    private String extension;

    private List<String> subscribedStudents;
    private List<String> interestedStudents;
    private List<String> tags;

    private String dateCreated;

    public ProjectReturnDTO(Project p) {
        this.uuid = p.getUuid();
        this.name = p.getName();
        this.description = p.getDescription();
        this.createdBy = p.getCreatedBy();
        this.department = p.getDepartment();
        this.status = p.getStatus();
        this.image = p.getImage();
        this.extension = p.getExtension();
        this.subscribedStudents = p.getSubscribedStudents();
        this.interestedStudents = p.getInterestedStudents();
        this.tags = p.getTags();

        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        this.dateCreated = formatter.format(p.getDateCreated());
    }
}
