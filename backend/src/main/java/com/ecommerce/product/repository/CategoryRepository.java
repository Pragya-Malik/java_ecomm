package com.ecommerce.product.repository;
import com.ecommerce.product.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CategoryRepository extends JpaRepository<Category, Long> {}
