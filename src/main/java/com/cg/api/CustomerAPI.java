package com.cg.api;

import com.cg.exception.DataConflictException;
import com.cg.exception.EmailExistedException;
import com.cg.model.Customer;
import com.cg.model.dto.CustomerDTO;
import com.cg.service.customer.ICustomerService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.ConstraintViolationException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
public class CustomerAPI {
    @Autowired
    ICustomerService customerService;

    @Autowired
    ModelMapper modelMapper;
    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers(){
        List<CustomerDTO> customers = customerService.findAllCustomerDTOsByDeletedIsFalse();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomer(@PathVariable Long id){
        Optional<Customer> customer = customerService.findByIdAndDeleteIsFalse(id);
        CustomerDTO customerDTO = modelMapper.map(customer.get(), CustomerDTO.class);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }
    @GetMapping("/id_ne={cId}")
    public ResponseEntity<List<CustomerDTO>> getAllCustomersNot(@PathVariable Long cId){
        List<Customer> customers = customerService.findAllByIdNotAndDeletedIsFalse(cId);
        List<CustomerDTO> customerDTOS = customers.stream().map(e->modelMapper.map(e,CustomerDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(customerDTOS, HttpStatus.OK);
    }
   @PostMapping
    public ResponseEntity<Customer> doCreateCustomer(@RequestBody CustomerDTO customerDTO){
        customerDTO.setId(null);
        customerDTO.getLocationRegion().setId(null);
        Customer customer = customerDTO.toCustomer();
       try{
           customerService.save(customer);
       }catch (DataIntegrityViolationException e){
           throw new DataConflictException(e.getMessage());
       }

        return new ResponseEntity<>(customer, HttpStatus.CREATED);
   }
}
