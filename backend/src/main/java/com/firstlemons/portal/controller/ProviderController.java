package com.firstlemons.portal.controller;

import com.firstlemons.portal.model.Provider;
import com.firstlemons.portal.service.ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/providers")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderService providerService;

    @GetMapping
    public ResponseEntity<List<Provider>> getProviders(@RequestParam(required = false) String type) {
        return ResponseEntity.ok(providerService.getProviders(type));
    }
}
