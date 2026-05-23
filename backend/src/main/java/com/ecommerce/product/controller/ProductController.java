package com.ecommerce.product.controller;
import com.ecommerce.product.dto.*;
import com.ecommerce.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/products") @RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    @GetMapping
    public Page<ProductResponse> list(@RequestParam(required=false) String search,
            @RequestParam(defaultValue="0") int page, @RequestParam(defaultValue="20") int size) {
        return productService.list(search, page, size);
    }
    @GetMapping("/{id}") public ProductResponse getById(@PathVariable Long id) { return productService.getById(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public ProductResponse create(@Valid @RequestBody ProductRequest req) { return productService.create(req); }
    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest req) { return productService.update(id, req); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { productService.delete(id); }
}
