import { useTaxCalculator } from "@/hooks/useTaxCalculator"
import { ActivitySelector } from "./ActivitySelector"
import { RevenueInput } from "./RevenueInput"
import { PurchasesInput } from "./PurchasesInput"
import { TaxSummary } from "./TaxSummary"
import { InfoPanel } from "./InfoPanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calculator } from "lucide-react"

export function TaxCalculator() {
  const {
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
  } = useTaxCalculator()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
            <Calculator className="h-4 w-4" />
            Auto-entrepreneur France 2026
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Calculateur de taxes
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Estimez vos cotisations sociales, impôts et TVA en fonction de votre chiffre d'affaires. Taux officiels URSSAF 2026.
          </p>
        </div>

        {/* Corps principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche — Saisie */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Paramètres de votre activité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ActivitySelector
                  value={inputs.activityType}
                  onChange={setActivityType}
                />

                <Separator />

                <RevenueInput
                  revenue={inputs.revenue}
                  activityType={inputs.activityType}
                  hasVersementLiberatoire={inputs.hasVersementLiberatoire}
                  hasACRE={inputs.hasACRE}
                  acrePhase={inputs.acrePhase}
                  onRevenueChange={setRevenue}
                  onVersementLiberatoireChange={setHasVersementLiberatoire}
                  onACREChange={setHasACRE}
                  onAcrePhaseChange={setAcrePhase}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Achats et TVA déductible</CardTitle>
              </CardHeader>
              <CardContent>
                <PurchasesInput
                  purchases={inputs.purchases}
                  onAdd={addPurchase}
                  onRemove={removePurchase}
                  onUpdate={updatePurchase}
                />
              </CardContent>
            </Card>

            <InfoPanel activityType={inputs.activityType} />
          </div>

          {/* Colonne droite — Résultats */}
          <div className="space-y-4">
            {result && irEstimate !== null ? (
              <TaxSummary result={result} irEstimate={irEstimate} />
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                  <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="font-semibold text-foreground">Entrez votre chiffre d'affaires</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Les résultats s'afficheront automatiquement
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Tableau comparatif rapide */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ventilation mensuelle estimée</CardTitle>
                </CardHeader>
                <CardContent>
                  <MonthlyBreakdown revenue={inputs.revenue} irEstimate={irEstimate ?? 0} cotisations={result.cotisationsSociales.amountAfterACRE} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Pied de page légal */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          Ces calculs sont donnés à titre indicatif. Consultez un expert-comptable pour une situation personnalisée.
          Taux 2026 — Sources : URSSAF, service-public.fr, légifrance.fr
        </p>
      </div>
    </div>
  )
}

function MonthlyBreakdown({
  revenue,
  cotisations,
  irEstimate,
}: {
  revenue: number
  cotisations: number
  irEstimate: number
}) {
  const monthly = (v: number) => (v / 12).toFixed(2)
  const rows = [
    { label: "CA mensuel brut", value: revenue / 12, color: "text-green-700" },
    { label: "Cotisations sociales", value: cotisations / 12, color: "text-red-600" },
    { label: "Impôt (estimé)", value: irEstimate / 12, color: "text-orange-600" },
    { label: "Revenu net mensuel", value: (revenue - cotisations - irEstimate) / 12, color: "text-primary font-bold" },
  ]

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
          <span className="text-sm text-muted-foreground">{row.label}</span>
          <span className={`text-sm ${row.color}`}>
            {parseFloat(monthly(row.value)) >= 0
              ? `${parseFloat(monthly(row.value)).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`
              : `−${Math.abs(parseFloat(monthly(row.value))).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}`}
          </span>
        </div>
      ))}
    </div>
  )
}
