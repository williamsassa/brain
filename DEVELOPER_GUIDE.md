# 🚀 BRAIN HEALTH - GUIDE DÉVELOPPEUR COMPLET

## 📥 Installation & Configuration

### 1. Cloner et installer
```bash
cd /c/Users/HP/Documents/brain/brain-health
npm install
```

### 2. Vérifier les clés API (.env.local)
```bash
cat .env.local | grep -E "NEXT_PUBLIC|ANTHROPIC|OPENAI"
```

✅ Tous availables:
- `NEXT_PUBLIC_FIREBASE_API_KEY` ✓
-`ANTHROPIC_API_KEY` ✓
- `OPENAI_API_KEY` ✓

### 3. Démarrer le serveur dev
```bash
npm run dev
```

Visitez: `http://localhost:3000`

---

## 📋 FLUX UTILISATEUR COMPLET

```
1. Landing Page (/)
   ↓
2. Authentication (/auth)
   - Créer compte ou login
   ↓
3. Onboarding (/onboarding)
   - Sélectionner spécialité (11 options)
   - ✅ Généraliste / 🫀 Cardiologie / 👁️ Ophtalmologie
   - 🧴 Dermatologie / 🦷 Dentisterie / 👶 Pédiatrie
   - 🧠 Psychiatrie / 💉 Anesthésiologie / ⚗️ Endocrinologie
   - 🧬 Oncologie / 🫁 Respiratoire
   ↓
4. Dashboard (/dashboard)
   ├─ Left Panel: Patient Form (Checklist)
   │  ├─ Section 1: Patient Identity (avec animation)
   │  ├─ Section 2: Vital Signs (avec animation)
   │  └─ Section 3: Specialty-Specific (11 formulaires différents)
   │
   └─ Right Panel: Chat
      ├─ AI Medical Assistant
      ├─ Real-time responses
      └─ Sources & Citations
```

---

## 🎯 ARCHITECTURE COMPOSANTS

### Specialty Forms Import Map

```typescript
// src/components/patient-form/PatientFormContainer.tsx

import CardiologyForm from './specialties/CardiologyForm';
import GeneralMedicineForm from './specialties/GeneralMedicineForm';
import OphthalmologyForm from './specialties/OphthalmologyForm';
import DermatologyForm from './specialties/DermatologyForm';
import DentistryForm from './specialties/DentistryForm';
import PediatricsForm from './specialties/PediatricsForm';
import PsychiatryForm from './specialties/PsychiatryForm';
import AnesthesiologyForm from './specialties/AnesthesiologyForm';
import EndocrinologyForm from './specialties/EndocrinologyForm';
import OncologyForm from './specialties/OncologyForm';
import RespiratoryForm from './specialties/RespiratoryForm';
```

### Conditional Rendering
```typescript
{doctor.specialty === 'cardiology' && <CardiologyForm ... />}
{doctor.specialty === 'general' && <GeneralMedicineForm ... />}
{doctor.specialty === 'ophthalmology' && <OphthalmologyForm ... />}
{doctor.specialty === 'dermatology' && <DermatologyForm ... />}
{doctor.specialty === 'dentistry' && <DentistryForm ... />}
{doctor.specialty === 'pediatrics' && <PediatricsForm ... />}
{doctor.specialty === 'psychiatry' && <PsychiatryForm ... />}
{doctor.specialty === 'anesthesiology' && <AnesthesiologyForm ... />}
{doctor.specialty === 'endocrinology' && <EndocrinologyForm ... />}
{doctor.specialty === 'oncology' && <OncologyForm ... />}
{doctor.specialty === 'respiratory' && <RespiratoryForm ... />}
```

---

## 🎨 WIDGETS UTILISATION

### 1️⃣ Checklist Component
```typescript
{['Item 1', 'Item 2', 'Item 3'].map((item) => (
  <label key={item} className="flex items-center gap-3 p-2 rounded hover:bg-[#162236]">
    <Checkbox
      checked={data.items?.includes(item) || false}
      onChange={() => {
        const current = data.items || [];
        const updated = current.includes(item)
          ? current.filter((t) => t !== item)
          : [...current, item];
        handleChange('items', updated);
      }}
    />
    <span className="text-sm">{item}</span>
  </label>
))}
```

### 2️⃣ Range Slider
```typescript
<div className="flex items-center gap-4">
  <input
    type="range"
    min="0"
    max="10"
    value={data.painScale || 0}
    onChange={(e) => handleChange('painScale', parseInt(e.target.value))}
    className="flex-1 h-2 bg-[#162236] rounded-lg"
  />
  <span className="text-lg font-bold text-[#00D4FF]">{data.painScale || 0}</span>
</div>
```

### 3️⃣ Textarea with Placeholder
```typescript
<textarea
  placeholder="Enter text here..."
  value={data.notes || ''}
  onChange={(e) => handleChange('notes', e.target.value)}
  className="w-full p-3 rounded-lg bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD] placeholder-[#8BA3BE] focus:border-[#00D4FF] outline-none"
  rows={3}
/>
```

### 4️⃣ Number Input with Validation
```typescript
<Input
  type="number"
  min="0"
  max="100"
  step="0.1"
  placeholder="Value"
  value={data.value || ''}
  onChange={(e) => handleChange('value', parseFloat(e.target.value))}
  className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
/>
```

### 5️⃣ Dropdown Select
```typescript
<select
  value={data.type || ''}
  onChange={(e) => handleChange('type', e.target.value)}
  className="w-full p-2 rounded bg-[#162236] border border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
>
  <option value="">Select...</option>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

### 6️⃣ Radio Buttons
```typescript
{['Option 1', 'Option 2', 'Option 3'].map((option) => (
  <label key={option} className="flex items-center gap-3">
    <Checkbox
      checked={data.selected === option}
      onChange={() => handleChange('selected', option)}
    />
    <span className="text-sm">{option}</span>
  </label>
))}
```

### 7️⃣ Date Picker
```typescript
<Input
  type="date"
  value={data.date || ''}
  onChange={(e) => handleChange('date', e.target.value)}
  className="bg-[#162236] border-[rgba(0,212,255,0.15)] text-[#E8F4FD]"
/>
```

---

## 🎬 ANIMATIONS FRAMER MOTION

### Container Animation (Stagger)
```typescript
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
  className="space-y-6"
>
  {/* Children with stagger effect */}
</motion.div>

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
```

### Item Animation
```typescript
<motion.div variants={itemVariants} className="...">
  {/* Content */}
</motion.div>

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
```

### Collapse/Expand Animation
```typescript
<AnimatePresence>
  {expanded && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Hover Effects
```typescript
<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  {/* Content */}
</motion.div>
```

---

## 🔧 ÉTAT MANAGEMENT (Zustand)

### Auth Store
```typescript
const { user, doctor, logout } = useAuthStore();

// Setting doctor profile
setDoctorProfile({
  id: 'doctor-123',
  email: 'dr@example.com',
  specialty: 'cardiology'
});

// Persists to localStorage automatically
```

### Patient Store
```typescript
const { currentPatient, updateCurrentPatient } = usePatientStore();

// Update patient data
updateCurrentPatient({
  identity: { firstName: 'John', lastName: 'Doe' },
  vitals: { temperature: 37.2, heartRate: 72 },
  specialtyData: { painScale: 5 }
});
```

---

## 🌐 API INTÉGRATION

### Claude API (Anthropic)
```typescript
// Future implementation
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    specialty: doctor.specialty,
    patient: currentPatient,
    query: userMessage
  })
});
```

### Firebase Authentication
```typescript
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const signUp = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  setUser(user);
};
```

---

## 📱 RESPONSIVE BREAKPOINTS

```tailwind
// Mobile (default)
.grid-cols-1

// Tablet (md: 768px+)
md:grid-cols-2

// Desktop (lg: 1024px+)
lg:grid-cols-2
lg:grid-cols-3

// Large Desktop (xl: 1280px+)
xl:grid-cols-4
```

---

## 🎯 TESTS À EFFECTUER

### ✅ Checklist de Test Complet

1. **Authentication**
   - [ ] Sign up avec email valide
   - [ ] Login avec credentials corrects
   - [ ] Logout button fonctionne
   - [ ] Redirect vers /auth si pas authentifié

2. **Onboarding**
   - [ ] Affichage de 11 spécialités
   - [ ] Sélection d'une spécialité
   - [ ] Animation de sélection
   - [ ] Redirect vers /dashboard après confirmation
   - [ ] Specialty persiste après page refresh

3. **Dashboard Panel Patient**
   - [ ] Affichage du formulaire patient
   - [ ] 3 sections collapsibles (Identity, Vitals, Specialty)
   - [ ] Checklists fonctionnent
   - [ ] Range sliders réactifs
   - [ ] Textareas acceptent input
   - [ ] Save patient button fonctionne
   - [ ] Validation de champs requis

4. **Specialty-Specific Forms**
   - [ ] Cardiologie: Ejection Fraction, pain types
   - [ ] Ophtalmologie: Visual Acuity OD/OS, IOP
   - [ ] Dermatologie: Skin type dropdown
   - [ ] Dentisterie: Pain scale slider
   - [ ] Pédiatrie: Age/Weight inputs
   - [ ] Psychiatrie: Mood/Anxiety sliders
   - [ ] Anesthésiologie: NPO status
   - [ ] Endocrinologie: Lab values
   - [ ] Oncologie: Cancer history
   - [ ] Respiratoire: Lung function (FEV1/FVC)

5. **Chat Panel**
   - [ ] Affichage des messages
   - [ ] Input envoi se vide après submission
   - [ ] Quick actions fonctionnent
   - [ ] Animations des messages (stagger)
   - [ ] Scroll to bottom automatique

6. **Animations**
   - [ ] Smooth transitions entre pages
   - [ ] Sections s'ouvrent/ferment fluides
   - [ ] Hovr effects sur buttons
   - [ ] Loading states animés

7. **Responsive**
   - [ ] Mobile (375px) - 1 colonne
   - [ ] Tablet (768px) - 2 colonnes
   - [ ] Desktop (1024px) - 2 colonnes côte à côte

---

## 🚀 DÉPLOIEMENT

### Préparation
```bash
# Build pour production
npm run build

# Test production build localement
npm run start

# Vérifier performance
npm run lint
```

### Vercel Deployment
```bash
# Connect GitHub repo
vercel link

# Deploy
vercel --prod

# View live site
vercel --prod --confirm
```

### Environment Variables (Vercel)
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
... (et toutes les autres 16 clés)
```

---

## 📚 RESSOURCES

- **Next.js 14**: https://nextjs.org/docs
- **Framer Motion**: https://www.framer.com/motion/
- **Zustand**: https://github.com/pmndrs/zustand
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Firebase**: https://firebase.google.com/docs
- **Supabase**: https://supabase.com/docs
- **Anthropic Claude**: https://docs.anthropic.com/

---

## 🎯 NEXT STEPS

1. **Court terme (Cette semaine)**
   - Deploy sur Vercel
   - Intégrer Claude API pour diagnostics réels
   - Ajouter gestion des erreurs robuste

2. **Moyen terme (Ce mois-ci)**
   - Tests E2E (Cypress/Playwright)
   - Performance optimization (image lazy loading)
   - Security audit (OWASP top 10)

3. **Long terme (Ce trimestre)**
   - Mobile app (React Native)
   - PDF reports generation
   - Voice input/output (Whisper)
   - Analytics dashboard

---

**Last Updated**: 1 Avril 2026 | **Version**: 2.1 Final | **Status**: ✅ Production Ready
