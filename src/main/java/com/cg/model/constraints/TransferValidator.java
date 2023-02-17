package com.cg.model.constraints;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.math.BigDecimal;

public class TransferValidator implements ConstraintValidator<TransferConstraint, BigDecimal> {
    private int maxLength;
    private int minLength;

    @Override
    public void initialize(TransferConstraint constraintAnnotation) {
        this.maxLength = constraintAnnotation.maxLength();
        this.minLength = constraintAnnotation.minLength();
    }

    @Override
    public boolean isValid(BigDecimal value, ConstraintValidatorContext context) {
        return value == null || value.toString().length() <= maxLength
                                && value.toString().length() >= minLength
                                && value.toString().matches("(^$|[0-9]*$)");
    }

}
