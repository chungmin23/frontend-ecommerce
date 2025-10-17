import { useState, useEffect } from 'react'
import { getOrderList, updateOrderStatus } from '@/api/adminApi'

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    newOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
  })
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await getOrderList({ page: 1, size: 100 })
      const orderList = response.data.dtoList
      setOrders(orderList)

      // Calculate stats
      const newCount = orderList.filter(o => o.status === 'PENDING').length
      const pendingCount = orderList.filter(o => o.status === 'PROCESSING').length
      const deliveredCount = orderList.filter(o => o.status === 'DELIVERED').length

      setStats({
        newOrders: newCount,
        pendingOrders: pendingCount,
        deliveredOrders: deliveredCount,
      })
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    }
  }

  const handleStatusChange = async (ono: number, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(ono, newStatus)
      alert('Order status updated successfully!')
      fetchOrders()
    } catch (error) {
      console.error('Failed to update order status:', error)
      alert('Failed to update order status. Please try again.')
    }
  }

  const getFilteredOrders = () => {
    switch (activeTab) {
      case 'pending':
        return orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING')
      case 'delivered':
        return orders.filter(o => o.status === 'DELIVERED')
      case 'cancelled':
        return orders.filter(o => o.status === 'CANCELLED')
      default:
        return orders
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'text-green-600 bg-green-50'
      case 'CANCELLED':
        return 'text-red-600 bg-red-50'
      case 'PROCESSING':
      case 'PENDING':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredOrders = getFilteredOrders()

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        Orders
        <span className="text-2xl">😍</span>
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-gray-600 text-sm mb-2">New Orders</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-blue-600">{stats.newOrders}</p>
            <div className="text-sm text-gray-600">
              Impression · 20% ↑
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-gray-600 text-sm mb-2">Pending Orders</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-purple-600">{stats.pendingOrders}</p>
            <div className="text-sm text-gray-600">
              Impression · 11% ↑
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-6">
          <h3 className="text-gray-600 text-sm mb-2">Delivered Orders</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-orange-600">{stats.deliveredOrders}</p>
            <div className="text-sm text-gray-600">
              Impression · 18% ↑
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'all'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'pending'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Pending Orders
        </button>
        <button
          onClick={() => setActiveTab('delivered')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'delivered'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Delivered Orders
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`pb-3 px-1 font-medium transition-colors ${
            activeTab === 'cancelled'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Cancelled Orders
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Order ID
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Ordered Date
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Customer
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Total Price
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.ono} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  #{order.ono}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.orderDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.memberEmail || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  ${order.totalAmount} USD
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status === 'DELIVERED' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {order.status === 'CANCELLED' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                    {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    )}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.ono, e.target.value as OrderStatus)}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  )
}
