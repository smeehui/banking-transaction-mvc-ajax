package com.cg.service.transfer;

import com.cg.model.Customer;
import com.cg.model.Transfer;
import com.cg.repository.CustomerRepository;
import com.cg.repository.TransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransferServiceImpl implements ITransferService {

    @Autowired
    private TransferRepository transferRepository;
    @Autowired
    private CustomerRepository customerRepository;


    @Override
    public List<Transfer> findALl() {
        return transferRepository.findAll();
    }

    @Override
    public Optional<Transfer> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public Transfer save(Transfer transfer) {
        Customer sender = transfer.getSender();
        Customer recipient = transfer.getRecipient();

        BigDecimal transferAmount = transfer.getTransferAmount();
        float fees = (float) transfer.getFees() / 100;
        BigDecimal transferFees = transferAmount.multiply(BigDecimal.valueOf(fees));
        BigDecimal transactionAmount = transferAmount.add(transferFees);

        transfer.setFeesAmount(transferFees);
        transfer.setTransactionAmount(transactionAmount);

        transfer = transferRepository.save(transfer);

        customerRepository.decrementBalance(sender.getId(),transactionAmount);
        customerRepository.incrementBalance(recipient.getId(),transferAmount);

        sender.setBalance(sender.getBalance().subtract(transactionAmount));
        recipient.setBalance(recipient.getBalance().add(transferAmount));
//        transfer.setSender(sender);
//        transfer.setRecipient(recipient);

        return transfer;
    }

    @Override
    public void deleteById(Long id) {

    }

    @Override
    public void delete(Transfer transfer) {

    }
}
