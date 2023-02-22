package com.cg.model.dto;

import com.cg.model.BaseEntity;
import com.cg.model.Deposit;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
public class DepositDTO extends BaseEntity implements Validator {
    private Long id;

    @Valid
    private CustomerDTO customer;

//    @TransactionAmount(minLength = 2,maxLength = 7)
    private String transactionAmount;

    public Deposit toDeposit(){
        return new Deposit()
                .setId(id)
                .setCustomer(customer.toCustomer())
                .setTransactionAmount(BigDecimal.valueOf(Long.parseLong(transactionAmount)));
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return DepositDTO.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        DepositDTO depositDTO = (DepositDTO) target;
        if (!depositDTO.getTransactionAmount().matches("[0-9]+")) {
            errors.rejectValue("transactionAmount", "deposit.tAmount", "TransactionAmount is not valid");
        }
    }
}
