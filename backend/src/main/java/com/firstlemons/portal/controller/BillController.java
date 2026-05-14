package com.firstlemons.portal.controller;

import com.firstlemons.portal.model.Bill;
import com.firstlemons.portal.model.User;
import com.firstlemons.portal.service.BillService;
import com.firstlemons.portal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
public class BillController {

    private final BillService billService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Bill>> getBills(Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        return ResponseEntity.ok(billService.getBillsForUser(user.getId()));
    }

    @PostMapping("/{id}/pay")
    public ResponseEntity<Bill> payBill(@PathVariable Long id, Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        return ResponseEntity.ok(billService.payBill(id, user.getId()));
    }
}
