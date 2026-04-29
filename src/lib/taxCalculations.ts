import {
  COTISATIONS_RATES,
  VERSEMENT_LIBERATOIRE_RATES,
  ABATTEMENT_RATES,
  CA_SEUILS,
  TVA_FRANCHISE_SEUILS,
  ACRE_REDUCTION,
  IR_TRANCHES,
} from "@/constants/taxRates"
import { TaxInputs, TaxResult } from "@/types/tax"

// ============================================================
// Moteur de calcul fiscal auto-entrepreneur 2026
// ============================================================

function computeIREstimate(revenuNetImposable: number): number {
  let impot = 0
  for (const tranche of IR_TRANCHES) {
    if (revenuNetImposable <= tranche.min) break
    const trancheHaute = Math.min(revenuNetImposable, tranche.max)
    impot += (trancheHaute - tranche.min) * (tranche.rate / 100)
  }
  return impot
}

export function calculateTaxes(inputs: TaxInputs): TaxResult {
  const { revenue, activityType, hasVersementLiberatoire, hasACRE, acrePhase, purchases } = inputs

  // ── 1. Cotisations sociales ──────────────────────────────
  const tauxBase = COTISATIONS_RATES[activityType]
  const acreMultiplier = hasACRE ? ACRE_REDUCTION[acrePhase] : 1
  const tauxEffectif = tauxBase * acreMultiplier
  const montantCotisations = revenue * (tauxEffectif / 100)

  const cotisationsSociales = {
    base: revenue,
    rate: tauxBase,
    amount: revenue * (tauxBase / 100),
    rateAfterACRE: tauxEffectif,
    amountAfterACRE: montantCotisations,
  }

  // ── 2. Versement libératoire ────────────────────────────
  const tauxVL = VERSEMENT_LIBERATOIRE_RATES[activityType]
  const montantVL = hasVersementLiberatoire ? revenue * (tauxVL / 100) : 0

  const versementLiberatoire = {
    applicable: hasVersementLiberatoire,
    rate: tauxVL,
    amount: montantVL,
  }

  // ── 3. Abattement fiscal (si pas de VL, IR classique) ───
  const tauxAbattement = ABATTEMENT_RATES[activityType]
  const revenueApresAbattement = revenue * (1 - tauxAbattement / 100)

  const abattementFiscal = {
    rate: tauxAbattement,
    revenueApresAbattement,
  }

  // ── 4. TVA ───────────────────────────────────────────────
  const seuilTVA = TVA_FRANCHISE_SEUILS[activityType]
  const franchiseApplicable = revenue <= seuilTVA

  // TVA déductible sur achats professionnels
  const tvaDeductible = purchases.reduce((sum, p) => {
    return sum + p.amount * (p.tvaRate / 100)
  }, 0)

  // TVA collectée seulement si hors franchise
  const tvaCollectee = franchiseApplicable ? 0 : revenue * 0.2
  const tvaSolde = franchiseApplicable ? 0 : tvaCollectee - tvaDeductible

  const tva = {
    franchiseApplicable,
    seuilFranchise: seuilTVA,
    revenueExceedsSeuil: revenue > seuilTVA,
    tvaCollectee,
    tvaDeductible,
    tvaSolde,
  }

  // ── 5. Résumé ────────────────────────────────────────────
  const totalCharges = montantCotisations + montantVL + (franchiseApplicable ? 0 : Math.max(0, tvaSolde))
  const revenueNet = revenue - totalCharges

  // Taux effectif global (cotisations + IR si VL)
  const tauxEffectifGlobal = revenue > 0
    ? ((montantCotisations + montantVL) / revenue) * 100
    : 0

  const seuilCA = CA_SEUILS[activityType]
  const depassementSeuil = revenue > seuilCA

  return {
    revenue,
    activityType,
    cotisationsSociales,
    versementLiberatoire,
    abattementFiscal,
    tva,
    totalCharges,
    revenueNet,
    tauxEffectifGlobal,
    depassementSeuil,
    seuilCA,
  }
}

export function estimateIR(result: TaxResult): number {
  if (result.versementLiberatoire.applicable) return result.versementLiberatoire.amount
  return computeIREstimate(result.abattementFiscal.revenueApresAbattement)
}
