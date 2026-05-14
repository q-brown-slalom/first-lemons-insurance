package com.firstlemons.portal.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ClaimRequest {
    private String description;
    private String claimType;
    private LocalDate dateOfService;
    private BigDecimal amount;
}
