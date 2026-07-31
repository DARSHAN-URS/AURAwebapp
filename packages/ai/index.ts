export interface AIServicePayload {
  prompt: string;
  system_prompt?: string;
  application_type: "AURA" | "NURSEPASS" | "FMGE";
  provider?: "openai" | "anthropic" | "google";
}

export function formatClinicalPrompt(patientScenario: string, examType: string): string {
  return `[${examType.toUpperCase()} CLINICAL REASONING TASK]\n${patientScenario}`;
}
