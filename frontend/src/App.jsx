import { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';
import { api } from './api';
import ProductModal from './ProductModal';
import DeleteModal from './DeleteModal';
import { useToast, ToastContainer } from './useToast';

const PAGE_SIZE = 10;

// ─── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav }) {
  const items = [
    { id: 'dashboard', icon: '◈', label: 'Dashboard' },
    { id: 'products',  icon: '⊞', label: 'Products' },
  ];
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>EC<span>OM</span></h1>
        <p>ADMIN PANEL</p>
      </div>
      <nav className="sidebar-nav">
        <div className="nav-label">Navigation</div>
        {items.map(i => (
          <button
            key={i.id}
            className={`nav-item ${active === i.id ? 'active' : ''}`}
            onClick={() => onNav(i.id)}
          >
            <span className="icon">{i.icon}</span>
            {i.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

// ─── Stock bar ───────────────────────────────────────────────────────────────
function StockBar({ stock }) {
  const max = 200;
  const pct = Math.min((stock / max) * 100, 100);
  const low = stock < 20;
  return (
    <div className="stock-bar-wrap">
      <span style={{ fontFamily: 'var(--mono)', fontSize: 12 }}>{stock}</span>
      <div className="stock-bar">
        <div className={`stock-bar-fill ${low ? 'low' : ''}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Dashboard view ──────────────────────────────────────────────────────────
function Dashboard({ stats, onNav }) {
  return (
    <>
      <div className="stats">
        <div className="stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value">{stats.total ?? '—'}</div>
          <div className="stat-sub">All active listings</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Categories</div>
          <div className="stat-value">{stats.categories ?? '—'}</div>
          <div className="stat-sub">Product categories</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Stock</div>
          <div className="stat-value" style={{ color: stats.lowStock > 0 ? 'var(--danger)' : 'inherit' }}>
            {stats.lowStock ?? '—'}
          </div>
          <div className="stat-sub">Items below 20 units</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Price</div>
          <div className="stat-value" style={{ fontSize: 22 }}>
            {stats.avgPrice != null ? `$${stats.avgPrice.toFixed(2)}` : '—'}
          </div>
          <div className="stat-sub">Across all products</div>
        </div>
      </div>

      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⊞</div>
        <h2 style={{ marginBottom: 8 }}>Manage Your Products</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>
          View, create, update, and delete products from the Products section.
        </p>
        <button className="btn btn-primary" onClick={() => onNav('products')}>
          Go to Products →
        </button>
      </div>
    </>
  );
}

// ─── Products view ───────────────────────────────────────────────────────────
function Products({ onAddClick, onEditClick, onDeleteClick, products, loading, page, totalPages, totalElements, onPageChange, search, onSearchChange }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Products</h2>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              placeholder="Search products..."
              value={search}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={onAddClick}>
            ＋ Add Product
          </button>
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="loading-center"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📦</div>
            <h3>No products found</h3>
            <p>{search ? 'Try a different search term' : 'Add your first product to get started'}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className="mono" style={{ color: 'var(--muted)' }}>{p.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.name}</div>
                    {p.description && (
                      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                        {p.description.slice(0, 50)}{p.description.length > 50 ? '…' : ''}
                      </div>
                    )}
                  </td>
                  <td className="mono">{p.sku}</td>
                  <td>
                    {p.categoryName
                      ? <span className="badge badge-cat">{p.categoryName}</span>
                      : <span className="badge badge-gray">—</span>}
                  </td>
                  <td className="price">${parseFloat(p.price).toFixed(2)}</td>
                  <td><StockBar stock={p.stock} /></td>
                  <td>
                    <span className={`badge ${p.active ? 'badge-green' : 'badge-red'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => onEditClick(p)}>✏️</button>
                      <button className="btn btn-danger btn-icon" title="Delete" onClick={() => onDeleteClick(p)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <span className="page-info">
            Showing {products.length} of {totalElements} products
          </span>
          <button className="page-btn" disabled={page === 0} onClick={() => onPageChange(page - 1)}>← Prev</button>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--muted)' }}>
            {page + 1} / {totalPages}
          </span>
          <button className="page-btn" disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({});

  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const { toasts, addToast } = useToast();
  const searchTimer = useRef(null);

  // Fetch products
  const fetchProducts = useCallback(async (p = 0, q = '') => {
    setLoading(true);
    try {
      const data = await api.getProducts(q, p, PAGE_SIZE);
      setProducts(data.content);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);

      // Derive stats from first page load
      if (p === 0 && !q) {
        const cats = [...new Set(data.content.map(x => x.categoryName).filter(Boolean))];
        const low = data.content.filter(x => x.stock < 20).length;
        const avg = data.content.length
          ? data.content.reduce((s, x) => s + parseFloat(x.price), 0) / data.content.length
          : 0;
        setStats({ total: data.totalElements, categories: cats.length, lowStock: low, avgPrice: avg });
        setCategories(cats.map((name, id) => ({ id: id + 1, name })));
      }
    } catch (e) {
      addToast('Failed to load products: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchProducts(0, ''); }, [fetchProducts]);

  // Debounced search
  const handleSearch = (val) => {
    setSearch(val);
    setPage(0);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchProducts(0, val), 400);
  };

  const handlePage = (p) => { setPage(p); fetchProducts(p, search); };

  // Create
  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await api.createProduct(data);
      addToast('Product created successfully!');
      setShowAdd(false);
      fetchProducts(page, search);
    } catch (e) {
      addToast('Create failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Update
  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      await api.updateProduct(editProduct.id, data);
      addToast('Product updated!');
      setEditProduct(null);
      fetchProducts(page, search);
    } catch (e) {
      addToast('Update failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    setSaving(true);
    try {
      await api.deleteProduct(deleteProduct.id);
      addToast('Product deleted.');
      setDeleteProduct(null);
      fetchProducts(page, search);
    } catch (e) {
      addToast('Delete failed: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const topbarTitles = { dashboard: 'Dashboard', products: 'Product Management' };

  return (
    <div className="app">
      <Sidebar active={view} onNav={setView} />
      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{topbarTitles[view]}</div>
          <div className="topbar-actions">
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
              API: {import.meta.env.VITE_API_URL || 'http://localhost:8080'}
            </span>
          </div>
        </div>

        <div className="content">
          {view === 'dashboard' && (
            <Dashboard stats={stats} onNav={setView} />
          )}
          {view === 'products' && (
            <Products
              products={products}
              loading={loading}
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              onPageChange={handlePage}
              search={search}
              onSearchChange={handleSearch}
              onAddClick={() => setShowAdd(true)}
              onEditClick={setEditProduct}
              onDeleteClick={setDeleteProduct}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAdd && (
        <ProductModal
          product={null}
          categories={categories}
          onSave={handleCreate}
          onClose={() => setShowAdd(false)}
          loading={saving}
        />
      )}
      {editProduct && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onSave={handleUpdate}
          onClose={() => setEditProduct(null)}
          loading={saving}
        />
      )}
      {deleteProduct && (
        <DeleteModal
          product={deleteProduct}
          onConfirm={handleDelete}
          onClose={() => setDeleteProduct(null)}
          loading={saving}
        />
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
