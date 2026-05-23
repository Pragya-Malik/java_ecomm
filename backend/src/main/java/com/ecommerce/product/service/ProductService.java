package com.ecommerce.product.service;
import com.ecommerce.product.dto.*;
import com.ecommerce.product.model.*;
import com.ecommerce.product.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
@Service @RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepo;
    private final CategoryRepository categoryRepo;
    public Page<ProductResponse> list(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepo.searchActive(search, pageable).map(this::toResponse);
    }
    public ProductResponse getById(Long id) { return toResponse(findOrThrow(id)); }
    @Transactional
    public ProductResponse create(ProductRequest req) {
        if (productRepo.existsBySku(req.getSku()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "SKU already exists");
        Product p = Product.builder()
            .name(req.getName()).description(req.getDescription())
            .price(req.getPrice()).stock(req.getStock()).sku(req.getSku())
            .category(req.getCategoryId() != null ? categoryRepo.findById(req.getCategoryId()).orElse(null) : null)
            .build();
        return toResponse(productRepo.save(p));
    }
    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product p = findOrThrow(id);
        p.setName(req.getName()); p.setDescription(req.getDescription());
        p.setPrice(req.getPrice()); p.setStock(req.getStock());
        if (req.getCategoryId() != null) p.setCategory(categoryRepo.findById(req.getCategoryId()).orElse(null));
        return toResponse(productRepo.save(p));
    }
    @Transactional
    public void delete(Long id) { Product p = findOrThrow(id); p.setActive(false); productRepo.save(p); }
    private Product findOrThrow(Long id) {
        return productRepo.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }
    private ProductResponse toResponse(Product p) {
        return ProductResponse.builder()
            .id(p.getId()).name(p.getName()).description(p.getDescription())
            .price(p.getPrice()).stock(p.getStock()).sku(p.getSku())
            .categoryName(p.getCategory() != null ? p.getCategory().getName() : null)
            .active(p.isActive()).createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt()).build();
    }
}
