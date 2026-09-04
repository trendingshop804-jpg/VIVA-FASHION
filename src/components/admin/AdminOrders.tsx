import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  Banknote,
  CreditCard,
  User,
  MapPin,
  XCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useCart } from '../../context/CartContext';
import { StoreService } from '../../services/storeService';
import type { Order, OrderStatus, PaymentStatus } from '../../types';

export const AdminOrders: React.FC = () => {
  const { orders, refreshOrders, adminUser } = useAdmin();
  const { currencySymbol, showToast } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.cashfreeOrderId && o.cashfreeOrderId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.cashfreePaymentId && o.cashfreePaymentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.orderStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment = paymentFilter === 'all' || o.paymentMethod.toLowerCase() === paymentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      await StoreService.updateOrderStatus(orderId, newStatus);
      await refreshOrders();
      showToast(`Order status updated to ${newStatus}`, 'success');
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
      }
    } catch {
      showToast('Failed to update status', 'warn');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkCodPaid = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const adminName = adminUser?.name || 'Admin';
      await StoreService.updatePaymentStatus(orderId, 'paid', {
        paidAt: new Date().toISOString(),
        paidBy: adminName,
      });
      await refreshOrders();
      showToast(`COD Payment marked as RECEIVED for order!`, 'success');
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, paymentStatus: 'paid', paidAt: new Date().toISOString(), paidBy: adminName } : null);
      }
    } catch {
      showToast('Failed to mark payment received', 'warn');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Confirmed':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF7F2] p-5 rounded-2xl border border-[#DEC3B5]/60 shadow-2xs">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-[#191E28] font-serif flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#C27D6E]" />
            <span>Order Management & Payment Pipeline</span>
          </h2>
          <p className="text-xs text-[#555E6C] mt-0.5">
            Monitor Razorpay online payments, Cash on Delivery collection, and fulfillment.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#DEC3B5]/60 flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order #, customer, Razorpay ID..."
            className="w-full bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#C27D6E]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            <option value="all">All Order Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#FAF7F2] border border-[#DEC3B5] rounded-lg px-3 py-1.5 text-xs font-semibold"
          >
            <option value="all">All Payment Methods</option>
            <option value="cashfree">Cashfree Payments</option>
            <option value="razorpay">Razorpay Online</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-[#DEC3B5]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#EAE3D9] text-[#71717A] text-[10px] uppercase tracking-wider font-bold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4">Order Status</th>
                <th className="py-3 px-4">Total Amount</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FAF4EC]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-[#71717A]">
                    No orders matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF7F2]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#191E28]">
                      {ord.orderNumber}
                      {ord.cashfreePaymentId && (
                        <span className="text-[9px] text-[#A66355] font-mono block">
                          CF: {ord.cashfreePaymentId}
                        </span>
                      )}
                      {ord.razorpayPaymentId && (
                        <span className="text-[9px] text-blue-700 font-mono block">
                          RZP: {ord.razorpayPaymentId}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#191E28]">{ord.customerName}</div>
                      <div className="text-[10px] text-[#71717A]">{ord.customerEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      {ord.paymentMethod === 'cashfree' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                          <CreditCard size={11} /> Cashfree
                        </span>
                      ) : ord.paymentMethod === 'razorpay' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[10px]">
                          <CreditCard size={11} /> Razorpay
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[10px]">
                          <Banknote size={11} /> Cash on Delivery
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPaymentBadge(ord.paymentStatus)}`}>
                        {ord.paymentStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.orderStatus}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-md border cursor-pointer ${getStatusBadge(ord.orderStatus)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#191E28]">
                      {currencySymbol}{ord.total.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-[#71717A] text-[11px]">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      {/* Mark COD Payment Received Action */}
                      {ord.paymentMethod === 'cod' && ord.paymentStatus !== 'paid' && (
                        <button
                          onClick={() => handleMarkCodPaid(ord.id)}
                          disabled={updatingId === ord.id}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2 py-1 rounded font-bold transition-colors shadow-2xs"
                          title="Mark COD Cash Collected"
                        >
                          Mark Paid
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 bg-[#FAF7F2] text-[#191E28] hover:bg-[#EAD7CD] rounded border border-[#DEC3B5] transition-colors"
                        title="View details"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-[#191E28]/70 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)} />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#DEC3B5] overflow-hidden text-xs">
              
              {/* Header */}
              <div className="p-4 bg-[#F5EBE6] border-b border-[#EAE3D9] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-[#191E28] uppercase tracking-wider font-serif">
                    Order Details: {selectedOrder.orderNumber}
                  </h3>
                  <span className="text-[10px] text-[#71717A]">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-1 text-[#191E28] hover:bg-[#EAD7CD] rounded-full">
                  <XCircle size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                
                {/* Status Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-[#DEC3B5]/60 text-center">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#71717A] block">Payment Method</span>
                    <strong className="text-[#191E28] uppercase">{selectedOrder.paymentMethod}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#71717A] block">Payment Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPaymentBadge(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#71717A] block">Order Status</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadge(selectedOrder.orderStatus)}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#71717A] block">Grand Total</span>
                    <strong className="text-[#191E28] text-sm">{currencySymbol}{selectedOrder.total.toLocaleString()}</strong>
                  </div>
                </div>

                {/* Transaction IDs */}
                {selectedOrder.cashfreePaymentId && (
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-900 block text-[11px]">Cashfree Payment Details</span>
                    <div className="grid grid-cols-2 text-[11px] text-emerald-800">
                      <div>Cashfree Order ID: <code className="font-mono font-bold">{selectedOrder.cashfreeOrderId || selectedOrder.orderNumber}</code></div>
                      <div>Cashfree Payment ID: <code className="font-mono font-bold">{selectedOrder.cashfreePaymentId}</code></div>
                    </div>
                  </div>
                )}

                {selectedOrder.razorpayPaymentId && (
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 space-y-1">
                    <span className="font-bold text-blue-900 block text-[11px]">Razorpay Payment Details</span>
                    <div className="grid grid-cols-2 text-[11px] text-blue-800">
                      <div>Razorpay Order ID: <code className="font-mono font-bold">{selectedOrder.razorpayOrderId}</code></div>
                      <div>Razorpay Payment ID: <code className="font-mono font-bold">{selectedOrder.razorpayPaymentId}</code></div>
                    </div>
                  </div>
                )}

                {/* Customer & Shipping */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-[#DEC3B5]/60 space-y-1">
                    <h5 className="font-bold uppercase tracking-wider text-[#A66355] text-[10px] border-b border-[#EAE3D9] pb-1 flex items-center gap-1">
                      <User size={12} /> Customer Information
                    </h5>
                    <div className="font-bold text-[#191E28]">{selectedOrder.customerName}</div>
                    <div className="text-[#71717A]">{selectedOrder.customerEmail}</div>
                    <div className="text-[#71717A]">{selectedOrder.customerPhone || 'N/A'}</div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-[#DEC3B5]/60 space-y-1">
                    <h5 className="font-bold uppercase tracking-wider text-[#A66355] text-[10px] border-b border-[#EAE3D9] pb-1 flex items-center gap-1">
                      <MapPin size={12} /> Shipping Address
                    </h5>
                    <div className="text-[#191E28]">
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                    </div>
                  </div>
                </div>

                {/* Items Snapshot */}
                <div className="bg-white p-3.5 rounded-xl border border-[#DEC3B5]/60 space-y-2">
                  <h5 className="font-bold uppercase tracking-wider text-[#A66355] text-[10px] border-b border-[#EAE3D9] pb-1">
                    Order Items Snapshot
                  </h5>
                  <div className="space-y-2">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2]">
                        <div className="flex items-center gap-2.5">
                          {it.image && <img src={it.image} alt={it.name} className="w-9 h-11 rounded object-cover border" />}
                          <div>
                            <span className="font-bold text-[#191E28] block">{it.name}</span>
                            <span className="text-[10px] text-[#71717A]">Size: {it.size} • Color: {it.color} • Qty: {it.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-[#191E28]">{currencySymbol}{(it.price * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-white p-3.5 rounded-xl border border-[#DEC3B5]/60 space-y-1.5 text-right">
                  <div className="flex justify-between"><span>Subtotal:</span><span>{currencySymbol}{selectedOrder.subtotal.toLocaleString()}</span></div>
                  {selectedOrder.discount > 0 && <div className="flex justify-between text-emerald-700"><span>Discount:</span><span>-{currencySymbol}{selectedOrder.discount.toLocaleString()}</span></div>}
                  <div className="flex justify-between"><span>Shipping:</span><span>{currencySymbol}{selectedOrder.shippingCost.toLocaleString()}</span></div>
                  {selectedOrder.codFee > 0 && <div className="flex justify-between text-amber-800"><span>COD Fee:</span><span>+{currencySymbol}{selectedOrder.codFee.toLocaleString()}</span></div>}
                  <div className="flex justify-between"><span>GST Tax:</span><span>{currencySymbol}{selectedOrder.tax.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-sm text-[#191E28] pt-1.5 border-t border-[#EAE3D9]"><span>Grand Total:</span><span>{currencySymbol}{selectedOrder.total.toLocaleString()}</span></div>
                </div>

                {/* Admin Actions */}
                {selectedOrder.paymentMethod === 'cod' && selectedOrder.paymentStatus !== 'paid' && (
                  <button
                    onClick={() => handleMarkCodPaid(selectedOrder.id)}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold uppercase tracking-wider"
                  >
                    Mark COD Cash Collected (Set Status = Paid)
                  </button>
                )}

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
