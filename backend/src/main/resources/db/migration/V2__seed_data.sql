INSERT INTO categories (name, description) VALUES
  ('Electronics', 'Electronic devices and accessories'),
  ('Clothing',    'Apparel and fashion items'),
  ('Books',       'Physical and digital books')
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, stock, sku, category_id) VALUES
  ('Wireless Headphones', 'Noise-cancelling BT headphones', 89.99,  50, 'ELEC-001', 1),
  ('USB-C Hub',           '7-in-1 USB-C hub adapter',       34.99, 120, 'ELEC-002', 1),
  ('Cotton T-Shirt',      '100% organic cotton, unisex',     19.99, 200, 'CLTH-001', 2),
  ('Clean Code',          'By Robert C. Martin',             29.99,  30, 'BOOK-001', 3)
ON CONFLICT DO NOTHING;
