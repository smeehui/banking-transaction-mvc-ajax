package com.cg.api;

import com.cg.exception.TransactionAmountException;
import com.cg.model.Transfer;
import com.cg.model.dto.CustomerDTO;
import com.cg.model.dto.TransferDTO;
import com.cg.service.transfer.ITransferService;
import com.cg.util.AppUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
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

    @Autowired
    AppUtil appUtil;

    @GetMapping
    public ResponseEntity<List<TransferDTO>> getTransfers(){
//        List<DepositDTO> depositDTOS = depositService.getAllDepositsDTO();
        List<Transfer> transfers = transferService.findALl();
        List<TransferDTO> transferDTOS = transfers.stream().map(e -> modelMapper.map(e, TransferDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(transferDTOS, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> doTransfer(@Validated @RequestBody TransferDTO transferDTO, BindingResult bindingResult){
        new TransferDTO().validate(transferDTO,bindingResult);

        CustomerDTO sender = transferDTO.getSender();
        CustomerDTO recipient = transferDTO.getRecipient();




        if (bindingResult.hasErrors()) {
            return appUtil.mapErrorToResponse(bindingResult);
        }


        Transfer transfer = modelMapper.map(transferDTO, Transfer.class);


        transferService.save(transfer);
        return new ResponseEntity<>(transfer, HttpStatus.CREATED);
    }
}
