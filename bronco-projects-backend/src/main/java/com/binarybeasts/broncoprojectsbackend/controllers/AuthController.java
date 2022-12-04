package com.binarybeasts.broncoprojectsbackend.controllers;

import com.binarybeasts.broncoprojectsbackend.configurations.JwtTokenUtil;
import com.binarybeasts.broncoprojectsbackend.dtos.*;
import com.binarybeasts.broncoprojectsbackend.entities.User;
import com.binarybeasts.broncoprojectsbackend.entities.VerificationCode;
import com.binarybeasts.broncoprojectsbackend.repositories.UserRepository;
import com.binarybeasts.broncoprojectsbackend.repositories.VerificationCodeRepository;
import com.binarybeasts.broncoprojectsbackend.services.EmailService;
import com.binarybeasts.broncoprojectsbackend.services.JwtUserDetailsService;
import com.binarybeasts.broncoprojectsbackend.services.FileService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private FileService fileService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/verificationcode")
    public void sendVerificationCode(@RequestBody String email) {
        if(verificationCodeRepository.findById(email).isPresent()) // THIS IS HERE JUST FOR TESTING PURPOSES
            verificationCodeRepository.deleteById(email);
        Random rnd = new Random();
        int code = rnd.nextInt(999999);

        verificationCodeRepository.insert(new VerificationCode(email, code));

        emailService.sendMessage(email, "Verification Code for Bronco Projects", String.format("Your verification code is %d", code));
    }

    @PostMapping("/verification")
    public ResponseEntity<?> verifyVerificationCode(@RequestBody VerificationCodeDTO code) {
       Optional<VerificationCode> optCode = verificationCodeRepository.findById(code.getEmail());
       if(optCode.isPresent() && optCode.get().getCode() == code.getCode())
            return new ResponseEntity<>(HttpStatus.ACCEPTED);

       else
           return ResponseEntity.badRequest().body("Invalid Verification Code");

    }

    @GetMapping("/user")
    public ResponseEntity<Boolean> verifyUserExists(@RequestParam String email) {
        Optional<User> user = userRepository.findById(email);
        return new ResponseEntity<Boolean>(user.isPresent(), HttpStatus.OK);
    }

    @PostMapping(value="/user", consumes={"multipart/form-data"})
    public ResponseEntity<String> createNewUser(@ModelAttribute UserCreateDTO user)  {
        if(userRepository.existsById(user.getEmail()))
            return ResponseEntity.badRequest().body("User exists");

        MultipartFile resume = user.getResume();
        MultipartFile transcript = user.getTranscript();
        try {
            String resumeId = fileService.addPdf(resume);
            String transcriptId = fileService.addPdf(transcript);

            User u = new User();
            u.setUserId(user.getEmail());
            u.setName(user.getName());
            u.setPassword(passwordEncoder.encode(user.getPassword()));
            u.setResumeFileId(resumeId);
            u.setTranscriptFileId(transcriptId);
            u.setDepartment(user.getDepartment());
            u.setSubscribedProjects(new ArrayList<>());
            u.setInterestedProjects(new ArrayList<>());
            u.setCreatedProjects(new ArrayList<>());

            userRepository.insert(u);
            return ResponseEntity.ok().body("Added user");
        }
        catch(IOException e) {
            return ResponseEntity.badRequest().body("Could not add pdf");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequest) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
            String token = jwtTokenUtil.generateToken(userDetails);
            return ResponseEntity.ok(new JwtResponseDTO(token));
        }
        catch (DisabledException e) {
            return ResponseEntity.badRequest().body("USER DISABLED");
        }
        catch (BadCredentialsException e) {
            return ResponseEntity.badRequest().body("INVALID CREDENTIALS");
        }
    }

    @PostMapping("/id")
    public ResponseEntity<?> getUserById(@RequestBody ObjectNode json) {
        Optional<User> user = userRepository.findById(json.get("id").asText());

        //return user if present
        if(user.isPresent()) {
            UserInfoDTO infoDTO = new UserInfoDTO();
            infoDTO.setName(user.get().getName());
            infoDTO.setUserId(user.get().getUserId());
            infoDTO.setInterestedProjects(user.get().getInterestedProjects());
            infoDTO.setDepartment(user.get().getDepartment());
            infoDTO.setSubscribedProjects(user.get().getSubscribedProjects());
            infoDTO.setCreatedProjects(user.get().getCreatedProjects());
            infoDTO.setResumeFileId(user.get().getResumeFileId());

            return ResponseEntity.ok().body(infoDTO);
        }

        return ResponseEntity.badRequest().body("User with id \"" + json.get("id").asText() + "\" doesn't exist");
    }

    @GetMapping("/id")
    public ResponseEntity<?> getUserId(Authentication authentication) {
        if(authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.badRequest().body("NO TOKEN PROVIDED");
        }
        else {
            User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            return ResponseEntity.ok().body(user.getUserId());
        }
    }

    @PostMapping("/resume")
    public ResponseEntity<?> getUserResume(@RequestBody ObjectNode json) {
        try {
            FileDTO pdf = fileService.getPdf(json.get("id").asText());
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(pdf.getType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + pdf.getName() + "\"")
                    .body(pdf.getFile());
        } catch(IOException e) {
            return ResponseEntity.badRequest().body("Could not retrieve image");
        }
    }
}
