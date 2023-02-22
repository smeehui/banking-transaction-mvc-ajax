package com.cg.api;

import com.cg.exception.DataConflictException;
import com.cg.exception.DataNotFoundException;
import com.cg.model.Customer;
import com.cg.model.dto.CustomerDTO;
import com.cg.repository.CustomerRepository;
import com.cg.service.customer.ICustomerService;
import com.cg.util.AppUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AppUtil appUtil;

    @GetMapping
    public ResponseEntity<List<CustomerDTO>> getAllCustomers() {
        List<CustomerDTO> customers = customerService.findAllCustomerDTOsByDeletedIsFalse();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> getCustomer(@PathVariable Long id) {
        Optional<Customer> customer = customerService.findByIdAndDeleteIsFalse(id);
        CustomerDTO customerDTO = modelMapper.map(customer.get(), CustomerDTO.class);
        return new ResponseEntity<>(customerDTO, HttpStatus.OK);
    }

    @GetMapping("/id_ne={cId}")
    public ResponseEntity<List<CustomerDTO>> getAllCustomersNot(@PathVariable Long cId) {
        List<Customer> customers = customerService.findAllByIdNotAndDeletedIsFalse(cId);
        List<CustomerDTO> customerDTOS = customers.stream().map(e -> modelMapper.map(e, CustomerDTO.class)).collect(Collectors.toList());
        return new ResponseEntity<>(customerDTOS, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Customer> doCreateCustomer(@RequestBody CustomerDTO customerDTO) {
        customerDTO.setId(null);
        customerDTO.getLocationRegion().setId(null);
        Customer customer = customerDTO.toCustomer();

        String email = customerDTO.getEmail();
        String phone = customerDTO.getPhone();

        Optional<Customer> customerOptionalEmail = customerService.findByEmail(email);
        if (customerOptionalEmail.isPresent()) throw new DataConflictException("Email has already been existed");
        Optional<Customer> customerOptionalPhone = customerService.findByPhone(phone);
        if (customerOptionalPhone.isPresent()) throw new DataConflictException("Phone has already been existed");


        customerService.save(customer);


        return new ResponseEntity<>(customer, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long id) {
        Optional<Customer> customerOpt = customerService.findByIdAndDeleteIsFalse(id);
        if (!customerOpt.isPresent()) {
            throw  new  DataNotFoundException ("User not found");
        }
        customerOpt.get().setDeleted(true);
        customerService.save(customerOpt.get());
        return new  ResponseEntity<>(HttpStatus.OK);
    }
}
