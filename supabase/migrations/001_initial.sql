-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table médecins
CREATE TABLE doctors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  language_preference TEXT DEFAULT 'en',
  profile_picture_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('M', 'F', 'Other')),
  blood_type TEXT,
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  phone TEXT,
  address TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table consultations
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),
  chief_complaint TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  soap_report JSONB,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table medical forms
CREATE TABLE medical_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  form_data JSONB NOT NULL DEFAULT '{}',
  vital_signs JSONB DEFAULT '{}',
  medications JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  medical_history JSONB DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'audio', 'image', 'system')),
  metadata JSONB DEFAULT '{}',
  sources JSONB DEFAULT '[]',
  diagnoses JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_patients_doctor ON patients(doctor_id);
CREATE INDEX idx_consultations_patient ON consultations(patient_id);
CREATE INDEX idx_consultations_doctor ON consultations(doctor_id);
CREATE INDEX idx_chat_messages_consultation ON chat_messages(consultation_id);
CREATE INDEX idx_medical_forms_consultation ON medical_forms(consultation_id);

-- Row Level Security (RLS)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Doctors can only view their own patients"
  ON patients FOR SELECT
  USING (doctor_id = (SELECT id FROM doctors WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Doctors can only view their own consultations"
  ON consultations FOR SELECT
  USING (doctor_id = (SELECT id FROM doctors WHERE firebase_uid = auth.uid()::text));

CREATE POLICY "Doctors can only view their own forms"
  ON medical_forms FOR SELECT
  USING (consultation_id IN (
    SELECT id FROM consultations WHERE doctor_id = (SELECT id FROM doctors WHERE firebase_uid = auth.uid()::text)
  ));

CREATE POLICY "Doctors can only view their own messages"
  ON chat_messages FOR SELECT
  USING (consultation_id IN (
    SELECT id FROM consultations WHERE doctor_id = (SELECT id FROM doctors WHERE firebase_uid = auth.uid()::text)
  ));
