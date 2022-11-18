package com.binarybeasts.broncoprojectsbackend.repositories;

import com.binarybeasts.broncoprojectsbackend.entities.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project, String> {
    //get projects that match department
    Page<Project> findByDepartment(String department, Pageable pageable);
}
