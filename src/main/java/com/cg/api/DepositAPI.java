package com.cg.api;

import com.cg.model.Deposit;
import com.cg.model.dto.DepositDTO;
import com.cg.service.deposit.IDepositService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/deposits")
public class DepositAPI {
    @Autowired
    IDepositService depositService;

    @Autowired
    ModelMapper modelMapper;
    @GetMapping
    public ResponseEntity<List<DepositDTO>> getDeposits(){
//        List<DepositDTO> depositDTOS = depositService.getAllDepositsDTO();
        List<Deposit> deposits = depositService.findALl();
        List<DepositDTO> depositDTOS = deposits.stream().map(e -> modelMapper.map(e, DepositDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(depositDTOS, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Deposit> doCreateDeposit(@Valid @RequestBody DepositDTO depositDTO){
        Deposit deposit = depositDTO.toDeposit();
        depositService.save(deposit);
        return new ResponseEntity<>(deposit, HttpStatus.CREATED);
    }
}
