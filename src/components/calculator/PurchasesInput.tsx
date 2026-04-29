import { useState } from "react"
import { Purchase } from "@/types/tax"
import { TVA_RATES } from "@/constants/taxRates"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { Plus, Trash2, ShoppingCart, Receipt } from "lucide-react"

interface PurchasesInputProps {
  purchases: Purchase[]
  onAdd: (purchase: Omit<Purchase, "id">) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<Omit<Purchase, "id">>) => void
}

const TVA_OPTIONS = [
  { label: "TVA 20% (taux normal)", value: TVA_RATES.normal },
  { label: "TVA 10% (taux intermédiaire)", value: TVA_RATES.intermediaire },
  { label: "TVA 5,5% (taux réduit)", value: TVA_RATES.reduit },
  { label: "TVA 2,1% (taux super-réduit)", value: TVA_RATES.superReduit },
]

interface FormState {
  description: string
  amount: string
  tvaRate: number
}

const EMPTY_FORM: FormState = { description: "", amount: "", tvaRate: TVA_RATES.normal }

export function PurchasesInput({ purchases, onAdd, onRemove, onUpdate: _onUpdate }: PurchasesInputProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [showForm, setShowForm] = useState(false)

  const totalTVADeductible = purchases.reduce((sum, p) => sum + p.amount * (p.tvaRate / 100), 0)
  const totalAchats = purchases.reduce((sum, p) => sum + p.amount, 0)

  function handleAdd() {
    const amount = parseFloat(form.amount)
    if (!form.description.trim() || isNaN(amount) || amount <= 0) return
    onAdd({ description: form.description.trim(), amount, tvaRate: form.tvaRate })
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-base font-semibold">
          <ShoppingCart className="h-4 w-4 text-primary" />
          Achats professionnels
        </Label>
        {!showForm && (
          <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Ajouter
          </Button>
        )}
      </div>

      {/* Formulaire d'ajout */}
      {showForm && (
        <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
          <p className="text-sm font-medium">Nouvel achat</p>
          <div className="space-y-2">
            <Label htmlFor="purchase-desc" className="text-xs">Description</Label>
            <Input
              id="purchase-desc"
              placeholder="Ex : Ordinateur portable, logiciel, matériel…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="purchase-amount" className="text-xs">Montant HT (€)</Label>
              <Input
                id="purchase-amount"
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchase-tva" className="text-xs">Taux TVA</Label>
              <Select
                value={String(form.tvaRate)}
                onValueChange={(v) => setForm((f) => ({ ...f, tvaRate: Number(v) }))}
              >
                <SelectTrigger id="purchase-tva">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TVA_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd} className="flex-1">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter l'achat
            </Button>
            <Button size="sm" variant="outline" onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}>
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Liste des achats */}
      {purchases.length > 0 ? (
        <div className="space-y-2">
          {purchases.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border px-4 py-3 bg-background hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.description}</p>
                <p className="text-xs text-muted-foreground">
                  HT : {formatCurrency(p.amount)} · TVA {p.tvaRate}% : {formatCurrency(p.amount * (p.tvaRate / 100))}
                </p>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onRemove(p.id)}
                className="ml-2 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Résumé achats */}
          <div className="rounded-lg border bg-blue-50 p-3 mt-2">
            <div className="flex items-start gap-2">
              <Receipt className="h-4 w-4 text-blue-600 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-blue-800">Récapitulatif des achats</p>
                <p className="text-xs text-blue-700">
                  Total HT : <strong>{formatCurrency(totalAchats)}</strong>
                </p>
                <p className="text-xs text-blue-700">
                  TVA déductible : <strong>{formatCurrency(totalTVADeductible)}</strong>
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  ⚠️ La TVA est déductible uniquement si vous êtes assujetti à la TVA (CA &gt; seuil de franchise)
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <ShoppingCart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucun achat enregistré</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ajoutez vos achats professionnels pour calculer la TVA déductible
          </p>
        </div>
      )}
    </div>
  )
}
