package com.binarybeasts.broncoprojectsbackend.controllers;

import com.binarybeasts.broncoprojectsbackend.dtos.ProjectCreateDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.ProjectFilterDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.ProjectPageReturnDTO;
import com.binarybeasts.broncoprojectsbackend.entities.Project;
import com.binarybeasts.broncoprojectsbackend.entities.User;
import com.binarybeasts.broncoprojectsbackend.repositories.ProjectRepository;
import com.binarybeasts.broncoprojectsbackend.repositories.UserRepository;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;
 
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostMapping("/latest")
    public ResponseEntity<ProjectPageReturnDTO> getRecent(@PageableDefault(page = 0, size = 10, sort = "dateCreated", direction = Sort.Direction.DESC) Pageable pageable) {
        //if user authenticated, show projects by their department, otherwise most recent
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // for whatever reason, if user is not logged in there are an "anonymousUser".
        ProjectPageReturnDTO returnDTO = new ProjectPageReturnDTO();
        Page<Project> page;
        if(!(authentication instanceof AnonymousAuthenticationToken)) {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            page = projectRepository.findByDepartment(user.getDepartment(), pageable);
        }
        else {
            page = projectRepository.findAll(pageable);
        }

        //return projects and page counts
        returnDTO.setProjects(page.getContent());
        returnDTO.setTotalPages(page.getTotalPages());
        returnDTO.setCurrentPage(page.getNumber());
        returnDTO.setTotalElements(page.getTotalElements());
        return ResponseEntity.ok().body(returnDTO);
    }

    @PostMapping("/id")
    public ResponseEntity<?> getProjectById(@RequestBody ObjectNode json) {
        Optional<Project> project = projectRepository.findById(json.get("id").asText());

        return project.isPresent() ? ResponseEntity.ok().body(project)
                                   : ResponseEntity.badRequest().body("Project with id " + json.get("id").asText() + " doesn't exist");
    }

    @PostMapping("/filter")
    public ResponseEntity<ProjectPageReturnDTO> getByTags(@PageableDefault(page = 0, size = 10, sort = "dateCreated", direction = Sort.Direction.DESC) Pageable pageable,
                                   @RequestBody ProjectFilterDTO filterDTO) {
        //add filters to query based on provided parameters
        Query query = new Query().with(pageable);
        if(filterDTO.getTags() != null) query.addCriteria(Criteria.where("tags").in(filterDTO.getTags()));
        if(filterDTO.getCreatedBy() != null) query.addCriteria(Criteria.where("createdBy").is(filterDTO.getCreatedBy()));
        if(filterDTO.getBefore() != null) query.addCriteria(Criteria.where("dateCreated").lte(filterDTO.getBefore()));
        if(filterDTO.getAfter() != null) query.addCriteria(Criteria.where("dateCreated").gte(filterDTO.getAfter()));
        if(filterDTO.getOn() != null) query.addCriteria(Criteria.where("dateCreated").is(filterDTO.getOn()));

        //build page with mongo template to execute query
        ProjectPageReturnDTO returnDTO = new ProjectPageReturnDTO();
        List<Project> projects = mongoTemplate.find(query, Project.class);
        Page<Project> page = PageableExecutionUtils.getPage(projects, pageable, () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Project.class));

        //return filtered projects and page counts
        returnDTO.setProjects(page.getContent());
        returnDTO.setTotalPages(page.getTotalPages());
        returnDTO.setCurrentPage(page.getNumber());
        returnDTO.setTotalElements(page.getTotalElements());
        return ResponseEntity.ok().body(returnDTO);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createProject(@RequestBody ProjectCreateDTO project) {
        //verify project doesn't already exist
        if(projectRepository.existsById(project.getName())) {
            return ResponseEntity.badRequest().body("Project exists");
        }

        //verify create request made by authenticated user
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!userRepository.existsById(user.getUsername())) {
            return ResponseEntity.badRequest().body("No authenticated user");
        }

        //Date date = Date.from(LocalDateTime.now().truncatedTo(ChronoUnit.DAYS).toInstant());
        //LocalDateTime.now().truncatedTo(ChronoUnit.DAYS)

        //create project and add to user's list of created projects
        Project p = new Project();
        p.setName(project.getName());
        p.setDescription(project.getDescription());
        p.setCreatedBy(user.getUsername());
        p.setDepartment(project.getDepartment());
        p.setTags(project.getTags());
        p.setDateCreated(Date.from(Instant.ofEpochMilli(new Date().getTime()).truncatedTo(ChronoUnit.DAYS)));
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
