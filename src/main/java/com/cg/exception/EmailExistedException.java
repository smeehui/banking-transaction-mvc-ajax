package com.cg.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class EmailExistedException extends RuntimeException{
    static final long serialVersionUID = 1L;
    public EmailExistedException(String message)  {
        super(message);
    }
}
