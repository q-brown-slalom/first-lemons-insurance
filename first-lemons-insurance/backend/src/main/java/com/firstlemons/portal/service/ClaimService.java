package com.firstlemons.portal.service;

import com.firstlemons.portal.dto.ClaimRequest;
import com.firstlemons.portal.model.Claim;
import com.firstlemons.portal.repository.ClaimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private final ClaimRepository claimRepository;

    public List<Claim> getClaimsForUser(Long userId) {
        return claimRepository.findByUserId(userId);
    }

    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Claim submitClaim(Long userId, ClaimRequest req) {
        Claim claim = new Claim();
        claim.setUserId(userId);
        claim.setDescription(req.getDescription());
        claim.setClaimType(req.getClaimType());
        claim.setDateOfService(req.getDateOfService());
        claim.setAmount(req.getAmount());
        claim.setStatus("PENDING");
        claim.setCreatedAt(LocalDateTime.now());
        return claimRepository.save(claim);
    }

    public Claim getClaimById(Long id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found: " + id));
    }
}
