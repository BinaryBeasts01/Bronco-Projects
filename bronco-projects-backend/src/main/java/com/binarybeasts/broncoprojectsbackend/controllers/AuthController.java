package com.binarybeasts.broncoprojectsbackend.controllers;

import com.binarybeasts.broncoprojectsbackend.dtos.VerificationCodeDTO;
import com.binarybeasts.broncoprojectsbackend.entities.VerificationCode;
import com.binarybeasts.broncoprojectsbackend.repositories.VerificationCodeRepository;
import com.binarybeasts.broncoprojectsbackend.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.net.http.HttpResponse;
import java.util.Optional;
import java.util.Random;

@RestController
public class AuthController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @GetMapping("/verification")
    public void sendVerificationCode(@RequestBody String email) {
        Random rnd = new Random();
        int code = rnd.nextInt(999999);

        verificationCodeRepository.insert(new VerificationCode(email, code));

        emailService.sendMessage(email, "Verification Code for Bronco Projects", String.format("Your verification code is %d", code));
    }

    @PostMapping("/verification")
    public ResponseEntity verifyVerificationCode(@RequestBody VerificationCodeDTO code) {
       Optional<VerificationCode> optCode = verificationCodeRepository.findByEmail(code.getEmail());
       if(optCode.isPresent() && optCode.get().getCode() == code.getCode())
            return new ResponseEntity<>(HttpStatus.ACCEPTED);

       else
           return ResponseEntity.badRequest().body("Invalid Verification Code");

    }
}
