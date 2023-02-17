package com.cg.service.deposit;

import com.cg.model.Customer;
import com.cg.model.Deposit;
import com.cg.model.dto.DepositDTO;
import com.cg.repository.CustomerRepository;
import com.cg.repository.DepositRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class DepositServiceImpl implements IDepositService {

    @Autowired
    private DepositRepository depositRepository;
    @Autowired
    private CustomerRepository customerRepository;


    @Override
    public List<Deposit> findALl() {
        return depositRepository.findAll();
    }

    @Override
    public Optional<Deposit> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public Deposit save(Deposit deposit) {
        deposit.setId(null);
        Customer customer = deposit.getCustomer();
        customerRepository.incrementBalance(customer.getId(), deposit.getTransactionAmount());
        customer.setBalance(customer.getBalance().add(deposit.getTransactionAmount()));
        deposit.setCustomer(customer);
        return depositRepository.save(deposit);
    }

    @Override
    public void deleteById(Long id) {

    }

    @Override
    public void delete(Deposit deposit) {

    }

    @Override
    public List<DepositDTO> getAllDepositsDTO() {
        return depositRepository.getAllDepositsDTO();
    }
}
