import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { getCartItems, changeCartItem, deleteCartItem } from '../api/cartApi';
import { getProductImage } from '../api/productApi';

interface CartItem {
  cino: number;
  pno: number;
  pname: string;
  price: number;
  qty: number;
  imageFile?: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await getCartItems();
      setCartItems(response.data);
      setSelectedItems(response.data.map((item: CartItem) => item.cino));

      // localStorage 업데이트
      localStorage.setItem('cart', JSON.stringify(response.data));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('장바구니 조회 실패:', error);
      alert('장바구니를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (cino: number, newQty: number) => {
    if (newQty < 1) return;

    try {
      const item = cartItems.find((item) => item.cino === cino);
      if (!item) return;

      const email = localStorage.getItem('userEmail') || 'test@example.com';

      const response = await changeCartItem({
        cino,
        email,
        pno: item.pno,
        qty: newQty,
      });

      setCartItems(response.data);

      // localStorage 업데이트
      localStorage.setItem('cart', JSON.stringify(response.data));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('수량 변경 실패:', error);
      alert('수량 변경에 실패했습니다.');
    }
  };

  const handleRemoveItem = async (cino: number) => {
    if (!window.confirm('해당 상품을 장바구니에서 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await deleteCartItem(cino);
      setCartItems(response.data);
      setSelectedItems(selectedItems.filter((id) => id !== cino));

      // localStorage 업데이트
      localStorage.setItem('cart', JSON.stringify(response.data));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('상품 삭제 실패:', error);
      alert('상품 삭제에 실패했습니다.');
    }
  };

  const handleSelectItem = (cino: number) => {
    setSelectedItems((prev) =>
      prev.includes(cino) ? prev.filter((id) => id !== cino) : [...prev, cino]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.cino));
    }
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cino))
      .reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert('주문할 상품을 선택해주세요.');
      return;
    }

    const orderItems = cartItems
      .filter((item) => selectedItems.includes(item.cino))
      .map((item) => ({
        pno: item.pno,
        pname: item.pname,
        qty: item.qty,
        price: item.price,
      }));

    navigate('/order', { state: { orderItems } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">장바구니</h2>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
          <ShoppingBag className="w-24 h-24 text-gray-300 mb-6" />
          <p className="text-xl text-gray-600 mb-6">장바구니가 비어있습니다.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition transform hover:scale-105"
          >
            쇼핑 계속하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Select All */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedItems.length === cartItems.length}
                  onChange={handleSelectAll}
                  className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="font-semibold text-gray-700">
                  전체 선택 ({selectedItems.length}/{cartItems.length})
                </span>
              </label>
            </div>

            {/* Cart Items List */}
            {cartItems.map((item) => (
              <div
                key={item.cino}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.cino)}
                      onChange={() => handleSelectItem(item.cino)}
                      className="mt-2 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />

                    {/* Product Image */}
                    {item.imageFile && (
                      <img
                        src={getProductImage(item.imageFile)}
                        alt={item.pname}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {item.pname}
                      </h3>
                      <p className="text-2xl font-bold text-purple-600 mb-4">
                        ₩{item.price.toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">수량:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.cino, item.qty - 1)
                            }
                            disabled={item.qty <= 1}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.cino, item.qty + 1)
                            }
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Item Total & Delete */}
                    <div className="flex flex-col items-end gap-4">
                      <button
                        onClick={() => handleRemoveItem(item.cino)}
                        className="p-2 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-1">상품 금액</p>
                        <p className="text-xl font-bold text-gray-900">
                          ₩{(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Fixed Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                주문 요약
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>선택 상품</span>
                  <span>{selectedItems.length}개</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span>₩{calculateTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span className="text-green-600 font-semibold">무료</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    총 결제 금액
                  </span>
                  <span className="text-3xl font-bold text-purple-600">
                    ₩{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedItems.length === 0}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                주문하기
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                쇼핑 계속하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
