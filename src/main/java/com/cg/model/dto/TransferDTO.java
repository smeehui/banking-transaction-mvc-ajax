package com.cg.model.dto;

import com.cg.model.BaseEntity;
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

    private String transferAmount;

    private String fees;


    @Override
    public boolean supports(Class<?> clazz) {
        return TransferDTO.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        TransferDTO transferDTO = (TransferDTO) target;

        String transferAmountStr = transferDTO.getTransferAmount();
        if (!transferAmountStr.matches("[0-9]+")) {
            errors.rejectValue("transferAmount", "transferAmount.format","Transfer amount is not valid");
        }
        else if (transferAmount.length() < 2 || transferAmount.length() > 9) {
            errors.rejectValue("transferAmount", "transferAmount.charater","Transfer amount character must be between 2 to 8");
        }
        else {
            BigDecimal transferAmount = BigDecimal.valueOf(Long.parseLong(transferAmountStr));
            BigDecimal minValue = BigDecimal.valueOf(10L);
            BigDecimal maxValue = BigDecimal.valueOf(1000000L);

            float fees = Float.parseFloat(transferDTO.getFees()) / 100;
            BigDecimal transferFees = transferAmount.multiply(BigDecimal.valueOf(fees));
            BigDecimal transactionAmount = transferAmount.add(transferFees);

            if (transferAmount.compareTo(minValue) < 0) {
                errors.rejectValue("transferAmount", "transferAmount.min");
            }

            if (transferAmount.compareTo(maxValue) > 0) {
                errors.rejectValue("transferAmount", "transferAmount.max");
            }

            if (sender.getBalance().compareTo(transactionAmount) < 0) {
                errors.rejectValue("senderBalance", "balance.low", "Sender balance is not enough");
            }

        }

        CustomerDTO sender = transferDTO.getSender();
        CustomerDTO recipient = transferDTO.getRecipient();

        if (sender.getId().equals(recipient.getId())) {
            errors.rejectValue("customer", "customer.same", "Sender and recipient must be identical");
        }
    }
}
