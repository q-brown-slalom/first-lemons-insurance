package com.firstlemons.portal.config;

import com.firstlemons.portal.model.*;
import com.firstlemons.portal.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;
    private final BillRepository billRepository;
    private final ProviderRepository providerRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String hash = passwordEncoder.encode("password");

        User alice = userRepository.save(new User(null, "alice", hash, "EMPLOYEE",
                "Alice", "Lemonhart", "alice@lemonade.com", "555-0101", null));
        User bob = userRepository.save(new User(null, "bob", hash, "OWNER",
                "Bob", "Citruski", "bob@freshsqueeze.com", "555-0102", "Fresh Squeeze Stand"));
        User carol = userRepository.save(new User(null, "carol", hash, "ADMIN",
                "Carol", "Admins", "carol@firstlemons.com", "555-0103", null));

        policyRepository.save(new Policy(null, alice.getId(), "Lemon Basic Plan",
                new BigDecimal("1500.00"), new BigDecimal("5000.00"), 20,
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31), "ACTIVE"));
        policyRepository.save(new Policy(null, bob.getId(), "Stand Owner Premium",
                new BigDecimal("500.00"), new BigDecimal("3000.00"), 10,
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31), "ACTIVE"));
        policyRepository.save(new Policy(null, carol.getId(), "Admin Plan",
                new BigDecimal("0.00"), new BigDecimal("1000.00"), 0,
                LocalDate.of(2024, 1, 1), LocalDate.of(2024, 12, 31), "ACTIVE"));

        claimRepository.save(new Claim(null, alice.getId(),
                "Urgent care visit for burn injury from boiling lemonade",
                "MEDICAL", LocalDate.of(2024, 3, 15), new BigDecimal("350.00"),
                "APPROVED", LocalDateTime.of(2024, 3, 16, 10, 0)));
        claimRepository.save(new Claim(null, alice.getId(),
                "Physical therapy after slip and fall at stand",
                "MEDICAL", LocalDate.of(2024, 4, 20), new BigDecimal("1200.00"),
                "PENDING", LocalDateTime.of(2024, 4, 21, 9, 0)));
        claimRepository.save(new Claim(null, alice.getId(),
                "Eye exam and prescription glasses",
                "MEDICAL", LocalDate.of(2024, 2, 5), new BigDecimal("425.00"),
                "DENIED", LocalDateTime.of(2024, 2, 6, 11, 0)));

        claimRepository.save(new Claim(null, bob.getId(),
                "Juicer equipment malfunction repair",
                "EQUIPMENT", LocalDate.of(2024, 3, 10), new BigDecimal("780.00"),
                "APPROVED", LocalDateTime.of(2024, 3, 11, 8, 0)));
        claimRepository.save(new Claim(null, bob.getId(),
                "Annual health inspection fee reimbursement",
                "INSPECTION", LocalDate.of(2024, 1, 20), new BigDecimal("200.00"),
                "APPROVED", LocalDateTime.of(2024, 1, 21, 14, 0)));
        claimRepository.save(new Claim(null, bob.getId(),
                "Emergency lemon supply replacement after frost damage",
                "SUPPLY", LocalDate.of(2024, 5, 1), new BigDecimal("950.00"),
                "PENDING", LocalDateTime.of(2024, 5, 2, 10, 30)));
        claimRepository.save(new Claim(null, bob.getId(),
                "Doctor visit - back pain from heavy lifting",
                "MEDICAL", LocalDate.of(2024, 4, 15), new BigDecimal("290.00"),
                "APPROVED", LocalDateTime.of(2024, 4, 16, 9, 0)));

        billRepository.save(new Bill(null, alice.getId(), "Monthly Premium - April 2024",
                new BigDecimal("145.00"), LocalDate.of(2024, 4, 1), true,
                LocalDateTime.of(2024, 4, 1, 8, 0)));
        billRepository.save(new Bill(null, alice.getId(), "Monthly Premium - May 2024",
                new BigDecimal("145.00"), LocalDate.of(2024, 5, 1), false, null));
        billRepository.save(new Bill(null, alice.getId(), "Deductible - Urgent Care 03/15",
                new BigDecimal("75.00"), LocalDate.of(2024, 4, 15), false, null));

        billRepository.save(new Bill(null, bob.getId(), "Monthly Premium - April 2024",
                new BigDecimal("310.00"), LocalDate.of(2024, 4, 1), true,
                LocalDateTime.of(2024, 4, 1, 9, 0)));
        billRepository.save(new Bill(null, bob.getId(), "Monthly Premium - May 2024",
                new BigDecimal("310.00"), LocalDate.of(2024, 5, 1), false, null));
        billRepository.save(new Bill(null, bob.getId(), "Equipment Claim Copay",
                new BigDecimal("150.00"), LocalDate.of(2024, 4, 10), true,
                LocalDateTime.of(2024, 4, 10, 10, 0)));

        providerRepository.save(new Provider(null, "Citrus Valley Medical Center",
                "Primary Care", "123 Lemon Grove Ave, Citrusville, CA 90210", "555-1001", "MEDICAL", true));
        providerRepository.save(new Provider(null, "Dr. Zara Lime, MD",
                "Occupational Health", "456 Tangerine Blvd, Fresno, CA 93650", "555-1002", "MEDICAL", true));
        providerRepository.save(new Provider(null, "Squeeze City Urgent Care",
                "Urgent Care", "789 Orange Street, Lemonville, CA 90001", "555-1003", "MEDICAL", false));
        providerRepository.save(new Provider(null, "Citrus Equipment Repair & Supply",
                "Juicers, Stands, Refrigeration", "321 Industrial Lemon Way, Commerce, CA 90022", "555-2001", "STAND_SERVICE", true));
        providerRepository.save(new Provider(null, "Lemon County Health Inspectors",
                "Food Safety & Stand Certification", "1 Government Plaza, Lemon County, CA 90100", "555-2002", "STAND_SERVICE", true));
        providerRepository.save(new Provider(null, "Fresh Supply Co.",
                "Lemons, Sugar, Cups & More", "55 Orchard Road, Sunkist, CA 91350", "555-2003", "STAND_SERVICE", true));

        documentRepository.save(new Document(null, alice.getId(),
                "Alice Lemonhart - Policy Certificate 2024", "POLICY",
                LocalDateTime.of(2024, 1, 1, 0, 0), "/api/documents/1/download"));
        documentRepository.save(new Document(null, alice.getId(),
                "EOB - Urgent Care 03/15/2024", "EOB",
                LocalDateTime.of(2024, 3, 20, 0, 0), "/api/documents/2/download"));
        documentRepository.save(new Document(null, bob.getId(),
                "Bob Citruski - Policy Certificate 2024", "POLICY",
                LocalDateTime.of(2024, 1, 1, 0, 0), "/api/documents/3/download"));
        documentRepository.save(new Document(null, bob.getId(),
                "EOB - Equipment Claim 03/10/2024", "EOB",
                LocalDateTime.of(2024, 3, 15, 0, 0), "/api/documents/4/download"));
        documentRepository.save(new Document(null, null,
                "First Lemons Insurance - Member Handbook 2024", "OTHER",
                LocalDateTime.of(2024, 1, 1, 0, 0), "/api/documents/5/download"));
        documentRepository.save(new Document(null, null,
                "Network Provider Directory 2024", "OTHER",
                LocalDateTime.of(2024, 1, 1, 0, 0), "/api/documents/6/download"));
    }
}
