package com.cg.model.dto;

import com.cg.model.BaseEntity;
import com.cg.model.constraints.TransactionAmount;
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
public class TransferDTO extends BaseEntity implements Validator {

    private Long id;
    private CustomerDTO sender;
    private CustomerDTO recipient;

    @TransactionAmount(maxLength = 8, minLength = 2)
    private BigDecimal transferAmount;

    @TransactionAmount(maxLength = 2, minLength = 1)
    private BigDecimal fees;
    private BigDecimal feesAmount;
    private BigDecimal transactionAmount;


    @Override
    public boolean supports(Class<?> clazz) {
        return TransferDTO.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        TransferDTO transferDTO = (TransferDTO) target;

        BigDecimal transferAmount = transferDTO.getTransferAmount();
        BigDecimal minValue = BigDecimal.valueOf(10L);
        BigDecimal maxValue = BigDecimal.valueOf(1000000L);
        if (transferAmount.compareTo(minValue) < 0) {
            errors.rejectValue("transferAmount", "transferAmount.min");
        }

        if (transferAmount.compareTo(maxValue) > 0) {
            errors.rejectValue("transferAmount", "transferAmount.max");
        }
    }
}
