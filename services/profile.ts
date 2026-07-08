const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface PersonalProfile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  country_residence: string | null;
  city: string | null;
  gender: string | null;
  date_of_birth: string | null;
  passport_number: string | null;
  passport_expiry: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relation: string | null;
  emergency_contact_phone: string | null;
}

export interface AcademicProfile {
  highest_qualification: string | null;
  gpa_10th: number | null;
  gpa_12th: number | null;
  cgpa_bachelors: number | null;
  cgpa_masters: number | null;
  grad_year: number | null;
  university: string | null;
  college: string | null;
  backlogs: number;
  research_papers: any[];
  projects: any[];
  work_experience: any[];
  internships: any[];
  certifications: any[];
  
  // English proficiency & exam scores
  ielts_score: number | null;
  ielts_expiry: string | null;
  toefl_score: number | null;
  toefl_expiry: string | null;
  pte_score: number | null;
  pte_expiry: string | null;
  duolingo_score: number | null;
  duolingo_expiry: string | null;
  gre_score: number | null;
  gre_expiry: string | null;
  gmat_score: number | null;
  gmat_expiry: string | null;
  sat_score: number | null;
  sat_expiry: string | null;
  neet_score: number | null;
  neet_expiry: string | null;
}

export interface StudyPreferences {
  preferred_countries: string[];
  preferred_universities: string[];
  preferred_courses: string[];
  degree_level: string | null;
  budget: string | null;
  target_intake: string | null;
  scholarship_required: boolean;
  preferred_city: string | null;
  preferred_language: string | null;
  career_goals: string | null;
}

export interface FinancialProfile {
  annual_family_income: string | null;
  savings: number;
  education_loan: number;
  sponsor: string | null;
  currency: string;
}

export interface CompletionScores {
  personal: number;
  academic: number;
  financial: number;
  documents: number;
  journey: number;
  overall: number;
}

export interface StudentProfileResponse {
  id: string;
  user_id: string;
  personal: PersonalProfile;
  academic: AcademicProfile;
  preferences: StudyPreferences;
  financial: FinancialProfile;
  verification_status: string;
  completion_scores: CompletionScores;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationSettings {
  email: boolean;
  whatsapp: boolean;
  sms: boolean;
  in_app: boolean;
  ai_updates: boolean;
  consultation: boolean;
  payments: boolean;
  scholarships: boolean;
  visa: boolean;
  application: boolean;
}

export interface LanguageSettings {
  preferred_language: string;
  supported_languages: string[];
}

export interface AppearanceSettings {
  theme: string;
  accent_color: string | null;
}

export interface ConnectedAccount {
  provider: string;
  provider_user_id: string;
  email: string | null;
  connected_at: string;
}

export interface StudentSettingsResponse {
  notifications: NotificationSettings;
  language: LanguageSettings;
  appearance: AppearanceSettings;
  connected_accounts: ConnectedAccount[];
  security: {
    two_factor_enabled: boolean;
    two_factor_method: string;
    login_history: any[];
    active_sessions: any[];
  };
}

export interface StudentDocument {
  id: string;
  user_id: string;
  category: string;
  filename: string;
  content_type: string;
  file_size: number;
  file_path: string;
  created_at: string;
}

/**
 * Fetches the student's master profile.
 */
export async function getStudentProfile(): Promise<StudentProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to load profile details.");
  }
  return res.json();
}

/**
 * Updates the student's master profile.
 */
export async function updateStudentProfile(payload: {
  personal?: Partial<PersonalProfile>;
  academic?: Partial<AcademicProfile>;
  preferences?: Partial<StudyPreferences>;
  financial?: Partial<FinancialProfile>;
}): Promise<StudentProfileResponse> {
  const res = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to update profile details.");
  }
  return res.json();
}

/**
 * Uploads a profile picture.
 */
export async function uploadProfilePhoto(file: File): Promise<{ photo_url: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/profile/photo`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to upload photo.");
  }
  return res.json();
}

/**
 * Deletes the profile picture.
 */
export async function deleteProfilePhoto(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/profile/photo`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete profile photo.");
  }
}

/**
 * Fetches general settings.
 */
export async function getUserSettings(): Promise<StudentSettingsResponse> {
  const res = await fetch(`${API_BASE_URL}/api/settings`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to retrieve settings details.");
  }
  return res.json();
}

/**
 * Updates general settings.
 */
export async function updateUserSettings(payload: {
  notifications?: Partial<NotificationSettings>;
  appearance?: Partial<AppearanceSettings>;
  language?: Partial<LanguageSettings>;
}): Promise<any> {
  const params = new URLSearchParams();
  const res = await fetch(`${API_BASE_URL}/api/settings`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error("Failed to save settings changes.");
  }
  return res.json();
}

/**
 * Exports student profile data as JSON.
 */
export async function exportProfileData(): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/profile/export`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error("Failed to export profile details.");
  }
  return res.json();
}

/**
 * Cascading account deletion.
 */
export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/account`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete account records.");
  }
}

/**
 * Lists document vault files.
 */
export async function listVaultDocuments(): Promise<StudentDocument[]> {
  const res = await fetch(`${API_BASE_URL}/api/profile/documents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch document vault uploads.");
  }
  return res.json();
}

/**
 * Uploads a document to the vault.
 */
export async function uploadVaultDocument(category: string, file: File): Promise<StudentDocument> {
  const formData = new FormData();
  formData.append("category", category);
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/profile/documents`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to upload document file.");
  }
  return res.json();
}

/**
 * Renames a document in the vault.
 */
export async function renameVaultDocument(docId: string, newFilename: string): Promise<StudentDocument> {
  const formData = new FormData();
  formData.append("new_filename", newFilename);

  const res = await fetch(`${API_BASE_URL}/api/profile/documents/${docId}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to rename vault document.");
  }
  return res.json();
}

/**
 * Deletes a document from the vault.
 */
export async function deleteVaultDocument(docId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/api/profile/documents/${docId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete vault document.");
  }
}

/**
 * Exposes a download redirection link for vault document files.
 */
export async function downloadVaultDocument(docId: string): Promise<{ download_url: string; filename: string }> {
  const res = await fetch(`${API_BASE_URL}/api/profile/documents/${docId}/download`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch document download link.");
  }
  return res.json();
}
