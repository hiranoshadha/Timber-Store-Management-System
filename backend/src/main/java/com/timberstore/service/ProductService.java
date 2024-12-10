package com.timberstore.service;

import com.timberstore.model.*;
import com.timberstore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class ProductService {
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private StockTransactionRepository stockTransactionRepository;

    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    

    @Transactional
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setProductName(productDetails.getProductName());
        product.setProductCode(productDetails.getProductCode());
        product.setPrice(productDetails.getPrice());
        product.setCurrentStock(productDetails.getCurrentStock());
        return productRepository.save(product);
    }

    @Transactional
    public StockTransaction addStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setCurrentStock(product.getCurrentStock() + quantity);
        productRepository.save(product);

        StockTransaction transaction = new StockTransaction();
        transaction.setProduct(product);
        transaction.setQuantity(quantity);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setTransactionType(StockTransaction.TransactionType.ADD);
        
        return stockTransactionRepository.save(transaction);
    }

    @Transactional
    public Product deleteProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        productRepository.delete(product);
        return product;
    }

    @Transactional
    public StockTransaction removeStock(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getCurrentStock() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        product.setCurrentStock(product.getCurrentStock() - quantity);
        productRepository.save(product);

        StockTransaction transaction = new StockTransaction();
        transaction.setProduct(product);
        transaction.setQuantity(quantity);
        transaction.setTransactionTime(LocalDateTime.now());
        transaction.setTransactionType(StockTransaction.TransactionType.REMOVE);
        
        return stockTransactionRepository.save(transaction);
    }
}
