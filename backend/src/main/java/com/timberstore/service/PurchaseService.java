package com.timberstore.service;

import com.timberstore.model.Purchase;
import com.timberstore.repository.PurchaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseService {
    @Autowired
    private PurchaseRepository purchaseRepository;

    @Transactional
    public Purchase createPurchase(Purchase purchase) {
        purchase.setPurchaseTime(LocalDateTime.now());
        return purchaseRepository.save(purchase);
    }

    public Purchase getPurchase(Long id) {
        return purchaseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Purchase not found"));
    }

    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    @Transactional
    public Purchase updatePurchase(Long id, Purchase purchaseDetails) {
        Purchase purchase = getPurchase(id);
        purchase.setDescription(purchaseDetails.getDescription());
        purchase.setAmount(purchaseDetails.getAmount());
        return purchaseRepository.save(purchase);
    }

    @Transactional
    public void deletePurchase(Long id) {
        Purchase purchase = getPurchase(id);
        purchaseRepository.delete(purchase);
    }

    public List<Purchase> getPurchasesByDateRange(LocalDateTime start, LocalDateTime end) {
        return purchaseRepository.findByPurchaseTimeBetween(start, end);
    }
}


