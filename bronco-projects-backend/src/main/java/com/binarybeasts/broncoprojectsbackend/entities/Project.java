package com.binarybeasts.broncoprojectsbackend.entities;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;
 
@Document
@Data
public class Project {
    @Id
    private String uuid;
    private String name;
    private String description;
    private String createdBy;
    private String department;
    private String status;
    private String image;
 
    private List<String> subscribedStudents;
    private List<String> interestedStudents;
    private List<String> tags;

    private Date dateCreated;
}
