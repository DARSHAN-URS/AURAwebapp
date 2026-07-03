import { z } from "zod";

// Step 1: Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone must be at least 8 digits").max(20, "Phone is too long"),
  countryResidence: z.string().min(1, "Select resident country"),
  nationality: z.string().min(1, "Select nationality"),
});

// Step 2: Academic Profile Schema
export const academicProfileSchema = z.object({
  qualification: z.string().min(1, "Select highest qualification"),
  gpa10th: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().min(0, "Invalid score").max(100, "Invalid score")),
  gpa12th: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().min(0, "Invalid score").max(100, "Invalid score")),
  cgpaBachelors: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().min(0, "Invalid score").max(10, "Invalid score").optional()),
  cgpaMasters: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().min(0, "Invalid score").max(10, "Invalid score").optional()),
  gradYear: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().min(1980, "Invalid graduation year").max(2035, "Invalid graduation year")),
});

// Step 3: English Proficiency Schema
export const englishProficiencySchema = z.object({
  englishExam: z.enum(["IELTS", "TOEFL", "PTE", "Duolingo", "Not Yet Taken"]),
  englishScore: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().min(0, "Score must be positive").optional()),
}).refine(
  (data) => {
    if (data.englishExam !== "Not Yet Taken" && data.englishScore === undefined) {
      return false;
    }
    return true;
  },
  {
    message: "Enter your exam score",
    path: ["englishScore"],
  }
);

// Step 4: Study Preferences Schema
export const studyPreferencesSchema = z.object({
  preferredCountry: z.enum(["Canada", "UK", "USA", "Australia", "Germany", "Ireland", "New Zealand", "Dubai"]),
  preferredCourse: z.string().min(1, "Select or enter preferred major course"),
  preferredIntake: z.string().min(1, "Select preferred intake"),
  budgetRange: z.string().min(1, "Select your annual budget range"),
  scholarshipRequired: z.boolean().default(false),
});

// Step 5: Additional Info Schema
export const additionalInfoSchema = z.object({
  workExperience: z.preprocess((val) => (val === "" || val === undefined ? 0 : Number(val)), z.number().min(0, "Experience cannot be negative")),
  gapYears: z.preprocess((val) => (val === "" || val === undefined ? 0 : Number(val)), z.number().min(0, "Gaps cannot be negative")),
  neetScore: z.preprocess((val) => (val === "" || val === undefined ? undefined : Number(val)), z.number().min(0, "NEET score cannot be negative").optional()),
  passportAvailable: z.boolean().default(false),
});

// Aggregate complete Checker schema
export const eligibilityFormSchema = z.object({
  personalInfo: personalInfoSchema,
  academicProfile: academicProfileSchema,
  englishProficiency: englishProficiencySchema,
  studyPreferences: studyPreferencesSchema,
  additionalInfo: additionalInfoSchema,
});

export type EligibilityFormValues = z.infer<typeof eligibilityFormSchema>;
