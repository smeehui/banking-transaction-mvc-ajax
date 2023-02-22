package com.cg.service.user;

import com.cg.model.User;
import com.cg.service.IGeneralService;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface IUserService extends UserDetailsService, IGeneralService<User> {
    public Optional<User> findByUserName(String username);
}
