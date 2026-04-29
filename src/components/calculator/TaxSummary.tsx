import { TaxResult } from "@/types/tax"
import { ACTIVITY_LABELS } from "@/constants/taxRates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Wallet } from "lucide-react"

interface TaxSummaryProps {
  result: TaxResult
  irEstimate: number
}

export function TaxSummary({ result, irEstimate }: TaxSummaryProps) {
  const totalAvecIR = result.cotisationsSociales.amountAfterACRE + irEstimate
  const revenueNetApresIR = result.revenue - totalAvecIR - (result.tva.franchiseApplicable ? 0 : Math.max(0, result.tva.tvaSolde))

  const revenueNetPercent = result.revenue > 0 ? (revenueNetApresIR / result.revenue) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Alerte dépassement seuil */}
      {result.depassementSeuil && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Dépassement du plafond de CA</AlertTitle>
          <AlertDescription>
            Votre CA de {formatCurrency(result.revenue)} dépasse le plafond de {formatCurrency(result.seuilCA)} pour{" "}
            <strong>{ACTIVITY_LABELS[result.activityType]}</strong>. Vous risquez de perdre le statut
            d'auto-entrepreneur.
          </AlertDescription>
        </Alert>
      )}

      {/* Alerte TVA assujettissement */}
      {result.tva.revenueExceedsSeuil && !result.depassementSeuil && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Franchise TVA dépassée</AlertTitle>
          <AlertDescription>
            Votre CA dépasse le seuil de franchise TVA ({formatCurrency(result.tva.seuilFranchise)}). Vous devez
            collecter et reverser la TVA.
          </AlertDescription>
        </Alert>
      )}

      {/* Carte résumé principal */}
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Résumé fiscal</CardTitle>
            <Badge variant={result.depassementSeuil ? "destructive" : "success"} className="text-xs">
              {result.depassementSeuil ? "Seuil dépassé" : "Statut valide"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Métriques clés */}
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              label="CA brut"
              value={formatCurrency(result.revenue)}
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              color="green"
            />
            <MetricCard
              label="Revenu net estimé"
              value={formatCurrency(revenueNetApresIR)}
              sub={`${revenueNetPercent.toFixed(0)}% du CA`}
              icon={<Wallet className="h-4 w-4 text-primary" />}
              color="primary"
            />
          </div>

          <Separator />

          {/* Détail des charges */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-foreground">Charges estimées</p>

            <LineItem
              label={`Cotisations sociales (${formatPercent(result.cotisationsSociales.rateAfterACRE)})`}
              value={result.cotisationsSociales.amountAfterACRE}
              sub={result.cotisationsSociales.rateAfterACRE !== result.cotisationsSociales.rate
                ? `Taux normal : ${formatPercent(result.cotisationsSociales.rate)} — Réduction ACRE appliquée`
                : undefined}
            />

            <LineItem
              label={
                result.versementLiberatoire.applicable
                  ? `Impôt (VL — ${formatPercent(result.versementLiberatoire.rate)})`
                  : `Impôt sur le revenu (estimé)`
              }
              value={irEstimate}
              sub={
                result.versementLiberatoire.applicable
                  ? "Versement libératoire"
                  : `Après abattement ${formatPercent(result.abattementFiscal.rate)} → base imposable ${formatCurrency(result.abattementFiscal.revenueApresAbattement)}`
              }
            />

            {!result.tva.franchiseApplicable && result.tva.tvaSolde > 0 && (
              <LineItem
                label={`TVA nette à reverser`}
                value={result.tva.tvaSolde}
                sub={`Collectée ${formatCurrency(result.tva.tvaCollectee)} − Déductible ${formatCurrency(result.tva.tvaDeductible)}`}
              />
            )}
          </div>

          <Separator />

          {/* Total charges */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="font-semibold text-foreground">Total charges</span>
            </div>
            <div className="text-right">
              <p className="font-bold text-destructive text-lg">{formatCurrency(totalAvecIR)}</p>
              <p className="text-xs text-muted-foreground">
                Taux effectif global : {formatPercent(result.tauxEffectifGlobal)}
              </p>
            </div>
          </div>

          {/* Franchise TVA info */}
          {result.tva.franchiseApplicable && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 px-3 py-2 mt-2">
              <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
              <p className="text-xs text-green-700">
                <strong>Franchise en base de TVA</strong> — Vous n'êtes pas assujetti à la TVA (CA ≤ {formatCurrency(result.tva.seuilFranchise)})
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ── Sous-composants internes ──────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ReactNode
  color: "green" | "primary"
}) {
  return (
    <div className={`rounded-lg p-3 border ${color === "green" ? "bg-green-50 border-green-100" : "bg-primary/5 border-primary/10"}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`font-bold text-lg ${color === "green" ? "text-green-800" : "text-primary"}`}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

function LineItem({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-border/50 last:border-0">
      <div className="flex-1 mr-4">
        <p className="text-sm text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      <p className="text-sm font-semibold text-foreground whitespace-nowrap">{formatCurrency(value)}</p>
    </div>
  )
}
