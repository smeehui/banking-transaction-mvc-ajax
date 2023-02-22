package com.cg.repository;

import com.cg.model.Deposit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface DepositRepository extends JpaRepository<Deposit, Long> {

//    @Query("SELECT NEW com.cg.model.dto.DepositDTO(" +
//           "d.id," +
//           "d.customer," +
//           "d.transactionAmount" +
//           ") FROM Deposit AS d")
//    List<DepositDTO> getAllDepositsDTO();
}
