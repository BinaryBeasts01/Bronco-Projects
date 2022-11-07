package com.binarybeasts.broncoprojectsbackend.controllers;

import com.binarybeasts.broncoprojectsbackend.configurations.JwtTokenUtil;
import com.binarybeasts.broncoprojectsbackend.dtos.JwtResponseDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.LoginRequestDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.UserCreateDTO;
import com.binarybeasts.broncoprojectsbackend.dtos.VerificationCodeDTO;
import com.binarybeasts.broncoprojectsbackend.entities.User;
import com.binarybeasts.broncoprojectsbackend.entities.VerificationCode;
import com.binarybeasts.broncoprojectsbackend.repositories.UserRepository;
import com.binarybeasts.broncoprojectsbackend.repositories.VerificationCodeRepository;
import com.binarybeasts.broncoprojectsbackend.services.EmailService;
import com.binarybeasts.broncoprojectsbackend.services.JwtUserDetailsService;
import com.binarybeasts.broncoprojectsbackend.services.PdfFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

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
    private PdfFileService pdfFileService;

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
    public ResponseEntity verifyVerificationCode(@RequestBody VerificationCodeDTO code) {
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
    public ResponseEntity createNewUser(@ModelAttribute UserCreateDTO user)  {
        if(userRepository.findById(user.getEmail()).isPresent())
            return ResponseEntity.badRequest().body("User exists");

        MultipartFile resume = user.getResume();
        MultipartFile transcript = user.getTranscript();
        try {
            String resumeId = pdfFileService.addPdf(resume.getName(), resume);
            String transcriptId = pdfFileService.addPdf(transcript.getName(), transcript);

            User u = new User();
            u.setUserId(user.getEmail());
            u.setPassword(passwordEncoder.encode(user.getPassword()));
            u.setResumeFileId(resumeId);
            u.setTranscriptFileId(transcriptId);
            u.setDepartment("Department");

            userRepository.insert(u);
            return ResponseEntity.ok().body("Added user");
        }
        catch(IOException e) {
            return ResponseEntity.badRequest().body("Could not add pdf");
        }
    }

    @PostMapping("/login")
    public ResponseEntity loginUser(@RequestBody LoginRequestDTO loginRequest) {
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
}
