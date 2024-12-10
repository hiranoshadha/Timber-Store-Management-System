package com.timberstore.controller;

import com.timberstore.model.StockTransaction;
import com.timberstore.service.StockTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock-transactions")
@CrossOrigin
public class StockTransactionController {
    @Autowired
    private StockTransactionService stockTransactionService;

    @GetMapping("/{productId}")
    public ResponseEntity<List<StockTransaction>> getTransactionsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(stockTransactionService.getTransactionsByProductId(productId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockTransaction> updateTransaction(@PathVariable Long id, @RequestBody StockTransaction transaction) {
        return ResponseEntity.ok(stockTransactionService.updateTransaction(id, transaction));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        stockTransactionService.deleteTransaction(id);
        return ResponseEntity.ok().build();
    }

}
