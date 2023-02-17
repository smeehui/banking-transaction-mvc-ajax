package com.cg.exception;

public class TransactionAmountException extends RuntimeException {
    public TransactionAmountException (){
        super("Transaction amount is out of range");
    }
}
