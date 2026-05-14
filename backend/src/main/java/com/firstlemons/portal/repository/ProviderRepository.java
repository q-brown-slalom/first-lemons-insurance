package com.firstlemons.portal.repository;

import com.firstlemons.portal.model.Provider;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    List<Provider> findByProviderType(String providerType);
}
