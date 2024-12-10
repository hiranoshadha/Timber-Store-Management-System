package com.timberstore.service;

import com.timberstore.model.Sale;
import com.timberstore.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {
    @Autowired
    private SaleRepository saleRepository;

    @Transactional
    public Sale createSale(Sale sale) {
        sale.setSaleTime(LocalDateTime.now());
        return saleRepository.save(sale);
    }

    public Sale getSale(Long id) {
        return saleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sale not found"));
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    @Transactional
    public Sale updateSale(Long id, Sale saleDetails) {
        Sale sale = getSale(id);
        sale.setDescription(saleDetails.getDescription());
        sale.setAmount(saleDetails.getAmount());
        return saleRepository.save(sale);
    }

    @Transactional
    public void deleteSale(Long id) {
        Sale sale = getSale(id);
        saleRepository.delete(sale);
    }

    public List<Sale> getSalesByDateRange(LocalDateTime start, LocalDateTime end) {
        return saleRepository.findBySaleTimeBetween(start, end);
    }
}
