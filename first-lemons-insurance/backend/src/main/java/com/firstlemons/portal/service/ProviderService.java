package com.firstlemons.portal.service;

import com.firstlemons.portal.model.Provider;
import com.firstlemons.portal.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProviderService {

    private final ProviderRepository providerRepository;

    public List<Provider> getProviders(String type) {
        if (type != null && !type.isBlank()) {
            return providerRepository.findByProviderType(type);
        }
        return providerRepository.findAll();
    }
}
