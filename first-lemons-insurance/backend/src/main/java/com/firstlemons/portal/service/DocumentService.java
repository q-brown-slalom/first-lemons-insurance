package com.firstlemons.portal.service;

import com.firstlemons.portal.model.Document;
import com.firstlemons.portal.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    public List<Document> getDocumentsForUser(Long userId) {
        List<Document> combined = new ArrayList<>(documentRepository.findByUserId(userId));
        combined.addAll(documentRepository.findByUserIdIsNull());
        return combined;
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found: " + id));
    }
}
