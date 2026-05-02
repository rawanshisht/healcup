import {
  pgTable, serial, varchar, text, integer, numeric,
  boolean, date, jsonb, timestamp, index,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const services = pgTable('services', {
  id:              serial('id').primaryKey(),
  name:            varchar('name', { length: 200 }).notNull(),
  description:     text('description'),
  durationMinutes: integer('duration_minutes').notNull(),
  price:           numeric('price', { precision: 10, scale: 2 }).notNull(),
  restrictions:    text('restrictions'),
  active:          boolean('active').notNull().default(true),
  sortOrder:       integer('sort_order').notNull().default(0),
  createdAt:       timestamp('created_at', { withTimezone: true }).notNull().default(sql`NOW()`),
})

export const appointments = pgTable('appointments', {
  id:                serial('id').primaryKey(),
  serviceId:         integer('service_id').references(() => services.id),
  serviceName:       varchar('service_name', { length: 200 }).notNull(),
  patientName:       varchar('patient_name', { length: 200 }).notNull(),
  phone:             varchar('phone', { length: 50 }).notNull(),
  email:             varchar('email', { length: 200 }),
  gender:            varchar('gender', { length: 20 }).notNull(),
  preferredDate:     date('preferred_date').notNull(),
  preferredTime:     varchar('preferred_time', { length: 20 }).notNull(),
  reason:            text('reason'),
  howHeard:          varchar('how_heard', { length: 100 }),
  screeningAnswers:  jsonb('screening_answers').notNull().default(sql`'{}'`),
  consentGiven:      boolean('consent_given').notNull().default(false),
  status:            varchar('status', { length: 30 }).notNull().default('pending'),
  adminNotes:        text('admin_notes'),
  createdAt:         timestamp('created_at', { withTimezone: true }).notNull().default(sql`NOW()`),
  updatedAt:         timestamp('updated_at', { withTimezone: true }).notNull().default(sql`NOW()`),
}, (t) => [
  index('idx_appointments_status').on(t.status),
  index('idx_appointments_preferred_date').on(t.preferredDate),
])

export const blockedDates = pgTable('blocked_dates', {
  id:        serial('id').primaryKey(),
  date:      date('date').notNull().unique(),
  reason:    varchar('reason', { length: 200 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().default(sql`NOW()`),
})

export const siteContent = pgTable('site_content', {
  key:       varchar('key', { length: 100 }).primaryKey(),
  value:     jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().default(sql`NOW()`),
})

export type Service     = typeof services.$inferSelect
export type NewService  = typeof services.$inferInsert
export type Appointment = typeof appointments.$inferSelect
export type NewAppointment = typeof appointments.$inferInsert
export type BlockedDate = typeof blockedDates.$inferSelect
export type SiteContent = typeof siteContent.$inferSelect
