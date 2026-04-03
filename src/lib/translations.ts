export const translations = {
  en: {
    // Common
    app_name: 'BRAIN HEALTH',
    app_subtitle: 'AI Medical Diagnostic Assistant',
    loading: 'Loading...',
    saving: 'Saving...',
    saved: 'Saved',
    error: 'Error',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    remove: 'Remove',
    submit: 'Submit',
    next: 'Next',
    previous: 'Previous',

    // Auth
    sign_in: 'Sign In',
    sign_out: 'Sign Out',
    continue_with_google: 'Continue with Google',
    professional_gate: 'Are you a licensed healthcare professional?',
    professional_gate_yes: 'Yes, I am a healthcare professional',
    professional_gate_no: 'No, I am not',
    access_denied: 'Access Denied',
    access_denied_msg: 'BRAIN HEALTH is exclusively available to licensed healthcare professionals.',

    // Patient Form
    patient_info: 'Patient Information',
    first_name: 'First Name',
    last_name: 'Last Name',
    date_of_birth: 'Date of Birth',
    gender: 'Gender',
    blood_type: 'Blood Type',
    height: 'Height (cm)',
    weight: 'Weight (kg)',
    bmi: 'BMI',
    address: 'Address',
    phone: 'Phone',
    emergency_contact: 'Emergency Contact',

    // Medical History
    medical_history: 'Medical History',
    family_history: 'Family History',
    previous_surgeries: 'Previous Surgeries',
    chronic_conditions: 'Chronic Conditions',
    current_medications: 'Current Medications',
    allergies: 'Allergies',
    drug_intolerances: 'Drug Intolerances',
    vaccination_history: 'Vaccination History',
    tobacco_use: 'Tobacco Use',
    alcohol_use: 'Alcohol Use',

    // Vital Signs
    vital_signs: 'Vital Signs',
    blood_pressure: 'Blood Pressure',
    systolic: 'Systolic',
    diastolic: 'Diastolic',
    heart_rate: 'Heart Rate (bpm)',
    temperature: 'Temperature (°C)',
    o2_saturation: 'O₂ Saturation (%)',
    respiratory_rate: 'Respiratory Rate (/min)',

    // Chat
    chat_title: 'AI Medical Assistant',
    message_placeholder: 'Type a message or use voice...',
    send: 'Send',
    copy: 'Copy',
    like: 'Like',
    dislike: 'Dislike',
    export_pdf: 'Export PDF',

    // Quick Actions
    summarize: 'Summarize',
    drug_interactions: 'Drug Interactions',
    risk_assessment: 'Risk Assessment',
    soap_report: 'SOAP Report',
    differential_diagnosis: 'Differential Diagnosis',

    // Onboarding
    welcome: 'Welcome',
    select_specialty: 'Select Your Medical Specialty',
    confirm_specialty: 'Confirm Specialty',

    // Dashboard
    new_patient: 'New Patient',
    recent_patients: 'Recent Patients',
    patient_list: 'Patient List',
    consultation_history: 'Consultation History',
    settings: 'Settings',
  },
  fr: {
    // Common
    app_name: 'BRAIN HEALTH',
    app_subtitle: 'Assistant de Diagnostic Médical IA',
    loading: 'Chargement...',
    saving: 'Enregistrement...',
    saved: 'Enregistré',
    error: 'Erreur',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    remove: 'Retirer',
    submit: 'Soumettre',
    next: 'Suivant',
    previous: 'Précédent',

    // Auth
    sign_in: 'Connexion',
    sign_out: 'Déconnexion',
    continue_with_google: 'Continuer avec Google',
    professional_gate: 'Êtes-vous un professionnel de santé agréé?',
    professional_gate_yes: 'Oui, je suis professionnel de santé',
    professional_gate_no: 'Non',
    access_denied: 'Accès refusé',
    access_denied_msg: 'BRAIN HEALTH est réservé aux professionnels de santé agréés.',

    // Patient Form
    patient_info: 'Informations Patient',
    first_name: 'Prénom',
    last_name: 'Nom de famille',
    date_of_birth: 'Date de naissance',
    gender: 'Sexe',
    blood_type: 'Groupe sanguin',
    height: 'Taille (cm)',
    weight: 'Poids (kg)',
    bmi: 'IMC',
    address: 'Adresse',
    phone: 'Téléphone',
    emergency_contact: 'Contact d\'urgence',

    // Medical History
    medical_history: 'Antécédents médicaux',
    family_history: 'Antécédents familiaux',
    previous_surgeries: 'Chirurgies antérieures',
    chronic_conditions: 'Conditions chroniques',
    current_medications: 'Médicaments actuels',
    allergies: 'Allergies',
    drug_intolerances: 'Intolérances médicamenteuses',
    vaccination_history: 'Historique vaccinal',
    tobacco_use: 'Consommation de tabac',
    alcohol_use: 'Consommation d\'alcool',

    // Vital Signs
    vital_signs: 'Signes vitaux',
    blood_pressure: 'Tension artérielle',
    systolic: 'Systolique',
    diastolic: 'Diastolique',
    heart_rate: 'Fréquence cardiaque (bpm)',
    temperature: 'Température (°C)',
    o2_saturation: 'Saturation O₂ (%)',
    respiratory_rate: 'Fréquence respiratoire (/min)',

    // Chat
    chat_title: 'Assistant Médical IA',
    message_placeholder: 'Tapez un message ou utilisez la voix...',
    send: 'Envoyer',
    copy: 'Copier',
    like: 'J\'aime',
    dislike: 'Je n\'aime pas',
    export_pdf: 'Exporter PDF',

    // Quick Actions
    summarize: 'Résumer',
    drug_interactions: 'Interactions',
    risk_assessment: 'Évaluation des risques',
    soap_report: 'Rapport SOAP',
    differential_diagnosis: 'Diagnostic différentiel',

    // Onboarding
    welcome: 'Bienvenue',
    select_specialty: 'Sélectionnez votre spécialité',
    confirm_specialty: 'Confirmer la spécialité',

    // Dashboard
    new_patient: 'Nouveau patient',
    recent_patients: 'Patients récents',
    patient_list: 'Liste des patients',
    consultation_history: 'Historique des consultations',
    settings: 'Paramètres',
  }
};

export type TranslationKey = keyof typeof translations.en;

export const t = (key: TranslationKey, lang: 'en' | 'fr' = 'en'): string => {
  return translations[lang][key] || key;
};
