package com.cg.model.constraints;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class Transaction implements ConstraintValidator<TransactionAmount, String> {
    private int maxLength;
    private int minLength;

    @Override
    public void initialize(TransactionAmount constraintAnnotation) {
        this.maxLength = constraintAnnotation.maxLength();
        this.minLength = constraintAnnotation.minLength();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return value == null
               || value.toString().length() <= maxLength
                  && value.toString().length() >= minLength
                  && value.toString().matches("(^$|[0-9]*$)");
    }

}
