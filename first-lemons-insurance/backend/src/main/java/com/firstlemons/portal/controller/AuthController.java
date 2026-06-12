package com.firstlemons.portal.controller;

import com.firstlemons.portal.dto.LoginRequest;
import com.firstlemons.portal.dto.LoginResponse;
import com.firstlemons.portal.model.User;
import com.firstlemons.portal.repository.UserRepository;
import com.firstlemons.portal.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok(new LoginResponse(token, user.getRole(), user.getId(), user.getFirstName(), user.getLastName()));
    }
}
