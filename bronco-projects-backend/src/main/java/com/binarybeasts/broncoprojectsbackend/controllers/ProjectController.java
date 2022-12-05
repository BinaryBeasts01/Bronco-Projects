package com.binarybeasts.broncoprojectsbackend.controllers;

import com.binarybeasts.broncoprojectsbackend.dtos.ProjectCreateDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.ProjectFilterDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.ProjectPageReturnDTO;
import com.binarybeasts.broncoprojectsbackend.entities.Project;
import com.binarybeasts.broncoprojectsbackend.entities.User;
import com.binarybeasts.broncoprojectsbackend.repositories.ProjectRepository;
import com.binarybeasts.broncoprojectsbackend.repositories.UserRepository;
import com.binarybeasts.broncoprojectsbackend.services.FileService;
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
import java.io.IOException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;
 
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private FileService fileService;

    @PostMapping("/latest")
    public ResponseEntity<ProjectPageReturnDTO> getRecentProjects(@PageableDefault(page = 0, size = 10, sort = "dateCreated", direction = Sort.Direction.DESC) Pageable pageable) {
        //if user authenticated, show recent projects by their department, otherwise most recent overall
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication(); // for whatever reason, if user is not logged in there are an "anonymousUser".
        ProjectPageReturnDTO returnDTO = new ProjectPageReturnDTO();
        Page<Project> page;

        if(authentication instanceof AnonymousAuthenticationToken) {
            page = projectRepository.findAll(pageable);
        }
        else {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            page = projectRepository.findByDepartment(user.getDepartment(), pageable);
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

        //return project if it exists
        return project.isPresent() ? ResponseEntity.ok().body(project)
                                   : ResponseEntity.badRequest().body("Project with id \"" + json.get("id").asText() + "\" doesn't exist");
    }

    @PostMapping("/filter")
    public ResponseEntity<ProjectPageReturnDTO> getProjectsByFilter(@PageableDefault(page = 0, size = 10, sort = "dateCreated", direction = Sort.Direction.DESC) Pageable pageable,
                                   @RequestBody ProjectFilterDTO filterDTO) {
        //add filters to query based on provided parameters
        Query query = new Query().with(pageable);
        if(filterDTO.getTags() != null) query.addCriteria(Criteria.where("tags").in(filterDTO.getTags()));
        if(filterDTO.getBy() != null) query.addCriteria(Criteria.where("createdBy").is(filterDTO.getBy()));
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

    @PostMapping(value="/create", consumes={"multipart/form-data"})
    public ResponseEntity<String> createProject(@ModelAttribute ProjectCreateDTO project) {
        //verify project doesn't already exist
        if(projectRepository.existsByName(project.getName())) {
            return ResponseEntity.badRequest().body("Project with name \"" + project.getName() + "\" already exists");
        }

        //verify create request made by authenticated user
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!userRepository.existsById(user.getUsername())) {
            return ResponseEntity.badRequest().body("No authenticated user");
        }

        //create project
        Project p = new Project();
        p.setName(project.getName());
        p.setDescription(project.getDescription());
        p.setCreatedBy(user.getUsername());
        p.setDepartment(project.getDepartment());
        p.setTags(project.getTags());
        p.setDateCreated(Date.from(Instant.ofEpochMilli(new Date().getTime()).truncatedTo(ChronoUnit.DAYS)));
        p.setSubscribedStudents(new ArrayList<>());
        p.setInterestedStudents(new ArrayList<>());
        p.setStatus("Active");

        try {
            p.setImage(Base64.getEncoder().encodeToString(project.getImage().getBytes()));
            p.setExtension(project.getImage().getContentType().substring(project.getImage().getContentType().lastIndexOf('/') + 1));
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Could not add image");
        }

        //needed for older accounts/redundancy
        if(user.getCreatedProjects() == null) {
            user.setCreatedProjects(new ArrayList<>());
        }

        //update mongo
        projectRepository.insert(p);
        user.getCreatedProjects().add(p.getUuid()); //done after project insert to be able to use uuid
        userRepository.save(user);
        return ResponseEntity.ok().body("Created project \"" + p.getName() + "\" with id \"" + p.getUuid() + "\"");
    }

    @PostMapping("/interest")
    public ResponseEntity<String> interestedInProject(@RequestBody ObjectNode json) {
        Optional<Project> project = projectRepository.findById(json.get("id").asText());
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        //check project exists
        if(project.isEmpty()) {
            return ResponseEntity.badRequest().body("Project \"" + json.get("id").asText() + "\" doesn't exist");
        }

        //check authenticated user
        if(!userRepository.existsById(user.getUsername())) {
            return ResponseEntity.badRequest().body("No authenticated user");
        }

        //needed for older accounts/redundancy
        //if user does not have interested projects list, initialize it
        if(user.getInterestedProjects() == null) {
            user.setInterestedProjects(new ArrayList<>());
        }

        //needed for older accounts/redundancy
        //if user does not have subscribed projects list, initialize it
        if(user.getSubscribedProjects() == null) {
            user.setSubscribedProjects(new ArrayList<>());
        }

        //don't re-interest in project
        if(user.getInterestedProjects().contains(project.get().getUuid())) {
            return ResponseEntity.badRequest().body("User already interested in project \"" + json.get("id").asText() + "\"");
        }

        //don't interest if subscribed
        if(user.getSubscribedProjects().contains(project.get().getUuid())) {
            return ResponseEntity.badRequest().body("User already subscribed to project \"" + json.get("id").asText() + "\"");
        }

        //checks for null lists, redundant since user/project creation initializes lists, but didn't in previous versions so not unnecessary yet
        if(project.get().getInterestedStudents() == null) {
            project.get().setInterestedStudents(new ArrayList<>());
        }

        //add user and project to each other's subscribed lists
        project.get().getInterestedStudents().add(user.getUserId());
        user.getInterestedProjects().add(project.get().getUuid());

        //update mongo
        projectRepository.save(project.get());
        userRepository.save(user);
        return ResponseEntity.ok().body("Interested in project \"" + json.get("id").asText() + "\"");
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribeToProject(@RequestBody ObjectNode json) {
        Optional<Project> project = projectRepository.findById(json.get("id").asText());
        Optional<User> user = userRepository.findById(json.get("user").asText());

        //check project exists
        if(project.isEmpty()) {
            return ResponseEntity.badRequest().body("Project \"" + json.get("id").asText() + "\" doesn't exist");
        }

        //check authenticated user
        if(user.isEmpty()) {
            return ResponseEntity.badRequest().body("User \n" + json.get("user").asText() + "\n cannot be found");
        }

        //needed for older accounts/redundancy
        //if user does not have interested projects list, initialize it
        if(user.get().getInterestedProjects() == null) {
            user.get().setInterestedProjects(new ArrayList<>());
        }

        //needed for older accounts/redundancy
        //if user does not have subscribed projects list, initialize it
        if(user.get().getSubscribedProjects() == null) {
            user.get().setSubscribedProjects(new ArrayList<>());
        }

        //don't re-subscribe to project
        if(user.get().getSubscribedProjects().contains(project.get().getUuid())) {
            return ResponseEntity.badRequest().body("User already subscribed to project \"" + json.get("id").asText() + "\"");
        }

        //checks for null lists, redundant since user/project creation initializes lists, but didn't in previous versions so not unnecessary yet
        if(project.get().getInterestedStudents() == null) {
            project.get().setInterestedStudents(new ArrayList<>());
        }

        if(project.get().getSubscribedStudents() == null) {
            project.get().setSubscribedStudents(new ArrayList<>());
        }

        //remove user and project from each other's interested lists
        project.get().getInterestedStudents().remove(user.get().getUserId());
        user.get().getInterestedProjects().remove(project.get().getUuid());

        //add user and project to each other's subscribed lists
        project.get().getSubscribedStudents().add(user.get().getUserId());
        user.get().getSubscribedProjects().add(project.get().getUuid());

        //update mongo
        projectRepository.save(project.get());
        userRepository.save(user.get());
        return ResponseEntity.ok().body("Subscribed to project \"" + json.get("id").asText() + "\"");
    }

    @PostMapping("/status")
    public ResponseEntity<String> updateProjectStatus(@RequestBody ObjectNode json) {
        Optional<Project> project = projectRepository.findById(json.get("id").asText());

        //check project exists
        if(project.isEmpty()) {
            return ResponseEntity.badRequest().body("Project \"" + json.get("id").asText() + "\" doesn't exist");
        }

        project.get().setStatus(json.get("status").asText());
        projectRepository.save(project.get());
        return ResponseEntity.ok().body("Project status updated to \"" + json.get("status").asText() + "\"");
    }

    @GetMapping("/created")
    public ResponseEntity<?> getCreatedProjects() {
        List<String> order = Arrays.asList("Active", "In Progress", "Closed");
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(!userRepository.existsById(user.getUserId())) {
            return ResponseEntity.badRequest().body("No authenticated user");
        }

        Comparator<Project> comparator = Comparator.comparing(p -> order.indexOf(p.getStatus()));
        ArrayList<Project> projects = new ArrayList<>();
        projectRepository.findAllById(user.getCreatedProjects()).forEach(projects::add);
        projects.sort(comparator);

        return ResponseEntity.ok().body(projects);
    }
}
