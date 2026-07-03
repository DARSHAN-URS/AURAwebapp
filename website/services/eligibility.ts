import { EligibilityFormValues } from "@/schemas/eligibility";
import { EligibilityPayload, EligibilityCheckResponse } from "@/types/eligibility";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Transforms the local client form structure into the FastAPI payload structure.
 */
function transformFormToPayload(formValues: EligibilityFormValues): EligibilityPayload {
  return {
    personal_info: {
      full_name: formValues.personalInfo.fullName,
      email: formValues.personalInfo.email,
      phone: formValues.personalInfo.phone,
      country_residence: formValues.personalInfo.countryResidence,
      nationality: formValues.personalInfo.nationality,
    },
    academic_profile: {
      qualification: formValues.academicProfile.qualification,
      gpa_10th: Number(formValues.academicProfile.gpa10th),
      gpa_12th: Number(formValues.academicProfile.gpa12th),
      cgpa_bachelors: formValues.academicProfile.cgpaBachelors ? Number(formValues.academicProfile.cgpaBachelors) : null,
      cgpa_masters: formValues.academicProfile.cgpaMasters ? Number(formValues.academicProfile.cgpaMasters) : null,
      grad_year: Number(formValues.academicProfile.gradYear),
    },
    english_proficiency: {
      english_exam: formValues.englishProficiency.englishExam,
      english_score: formValues.englishProficiency.englishScore ? Number(formValues.englishProficiency.englishScore) : null,
    },
    study_preferences: {
      preferred_country: formValues.studyPreferences.preferredCountry,
      preferred_course: formValues.studyPreferences.preferredCourse,
      preferred_intake: formValues.studyPreferences.preferredIntake,
      budget_range: formValues.studyPreferences.budgetRange,
      scholarship_required: formValues.studyPreferences.scholarshipRequired,
    },
    additional_info: {
      work_experience: Number(formValues.additionalInfo.workExperience),
      gap_years: Number(formValues.additionalInfo.gapYears),
      neet_score: formValues.additionalInfo.neetScore ? Number(formValues.additionalInfo.neetScore) : null,
      passport_available: formValues.additionalInfo.passportAvailable,
    },
  };
}

/**
 * Submits the eligibility details to the FastAPI backend.
 */
export async function checkStudentEligibility(formValues: EligibilityFormValues): Promise<EligibilityCheckResponse> {
  const payload = transformFormToPayload(formValues);
  
  const response = await fetch(`${API_BASE_URL}/api/eligibility/check`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Unable to submit eligibility check. Please try again.");
  }

  return response.json();
}

/**
 * Retrieves the check results for a given request ID.
 */
export async function getEligibilityResultById(id: string): Promise<EligibilityCheckResponse> {
  const response = await fetch(`${API_BASE_URL}/api/eligibility/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Assessment result not found.");
  }

  return response.json();
}
