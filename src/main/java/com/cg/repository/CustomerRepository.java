package com.cg.repository;

import com.cg.model.Customer;
import com.cg.model.dto.CustomerDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByPhone(String phone);

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByIdAndDeletedFalse(Long id);

    List<Customer> findAllByDeletedIsFalse();

    List<Customer> findAllByIdNot(Long id);

    List<Customer> findAllByIdNotAndDeletedIsFalse(Long id);

    @Modifying
    @Query("UPDATE Customer AS c SET c.balance = c.balance + :transactionAmount WHERE c.id = :customerId")
    void incrementBalance(@Param("customerId") Long customerId, @Param("transactionAmount") BigDecimal transactionAmount);

    @Modifying
    @Query("UPDATE Customer AS c SET c.balance = c.balance - :transactionAmount WHERE c.id = :customerId")
    void decrementBalance(@Param("customerId") Long customerId, @Param("transactionAmount") BigDecimal transactionAmount);

//    Long id, String fullName, String email, String phone, BigDecimal balance, LocationRegion locationRegion
    @Query("SELECT NEW com.cg.model.dto.CustomerDTO(" +
           "c.id," +
           "c.fullName," +
           "c.email," +
           "c.phone," +
           "c.balance," +
           "c.locationRegion" +
           ") FROM Customer AS c " +
           "WHERE c.deleted = FALSE")
    List<CustomerDTO> findAllCustomerDTOsByDeletedIsFalse();
}

