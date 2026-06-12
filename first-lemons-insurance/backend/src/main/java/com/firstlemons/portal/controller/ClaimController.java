package com.firstlemons.portal.controller;

import com.firstlemons.portal.dto.ClaimRequest;
import com.firstlemons.portal.model.Claim;
import com.firstlemons.portal.model.User;
import com.firstlemons.portal.service.ClaimService;
import com.firstlemons.portal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Claim>> getClaims(Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        if ("OWNER".equals(user.getRole()) || "ADMIN".equals(user.getRole())) {
            return ResponseEntity.ok(claimService.getAllClaims());
        }
        return ResponseEntity.ok(claimService.getClaimsForUser(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Claim> submitClaim(Authentication auth, @RequestBody ClaimRequest request) {
        User user = userService.getUserByUsername(auth.getName());
        return ResponseEntity.ok(claimService.submitClaim(user.getId(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Claim> getClaim(@PathVariable Long id, Authentication auth) {
        Claim claim = claimService.getClaimById(id);
        User user = userService.getUserByUsername(auth.getName());
        if (!"ADMIN".equals(user.getRole()) && !"OWNER".equals(user.getRole())
                && !claim.getUserId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(claim);
    }
}
