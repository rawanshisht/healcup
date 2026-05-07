export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { products, productVariants } from '@/lib/schema'
import { asc, eq } from 'drizzle-orm'
import ProductsManager from './ProductsManager'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Products' }

export default async function AdminProductsPage() {
  const allProducts = await db.select().from(products).orderBy(asc(products.sortOrder))
  const allVariants = await db.select().from(productVariants).orderBy(asc(productVariants.sortOrder))
  const productList = allProducts.map(p => ({
    ...p,
    variants: allVariants.filter(v => v.productId === p.id),
  }))

  return (
    <div className="space-y-6 max-w-3xl w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#1a4a4a]" style={{ fontFamily: 'Georgia, serif' }}>Products</h1>
        <p className="text-sm text-gray-500 mt-1">Manage shop products and their variants.</p>
      </div>
      <ProductsManager initialProducts={productList} />
    </div>
  )
}
