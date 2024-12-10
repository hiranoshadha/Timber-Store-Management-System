package com.timberstore.controller;

import com.timberstore.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin
public class AnalyticsController {
    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics() {
        return ResponseEntity.ok(analyticsService.generateDashboardAnalytics());
    }

    @GetMapping("/financial-report")
    public ResponseEntity<Map<String, Object>> getMonthlyFinancialReport() {
        return ResponseEntity.ok(analyticsService.getMonthlyFinancialReport());
    }
}
