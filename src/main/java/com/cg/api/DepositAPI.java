package com.cg.api;

import com.cg.model.Deposit;
import com.cg.model.dto.DepositDTO;
import com.cg.service.deposit.IDepositService;
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
@RequestMapping("/api/deposits")
public class DepositAPI {
    @Autowired
    IDepositService depositService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    private AppUtil appUtil;

    @GetMapping
    public ResponseEntity<List<DepositDTO>> getDeposits(){
        List<Deposit> deposits = depositService.findALl();
        List<DepositDTO> depositDTOS = deposits.stream().map(e -> modelMapper.map(e, DepositDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(depositDTOS, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> doCreateDeposit(@Validated @RequestBody DepositDTO depositDTO, BindingResult bindingResult){
        new DepositDTO().validate(depositDTO,bindingResult);
        if (bindingResult.hasErrors()) {
            return appUtil.mapErrorToResponse(bindingResult);
        }

        Deposit deposit = depositDTO.toDeposit();
        depositService.save(deposit);
        depositDTO.getCustomer().setBalance(deposit.getCustomer().getBalance());

        return new ResponseEntity<>(depositDTO, HttpStatus.CREATED);
    }
}
