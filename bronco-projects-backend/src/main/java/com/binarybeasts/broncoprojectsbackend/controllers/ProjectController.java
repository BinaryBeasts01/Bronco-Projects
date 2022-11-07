package com.binarybeasts.broncoprojectsbackend.controllers;

import com.binarybeasts.broncoprojectsbackend.dtos.ProjectCreateDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.ProjectFilterDTO;
import com.binarybeasts.broncoprojectsbackend.entities.Project;
import com.binarybeasts.broncoprojectsbackend.entities.User;
import com.binarybeasts.broncoprojectsbackend.repositories.ProjectRepository;
import com.binarybeasts.broncoprojectsbackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
 
@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;
 
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @GetMapping("/latest_projects")
    public List<Project> getRecent(@PageableDefault(page = 0, size = 10, direction = Sort.Direction.DESC) Pageable pageable) {
        //if user authenticated, show projects by their department, otherwise most recent
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.existsById(user.getUsername()) ? projectRepository.findByDepartment(user.getDepartment(), pageable).getContent()
                                                             : projectRepository.findAllByOrderByDateCreated(pageable).getContent();
    }

    //testing throwaway, see testGetRecentWithoutUser() in ProjectControllerTest
    @GetMapping("/top")
    public List<Project> getTop(@PageableDefault(page = 0, size = 10, direction = Sort.Direction.DESC) Pageable pageable) {
        return projectRepository.findAllByOrderByDateCreated(pageable).getContent();
    }

    @GetMapping("/tags")
    public List<Project> getByTags(@PageableDefault(page = 0, size = 10, direction = Sort.Direction.DESC) Pageable pageable,
                                   @RequestBody ProjectFilterDTO filterDTO) {
        //add filters to query based on provided parameters
        Criteria criteria = Criteria.where("tags").in(filterDTO.getTags());
        if(filterDTO.getCreatedBy() != null) criteria.and("createdBy").is(filterDTO.getCreatedBy());
        if(filterDTO.getBefore() != null) criteria.and("dateCreated").lte(filterDTO.getBefore());
        if(filterDTO.getAfter() != null) criteria.and("dateCreated").gte(filterDTO.getAfter());
        if(filterDTO.getOn() != null) criteria.and("dateCreated").is(filterDTO.getOn());

        return mongoTemplate.find(new Query(criteria).with(pageable), Project.class);
    }

    @PostMapping("/create")
    public ResponseEntity createProject(@RequestBody ProjectCreateDTO project) {
        //verify project doesn't already exist and create request made by authenticated user
        if(projectRepository.findById(project.getName()).isPresent()) {
            return ResponseEntity.badRequest().body("Project exists");
        }

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!userRepository.existsById(user.getUsername())) {
            return ResponseEntity.badRequest().body("No authenticated user");
        }

        //create project and add to user's list of created projects
        Project p = new Project();
        p.setName(project.getName());
        p.setDescription(project.getDescription());
        p.setCreatedBy(user.getUsername());
        p.setDepartment(project.getDepartment());
        p.setTags(project.getTags());
        p.setDateCreated(new Date());
        p.setSubscribedStudents(new ArrayList<>());

        //init list of created projects on first created
        if(user.getCreatedProjects() == null) user.setCreatedProjects(new ArrayList<>());
        user.getCreatedProjects().add(p.getName());

        //update mongo
        projectRepository.insert(p);
        userRepository.save(user);
        return ResponseEntity.ok().body("Added project");
    }
}
