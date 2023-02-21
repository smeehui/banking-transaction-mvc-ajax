package com.cg.controller;

import com.cg.model.dto.UserDTO;
import com.cg.model.jwt.JwtResponse;
import com.cg.service.jwt.JwtService;
import com.cg.service.user.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private IUserService userService;


    @PostMapping("/register")
    public ResponseEntity<?> doRegister(@RequestBody UserDTO userDTO){




        return new ResponseEntity<>(userDTO,HttpStatus.CREATED);
    }

}