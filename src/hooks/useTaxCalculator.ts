import { useState, useMemo } from "react"
import { TaxInputs, Purchase, ActivityType } from "@/types/tax"
import { calculateTaxes, estimateIR } from "@/lib/taxCalculations"

const DEFAULT_INPUTS: TaxInputs = {
  revenue: 0,
  activityType: "prestations_bic",
  hasVersementLiberatoire: false,
  hasACRE: false,
  acrePhase: "first_half_2026",
  purchases: [],
}

export function useTaxCalculator() {
  const [inputs, setInputs] = useState<TaxInputs>(DEFAULT_INPUTS)

  const result = useMemo(() => {
    if (inputs.revenue <= 0) return null
    return calculateTaxes(inputs)
  }, [inputs])

  const irEstimate = useMemo(() => {
    if (!result) return null
    return estimateIR(result)
  }, [result])

  function setRevenue(revenue: number) {
    setInputs((prev) => ({ ...prev, revenue }))
  }

  function setActivityType(activityType: ActivityType) {
    setInputs((prev) => ({ ...prev, activityType }))
  }

  function setHasVersementLiberatoire(value: boolean) {
    setInputs((prev) => ({ ...prev, hasVersementLiberatoire: value }))
  }

  function setHasACRE(value: boolean) {
    setInputs((prev) => ({ ...prev, hasACRE: value }))
  }

  function setAcrePhase(phase: TaxInputs["acrePhase"]) {
    setInputs((prev) => ({ ...prev, acrePhase: phase }))
  }

  function addPurchase(purchase: Omit<Purchase, "id">) {
    const newPurchase: Purchase = {
      ...purchase,
      id: crypto.randomUUID(),
    }
    setInputs((prev) => ({ ...prev, purchases: [...prev.purchases, newPurchase] }))
  }

  function removePurchase(id: string) {
    setInputs((prev) => ({
      ...prev,
      purchases: prev.purchases.filter((p) => p.id !== id),
    }))
  }

  function updatePurchase(id: string, updates: Partial<Omit<Purchase, "id">>) {
    setInputs((prev) => ({
      ...prev,
      purchases: prev.purchases.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }))
  }

  return {
    inputs,
    result,
    irEstimate,
    setRevenue,
    setActivityType,
    setHasVersementLiberatoire,
    setHasACRE,
    setAcrePhase,
    addPurchase,
    removePurchase,
    updatePurchase,
  }
}
