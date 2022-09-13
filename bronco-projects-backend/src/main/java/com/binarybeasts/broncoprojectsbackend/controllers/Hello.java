package com.binarybeasts.broncoprojectsbackend.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class Hello {

    @GetMapping("/")
    public String getHome() {
        return "index.html";
    }
}
