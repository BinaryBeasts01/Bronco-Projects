package com.binarybeasts.broncoprojectsbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import com.google.common.base.Preconditions;

@SpringBootApplication
public class BroncoProjectsBackendApplication {
    public static void main(String[] args) {
        Preconditions.checkNotNull("A", "String must not be null!");
        SpringApplication.run(BroncoProjectsBackendApplication.class, args);
    }

}