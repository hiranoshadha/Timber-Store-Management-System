package com.timberstore.controller;

import com.timberstore.model.Purchase;
import com.timberstore.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {
    @Autowired
    private PurchaseService purchaseService;

    @PostMapping
    public ResponseEntity<Purchase> createPurchase(@RequestBody Purchase purchase) {
        return ResponseEntity.ok(purchaseService.createPurchase(purchase));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getPurchase(@PathVariable Long id) {
        return ResponseEntity.ok(purchaseService.getPurchase(id));
    }

    @GetMapping
    public ResponseEntity<List<Purchase>> getAllPurchases() {
        return ResponseEntity.ok(purchaseService.getAllPurchases());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Purchase> updatePurchase(
        @PathVariable Long id, 
        @RequestBody Purchase purchaseDetails
    ) {
        return ResponseEntity.ok(purchaseService.updatePurchase(id, purchaseDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchase(@PathVariable Long id) {
        purchaseService.deletePurchase(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/by-date-range")
    public ResponseEntity<List<Purchase>> getPurchasesByDateRange(
        @RequestParam LocalDateTime start,
        @RequestParam LocalDateTime end
    ) {
        return ResponseEntity.ok(purchaseService.getPurchasesByDateRange(start, end));
    }
}
