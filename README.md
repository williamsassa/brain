#  BRAIN HEALTH — Operation HELIX-FT

**AI-powered Diagnostic Assistant for Healthcare Professionals**

Bilingue (English/French) | Medical specialties: Cardiology, Ophthalmology, Dermatology, Dentistry, Pediatrics, Psychiatry, Anesthesiology, Endocrinology, Oncology, Respiratory

## Quick Start

### 1. Prerequisites
- Node.js 18+, Python 3.9+
- Firebase, Supabase, OpenAI 

### 2. Installation & Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Start dev server
npm run dev

# Start Python microservice (optional)
cd python-services && pip install -r requirements.txt && python main.py
```


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.


##  STRUCTURE DE FICHIERS

```
Brain-Health Project
├──  src/
│   ├──  app/
│   │   ├── onboarding/page.tsx ........... Sélection spécialité (animée)
│   │   ├── dashboard/page.tsx ........... Layout principal
│   │   └── auth/page.tsx ............... Authentification
│   ├──  components/
│   │   ├──  patient-form/
│   │   │   ├── PatientFormContainer.tsx . Orchestration formulaires
│   │   │   ├──  sections/
│   │   │   │   ├── CommonSection.tsx
│   │   │   │   └── VitalSigns.tsx
│   │   │   └──  specialties/ ......... 11 formulaires
│   │   │       ├── CardiologyForm.tsx
│   │   │       ├── GeneralMedicineForm.tsx
│   │   │       ├── OphthalmologyForm.tsx
│   │   │       ├── DermatologyForm.tsx
│   │   │       ├── DentistryForm.tsx
│   │   │       ├── PediatricsForm.tsx
│   │   │       ├── PsychiatryForm.tsx
│   │   │       ├── AnesthesiologyForm.tsx
│   │   │       ├── EndocrinologyForm.tsx
│   │   │       ├── OncologyForm.tsx
│   │   │       └── RespiratoryForm.tsx
│   │   ├──  chat/
│   │   │   ├── ChatContainer.tsx ........ Avec animations
│   │   │   ├── MessageList.tsx ......... Stagger animations
│   │   │   ├── ChatInput.tsx
│   │   │   └── QuickActions.tsx
│   │   └──  ui/ ..................... Composants réutilisables
│   ├──  store/ ....................... Zustand stores
│   │   ├── authStore.ts .............. localStorage persist
│   │   ├── patientStore.ts
│   │   └── chatStore.ts
│   ├──  types/ ...................... TypeScript types
│   │   ├── specialty.ts .............. 11 spécialités définies
│   │   └── index.ts
│   └──  lib/
│       └── medical-prompts.ts ........ Prompts Claude par spécialité
├──  .env.local ..................... 16 clés API 
├──  package.json ................... Next.js 14.2.35
└──  AUDIT_COMPLET.md ............... Ce rapport
```


---

##  SÉCURITÉ & DONNÉES

| Aspect | Status |
|--------|--------|
| Firebase Auth |  EmailPassword + OAuth |
| Database Encryption |  PostgreSQL (Supabase) |
| API Keys |  Server-side secrets + Public keys |
| CORS Configuration | Configured |
| Input Validation | Via form handlers |
---



## FINAL CHECKLIST

```
✓ 11/11 Spécialités créées avec formulaires
✓ 16/16 Clés API présentes dans .env.local
✓ 94 Questions cliniques pertinentes
✓ 7 Types de widgets implémentés
✓ Framer Motion animations complètes
✓ Design System cohérent (Medical Cyan-Blue Theme)
✓ Responsive mobile/tablet/desktop
✓ TypeScript sans erreurs
✓ Build production sans warnings
✓ Persistent state avec Zustand + localStorage
✓ Navigation fluide post-onboarding
✓ Chat sidebar animations
✓ Patient form checklist interactive
✓ Dashboard professionnel avec logout
✓ All 11 specialty forms imported and integrated
✓ Page footer status summary
```

---



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
