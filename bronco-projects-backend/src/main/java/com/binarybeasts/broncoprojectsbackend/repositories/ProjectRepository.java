package com.binarybeasts.broncoprojectsbackend.repositories;

import com.binarybeasts.broncoprojectsbackend.entities.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface ProjectRepository extends MongoRepository<Project, String> {
    //get all projects whose tags[] contain an element of passed tags[]
    @Query("{ 'tags': { $in: ?0 } }")
    Page<Project> findByTags(String[] tags, Pageable pageable);

    //get projects by date created, can get newest or oldest based on passed pageable
    Page<Project> findByDateCreated(Pageable pageable);

    Page<Project> findByDepartment(String department, Pageable pageable);
}
