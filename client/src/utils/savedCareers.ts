export type SavedCareer = {
  slug: string;
  title?: string;
  image?: string | null;
  salaryIndiaMin?: number;
  salaryIndiaMax?: number;
  futureDemand?: number | null;
  growthRate?: number | null;
  automationRisk?: number | null;
  requiredSkills?: string[];
  dailyWork?: string | null;
};

const STORAGE_KEY = "saved_careers_v1";

function safeParse(value: string | null): SavedCareer[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed as SavedCareer[];
  } catch {
    return [];
  }
}

export function getSavedCareers(): SavedCareer[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function isCareerSaved(slug: string): boolean {
  if (!slug) return false;
  return getSavedCareers().some((c) => c.slug === slug);
}

export function saveCareer(career: SavedCareer) {
  if (!career?.slug) return;
  const existing = getSavedCareers();
  if (existing.some((c) => c.slug === career.slug)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([career, ...existing]));
}

export function removeCareer(slug: string) {
  if (!slug) return;
  const existing = getSavedCareers();
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(existing.filter((c) => c.slug !== slug))
  );
}

export function toggleCareer(career: SavedCareer) {
  if (!career?.slug) return;
  if (isCareerSaved(career.slug)) {
    removeCareer(career.slug);
  } else {
    saveCareer(career);
  }
}

