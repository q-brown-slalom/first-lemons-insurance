package com.firstlemons.portal.controller;

import com.firstlemons.portal.model.User;
import com.firstlemons.portal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<User> getMe(Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateMe(Authentication auth, @RequestBody User updates) {
        User current = userService.getUserByUsername(auth.getName());
        User updated = userService.updateUser(current.getId(), updates);
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(Authentication auth) {
        User current = userService.getUserByUsername(auth.getName());
        if (!"ADMIN".equals(current.getRole())) {
            return ResponseEntity.status(403).build();
        }
        List<User> users = userService.getAllUsers();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }
}
