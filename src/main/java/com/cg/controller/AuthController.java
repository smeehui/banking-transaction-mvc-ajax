package com.cg.controller;

import com.cg.model.dto.UserDTO;
import com.cg.model.jwt.JwtResponse;
import com.cg.service.jwt.JwtService;
import com.cg.service.user.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO user) {
        String username = user.getUsername();
        String password = user.getPassword();
        UserDetails userDetails = userService.loadUserByUsername(username);
        String jwt = jwtService.generateToken(userDetails);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authenticate = authenticationManager.authenticate(authentication);
        JwtResponse response = new JwtResponse (jwt,user.getId(),username,authenticate.getAuthorities());
        return ResponseEntity.ok(response);
    }


}