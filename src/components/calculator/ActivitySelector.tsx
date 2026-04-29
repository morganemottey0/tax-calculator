import { ActivityType } from "@/types/tax"
import { ACTIVITY_LABELS, CA_SEUILS, COTISATIONS_RATES } from "@/constants/taxRates"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency, formatPercent } from "@/lib/utils"
import { Briefcase } from "lucide-react"

interface ActivitySelectorProps {
  value: ActivityType
  onChange: (value: ActivityType) => void
}

const ACTIVITIES: ActivityType[] = [
  "vente_marchandises",
  "prestations_bic",
  "liberal_bnc",
  "liberal_cipav",
  "meuble_tourisme",
]

export function ActivitySelector({ value, onChange }: ActivitySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="activity-select" className="flex items-center gap-2 text-base font-semibold">
        <Briefcase className="h-4 w-4 text-primary" />
        Type d'activité
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as ActivityType)}>
        <SelectTrigger id="activity-select" className="h-11">
          <SelectValue placeholder="Sélectionnez votre activité" />
        </SelectTrigger>
        <SelectContent>
          {ACTIVITIES.map((activity) => (
            <SelectItem key={activity} value={activity}>
              <div className="flex flex-col py-1">
                <span className="font-medium">{ACTIVITY_LABELS[activity]}</span>
                <span className="text-xs text-muted-foreground">
                  {formatPercent(COTISATIONS_RATES[activity])} de cotisations · Plafond {formatCurrency(CA_SEUILS[activity])}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Plafond CA : <strong>{formatCurrency(CA_SEUILS[value])}</strong> — Cotisations sociales : <strong>{formatPercent(COTISATIONS_RATES[value])}</strong>
      </p>
    </div>
  )
}
