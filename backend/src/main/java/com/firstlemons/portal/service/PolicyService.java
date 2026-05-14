package com.firstlemons.portal.service;

import com.firstlemons.portal.model.Policy;
import com.firstlemons.portal.repository.PolicyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PolicyService {

    private final PolicyRepository policyRepository;

    public Optional<Policy> getPolicyForUser(Long userId) {
        return policyRepository.findByUserId(userId);
    }

    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }
}
