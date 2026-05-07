'use client'

import { useState } from 'react'
import { useCart } from '@/context/cart'
import { toast } from 'sonner'
import { ShoppingCart, Package } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product, ProductVariant } from '@/lib/schema'

type ProductWithVariants = Product & { variants: ProductVariant[] }

export default function ShopClient({ products }: { products: ProductWithVariants[] }) {
  return (
    <div className="min-h-screen bg-[#f4f1eb]">
      <div className="container-site py-16">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-widest text-[#c9a84c] uppercase mb-2">Our Shop</p>
            <h1 className="text-3xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>
              Natural Products
            </h1>
            <p className="text-gray-500 text-sm mt-2">Pure, ethically sourced products rooted in the Sunnah.</p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e0d9cf] p-16 text-center">
              <Package size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">No products available yet. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: ProductWithVariants }) {
  const { addItem, count } = useCart()
  const hasVariants = product.variants.length > 0
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants[0]?.id ?? null
  )

  const selected = product.variants.find(v => v.id === selectedVariantId)
  const displayPrice = hasVariants ? (selected ? Number(selected.price) : null) : (product.price ? Number(product.price) : null)
  const displayStock = hasVariants ? (selected?.stock ?? 0) : (product.stock ?? 0)
  const inStock = displayStock > 0

  const handleAdd = () => {
    if (hasVariants) {
      if (!selected) return
      addItem({
        variantId: selected.id,
        productId: product.id,
        productName: product.name,
        variantLabel: selected.label,
        price: Number(selected.price),
        imageUrl: product.imageUrl,
      })
      toast.success(`${product.name} (${selected.label}) added to cart`)
    } else {
      if (!product.price) return
      addItem({
        variantId: null,
        productId: product.id,
        productName: product.name,
        variantLabel: '',
        price: Number(product.price),
        imageUrl: product.imageUrl,
      })
      toast.success(`${product.name} added to cart`)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e0d9cf] shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-56 h-48 sm:h-auto bg-[#f4f1eb] flex items-center justify-center shrink-0 relative">
          {product.imageUrl ? (
            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#c9a84c]">
              <span className="text-5xl">🍯</span>
              <span className="text-xs text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>
              {product.name}
            </h2>
            {product.description && (
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{product.description}</p>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {/* Variant selector */}
            {hasVariants && (
              <div>
                <p className="text-xs text-gray-400 mb-2 font-medium">Select size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      disabled={v.stock === 0}
                      className={`px-3 py-1.5 text-sm font-semibold rounded-lg border transition-colors ${
                        selectedVariantId === v.id
                          ? 'bg-[#1a4a4a] text-white border-[#1a4a4a]'
                          : v.stock === 0
                          ? 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed line-through'
                          : 'border-[#e0d9cf] text-gray-700 hover:border-[#1a4a4a]'
                      }`}
                    >
                      {v.label} · £{Number(v.price).toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                {displayPrice !== null && (
                  <p className="text-2xl font-bold text-[#1a4a4a]">£{displayPrice.toFixed(2)}</p>
                )}
                {displayStock <= 5 && displayStock > 0 && (
                  <p className="text-xs text-[#b8892a] mt-0.5">Only {displayStock} left</p>
                )}
                {!inStock && (
                  <p className="text-xs text-red-500 mt-0.5">Out of stock</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  disabled={!inStock || displayPrice === null}
                  className="flex items-center gap-2 bg-[#1a4a4a] hover:bg-[#1e5c5c] disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  <ShoppingCart size={15} />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                {count > 0 && (
                  <Link
                    href="/cart"
                    className="text-sm text-[#237070] hover:underline font-semibold"
                  >
                    View Cart ({count})
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
