import { useState, useEffect } from 'react';

const EMPTY = { name: '', description: '', price: '', stock: '', sku: '', categoryId: '' };

export default function ProductModal({ product, categories, onSave, onClose, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        stock: product.stock ?? '',
        sku: product.sku || '',
        categoryId: product.categoryId ?? '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [product]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.sku.trim()) e.sku = 'SKU required';
    if (form.price === '' || isNaN(form.price) || +form.price < 0) e.price = 'Valid price required';
    if (form.stock === '' || isNaN(form.stock) || +form.stock < 0) e.stock = 'Valid stock required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      sku: form.sku,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
    });
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>{product ? '✏️ Edit Product' : '＋ New Product'}</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-control" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Wireless Headphones" />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-control" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short product description..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input className="form-control" type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0.00" />
              {errors.price && <div className="form-error">{errors.price}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Stock *</label>
              <input className="form-control" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} placeholder="0" />
              {errors.stock && <div className="form-error">{errors.stock}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">SKU *</label>
              <input className="form-control" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="e.g. ELEC-001" style={{ fontFamily: 'var(--mono)' }} />
              {errors.sku && <div className="form-error">{errors.sku}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-control" value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
                <option value="">— None —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : (product ? 'Update' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  );
}
