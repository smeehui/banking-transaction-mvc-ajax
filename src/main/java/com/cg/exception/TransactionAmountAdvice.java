package com.cg.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class TransactionAmountAdvice {

    @ResponseBody
    @ExceptionHandler(TransactionAmountException.class)
    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
    public Map<String,String> exceptionHandler(TransactionAmountException exception) {
        Map<String,String> map = new HashMap<>();
        map.put("errorMessage", exception.getMessage());
        return map;
    }
}
