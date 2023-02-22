package com.cg.model.constraints;


import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = Transaction.class)
@Target({ElementType.FIELD,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface TransactionAmount {
    String message() default "Invalid transaction amount";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    int maxLength();

    int minLength();
}
