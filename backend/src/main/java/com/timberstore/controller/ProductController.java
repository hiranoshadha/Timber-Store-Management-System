package com.timberstore.controller;

import com.timberstore.model.*;
import com.timberstore.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
    return ResponseEntity.ok(productService.getAllProducts());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    

    @PostMapping("/{productId}/add-stock")
    public ResponseEntity<StockTransaction> addStock(
        @PathVariable Long productId, 
        @RequestParam int quantity
    ) {
        return ResponseEntity.ok(productService.addStock(productId, quantity));
    }

    @PostMapping("/{productId}/remove-stock")
    public ResponseEntity<StockTransaction> removeStock(
        @PathVariable Long productId, 
        @RequestParam int quantity
    ) {
        return ResponseEntity.ok(productService.removeStock(productId, quantity));
    }
}
