package com.firstlemons.portal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "policies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Policy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String planName;
    private BigDecimal deductible;
    private BigDecimal outOfPocketMax;
    private Integer coinsurancePercent;
    private LocalDate effectiveDate;
    private LocalDate expirationDate;
    private String status; // ACTIVE, INACTIVE
}
