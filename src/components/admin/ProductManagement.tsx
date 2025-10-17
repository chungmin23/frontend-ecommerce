import { useState, useEffect } from 'react'
import { getProductList } from '@/api/productApi'
import { createProduct, updateProduct, deleteProduct } from '@/api/adminApi'

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    pname: '',
    pdesc: '',
    price: '',
    stock: '',
  })
  const [imageFiles, setImageFiles] = useState<FileList | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await getProductList({ page: 1, size: 100 })
      setProducts(response.data.dtoList)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formDataObj = new FormData()
    formDataObj.append('pname', formData.pname)
    formDataObj.append('pdesc', formData.pdesc)
    formDataObj.append('price', formData.price)
    formDataObj.append('stock', formData.stock)

    if (imageFiles) {
      Array.from(imageFiles).forEach((file) => {
        formDataObj.append('files', file)
      })
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.pno, formDataObj)
        alert('Product updated successfully!')
      } else {
        await createProduct(formDataObj)
        alert('Product created successfully!')
      }
      setShowModal(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product. Please try again.')
    }
  }

  const handleDelete = async (pno: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(pno)
      alert('Product deleted successfully!')
      fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product. Please try again.')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      pname: product.pname,
      pdesc: product.pdesc,
      price: product.price.toString(),
      stock: product.stock?.toString() || '',
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({ pname: '', pdesc: '', price: '', stock: '' })
    setImageFiles(null)
    setEditingProduct(null)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Product Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.pno} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">#{product.pno}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.pname}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{product.pdesc}</td>
                <td className="px-6 py-4 text-sm text-gray-900">${product.price}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{product.stock || 'N/A'}</td>
                <td className="px-6 py-4 text-sm">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.pno)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.pname}
                  onChange={(e) => setFormData({ ...formData, pname: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.pdesc}
                  onChange={(e) => setFormData({ ...formData, pdesc: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImageFiles(e.target.files)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
