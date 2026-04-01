export const progressiveMap: Record<string, string[]> = {
  "Slewing Mobile Crane C0 (open/over 100t)": [
    "Slewing Mobile Crane C1 (up to 100t)",
    "Slewing Mobile Crane C6 (up to 60t)",
    "Slewing Mobile Crane C2 (up to 20t)",
  ],
  "Slewing Mobile Crane C1 (up to 100t)": [
    "Slewing Mobile Crane C6 (up to 60t)",
    "Slewing Mobile Crane C2 (up to 20t)",
  ],
  "Slewing Mobile Crane C6 (up to 60t)": [
    "Slewing Mobile Crane C2 (up to 20t)",
  ],
  "Advanced Rigging RA": [
    "Intermediate Rigging RI",
    "Basic Rigging RB",
    "Dogging DG",
  ],
  "Intermediate Rigging RI": [
    "Basic Rigging RB",
    "Dogging DG",
  ],
  "Basic Rigging RB": [
    "Dogging DG",
  ],
  "Advanced Scaffolding SA": [
    "Intermediate Scaffolding SI",
    "Basic Scaffolding SB",
  ],
  "Intermediate Scaffolding SI": [
    "Basic Scaffolding SB",
  ],
};

export function getCoveredLicences(held: string[]): string[] {
  const covered: Set<string> = new Set();
  for (const lic of held) {
    const satisfies = progressiveMap[lic];
    if (satisfies) {
      for (const s of satisfies) covered.add(s);
    }
  }
  return Array.from(covered);
}

export function isLicenceCovered(lic: string, held: string[]): string | null {
  for (const h of held) {
    const satisfies = progressiveMap[h];
    if (satisfies && satisfies.includes(lic)) return h;
  }
  return null;
}