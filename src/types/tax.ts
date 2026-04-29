export type ActivityType =
  | "vente_marchandises"
  | "prestations_bic"
  | "liberal_bnc"
  | "liberal_cipav"
  | "meuble_tourisme"

export interface Purchase {
  id: string
  description: string
  amount: number
  tvaRate: number
}

export interface TaxInputs {
  revenue: number
  activityType: ActivityType
  hasVersementLiberatoire: boolean
  hasACRE: boolean
  acrePhase: "first_half_2026" | "second_half_2026"
  purchases: Purchase[]
}

export interface CotisationsSociales {
  base: number
  rate: number
  amount: number
  rateAfterACRE: number
  amountAfterACRE: number
}

export interface VersementLiberatoire {
  applicable: boolean
  rate: number
  amount: number
}

export interface AbattementFiscal {
  rate: number
  revenueApresAbattement: number
}

export interface TVAInfo {
  franchiseApplicable: boolean
  seuilFranchise: number
  revenueExceedsSeuil: boolean
  tvaCollectee: number
  tvaDeductible: number
  tvaSolde: number
}

export interface TaxResult {
  revenue: number
  activityType: ActivityType
  cotisationsSociales: CotisationsSociales
  versementLiberatoire: VersementLiberatoire
  abattementFiscal: AbattementFiscal
  tva: TVAInfo
  totalCharges: number
  revenueNet: number
  tauxEffectifGlobal: number
  depassementSeuil: boolean
  seuilCA: number
}
