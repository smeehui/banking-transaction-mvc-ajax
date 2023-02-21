package com.cg.exception;

import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        Map<String, List<String>> body = new HashMap<>();

        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        body.put("errors", errors);
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ResponseBody
    @ExceptionHandler(TransactionAmountException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public Map<String,String> transactionAmountExceptionHandler(TransactionAmountException exception) {
        Map<String,String> map = new HashMap<>();
        map.put("errorMessage", exception.getMessage());
        return map;
    }
    @ResponseBody
    @ExceptionHandler(EmailExistedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String,String> emailExistedExceptionHandler(EmailExistedException exception) {
        Map<String,String> map = new HashMap<>();
        map.put("errorMessage", exception.getMessage());
        return map;
    }
    @ResponseBody
    @ExceptionHandler(PhoneExistedException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String,String> phoneExistedExceptionHandler(PhoneExistedException exception) {
        Map<String,String> map = new HashMap<>();
        map.put("errorMessage", exception.getMessage());
        return map;
    }
    @ResponseBody
    @ExceptionHandler(DataConflictException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String,String> dataConflictExceptionHandler(DataConflictException exception) {
        Map<String,String> map = new HashMap<>();
        String msg = exception.getMessage();
        if (msg.contains("phone")){
            msg = "Phone number is existed";
        }
        if (msg.contains("email")){
            msg = "Email address is existed";
        }
        map.put("errorMessage", msg);
        return map;
    }

    @ResponseBody
    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String,String> userNotFoundHandler(UsernameNotFoundException exception) {
        Map<String,String> map = new HashMap<>();
        String msg = exception.getMessage();
        if (msg.contains("phone")){
            msg = "Phone number is existed";
        }
        if (msg.contains("email")){
            msg = "Email address is existed";
        }
        map.put("errorMessage", msg);
        return map;
    }
}
