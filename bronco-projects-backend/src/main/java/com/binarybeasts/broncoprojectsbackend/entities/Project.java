package com.binarybeasts.broncoprojectsbackend.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document
public class Project {
    @Id
    private String projectId;
    private String name;
    private String description;
    private String createdBy;
    private String department;
 
    private List<String> subscribedStudents;
    private List<String> tags;

    private Date dateCreated;

    public Project(String projectId, String name, String description, String createdBy, String department, List<String> subscribedStudents, List<String> tags, Date dateCreated) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.department = department;
        this.subscribedStudents = subscribedStudents;
        this.tags = tags;
        this.dateCreated = dateCreated;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public List<String> getSubscribedStudents() {
        return subscribedStudents;
    }

    public void setSubscribedStudents(List<String> subscribedStudents) {
        this.subscribedStudents = subscribedStudents;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Date getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Date dateCreated) {
        this.dateCreated = dateCreated;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
