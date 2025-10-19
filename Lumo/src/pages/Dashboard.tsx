
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import supabase from '@/assets/supabase-client'
import { useSession } from '@/session'
import { BentoGrid, BentoGridItem } from '@/components/ui/dashboard'
import { PieCharts } from '@/components/ui/pie-chart'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { cn } from '@/lib/utils'
import { MonthlyBarGraph } from '@/components/ui/bar-graph'
import { getCustomerAccounts, getAccountPurchases, getCustomerBills, getMerchant, type NessieAccount, type NessiePurchase, type NessieBill } from '@/lib/nessie'

function capitalize(word: string) {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export default function Dashboard() {
  const [fullName, setFullName] = useState<string>('')
  const { session } = useSession()
  const currencyFmt = useMemo(() => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }), [])
  const allowedCategories = useMemo(() => new Set(['Food', 'Travel', 'Entertainment', 'Bills', 'Groceries', 'Dining', 'Shopping', 'Utilities']), [])
  const [customerId, setCustomerId] = useState<string>('')
  const [accounts, setAccounts] = useState<NessieAccount[]>([])
  const [purchases, setPurchases] = useState<NessiePurchase[]>([])
  const [bills, setBills] = useState<NessieBill[]>([])

  useEffect(() => {
    const email = session?.email || localStorage.getItem('userEmail') || ''
    if (!email) return

    ;(async () => {
      const { data, error } = await supabase
        .from('userLogin')
        .select('first_name, last_name')
        .eq('email', email)
        .limit(1)
        .single()
      if (!error && data) {
        const first = capitalize(data.first_name as string)
        const last = capitalize(data.last_name as string)
        setFullName(`${first} ${last}`)
      }
    })()
  }, [session?.email])

  useEffect(() => {
    const stored = localStorage.getItem('nessieCustomerId') || ''
    setCustomerId(stored)
  }, [])

  useEffect(() => {
    if (!customerId) return
    ;(async () => {
      try {
        const accs = await getCustomerAccounts(customerId)
        setAccounts(accs)
        const allPurchases: NessiePurchase[] = []
        for (const a of accs) {
          try {
            const ps = await getAccountPurchases(a._id)
            allPurchases.push(...ps)
          } catch {}
        }
        // Enrich categories by merchant lookup if missing
        const enriched: NessiePurchase[] = []
        for (const p of allPurchases) {
          let category = p.category
          if (!category && (p as any).merchant_id) {
            try {
              const m = await getMerchant(String((p as any).merchant_id))
              const cats = Array.isArray(m?.category) ? m.category : (typeof m?.category === 'string' ? [m.category] : [])
              category = cats[0] || 'Other'
            } catch {}
          }
          enriched.push({ ...p, category: category || 'Other' })
        }
        setPurchases(enriched)
        try {
          const bs = await getCustomerBills(customerId)
          setBills(bs)
        } catch {}
      } catch (e) {
        console.error(e)
      }
    })()
  }, [customerId])

  const pieData = useMemo(() => {
    const totals = new Map<string, number>()
    for (const p of purchases) {
      const raw = (p.category || 'Other') as string
      const key = allowedCategories.has(raw) ? raw : 'Other'
      totals.set(key, (totals.get(key) || 0) + (p.amount || 0))
    }
    return Array.from(totals.entries()).map(([name, value]) => ({ name, value: Number(value.toFixed(2)) }))
  }, [purchases, allowedCategories])

  const categorySummary = useMemo(() => {
    const total = purchases.reduce((s, p) => s + (p.amount || 0), 0)
    const byCat = new Map<string, number>()
    for (const p of purchases) {
      const raw = (p.category || 'Other') as string
      const key = allowedCategories.has(raw) ? raw : 'Other'
      byCat.set(key, (byCat.get(key) || 0) + (p.amount || 0))
    }
    const list = Array.from(byCat.entries()).map(([name, value]) => ({
      name,
      value: Number((value).toFixed(2)),
      percent: total > 0 ? Number(((value / total) * 100).toFixed(1)) : 0,
    }))
    list.sort((a, b) => b.value - a.value)
    return { total: Number(total.toFixed(2)), list }
  }, [purchases, allowedCategories])

  const monthlyData = useMemo(() => {
    const byMonth = new Map<string, number>()
    for (const p of purchases) {
      const d = p.purchase_date ? new Date(p.purchase_date) : null
      if (!d) continue
      const key = d.toLocaleString('en-US', { month: 'short' })
      byMonth.set(key, (byMonth.get(key) || 0) + (p.amount || 0))
    }
    const order = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return order.map((m) => ({ month: m, amount: Number(((byMonth.get(m) || 0)).toFixed(2)) }))
  }, [purchases])

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, a) => sum + (a.balance || 0), 0)
  }, [accounts])

  const recentPurchases = useMemo(() => {
    return [...purchases]
      .sort((a, b) => {
        const da = a.purchase_date ? new Date(a.purchase_date).getTime() : 0
        const db = b.purchase_date ? new Date(b.purchase_date).getTime() : 0
        return db - da
      })
      .slice(0, 5)
  }, [purchases])

  const currentMonthTotal = useMemo(() => {
    const now = new Date()
    const m = now.getMonth()
    const y = now.getFullYear()
    return purchases.reduce((sum, p) => {
      if (!p.purchase_date) return sum
      const d = new Date(p.purchase_date)
      return d.getMonth() === m && d.getFullYear() === y ? sum + (p.amount || 0) : sum
    }, 0)
  }, [purchases])

  const rewardsTotal = useMemo(() => {
    return accounts.reduce((sum, a) => sum + (a.rewards || 0), 0)
  }, [accounts])

  const nextBill = useMemo(() => {
    const upcoming = bills
      .filter((b) => b.payment_date && new Date(b.payment_date) >= new Date())
      .sort((a, b) => new Date(a.payment_date || 0).getTime() - new Date(b.payment_date || 0).getTime())
    return upcoming[0]
  }, [bills])

  return (
    <div className="relative z-10">
      <div className="px-6 pt-6">
        <h1 className="text-3xl md:text-4xl font-semibold">Dashboard</h1>
        {fullName && (
          <p className="mt-2 text-white/80 text-lg">Welcome, {fullName}</p>
        )}
        {customerId && (
          <p className="mt-1 text-white/60 text-sm">Nessie ID: <span className="font-mono">{customerId}</span></p>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-12 gap-6 pt-6 pb-12 px-6">
        <div className="col-span-12">
          {!customerId && (
            <div className="mb-6 p-4 border border-white/10 rounded-xl bg-white/5">
              <p className="text-white/80 mb-3">Enter your Nessie customerId to load your data.</p>
              <div className="flex gap-2">
                <input
                  placeholder="Customer ID"
                  defaultValue={customerId}
                  onBlur={(e) => {
                    const v = e.currentTarget.value.trim()
                    setCustomerId(v)
                    if (v) localStorage.setItem('nessieCustomerId', v)
                  }}
                  className="w-full bg-transparent text-sm p-3 rounded-lg border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-white/30"
                />
                <button
                  onClick={(e) => {
                    const parent = (e.currentTarget.previousSibling as HTMLInputElement)
                    const v = parent?.value.trim() || ''
                    setCustomerId(v)
                    if (v) localStorage.setItem('nessieCustomerId', v)
                  }}
                  className="rounded-lg bg-white text-black px-4 text-sm font-medium"
                >Save</button>
              </div>
            </div>
          )}
          <BentoGrid>
            <GlowingBentoItem
              className="md:col-span-4 md:row-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="p-4 sm:p-6">
                <PieCharts
                  data={pieData}
                  colors={colors}
                  title="Spending Breakdown"
                />
                <div className="mt-4 text-sm text-white/80 space-y-1">
                  {categorySummary.list.slice(0, 6).map((c) => (
                    <div key={c.name} className="flex items-center justify-between">
                      <span className="truncate">{c.name}</span>
                      <span className="whitespace-nowrap">{currencyFmt.format(c.value)} · {c.percent}%</span>
                    </div>
                  ))}
                  {categorySummary.list.length === 0 && (
                    <p className="text-white/50">No spending yet.</p>
                  )}
                </div>
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-2 md:row-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-1 opacity-80">Accounts</h2>
                  <p className="text-4xl font-bold text-white">{currencyFmt.format(totalBalance)}</p>
                </div>
                <div className="text-sm opacity-80 space-y-1">
                  {accounts.slice(0, 4).map((a) => (
                    <div key={a._id} className="flex justify-between">
                      <span>{a.nickname || a.type || 'Account'}</span>
                      <span>{currencyFmt.format(Number(a.balance || 0))}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-3"
              gradientFrom="from-slate-800/40"
              gradientTo="to-slate-800/40"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-3 opacity-80">Recent Purchases</h2>
                <div className="space-y-2 divide-y divide-white/20">
                  {recentPurchases.map((p) => (
                    <div key={p._id} className="flex justify-between items-center py-1">
                      <span className="text-sm opacity-80">{p.description || 'Purchase'}</span>
                      <span className="font-medium">-{currencyFmt.format(Number(p.amount || 0))}</span>
                    </div>
                  ))}
                  {recentPurchases.length === 0 && (
                    <p className="text-sm text-white/50">No purchases yet.</p>
                  )}
                </div>
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-3"
              gradientFrom="from-slate-800/40"
              gradientTo="to-slate-800/40"
            >
              <div className="text-white h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-2 opacity-80 text-center">
                  Monthly Spending
                </h2>
                <div className="flex-grow min-h-[150px]">
                  <MonthlyBarGraph data={monthlyData} />
                </div>
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-1 opacity-80">Bills</h2>
                <p className="text-sm opacity-70">Total: {bills.length}</p>
                {nextBill ? (
                  <p className="text-xs opacity-60 mt-1">Next: {nextBill.payee || nextBill.nickname || 'Bill'} on {nextBill.payment_date}</p>
                ) : (
                  <p className="text-xs opacity-60 mt-1">No upcoming bills</p>
                )}
              </div>
            </GlowingBentoItem>

            <GlowingBentoItem
              className="md:col-span-2"
              gradientFrom="from-slate-800/60"
              gradientTo="to-slate-700/60"
            >
              <div className="text-white">
                <h2 className="text-lg font-semibold mb-1 opacity-80">This Month</h2>
                <p className="text-3xl font-bold text-white">{currencyFmt.format(currentMonthTotal)}</p>
                <p className="text-xs opacity-40 mt-1">Total purchases</p>
              </div>
            </GlowingBentoItem>

            {rewardsTotal > 0 && (
              <GlowingBentoItem
                className="md:col-span-2"
                gradientFrom="from-slate-800/60"
                gradientTo="to-slate-700/60"
              >
                <div className="text-white">
                  <h2 className="text-lg font-semibold mb-1 opacity-80">Rewards</h2>
                  <p className="text-3xl font-bold text-white">{rewardsTotal}</p>
                  <p className="text-xs opacity-40 mt-1">Total across accounts</p>
                </div>
              </GlowingBentoItem>
            )}
          </BentoGrid>
        </div>
      </div>
    </div>
  )
}

// Helper component to wrap content and include GlowingEffect correctly
function GlowingBentoItem({
  children,
  className,
  gradientFrom,
  gradientTo,
}: {
  children: ReactNode
  className?: string
  gradientFrom: string
  gradientTo: string
}) {
  return (
    <BentoGridItem
      className={cn(className, 'relative')}
      gradientFrom={gradientFrom}
      gradientTo={gradientTo}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
        className="rounded-[inherit]"
      />
      <div className="relative z-10 h-full p-4 rounded-[inherit]">
        {children}
      </div>
    </BentoGridItem>
  )
}


// Removed demo constants

const colors = {
  Food: '#8B5CF6',
  Travel: '#3B82F6',
  Entertainment: '#14B8A6',
  Bills: '#22D3EE',
}


