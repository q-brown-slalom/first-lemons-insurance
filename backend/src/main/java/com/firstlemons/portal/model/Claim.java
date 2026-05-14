package com.firstlemons.portal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String description;
    private String claimType; // MEDICAL, EQUIPMENT, INSPECTION, SUPPLY
    private LocalDate dateOfService;
    private BigDecimal amount;
    private String status; // PENDING, APPROVED, DENIED
    private LocalDateTime createdAt;
}
