package com.cg.api;

import com.cg.exception.TransactionAmountException;
import com.cg.model.Transfer;
import com.cg.model.dto.TransferDTO;
import com.cg.service.transfer.ITransferService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transfers")
public class TransferAPI {
    @Autowired
    ITransferService transferService;
    @Autowired
    ModelMapper modelMapper;
    @GetMapping
    public ResponseEntity<List<TransferDTO>> getTransfers(){
//        List<DepositDTO> depositDTOS = depositService.getAllDepositsDTO();
        List<Transfer> transfers = transferService.findALl();
        List<TransferDTO> transferDTOS = transfers.stream().map(e -> modelMapper.map(e, TransferDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(transferDTOS, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Transfer> doTransfer(@RequestBody TransferDTO transferDTO){
        Transfer transfer = modelMapper.map(transferDTO, Transfer.class);
//     try {
//
//     }catch (RuntimeException e) {
//         throw new TransactionAmountException();
//     }
        transferService.save(transfer);
        return new ResponseEntity<>(transfer, HttpStatus.CREATED);
    }
}
