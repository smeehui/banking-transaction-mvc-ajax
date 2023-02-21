package com.cg.api;

import com.cg.model.Role;
import com.cg.model.User;
import com.cg.model.dto.RoleDTO;
import com.cg.model.dto.UserDTO;
import com.cg.model.jwt.JwtResponse;
import com.cg.service.jwt.JwtService;
import com.cg.service.user.IUserService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserAPI {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private IUserService userService;

    @Autowired
    ModelMapper modelMapper;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO user) {
        String username = user.getUsername();
        String password = user.getPassword();
        UserDetails userDetails = userService.loadUserByUsername(username);
        String jwt = jwtService.generateToken(userDetails);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(username, password);
        Authentication authenticate = authenticationManager.authenticate(authentication);
        JwtResponse response = new JwtResponse (jwt,user.getId(),username,authenticate.getAuthorities());

        ResponseCookie springCookie = ResponseCookie.from("jwtToken", jwt)
                .httpOnly(false)
                .secure(false)
                .path("/")
                .maxAge(60 * 1000)
                .domain("localhost")
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, springCookie.toString())
                .body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> doCreate(@RequestBody UserDTO userDTO){
            Set<RoleDTO> roleDTOs = userDTO.getRoles();
            Set<Role> roles = roleDTOs.stream().map(roleDTO -> modelMapper.map(roleDTO, Role.class)).collect(Collectors.toSet());
            User user = modelMapper.map(userDTO, User.class);
            user.setRoles(roles);
            userService.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
    }
}
