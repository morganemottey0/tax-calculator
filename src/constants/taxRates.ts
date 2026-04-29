import { ActivityType } from "@/types/tax"

// ============================================================
// TAUX 2026 — Sources : URSSAF, service-public.fr
// ============================================================

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  vente_marchandises: "Vente de marchandises (BIC)",
  prestations_bic: "Prestations de services (BIC)",
  liberal_bnc: "Professions libérales (BNC — Sécu. générale)",
  liberal_cipav: "Professions libérales (CIPAV)",
  meuble_tourisme: "Location meublé de tourisme classé",
}

// Taux de cotisations sociales 2026 (en %)
export const COTISATIONS_RATES: Record<ActivityType, number> = {
  vente_marchandises: 12.3,
  prestations_bic: 21.2,
  liberal_bnc: 25.6,
  liberal_cipav: 23.2,
  meuble_tourisme: 6.0,
}

// Versement libératoire de l'impôt sur le revenu (en %)
export const VERSEMENT_LIBERATOIRE_RATES: Record<ActivityType, number> = {
  vente_marchandises: 1.0,
  prestations_bic: 1.7,
  liberal_bnc: 2.2,
  liberal_cipav: 2.2,
  meuble_tourisme: 1.0,
}

// Abattement forfaitaire pour frais (régime micro-fiscal, en %)
export const ABATTEMENT_RATES: Record<ActivityType, number> = {
  vente_marchandises: 71,
  prestations_bic: 50,
  liberal_bnc: 34,
  liberal_cipav: 34,
  meuble_tourisme: 71,
}

// Seuils de chiffre d'affaires 2026 (en €)
export const CA_SEUILS: Record<ActivityType, number> = {
  vente_marchandises: 203_100,
  prestations_bic: 83_600,
  liberal_bnc: 83_600,
  liberal_cipav: 83_600,
  meuble_tourisme: 203_100,
}

// Seuils franchise TVA (jusqu'au 1er juin 2026, en €)
export const TVA_FRANCHISE_SEUILS: Record<ActivityType, number> = {
  vente_marchandises: 85_000,
  prestations_bic: 37_500,
  liberal_bnc: 37_500,
  liberal_cipav: 37_500,
  meuble_tourisme: 85_000,
}

// Taux TVA standards (%)
export const TVA_RATES = {
  normal: 20,
  intermediaire: 10,
  reduit: 5.5,
  superReduit: 2.1,
} as const

export type TVARate = (typeof TVA_RATES)[keyof typeof TVA_RATES]

// ACRE 2026 :
// Avant le 1er juillet 2026 : exonération 50% (taux = 50% du taux normal)
// À partir du 1er juillet 2026 : exonération 25% (taux = 75% du taux normal)
export const ACRE_REDUCTION = {
  first_half_2026: 0.5,  // multiplie le taux par 0.5 → 50% du taux
  second_half_2026: 0.75, // multiplie le taux par 0.75 → 75% du taux
}

// Tranches IR 2026 (barème progressif sur revenu net imposable)
export const IR_TRANCHES = [
  { min: 0,      max: 11_294, rate: 0 },
  { min: 11_294, max: 28_797, rate: 11 },
  { min: 28_797, max: 82_341, rate: 30 },
  { min: 82_341, max: 177_106, rate: 41 },
  { min: 177_106, max: Infinity, rate: 45 },
]
