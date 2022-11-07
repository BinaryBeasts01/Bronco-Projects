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
    private String name;
    private String description;
    private String createdBy;
    private String department;
 
    private List<String> subscribedStudents;
    private List<String> tags;

    private Date dateCreated;
}
