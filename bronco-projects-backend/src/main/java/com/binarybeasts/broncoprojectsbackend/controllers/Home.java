package com.binarybeasts.broncoprojectsbackend.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class Home {
    @GetMapping("/")
    public String getHome() {
        return "index.html";
    }

    @GetMapping("/projects/**")
    public String getProjects() {return "forward:/";}
}