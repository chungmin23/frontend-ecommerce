import { useState } from "react"
import { getRecommendation, indexAllProducts } from "../../api/productApi"

const RecommendPage = () => {
  const [userQuery, setUserQuery] = useState("")
  const [recommendation, setRecommendation] = useState<ProductRecommendation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [indexing, setIndexing] = useState(false)

  const handleRecommendation = async () => {
    if (!userQuery.trim()) {
      setError("Please enter a query")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await getRecommendation(userQuery)
      setRecommendation(result)
    } catch (err) {
      setError("Failed to get recommendation. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleIndexProducts = async () => {
    setIndexing(true)
    setError(null)

    try {
      await indexAllProducts()
      alert("Products indexed successfully!")
    } catch (err) {
      setError("Failed to index products. Please try again.")
      console.error(err)
    } finally {
      setIndexing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRecommendation()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Product Recommendation</h1>
        <p className="text-gray-600">Ask for product recommendations using natural language</p>
      </div>

      <div className="mb-6">
        <button
          onClick={handleIndexProducts}
          disabled={indexing}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {indexing ? "Indexing..." : "Index All Products"}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Click to index all products into the vector database (required for first-time use)
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            What are you looking for?
          </label>
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., I need a laptop for programming and gaming"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleRecommendation}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Getting Recommendations..." : "Get Recommendations"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {recommendation && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">AI Recommendation</h2>
            <p className="text-gray-700 mb-2">{recommendation.explanation}</p>
            <div className="text-sm text-gray-500">
              Confidence: {(recommendation.confidence * 100).toFixed(1)}%
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Recommended Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendation.recommendedProducts.map((product) => (
                <div key={product.pno} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <h4 className="font-bold text-lg mb-2">{product.pname}</h4>
                  <p className="text-gray-600 text-sm mb-3">{product.pdesc || 'No description available'}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-blue-600 font-bold text-xl">
                        ₩{product.price.toLocaleString()}
                      </div>
                      {product.category && (
                        <div className="text-sm text-gray-500">
                          Category: {product.category}
                        </div>
                      )}
                    </div>
                    <div className="text-sm">
                      {product.stock && product.stock > 0 ? (
                        <span className="text-green-600">In Stock ({product.stock})</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecommendPage
