package com.cg.model;

import com.cg.model.dto.DepositDTO;
import lombok.*;
import lombok.experimental.Accessors;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "deposits")
@Accessors(chain = true)
public class Deposit extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", referencedColumnName = "id", nullable = false)
    private Customer customer;


    @NotNull(message = "Transaction amount is required")
    @Column(name = "transaction_amount", precision = 10, scale = 0, nullable = false)
    private BigDecimal transactionAmount;

    public DepositDTO toDepositDTO() {
    return new DepositDTO()
            .setId(id)
            .setCustomer(customer.toCustomerDTO())
            .setTransactionAmount(transactionAmount);
    }

}
