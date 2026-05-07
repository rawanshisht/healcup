import { db } from '@/lib/db'
import { products, productVariants } from '@/lib/schema'
import { asc, eq } from 'drizzle-orm'
import ShopClient from './ShopClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Shop' }

export default async function ShopPage() {
  const allProducts = await db.select().from(products).where(eq(products.active, true)).orderBy(asc(products.sortOrder))
  const allVariants = await db.select().from(productVariants).orderBy(asc(productVariants.sortOrder))

  const productList = allProducts.map(p => ({
    ...p,
    variants: allVariants.filter(v => v.productId === p.id),
  }))

  return <ShopClient products={productList} />
}
