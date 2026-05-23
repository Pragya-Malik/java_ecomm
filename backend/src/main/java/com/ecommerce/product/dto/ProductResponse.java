package com.ecommerce.product.dto;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
@Data @Builder
public class ProductResponse {
    Long id; String name; String description;
    BigDecimal price; Integer stock; String sku;
    String categoryName; boolean active;
    OffsetDateTime createdAt; OffsetDateTime updatedAt;
}
