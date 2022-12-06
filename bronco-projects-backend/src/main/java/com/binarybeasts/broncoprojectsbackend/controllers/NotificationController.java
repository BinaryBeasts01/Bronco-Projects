package com.binarybeasts.broncoprojectsbackend.controllers;

import com.binarybeasts.broncoprojectsbackend.dtos.NotificationDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.NotificationReturnDTO;
import com.binarybeasts.broncoprojectsbackend.entities.Notification;
import com.binarybeasts.broncoprojectsbackend.entities.Project;
import com.binarybeasts.broncoprojectsbackend.entities.User;
import com.binarybeasts.broncoprojectsbackend.repositories.NotificationRepository;
import com.binarybeasts.broncoprojectsbackend.repositories.ProjectRepository;
import com.binarybeasts.broncoprojectsbackend.repositories.UserRepository;
import com.binarybeasts.broncoprojectsbackend.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/notify")
    public ResponseEntity<String> sendNotification(@RequestBody NotificationDTO notification) {
        Optional<Project> project = projectRepository.findById(notification.getId());
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        //verify user exists
        if(!userRepository.existsById(user.getUserId())) {
            return ResponseEntity.badRequest().body("No authenticated user");
        }

        //check project exists
        if(project.isEmpty()) {
            return ResponseEntity.badRequest().body("Project \"" + notification.getId() + "\" doesn't exist");
        }

        //verify user is owner of project
        if(!project.get().getCreatedBy().equals(user.getUsername())) {
            return ResponseEntity.badRequest().body("User \"" + user.getUsername() + "\" is not owner of project \"" + project.get().getUuid() + "\"");
        }

        //verify users to notify
        if(project.get().getSubscribedStudents().size() == 0) {
            return ResponseEntity.badRequest().body("No subscribed users");
        }

        //create notification and save to notifications collection
        Notification n = new Notification();
        n.setMessage(notification.getMessage());
        n.setDate(new Date());
        n.setFrom(project.get().getCreatedBy());
        n.setTitle(notification.getTitle());
        notificationRepository.insert(n);

        //get list of students to notify
        ArrayList<User> students = new ArrayList<>();
        userRepository.findAllById(project.get().getSubscribedStudents()).forEach(students::add);

        for(User student : students) {
            //init list if doesn't exist
            if(student.getNotifications() == null) {
                student.setNotifications(new ArrayList<>());
            }

            //add notification
            student.getNotifications().add(n.getUuid());
            //emailService.sendMessage(student.getUserId(),"Notification for " + project.get().getName(), notification.getMessage());
        }

        //save all students
        userRepository.saveAll(students);
        return ResponseEntity.ok().body("Notifications sent");
    }

    @GetMapping("/delete")
    public ResponseEntity<String> removeNotification() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        //verify user exists
        if(!userRepository.existsById(user.getUserId())) {
            return ResponseEntity.badRequest().body("No authenticated user");
        }

        //ensure user has notifications list
        if(user.getNotifications() == null) {
            user.setNotifications(new ArrayList<>());
        }

        //remove notifications and update mongo
        notificationRepository.findAllById(user.getNotifications()).forEach(v -> user.getNotifications().remove(v.getUuid()));
        userRepository.save(user);
        return ResponseEntity.ok().body("Notifications deleted");
    }

    @GetMapping("/get")
    public ResponseEntity<?> getNotifications() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        //verify user exists
        if(!userRepository.existsById(user.getUserId())) {
            return ResponseEntity.badRequest().body("No authenticated user");
        }

        //format date to dd-mm-yyyy
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        ArrayList<NotificationReturnDTO> notifications = new ArrayList<>();

        //ensure user has notifications list
        if(user.getNotifications() == null) {
            user.setNotifications(new ArrayList<>());
        }

        //build notifications to return, formatting each date
        notificationRepository.findAllByUuidIn(user.getNotifications(), Sort.by(Sort.Direction.DESC, "date")).forEach(v -> {
            NotificationReturnDTO returnDTO = new NotificationReturnDTO();
            returnDTO.setFrom(v.getFrom());
            returnDTO.setMessage(v.getMessage());
            returnDTO.setTitle(v.getTitle());
            returnDTO.setDate(formatter.format(v.getDate()));
            notifications.add(returnDTO);
        });

        Collections.reverse(notifications);
        return ResponseEntity.ok().body(notifications);
    }
}
