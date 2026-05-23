package com.ecommerce.product.dto;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class ProductRequest {
    @NotBlank String name;
    String description;
    @NotNull @DecimalMin("0.0") BigDecimal price;
    @NotNull @Min(0) Integer stock;
    @NotBlank String sku;
    Long categoryId;
}
