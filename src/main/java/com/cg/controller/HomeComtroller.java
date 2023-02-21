package com.cg.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("")
public class HomeComtroller {
    @GetMapping("/")
    public String directToLogin(){
        return "/login";
    }

    @GetMapping("/login")
    public String showLoginForm(){
        return "/login";
    }

    @GetMapping("/index")
    public String redirectToHome(){
        return "/index";
    }
}
