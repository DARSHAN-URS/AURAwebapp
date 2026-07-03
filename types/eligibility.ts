export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  countryResidence: string;
  nationality: string;
}

export interface AcademicProfile {
  qualification: string;
  gpa10th: number;
  gpa12th: number;
  cgpaBachelors?: number | "";
  cgpaMasters?: number | "";
  gradYear: number;
}

export interface EnglishProficiency {
  englishExam: "IELTS" | "TOEFL" | "PTE" | "Duolingo" | "Not Yet Taken";
  englishScore?: number | "";
}

export interface StudyPreferences {
  preferredCountry: "Canada" | "UK" | "USA" | "Australia" | "Germany" | "Ireland" | "New Zealand" | "Dubai";
  preferredCourse: string;
  preferredIntake: string;
  budgetRange: string;
  scholarshipRequired: boolean;
}

export interface AdditionalInfo {
  workExperience: number;
  gapYears: number;
  neetScore?: number | "";
  passportAvailable: boolean;
}

export interface EligibilityPayload {
  personal_info: {
    full_name: string;
    email: string;
    phone: string;
    country_residence: string;
    nationality: string;
  };
  academic_profile: {
    qualification: string;
    gpa_10th: number;
    gpa_12th: number;
    cgpa_bachelors?: number | null;
    cgpa_masters?: number | null;
    grad_year: number;
  };
  english_proficiency: {
    english_exam: string;
    english_score?: number | null;
  };
  study_preferences: {
    preferred_country: string;
    preferred_course: string;
    preferred_intake: string;
    budget_range: string;
    scholarship_required: boolean;
  };
  additional_info: {
    work_experience: number;
    gap_years: number;
    neet_score?: number | null;
    passport_available: boolean;
  };
}

export interface UniversityRecommendation {
  name: string;
  location: string;
  reasoning: string;
}

export interface AIResultResponse {
  id: string;
  request_id: string;
  overall_score: number;
  admission_probability: "Low" | "Medium" | "High";
  scholarship_potential: "Low" | "Medium" | "High";
  visa_readiness: "Low" | "Medium" | "High";
  strengths: string[];
  weaknesses: string[];
  suggested_improvements: string[];
  recommended_countries: string[];
  recommended_universities: UniversityRecommendation[];
  suggested_next_steps: string[];
  created_at: string;
}

export interface RequestResponse {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  country_residence: string;
  nationality: string;
  qualification: string;
  gpa_10th: number;
  gpa_12th: number;
  cgpa_bachelors: number | null;
  cgpa_masters: number | null;
  grad_year: number;
  english_exam: string;
  english_score: number | null;
  preferred_country: string;
  preferred_course: string;
  preferred_intake: string;
  budget_range: string;
  scholarship_required: boolean;
  work_experience: number;
  gap_years: number;
  neet_score: number | null;
  passport_available: boolean;
  status: string;
  created_at: string;
}

export interface EligibilityCheckResponse {
  request: RequestResponse;
  result?: AIResultResponse;
}
