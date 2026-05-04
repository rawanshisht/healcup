export type ContactInfo = {
  address: string
  phone: string
  email: string
  whatsapp: string
  facebook: string
}

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  address: '123 Clinic Street, City, Postcode',
  phone: '+44 700 000 0000',
  email: 'info@yourdomain.com',
  whatsapp: '',
  facebook: '',
}

export type AboutContent = {
  storyHeading: string
  paragraph1: string
  paragraph2: string
  paragraph3: string
  values: { title: string; body: string }[]
}

export type HowItWorksContent = {
  steps: { n: number; title: string; desc: string }[]
  before: string[]
  after: string[]
  unsuitable: string[]
}

export const DEFAULT_ABOUT: AboutContent = {
  storyHeading: 'A Clinic Built on Care & Expertise',
  paragraph1: 'Our clinic was founded with a single purpose: to make authentic, professional hijama therapy accessible to all who seek it. Rooted in centuries of traditional practice, hijama — when performed correctly in a hygienic environment — can offer profound physical and holistic benefits.',
  paragraph2: 'We are committed to maintaining the highest standards of safety, cleanliness, and patient care. Every session is conducted using sterile, single-use equipment, and every practitioner is trained to guide patients through the experience with warmth and expertise.',
  paragraph3: 'Whether you are new to hijama or a returning patient, you will always be welcomed into a calm, respectful space where your comfort and healing come first.',
  values: [
    { title: 'Compassionate Care',      body: 'Every patient is treated with dignity, respect, and genuine concern for their wellbeing.' },
    { title: 'Strict Hygiene',          body: 'We use single-use, sterile equipment for every session. Your safety is our highest priority.' },
    { title: 'Qualified Practitioners', body: 'Our hijama therapists are certified, experienced, and committed to continuous learning.' },
    { title: 'Rooted in Tradition',     body: 'Our practice draws on centuries of traditional wisdom, following time-honoured methods that have supported wellbeing across cultures.' },
  ],
}

export const DEFAULT_HOW_IT_WORKS: HowItWorksContent = {
  steps: [
    { n: 1, title: 'Consultation',         desc: 'Your practitioner reviews your health history, goals, and any concerns. Your pre-screening questionnaire is checked to ensure hijama is appropriate for you.' },
    { n: 2, title: 'Preparation',          desc: 'You are guided to a private, comfortable treatment room. The area is cleaned with antiseptic and all equipment is sterile and single-use — opened in front of you.' },
    { n: 3, title: 'Dry Cupping Phase',    desc: 'Cups are placed on the skin and light suction applied. This creates a gentle pulling sensation that draws blood to the surface. Most patients find this deeply relaxing.' },
    { n: 4, title: 'Wet Hijama',           desc: 'Small, superficial scratches are made with a sterile lancet before the cup is replaced. This draws out a small amount of stagnant blood — the core practice of traditional hijama.' },
    { n: 5, title: 'Cleansing & Dressing', desc: 'The treatment area is thoroughly cleaned and dressed. Your practitioner checks on your comfort and ensures you feel well before leaving.' },
    { n: 6, title: 'Aftercare Guidance',   desc: 'Clear written and verbal aftercare instructions are provided before you leave. You are given contact details for any follow-up questions.' },
  ],
  before: [
    'Eat a light meal at least 2 hours before — do not arrive on an empty stomach.',
    'Wear clean, loose, dark-coloured clothing (cups may leave temporary marks).',
    'Stay well hydrated the day before and morning of your appointment.',
    'Avoid strenuous exercise for 24 hours before treatment.',
    'Do not shave the treatment area on the day of your appointment.',
    'Inform us of any medications, health conditions, or concerns.',
  ],
  after: [
    'Rest for the day — avoid strenuous activity for at least 24 hours.',
    'Avoid cold water, cold showers, or swimming for 24 hours after treatment.',
    'Eat light, nutritious food. Honey and dates are traditional post-treatment recommendations.',
    'Keep the treatment area clean and covered if needed.',
    'Drink plenty of water to aid detoxification.',
    'Circular marks from cupping are normal and will fade within 3–10 days.',
    'Contact us if you experience unusual pain or signs of infection.',
  ],
  unsuitable: [
    'Currently taking blood thinners or anticoagulant medication',
    'Fever or acute illness on the day of treatment',
    'Severe anaemia or blood disorders',
    'Active open wounds, skin infections, or eczema at the treatment site',
    'Pregnancy (please consult us — some forms may be appropriate)',
    'Very recent surgery (within the past 4 weeks)',
  ],
}
