package com.cg.model.constraints;


import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = TransferValidator.class)
@Target({ElementType.FIELD,ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface TransferConstraint {
    String message() default "Invalid transaction amount";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};

    int maxLength();

    int minLength();
}
