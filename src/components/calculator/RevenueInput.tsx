import { ChangeEvent } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { TaxInputs } from "@/types/tax"
import { VERSEMENT_LIBERATOIRE_RATES, ACRE_REDUCTION } from "@/constants/taxRates"
import { formatPercent } from "@/lib/utils"
import { Euro, Info } from "lucide-react"

interface RevenueInputProps {
  revenue: number
  activityType: TaxInputs["activityType"]
  hasVersementLiberatoire: boolean
  hasACRE: boolean
  acrePhase: TaxInputs["acrePhase"]
  onRevenueChange: (value: number) => void
  onVersementLiberatoireChange: (value: boolean) => void
  onACREChange: (value: boolean) => void
  onAcrePhaseChange: (phase: TaxInputs["acrePhase"]) => void
}

export function RevenueInput({
  revenue,
  activityType,
  hasVersementLiberatoire,
  hasACRE,
  acrePhase,
  onRevenueChange,
  onVersementLiberatoireChange,
  onACREChange,
  onAcrePhaseChange,
}: RevenueInputProps) {
  function handleRevenueChange(e: ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(e.target.value.replace(/\s/g, "")) || 0
    onRevenueChange(value)
  }

  const vlRate = VERSEMENT_LIBERATOIRE_RATES[activityType]
  const acreLabel = acrePhase === "first_half_2026"
    ? `Exonération 50% (avant juillet 2026)`
    : `Exonération 25% (à partir de juillet 2026)`

  return (
    <div className="space-y-5">
      {/* Chiffre d'affaires */}
      <div className="space-y-2">
        <Label htmlFor="revenue" className="flex items-center gap-2 text-base font-semibold">
          <Euro className="h-4 w-4 text-primary" />
          Chiffre d'affaires annuel HT
        </Label>
        <div className="relative">
          <Input
            id="revenue"
            type="number"
            min={0}
            step={100}
            value={revenue || ""}
            onChange={handleRevenueChange}
            placeholder="Ex : 45 000"
            className="h-12 pr-10 text-lg font-semibold"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
        </div>
      </div>

      {/* Versement libératoire */}
      <div className="rounded-lg border p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="vl-switch" className="font-semibold cursor-pointer">
              Versement libératoire de l'IR
            </Label>
            <p className="text-xs text-muted-foreground">
              Payer l'impôt directement via l'URSSAF au taux de {formatPercent(vlRate)} du CA
            </p>
          </div>
          <Switch
            id="vl-switch"
            checked={hasVersementLiberatoire}
            onCheckedChange={onVersementLiberatoireChange}
          />
        </div>
        {hasVersementLiberatoire && (
          <div className="flex items-center gap-1.5 pt-1">
            <Info className="h-3 w-3 text-blue-500" />
            <p className="text-xs text-blue-700">
              Taux applicable : <strong>{formatPercent(vlRate)}</strong> — Conditions d'éligibilité : RFR ≤ 29 315 €/part
            </p>
          </div>
        )}
      </div>

      {/* ACRE */}
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="acre-switch" className="font-semibold cursor-pointer">
              Bénéficier de l'ACRE
            </Label>
            <p className="text-xs text-muted-foreground">
              Exonération partielle de cotisations sociales (1ère année)
            </p>
          </div>
          <Switch
            id="acre-switch"
            checked={hasACRE}
            onCheckedChange={onACREChange}
          />
        </div>
        {hasACRE && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Période de création :</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onAcrePhaseChange("first_half_2026")}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  acrePhase === "first_half_2026"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-accent"
                }`}
              >
                Avant juillet 2026
              </button>
              <button
                onClick={() => onAcrePhaseChange("second_half_2026")}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  acrePhase === "second_half_2026"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:bg-accent"
                }`}
              >
                À partir de juillet 2026
              </button>
            </div>
            <Badge variant="info" className="text-xs">
              {acreLabel} · Taux ACRE : {formatPercent(ACRE_REDUCTION[acrePhase] * 100)}
            </Badge>
          </div>
        )}
      </div>
    </div>
  )
}
