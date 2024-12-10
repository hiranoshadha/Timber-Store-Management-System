package com.timberstore.repository;

import com.timberstore.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findBySaleTimeBetween(LocalDateTime start, LocalDateTime end);
    List<Sale> findByAmountGreaterThan(double amount);
}