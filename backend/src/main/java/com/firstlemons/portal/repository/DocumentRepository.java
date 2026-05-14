package com.firstlemons.portal.repository;

import com.firstlemons.portal.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUserId(Long userId);
    List<Document> findByUserIdIsNull();
}
