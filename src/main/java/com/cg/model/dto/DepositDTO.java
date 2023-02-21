package com.cg.model.dto;

import com.cg.model.BaseEntity;
import com.cg.model.Customer;
import com.cg.model.Deposit;
import com.cg.model.constraints.TransactionAmount;
import lombok.*;
import lombok.experimental.Accessors;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
public class DepositDTO extends BaseEntity {
    private Long id;
    private CustomerDTO customer;

    @TransactionAmount(minLength = 2,maxLength = 7)
    private BigDecimal transactionAmount;

    public Deposit toDeposit(){
        return new Deposit()
                .setId(id)
                .setCustomer(customer.toCustomer())
                .setTransactionAmount(transactionAmount);
    }

    public DepositDTO(Long id, Customer customer, BigDecimal transactionAmount) {
        this.id = id;
        this.customer = customer.toCustomerDTO();
        this.transactionAmount = transactionAmount;
    }
}
