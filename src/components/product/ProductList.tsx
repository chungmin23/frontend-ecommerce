import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart as CartIcon } from 'lucide-react';
import { getProductList, getProductImage } from '@/api/productApi';
import { changeCartItem } from '@/api/cartApi';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);
  const [sortOrder, setSortOrder] = useState('recommended');

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProductList({ page, size: 6 });
      setProducts(response.dtoList);
      setTotalPages(response.totalPage);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
      alert('상품 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (productId: number) => {
    setLiked((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = async (product: Product) => {
    try {
      const email = localStorage.getItem('userEmail') || 'test@example.com';

      await changeCartItem({
        email,
        pno: product.pno,
        qty: 1,
      });

      // localStorage에 장바구니 저장 (카운트용)
      const savedCart = localStorage.getItem('cart');
      const cart = savedCart ? JSON.parse(savedCart) : [];
      cart.push(product);
      localStorage.setItem('cart', JSON.stringify(cart));

      // 장바구니 업데이트 이벤트 발생
      window.dispatchEvent(new Event('cartUpdated'));

      alert('장바구니에 추가되었습니다!');
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">


            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105">
              지금 쇼핑하기
            </button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">인기 상품</h3>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="recommended">추천순</option>
            <option value="lowPrice">낮은 가격순</option>
            <option value="highPrice">높은 가격순</option>
            <option value="rating">평점순</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.pno}
              className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    product.uploadFileNames && product.uploadFileNames.length > 0
                      ? getProductImage(product.uploadFileNames[0])
                      : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'
                  }
                  alt={product.pname}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                  onClick={() => navigate(`/products/${product.pno}`)}
                />
                <button
                  onClick={() => toggleLike(product.pno)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      liked.includes(product.pno)
                        ? 'fill-pink-500 text-pink-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              <div className="p-5">
                <h4
                  className="font-semibold text-lg mb-2 text-gray-900 cursor-pointer hover:text-purple-600"
                  onClick={() => navigate(`/products/${product.pno}`)}
                >
                  {product.pname}
                </h4>
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-600">4.5</span>
                  <span className="ml-1 text-sm text-gray-400">(120)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-purple-600">
                    ₩{product.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-105 flex items-center gap-2"
                  >
                    <CartIcon className="w-4 h-4" />
                    담기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            이전
          </button>
          <span className="text-gray-700 font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
