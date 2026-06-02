import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { shopOrders, shopOrderItems, productVariants, products } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

const schema = z.object({
  customerName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  items: z.array(z.object({
    variantId: z.number().nullable(),
    productId: z.number().optional(),
    productName: z.string(),
    variantLabel: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number(),
  })),
})

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  try {
    const body = await req.json()
    const data = schema.parse(body)

    for (const item of data.items) {
      if (item.variantId !== null) {
        const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, item.variantId))
        if (!variant || variant.stock < item.quantity) {
          return NextResponse.json({ error: `"${item.productName}" is out of stock or has insufficient stock` }, { status: 400 })
        }
      } else if (item.productId) {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId))
        if (!product || product.stock < item.quantity) {
          return NextResponse.json({ error: `"${item.productName}" is out of stock or has insufficient stock` }, { status: 400 })
        }
      }
    }

    const total = data.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
    const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

    const [order] = await db.insert(shopOrders).values({
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      total: String(total),
      status: 'pending_payment',
    }).returning()

    await db.insert(shopOrderItems).values(
      data.items.map(i => ({
        orderId: order.id,
        variantId: i.variantId,
        productName: i.productName,
        variantLabel: i.variantLabel,
        quantity: i.quantity,
        unitPrice: String(i.unitPrice),
      }))
    )

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: data.email,
      line_items: data.items.map(i => ({
        price_data: {
          currency: 'gbp',
          product_data: { name: `${i.productName} — ${i.variantLabel}` },
          unit_amount: Math.round(i.unitPrice * 100),
        },
        quantity: i.quantity,
      })),
      mode: 'payment',
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: { type: 'shop_order', orderId: String(order.id) },
    })

    await db.update(shopOrders).set({ stripeSessionId: session.id }).where(eq(shopOrders.id, order.id))

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Shop checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
