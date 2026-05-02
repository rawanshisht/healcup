import { config } from 'dotenv'
config({ path: '.env.local' })

import { send16thReminder } from '../src/lib/notifications'

const email = process.argv[2] ?? 'violetrose2026@gmail.com'
const name  = process.argv[3] ?? 'there'

;(async () => {
  console.log('RESEND_API_KEY set:', !!process.env.RESEND_API_KEY)
  console.log('RESEND_FROM:', process.env.RESEND_FROM)
  console.log(`Sending to ${email}…`)
  await send16thReminder(email, name)
  console.log('Done.')
})()
