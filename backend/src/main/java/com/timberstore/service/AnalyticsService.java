package com.timberstore.service;

import com.timberstore.model.*;
import com.timberstore.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private StockTransactionRepository stockTransactionRepository;
    @Autowired
    private PurchaseRepository purchaseRepository;
    @Autowired
    private SaleRepository saleRepository;

    public Map<String, Object> generateDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        // Total Products
        analytics.put("totalProducts", productRepository.count());

        // Stock Overview
        analytics.put("stockSummary", calculateStockSummary());

        // Sales Analytics
        analytics.put("salesAnalytics", calculateSalesAnalytics());

        // Purchase Analytics
        analytics.put("purchaseAnalytics", calculatePurchaseAnalytics());

        // Top Products by Movement
        analytics.put("topProductsByMovement", getTopProductsByStockMovement());

        return analytics;
    }

    private Map<String, Double> calculateStockSummary() {
        Map<String, Double> stockSummary = new HashMap<>();
        List<StockTransaction> transactions = stockTransactionRepository.findAll();

        double totalAddedStock = transactions.stream()
            .filter(t -> t.getTransactionType() == StockTransaction.TransactionType.ADD)
            .mapToDouble(StockTransaction::getQuantity)
            .sum();

        double totalRemovedStock = transactions.stream()
            .filter(t -> t.getTransactionType() == StockTransaction.TransactionType.REMOVE)
            .mapToDouble(StockTransaction::getQuantity)
            .sum();

        stockSummary.put("totalAddedStock", totalAddedStock);
        stockSummary.put("totalRemovedStock", totalRemovedStock);
        stockSummary.put("netStockChange", totalAddedStock - totalRemovedStock);

        return stockSummary;
    }

    private Map<String, Double> calculateSalesAnalytics() {
        List<Sale> sales = saleRepository.findAll();
        Map<String, Double> salesAnalytics = new HashMap<>();

        double totalSalesAmount = sales.stream()
            .mapToDouble(Sale::getAmount)
            .sum();

        salesAnalytics.put("totalSalesAmount", totalSalesAmount);
        salesAnalytics.put("averageSaleAmount", sales.isEmpty() ? 0 : totalSalesAmount / sales.size());
        salesAnalytics.put("totalSalesCount", (double) sales.size());

        return salesAnalytics;
    }

    private Map<String, Double> calculatePurchaseAnalytics() {
        List<Purchase> purchases = purchaseRepository.findAll();
        Map<String, Double> purchaseAnalytics = new HashMap<>();

        double totalPurchaseAmount = purchases.stream()
            .mapToDouble(Purchase::getAmount)
            .sum();

        purchaseAnalytics.put("totalPurchaseAmount", totalPurchaseAmount);
        purchaseAnalytics.put("averagePurchaseAmount", purchases.isEmpty() ? 0 : totalPurchaseAmount / purchases.size());
        purchaseAnalytics.put("totalPurchaseCount", (double) purchases.size());

        return purchaseAnalytics;
    }

    private List<Map<String, Object>> getTopProductsByStockMovement() {
        List<StockTransaction> transactions = stockTransactionRepository.findAll();
        Map<Product, Double> productMovements = new HashMap<>();

        transactions.forEach(transaction -> {
            Product product = transaction.getProduct();
            double quantity = transaction.getQuantity() * 
                (transaction.getTransactionType() == StockTransaction.TransactionType.ADD ? 1 : -1);
            productMovements.merge(product, Math.abs(quantity), Double::sum);
        });

        return productMovements.entrySet().stream()
            .map(entry -> {
                Map<String, Object> movement = new HashMap<>();
                movement.put("productCode", entry.getKey().getProductCode());
                movement.put("productName", entry.getKey().getProductName());
                movement.put("totalMovement", entry.getValue());
                return movement;
            })
            .sorted((a, b) -> Double.compare((Double) b.get("totalMovement"), (Double) a.get("totalMovement")))
            .limit(5)
            .collect(Collectors.toList());
    }

    public Map<String, Object> getMonthlyFinancialReport() {
        Map<String, Object> report = new HashMap<>();
        
        Map<String, Double> monthlySales = saleRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                sale -> sale.getSaleTime().getMonth().toString(),
                Collectors.summingDouble(Sale::getAmount)
            ));

        Map<String, Double> monthlyPurchases = purchaseRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                purchase -> purchase.getPurchaseTime().getMonth().toString(),
                Collectors.summingDouble(Purchase::getAmount)
            ));

        report.put("monthlySales", monthlySales);
        report.put("monthlyPurchases", monthlyPurchases);

        return report;
    }
}
