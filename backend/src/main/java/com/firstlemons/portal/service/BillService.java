package com.firstlemons.portal.service;

import com.firstlemons.portal.model.Bill;
import com.firstlemons.portal.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BillService {

    private final BillRepository billRepository;

    public List<Bill> getBillsForUser(Long userId) {
        return billRepository.findByUserId(userId);
    }

    public Bill payBill(Long billId, Long userId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found: " + billId));
        if (!bill.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied");
        }
        bill.setPaid(true);
        bill.setPaidAt(LocalDateTime.now());
        return billRepository.save(bill);
    }
}
