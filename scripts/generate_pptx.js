const PptxGenJS = require('pptxgenjs');

const slides = [
  {
    title: 'Agrismart',
    bullets: [
      'Digital marketplace for agricultural goods and services',
      'Tagline: Connect farmers, buyers and services — simple, secure, local.'
    ],
    notes: 'Intro: name, one-liner, and quick value prop.'
  },
  {
    title: 'The Problem',
    bullets: [
      'Fragmented supply chains; farmers lack direct market access',
      'Poor price transparency and high middleman fees',
      'Limited digital payment and logistics integration for smallholders'
    ],
    notes: 'Describe the typical farmer pain and market inefficiencies.'
  },
  {
    title: 'Market Opportunity',
    bullets: [
      'Large agricultural population and growing e-commerce adoption',
      'High mobile payments penetration (MPESA)',
      'Target: smallholder farmers, local retailers, restaurants'
    ],
    notes: 'Mention TAM and mobile-first adoption.'
  },
  {
    title: 'Our Solution',
    bullets: [
      'Marketplace + order management + integrated payments',
      'Product listings, cart & checkout, MPESA payments, admin dashboard, order tracking'
    ],
    notes: 'Summarize end-to-end user flow.'
  },
  {
    title: 'Product Screens',
    bullets: [
      'Home & product catalog',
      'Product detail and cart',
      'Payment form (MPESA flow)',
      'Admin dashboard — order & product management'
    ],
    notes: 'Point to core screens and UX flows.'
  },
  {
    title: 'Key Features',
    bullets: [
      'Buyer: catalog, product detail, cart, secure MPESA checkout',
      'Seller/Admin: product CRUD, order management',
      'Integrations: MPESA, email (nodemailer), uploads (multer)',
      'Security: JWT auth, bcrypt hashing'
    ],
    notes: 'Call out differentiators.'
  },
  {
    title: 'Technology & Architecture',
    bullets: [
      'Frontend: React + Vite + Tailwind',
      'Backend: Node.js + Express',
      'Database: MongoDB Atlas (mongoose)',
      'Integrations: MPESA, nodemailer'
    ],
    notes: 'High-level stack and integrations.'
  },
  {
    title: 'Business Model',
    bullets: [
      'Transaction fee per sale',
      'Premium subscriptions for vendors',
      'Logistics & fulfillment partnerships'
    ],
    notes: 'Describe monetization levers.'
  },
  {
    title: 'Go-to-Market',
    bullets: [
      'Phase 1: pilot with 50 farmers; onboard retailers',
      'Phase 2: expand via cooperatives and partnerships',
      'Marketing: local radio, WhatsApp, demo days'
    ],
    notes: 'Outline GTM plan and partnerships.'
  },
  {
    title: 'Roadmap & Milestones',
    bullets: [
      '0–3 months: pilot, payment polish, merchant onboarding',
      '3–9 months: logistics partnerships, analytics dashboard',
      '9–18 months: regional scaling, B2B partnerships'
    ],
    notes: 'Show timeline and hires.'
  },
  {
    title: 'The Ask',
    bullets: [
      'Funding: $X to hire, run pilot, scale',
      'Use of funds: product (40%), ops (30%), marketing (20%), reserve (10%)',
      'Introductions to cooperatives and logistics partners'
    ],
    notes: 'Be specific about milestones tied to funding.'
  },
  {
    title: 'Contact',
    bullets: [
      'Thank you',
      'Contact: [Name] – [email] – [phone]',
      'CTA: Book a demo / join the pilot'
    ],
    notes: 'Close and call to action.'
  }
];

async function build() {
  try {
    const pptx = new PptxGenJS();

    slides.forEach(s => {
      const slide = pptx.addSlide();
      slide.addText(s.title, { x: 0.5, y: 0.3, fontSize: 28, bold: true, color: '363636' });
      slide.addText(s.bullets.join('\n'), { x: 0.5, y: 1.0, fontSize: 14, color: '555555', line: 1.2, w: '90%' });
      if (s.notes) slide.addNotes(s.notes);
    });

    const fileName = 'Agrismart_Pitch_Deck.pptx';
    console.log('Writing PPTX to', fileName);
    await pptx.writeFile({ fileName });
    console.log('PPTX generated:', fileName);
  } catch (err) {
    console.error('Error generating PPTX:', err);
    process.exit(1);
  }
}

build();
