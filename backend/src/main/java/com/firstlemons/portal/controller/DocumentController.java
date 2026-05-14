package com.firstlemons.portal.controller;

import com.firstlemons.portal.model.Document;
import com.firstlemons.portal.model.User;
import com.firstlemons.portal.service.DocumentService;
import com.firstlemons.portal.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<Document>> getDocuments(Authentication auth) {
        User user = userService.getUserByUsername(auth.getName());
        return ResponseEntity.ok(documentService.getDocumentsForUser(user.getId()));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Map<String, String>> download(@PathVariable Long id) {
        Document doc = documentService.getDocumentById(id);
        return ResponseEntity.ok(Map.of("message", "Mock download for: " + doc.getTitle()));
    }
}
