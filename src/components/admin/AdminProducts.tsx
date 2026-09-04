import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  AlertTriangle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';
import { StoreService } from '../../services/storeService';
import { AdminProductModal } from './AdminProductModal';
import type { Product } from '../../types';

export const AdminProducts: React.FC = () => {
  const { products, refreshProducts } = useAdmin();
  const { currencySymbol, showToast } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(query) ||
          (p.sku && p.sku.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query) ||
          (p.fabric && p.fabric.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Stock
      if (stockFilter === 'low' && p.stock > 5) return false;
      if (stockFilter === 'out' && p.stock > 0) return false;
      if (stockFilter === 'in' && p.stock <= 0) return false;

      return true;
    });
  }, [products, searchTerm, selectedCategory, stockFilter]);

  const handleDelete = async (productId: string) => {
    await StoreService.deleteProduct(productId);
    await refreshProducts();
    setDeleteConfirmId(null);
    showToast('Product deleted from store catalog', 'info');
  };

  const handleDuplicate = async (product: Product) => {
    const duplicated: Partial<Product> = {
      ...product,
      id: undefined,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy-${Date.now().toString().slice(-4)}`,
      sku: `${product.sku}-CP`,
    };
    await StoreService.saveProduct(duplicated);
    await refreshProducts();
    showToast(`Duplicated "${product.name}"`, 'success');
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProductIds.length} selected products?`)) return;
    for (const id of selectedProductIds) {
      await StoreService.deleteProduct(id);
    }
    await refreshProducts();
    setSelectedProductIds([]);
    showToast('Selected products deleted', 'info');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif">
            Product Catalog ({products.length})
          </h2>
          <p className="text-xs text-[#555E6C]">
            Manage Kurtis, Shawls, and Leggings listings, inventory, and pricing.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 bg-[#191E28] hover:bg-[#C27D6E] text-white px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors shadow-sm"
        >
          <Plus size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Strip */}
      <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search Bar (6 cols) */}
          <div className="sm:col-span-6 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C93A0]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, SKU, fabric, or category..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg text-xs focus:ring-1 focus:ring-[#C27D6E]"
            />
          </div>

          {/* Category Filter (3 cols) */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg text-xs font-semibold uppercase focus:ring-1 focus:ring-[#C27D6E]"
            >
              <option value="all">All Categories</option>
              <option value="kurtis">Kurtis & Kurtas</option>
              <option value="shawls">Shawls & Dupattas</option>
              <option value="leggings">Leggings & Churidars</option>
            </select>
          </div>

          {/* Stock Filter (3 cols) */}
          <div className="sm:col-span-3">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full py-2 px-3 bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg text-xs font-semibold focus:ring-1 focus:ring-[#C27D6E]"
            >
              <option value="all">All Stock Statuses</option>
              <option value="in">In Stock</option>
              <option value="low">Low Stock (≤ 5)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

        </div>

        {/* Bulk Action Bar */}
        {selectedProductIds.length > 0 && (
          <div className="bg-[#FAF4EC] p-2.5 rounded-lg border border-[#DEC3B5] flex items-center justify-between text-xs">
            <span className="font-bold text-[#191E28]">
              {selectedProductIds.length} product(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs font-semibold"
            >
              <Trash2 size={13} />
              <span>Delete Selected</span>
            </button>
          </div>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#DEC3B5]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#EAE3D9] text-[#71717A] text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedProductIds.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-[#C27D6E]"
                  />
                </th>
                <th className="py-3 px-3">Product</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3">Price</th>
                <th className="py-3 px-3">Stock</th>
                <th className="py-3 px-3">Badges</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF4EC]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs text-[#71717A]">
                    No products match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => toggleSelectOne(product.id)}
                        className="accent-[#C27D6E]"
                      />
                    </td>
                    
                    {/* Image & Title */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-12 rounded object-cover border border-[#DEC3B5] shrink-0"
                        />
                        <div>
                          <div className="font-bold text-[#191E28] line-clamp-1">{product.name}</div>
                          {product.fabric && (
                            <span className="text-[10px] text-[#71717A] line-clamp-1">{product.fabric}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5EBE6] text-[#A66355]">
                        {product.category}
                      </span>
                    </td>

                    {/* SKU */}
                    <td className="py-3 px-3 font-mono text-[11px] text-[#555E6C]">
                      {product.sku || '—'}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#191E28]">
                        {currencySymbol}{product.price.toLocaleString()}
                      </div>
                      {product.salePrice && product.salePrice > product.price && (
                        <div className="text-[10px] text-[#8C93A0] line-through">
                          {currencySymbol}{product.salePrice.toLocaleString()}
                        </div>
                      )}
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-3">
                      {product.stock <= 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                          Out of Stock
                        </span>
                      ) : product.stock <= 5 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                          <AlertTriangle size={10} /> {product.stock} left
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">{product.stock} in stock</span>
                      )}
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-3 space-x-1">
                      {product.isBestSeller && (
                        <span className="px-1.5 py-0.5 bg-[#DCA134]/15 text-[#DCA134] rounded text-[9px] font-bold">
                          Best
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[9px] font-bold">
                          New
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => handleDuplicate(product)}
                        className="p-1.5 text-[#555E6C] hover:text-[#191E28] hover:bg-[#EAD7CD]/40 rounded transition-colors"
                        title="Duplicate product"
                      >
                        <Copy size={14} />
                      </button>

                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-[#555E6C] hover:text-[#C27D6E] hover:bg-[#EAD7CD]/40 rounded transition-colors"
                        title="Edit product"
                      >
                        <Edit2 size={14} />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="p-1.5 text-[#555E6C] hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete product"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit/Add Modal */}
      {isModalOpen && (
        <AdminProductModal
          product={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSaved={refreshProducts}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] p-6 rounded-2xl max-w-sm w-full border border-[#DEC3B5] space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-[#191E28] uppercase tracking-wider">
              Delete Product Confirmation
            </h4>
            <p className="text-xs text-[#555E6C]">
              Are you sure you want to permanently delete this product? This action will remove it from the customer storefront catalog immediately.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-[#DEC3B5] rounded text-xs font-semibold text-[#191E28]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
