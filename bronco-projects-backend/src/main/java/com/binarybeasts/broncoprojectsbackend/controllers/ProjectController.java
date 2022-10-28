package com.binarybeasts.broncoprojectsbackend.controllers;

import com.binarybeasts.broncoprojectsbackend.entities.Project;
import com.binarybeasts.broncoprojectsbackend.entities.User;
import com.binarybeasts.broncoprojectsbackend.repositories.ProjectRepository;
import com.binarybeasts.broncoprojectsbackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    //if user authenticated, show projects by their department, otherwise most recent
    @GetMapping("/latest_projects")
    public List<Project> getRecent(@PageableDefault(page = 0, size = 10, direction = Sort.Direction.DESC) Pageable pageable) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(userRepository.existsById(user.getUsername())) {
            return projectRepository.findByDepartment(user.getDepartment(), pageable).getContent();
        }

        return projectRepository.findByDateCreated(pageable).getContent();
    }

    //https://stackoverflow.com/questions/7899525/how-to-split-a-string-by-space
    //stack overflow considerations to split by whitespace rather than normal space, and trim leading spaces to not get empty string as first element
    @GetMapping("/tags")
    public List<Project> getByTags(@PageableDefault(page = 0, size = 10, direction = Sort.Direction.DESC) Pageable pageable,
                                   @RequestParam(value = "query", required = true) String tags) {
        return projectRepository.findByTags(tags.trim().split("\\s+"), pageable).getContent();
    }
}
