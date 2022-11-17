package com.binarybeasts.broncoprojectsbackend.services;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EmailServiceTest {
    @Test
    void test() {
        EmailService service = new EmailService();
        service.sendMessage("austinlee1@cpp.edu", "Test", "Test passed successfully");
        System.out.println("Email Service Successful");
    }
}