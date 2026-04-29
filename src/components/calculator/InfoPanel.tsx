import { ActivityType } from "@/types/tax"
import { ACTIVITY_LABELS, CA_SEUILS, COTISATIONS_RATES, ABATTEMENT_RATES, TVA_FRANCHISE_SEUILS, VERSEMENT_LIBERATOIRE_RATES } from "@/constants/taxRates"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { Info, BookOpen } from "lucide-react"

interface InfoPanelProps {
  activityType: ActivityType
}

export function InfoPanel({ activityType }: InfoPanelProps) {
  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
          <BookOpen className="h-4 w-4" />
          Informations fiscales 2026 — {ACTIVITY_LABELS[activityType]}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs text-blue-800">
        <InfoRow label="Plafond CA" value={formatCurrency(CA_SEUILS[activityType])} />
        <InfoRow label="Cotisations sociales" value={formatPercent(COTISATIONS_RATES[activityType])} />
        <InfoRow label="Abattement forfaitaire IR" value={formatPercent(ABATTEMENT_RATES[activityType])} />
        <InfoRow label="Versement libératoire" value={formatPercent(VERSEMENT_LIBERATOIRE_RATES[activityType])} />
        <InfoRow label="Seuil franchise TVA" value={formatCurrency(TVA_FRANCHISE_SEUILS[activityType])} />

        <Separator className="bg-blue-200" />

        <div className="space-y-1.5 pt-1">
          <div className="flex items-start gap-1.5">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            <p>Les cotisations sociales comprennent : retraite, maladie, CSG/CRDS.</p>
          </div>
          <div className="flex items-start gap-1.5">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            <p>ACRE : exonération 50% avant juillet 2026, 25% à partir de juillet 2026.</p>
          </div>
          <div className="flex items-start gap-1.5">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            <p>L'IR estimé est calculé sur le barème progressif après abattement forfaitaire.</p>
          </div>
          <div className="flex items-start gap-1.5">
            <Info className="h-3 w-3 mt-0.5 shrink-0" />
            <p>Facturation électronique obligatoire à partir du 1er septembre 2026.</p>
          </div>
        </div>

        <div className="rounded-md bg-blue-100 border border-blue-300 p-2 text-blue-700">
          <p className="font-semibold mb-0.5">Sources officielles</p>
          <p>URSSAF autoentrepreneur.urssaf.fr · Légifrance · economie.gouv.fr</p>
          <p className="mt-1 italic">Taux valides au 1er janvier 2026.</p>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-blue-700">{label}</span>
      <span className="font-bold text-blue-900">{value}</span>
    </div>
  )
}
