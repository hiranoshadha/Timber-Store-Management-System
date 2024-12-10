package com.timberstore.repository;

import com.timberstore.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByPurchaseTimeBetween(LocalDateTime start, LocalDateTime end);
    List<Purchase> findByAmountGreaterThan(double amount);
}


