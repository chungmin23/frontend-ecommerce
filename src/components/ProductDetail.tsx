import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { getProduct, getProductImage } from '../api/productApi';
import { changeCartItem } from '../api/cartApi';

interface Product {
  pno: number;
  pname: string;
  price: number;
  pdesc?: string;
  uploadFileNames?: string[];
}

const ProductDetail: React.FC = () => {
  const { pno } = useParams<{ pno: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [pno]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProduct(pno);
      setProduct(response.data);
    } catch (error) {
      console.error('상품 조회 실패:', error);
      alert('상품 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      const email = localStorage.getItem('userEmail') || 'test@example.com';

      await changeCartItem({
        email,
        pno: product.pno,
        qty: quantity,
      });

      // localStorage에 장바구니 저장 (카운트용)
      const savedCart = localStorage.getItem('cart');
      const cart = savedCart ? JSON.parse(savedCart) : [];
      cart.push({ ...product, qty: quantity });
      localStorage.setItem('cart', JSON.stringify(cart));

      // 장바구니 업데이트 이벤트 발생
      window.dispatchEvent(new Event('cartUpdated'));

      alert('장바구니에 추가되었습니다.');
      if (window.confirm('장바구니로 이동하시겠습니까?')) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('장바구니 추가 실패:', error);
      alert('장바구니 추가에 실패했습니다.');
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    const orderItems = [{
      pno: product.pno,
      pname: product.pname,
      qty: quantity,
      price: product.price,
    }];
    navigate('/order', { state: { orderItems } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">상품을 찾을 수 없습니다.</div>
      </div>
    );
  }

  const images = product.uploadFileNames && product.uploadFileNames.length > 0
    ? product.uploadFileNames.map(name => getProductImage(name))
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>뒤로 가기</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Section */}
        <div>
          <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
            <img
              src={images[selectedImage]}
              alt={product.pname}
              className="w-full h-[500px] object-cover"
            />
            <button
              onClick={() => setLiked(!liked)}
              className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition"
            >
              <Heart
                className={`w-6 h-6 ${liked ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`}
              />
            </button>
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.pname} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer transition ${
                    selectedImage === index
                      ? 'ring-2 ring-purple-600'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.pname}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600">4.8 (234 리뷰)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              ₩{product.price.toLocaleString()}
            </div>
            <p className="text-gray-500">배송비 무료</p>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">상품 설명</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.pdesc || '고품질의 프리미엄 상품입니다. 세련된 디자인과 뛰어난 기능성을 자랑합니다.'}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">수량</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center text-xl font-semibold border-2 border-gray-200 rounded-lg py-2"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Total Price */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">총 금액</span>
              <span className="text-3xl font-bold text-purple-600">
                ₩{(product.price * quantity).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5" />
              장바구니
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition transform hover:scale-105"
            >
              바로 구매
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 space-y-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold">✓</span>
              <span>무료 배송</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">✓</span>
              <span>30일 이내 무료 반품</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">✓</span>
              <span>100% 정품 보장</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
