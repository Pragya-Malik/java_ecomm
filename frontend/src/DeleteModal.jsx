export default function DeleteModal({ product, onConfirm, onClose, loading }) {
  if (!product) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: 380 }}>
        <div className="modal-header">
          <h3>🗑️ Delete Product</h3>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: 'var(--text)' }}>{product.name}</strong>?{' '}
            This will soft-delete the product and it won't appear in listings.
          </p>
          <div style={{
            marginTop: 14,
            padding: '10px 14px',
            background: 'rgba(239,68,68,0.08)',
            borderRadius: 'var(--radius)',
            border: '1px solid rgba(239,68,68,0.2)',
            fontFamily: 'var(--mono)',
            fontSize: 12,
            color: 'var(--danger)',
          }}>
            SKU: {product.sku}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
