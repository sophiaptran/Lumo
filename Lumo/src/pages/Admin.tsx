import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { createCustomer, createMerchant, createAccount, createPurchase, getMerchantsNearby, getCustomers, getAccountPurchases } from '@/lib/nessie'

export default function Admin() {
  const [log, setLog] = useState<string>('')

  const append = (s: string) => setLog((prev) => `${prev}\n${s}`)

  return (
    <div className="min-h-screen w-full bg-black text-white p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin / Staff</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-xl border border-white/10 p-4 bg-white/5">
          <h2 className="font-medium mb-2">Create Customer</h2>
          <form onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(form)
            try {
              const res = await createCustomer({
                first_name: String(fd.get('first_name')||''),
                last_name: String(fd.get('last_name')||''),
                address: {
                  street_number: String(fd.get('street_number')||''),
                  street_name: String(fd.get('street_name')||''),
                  city: String(fd.get('city')||''),
                  state: String(fd.get('state')||''),
                  zip: String(fd.get('zip')||''),
                }
              })
              append(`Customer created: ${res._id}`)
              form.reset()
            } catch (err: any) {
              append(`Error: ${err?.message||err}`)
            }
          }} className="grid grid-cols-2 gap-2 text-sm">
            <input name="first_name" placeholder="First name" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="last_name" placeholder="Last name" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="street_number" placeholder="Street number" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="street_name" placeholder="Street name" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="city" placeholder="City" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="state" placeholder="State (IL)" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="zip" placeholder="ZIP" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <div className="col-span-2 flex justify-end"><button className="bg-white text-black px-4 py-2 rounded-md">Create</button></div>
          </form>
        </section>

        <section className="rounded-xl border border-white/10 p-4 bg-white/5">
          <h2 className="font-medium mb-2">Create Merchant</h2>
          <form onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(form)
            try {
              const res = await createMerchant({
                name: String(fd.get('name')||''),
                category: String(fd.get('category')||'').split(',').map(s=>s.trim()).filter(Boolean),
                address: {
                  street_number: String(fd.get('street_number')||''),
                  street_name: String(fd.get('street_name')||''),
                  city: String(fd.get('city')||''),
                  state: String(fd.get('state')||''),
                  zip: String(fd.get('zip')||''),
                },
                geocode: {
                  lat: Number((document.getElementById('map-lat') as HTMLInputElement)?.value || fd.get('lat') || 0),
                  lng: Number((document.getElementById('map-lng') as HTMLInputElement)?.value || fd.get('lng') || 0),
                }
              })
              append(`Merchant created: ${res._id}`)
              form.reset()
            } catch (err: any) {
              append(`Error: ${err?.message||err}`)
            }
          }} className="grid grid-cols-2 gap-2 text-sm">
            <input name="name" placeholder="Name" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="category" placeholder="Categories (comma)" className="bg-transparent border border-white/10 rounded-md p-2" />
            <input name="street_number" placeholder="Street number" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="street_name" placeholder="Street name" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="city" placeholder="City" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="state" placeholder="State (IL)" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="zip" placeholder="ZIP" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input id="map-lat" name="lat" placeholder="Lat" className="bg-transparent border border-white/10 rounded-md p-2" />
            <input id="map-lng" name="lng" placeholder="Lng" className="bg-transparent border border-white/10 rounded-md p-2" />
            <div className="col-span-2 flex justify-end"><button className="bg-white text-black px-4 py-2 rounded-md">Create</button></div>
          </form>
        </section>

        <section className="rounded-xl border border-white/10 p-4 bg-white/5">
          <h2 className="font-medium mb-2">Search Merchants</h2>
          <MapPicker />
        </section>

        <section className="rounded-xl border border-white/10 p-4 bg-white/5 md:col-span-2">
          <h2 className="font-medium mb-2">All Customers</h2>
          <button
            className="mb-3 bg-white text-black px-4 py-2 rounded-md"
            onClick={async ()=>{
              try {
                const cs = await getCustomers()
                append(`Loaded ${Array.isArray(cs)? cs.length:0} customers`)
                const list = document.getElementById('customers-list')
                if (list) list.innerHTML = ''
                ;(Array.isArray(cs)? cs: []).forEach((c:any)=>{
                  const li = document.createElement('li')
                  li.className = 'flex justify-between gap-2 border-b border-white/10 pb-1'
                  li.innerHTML = `<span class=\"truncate\">${c.first_name||''} ${c.last_name||''}</span><span class=\"text-white/50 font-mono text-[10px] break-all\">${c._id||''}</span>`
                  if (c?._id) {
                    const btn = document.createElement('button')
                    btn.className = 'text-red-400 text-xs underline ml-2'
                    btn.textContent = 'Delete'
                    btn.onclick = async () => {
                      try {
                        await deleteCustomer(c._id)
                        append(`Deleted ${c._id}`)
                        li.remove()
                      } catch (e:any) {
                        append(`Error deleting ${c._id}: ${e?.message||e}`)
                      }
                    }
                    li.appendChild(btn)
                  }
                  list?.appendChild(li)
                })
              } catch (e:any) {
                append(`Error: ${e?.message||e}`)
              }
            }}
          >Refresh</button>
          <ul id="customers-list" className="max-h-64 overflow-auto text-sm space-y-1"></ul>
        </section>

        <section className="rounded-xl border border-white/10 p-4 bg-white/5">
          <h2 className="font-medium mb-2">Create Account</h2>
          <form onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(form)
            try {
              const res = await createAccount(String(fd.get('customerId')||''), {
                type: String(fd.get('type')||'Checking'),
                nickname: String(fd.get('nickname')||'Main'),
                rewards: Number(fd.get('rewards')||0),
                balance: Number(fd.get('balance')||0),
              })
              append(`Account created: ${res._id}`)
              form.reset()
            } catch (err: any) {
              append(`Error: ${err?.message||err}`)
            }
          }} className="grid grid-cols-2 gap-2 text-sm">
            <input name="customerId" placeholder="Customer ID" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="type" placeholder="Type (Checking)" className="bg-transparent border border-white/10 rounded-md p-2" />
            <input name="nickname" placeholder="Nickname" className="bg-transparent border border-white/10 rounded-md p-2" />
            <input name="rewards" placeholder="Rewards" type="number" className="bg-transparent border border-white/10 rounded-md p-2" />
            <input name="balance" placeholder="Balance" type="number" step="0.01" className="bg-transparent border border-white/10 rounded-md p-2" />
            <div className="col-span-2 flex justify-end"><button className="bg-white text-black px-4 py-2 rounded-md">Create</button></div>
          </form>
        </section>

        <section className="rounded-xl border border-white/10 p-4 bg-white/5">
          <h2 className="font-medium mb-2">Create Purchase</h2>
          <form onSubmit={async (e) => {
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(form)
            try {
              const res = await createPurchase(String(fd.get('accountId')||''), {
                merchant_id: String(fd.get('merchantId')||''),
                medium: 'balance',
                purchase_date: String(fd.get('purchase_date')||''),
                amount: Number(fd.get('amount')||0),
                status: 'completed',
                description: String(fd.get('description')||'')
              })
              append(`Purchase created: ${res._id}`)
              form.reset()
            } catch (err: any) {
              append(`Error: ${err?.message||err}`)
            }
          }} className="grid grid-cols-2 gap-2 text-sm">
            <input name="accountId" placeholder="Account ID" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="merchantId" placeholder="Merchant ID" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="purchase_date" placeholder="YYYY-MM-DD" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="amount" type="number" step="0.01" placeholder="Amount" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="description" placeholder="Description" className="bg-transparent border border-white/10 rounded-md p-2" />
            <div className="col-span-2 flex justify-end"><button className="bg-white text-black px-4 py-2 rounded-md">Create</button></div>
          </form>
        </section>

        <section className="rounded-xl border border-white/10 p-4 bg-white/5 md:col-span-2">
          <h2 className="font-medium mb-2">Account Purchases</h2>
          <form onSubmit={async (e)=>{
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(form)
            const accId = String(fd.get('accId')||'')
            try {
              const ps = await getAccountPurchases(accId)
              const list = document.getElementById('purchases-list')
              if (list) list.innerHTML = ''
              ;(Array.isArray(ps)? ps: []).forEach((p:any)=>{
                const li = document.createElement('li')
                li.className = 'flex justify-between gap-2 border-b border-white/10 pb-1'
                li.innerHTML = `<span class=\"truncate\">${p.description||'Purchase'} • ${p.purchase_date||''}</span><span class=\"text-white/50\">$${Number(p.amount||0).toFixed(2)}</span>`
                list?.appendChild(li)
              })
            } catch (e:any) {
              append(`Error: ${e?.message||e}`)
            }
          }} className="flex gap-2 mb-3 text-sm">
            <input name="accId" placeholder="Account ID" className="flex-1 bg-transparent border border-white/10 rounded-md p-2" required />
            <button className="bg-white text-black px-4 py-2 rounded-md">Load</button>
          </form>
          <ul id="purchases-list" className="max-h-64 overflow-auto text-sm space-y-1"></ul>
        </section>

        <section className="rounded-xl border border-white/10 p-4 bg-white/5 md:col-span-2">
          <h2 className="font-medium mb-2">Bulk Generate Purchases (x50)</h2>
          <form className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm" onSubmit={async (e)=>{
            e.preventDefault()
            const form = e.currentTarget as HTMLFormElement
            const fd = new FormData(form)
            const accId = String(fd.get('accId')||'')
            const lat = Number(fd.get('lat')||41.8781)
            const lng = Number(fd.get('lng')||-87.6298)
            const rad = Number(fd.get('rad')||10)
            if (!accId) return
            append(`Fetching merchants within ${rad}mi...`)
            try {
              const merchants = await getMerchantsNearby(lat, lng, rad)
              if (!Array.isArray(merchants) || merchants.length === 0) {
                append('No merchants found in radius. Try a different area or increase radius.')
                return
              }
              append(`Creating 50 purchases using ${merchants.length} merchants...`)
              const today = new Date()
              for (let i=0;i<50;i++) {
                const m = merchants[Math.floor(Math.random()*merchants.length)]
                const d = new Date(today)
                d.setDate(d.getDate() - Math.floor(Math.random()*30))
                const dateStr = d.toISOString().slice(0,10)
                const amt = Number((Math.random()*100).toFixed(2))
                try {
                  await createPurchase(accId, { merchant_id: String(m._id||''), medium: 'balance', purchase_date: dateStr, amount: amt, status: 'completed', description: `Auto ${i+1} at ${m.name||'Merchant'}` })
                } catch {}
              }
              append('Done. Load purchases to view.')
            } catch (err:any) {
              append(`Error: ${err?.message||err}`)
            }
          }}>
            <input name="accId" placeholder="Account ID" className="bg-transparent border border-white/10 rounded-md p-2" required />
            <input name="lat" placeholder="Lat (default 41.8781)" className="bg-transparent border border-white/10 rounded-md p-2" />
            <input name="lng" placeholder="Lng (default -87.6298)" className="bg-transparent border border-white/10 rounded-md p-2" />
            <input name="rad" placeholder="Radius mi (default 10)" className="bg-transparent border border-white/10 rounded-md p-2" />
            <div className="col-span-2 md:col-span-4 flex justify-end">
              <button className="bg-white text-black px-4 py-2 rounded-md">Generate</button>
            </div>
          </form>
        </section>
      </div>

      <pre className="mt-6 text-xs bg-black/40 border border-white/10 rounded-lg p-3 whitespace-pre-wrap">{log.trim()}</pre>
    </div>
  )
}

function MapPicker() {
  const [position, setPosition] = useState<[number, number]>([41.8781, -87.6298])
  const [nearby, setNearby] = useState<any[]>([])
  const [searching, setSearching] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng
        setPosition([lat, lng])
        const latEl = document.getElementById('map-lat') as HTMLInputElement | null
        const lngEl = document.getElementById('map-lng') as HTMLInputElement | null
        if (latEl) latEl.value = String(lat)
        if (lngEl) lngEl.value = String(lng)
        // Fetch merchants nearby on pin drop
        setSearching(true)
        setErr(null)
        getMerchantsNearby(lat, lng, 5)
          .then((ms) => {
            setNearby(Array.isArray(ms) ? ms : [])
          })
          .catch((e) => {
            console.error(e)
            setErr('Search failed. Try another spot or increase radius.')
            setNearby([])
          })
          .finally(() => setSearching(false))
      },
    })
    return <CircleMarker center={position} radius={8} pathOptions={{ color: '#fff' }} />
  }

  return (
    <>
      <div className="h-64 rounded-md overflow-hidden border border-white/10">
        <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker />
        </MapContainer>
      </div>
      <div className="mt-2 text-xs">
        <p className="text-white/70 mb-1">Nearby merchants (rad 5mi):</p>
        <p className="text-white/50 mb-1">Lat: {position[0].toFixed(5)}, Lng: {position[1].toFixed(5)}</p>
        {searching && <p className="text-white/60">Searching…</p>}
        {err && <p className="text-red-400">{err}</p>}
        {!searching && !err && nearby.length ? (
          <ul className="max-h-32 overflow-auto space-y-1">
            {nearby.map((m: any) => {
              const cats = Array.isArray(m?.category)
                ? m.category
                : (typeof m?.category === 'string' ? [m.category] : [])
              return (
                <li key={m._id || `${m.name}-${Math.random()}`} className="flex justify-between gap-2 border-b border-white/10 pb-1">
                  <div className="min-w-0">
                    <span className="block truncate">{m.name || 'Merchant'}</span>
                    {m._id && (
                      <span className="text-white/50 font-mono text-[10px] break-all">{m._id}</span>
                    )}
                  </div>
                  <span className="text-white/50 whitespace-nowrap">{cats.join(', ')}</span>
                </li>
              )
            })}
          </ul>
        ) : !searching && !err ? (
          <p className="text-white/50">Drop a pin to search.</p>
        ) : null}
      </div>
    </>
  )
}


