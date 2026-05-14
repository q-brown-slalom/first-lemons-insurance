package com.firstlemons.portal.controller;

import com.firstlemons.portal.model.User;
import com.firstlemons.portal.service.PolicyService;
import com.firstlemons.portal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/policy")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<?> getPolicy(Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        if ("ADMIN".equals(user.getRole())) {
            return ResponseEntity.ok(policyService.getAllPolicies());
        }
        return ResponseEntity.ok(policyService.getPolicyForUser(user.getId()).orElse(null));
    }
}
