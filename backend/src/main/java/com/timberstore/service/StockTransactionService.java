package com.timberstore.service;

import com.timberstore.model.Product;
import com.timberstore.model.StockTransaction;
import com.timberstore.model.StockTransaction.TransactionType;
import com.timberstore.repository.ProductRepository;
import com.timberstore.repository.StockTransactionRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockTransactionService {
    @Autowired
    private StockTransactionRepository stockTransactionRepository;
    
    @Autowired
    private ProductRepository productRepository;

    public List<StockTransaction> getTransactionsByProductId(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return stockTransactionRepository.findByProduct(product);
    }
        @Transactional
        public StockTransaction updateTransaction(Long id, StockTransaction transactionDetails) {
            StockTransaction oldTransaction = stockTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock transaction not found"));
        
            Product product = oldTransaction.getProduct();
        
            // Revert the old transaction
            if (oldTransaction.getTransactionType() == TransactionType.ADD) {
                product.setCurrentStock(product.getCurrentStock() - oldTransaction.getQuantity());
            } else {
                product.setCurrentStock(product.getCurrentStock() + oldTransaction.getQuantity());
            }
        
            // Apply the new transaction
            if (transactionDetails.getTransactionType() == TransactionType.ADD) {
                product.setCurrentStock(product.getCurrentStock() + transactionDetails.getQuantity());
            } else {
                product.setCurrentStock(product.getCurrentStock() - transactionDetails.getQuantity());
            }
        
            productRepository.save(product);
        
            oldTransaction.setQuantity(transactionDetails.getQuantity());
            oldTransaction.setTransactionType(transactionDetails.getTransactionType());
        
            return stockTransactionRepository.save(oldTransaction);
        }

        @Transactional
        public void deleteTransaction(Long id) {
            StockTransaction transaction = stockTransactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock transaction not found"));
        
            Product product = transaction.getProduct();
        
            // Revert the transaction effect on current stock
            if (transaction.getTransactionType() == TransactionType.ADD) {
                product.setCurrentStock(product.getCurrentStock() - transaction.getQuantity());
            } else {
                product.setCurrentStock(product.getCurrentStock() + transaction.getQuantity());
            }
        
            productRepository.save(product);
            stockTransactionRepository.delete(transaction);
        }
    }


