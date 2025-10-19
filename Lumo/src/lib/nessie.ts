const API_KEY = '604f5835f357a58e1d4605c970e2be39'

async function nessieRequest(method: 'GET' | 'POST' | 'DELETE', path: string, body?: any): Promise<any> {
  const hasQuery = path.includes('?')
  const sep = hasQuery ? '&' : '?'
  const urls = [
    `/nessie${path}${sep}key=${API_KEY}`,
  ]
  let lastErr: any = null
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'GET' || method === 'DELETE' ? undefined : (body ? JSON.stringify(body) : undefined),
        mode: 'cors',
      })
      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(`Nessie error ${res.status}: ${text}`)
      }
      return await res.json()
    } catch (e) {
      lastErr = e
      // try next url
    }
  }
  throw lastErr || new Error('Nessie request failed')
}

async function nessieGet(path: string): Promise<any> {
  return nessieRequest('GET', path)
}

async function nessiePost(path: string, body: any): Promise<any> {
  return nessieRequest('POST', path, body)
}

function buildQuery(params: Record<string, string | number | undefined>) {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) usp.append(k, String(v))
  })
  return usp.toString()
}

export async function getMerchantsNearby(lat: number, lng: number, rad = 5): Promise<any[]> {
  const q = buildQuery({ lat, lng, rad })
  // Note: path already includes a query, so avoid double '?'
  return nessieRequest('GET', `/merchants?${q}`)
}

export async function getCustomers(): Promise<any[]> {
  return nessieGet('/customers')
}

// Global data reset (if supported by sandbox)
export async function deleteAllData(): Promise<void> {
  await nessieRequest('DELETE', '/data')
}

export async function deleteCustomer(id: string): Promise<void> {
  // Prefer DELETE; fallback to legacy POST .../delete if needed
  try { await nessieRequest('DELETE', `/customers/${id}`); return } catch {}
  await nessieRequest('POST', `/customers/${id}/delete`)
}

export async function deleteAccount(id: string): Promise<void> {
  // Prefer DELETE; fallback to legacy POST .../delete if needed
  try { await nessieRequest('DELETE', `/accounts/${id}`); return } catch {}
  await nessieRequest('POST', `/accounts/${id}/delete`)
}

export async function getMerchants(): Promise<any[]> {
  return nessieGet('/merchants')
}

export async function deleteMerchant(id: string): Promise<void> {
  try { await nessieRequest('DELETE', `/merchants/${id}`); return } catch {}
  await nessieRequest('POST', `/merchants/${id}/delete`)
}

export async function deletePurchase(id: string): Promise<void> {
  try { await nessieRequest('DELETE', `/purchases/${id}`); return } catch {}
  await nessieRequest('POST', `/purchases/${id}/delete`)
}

export async function deleteBill(id: string): Promise<void> {
  try { await nessieRequest('DELETE', `/bills/${id}`); return } catch {}
  await nessieRequest('POST', `/bills/${id}/delete`)
}

export type NessieAccount = {
  _id: string
  nickname?: string
  type?: string
  rewards?: number
  balance?: number
}

export type NessiePurchase = {
  _id: string
  description?: string
  amount: number
  status?: string
  purchase_date?: string
  category?: string
}

export type NessieBill = {
  _id: string
  status?: string
  payee?: string
  nickname?: string
  payment_date?: string
  payment_amount?: number
}

export async function getCustomerAccounts(customerId: string): Promise<NessieAccount[]> {
  return nessieGet(`/customers/${customerId}/accounts`)
}

export async function getAccountPurchases(accountId: string): Promise<NessiePurchase[]> {
  return nessieGet(`/accounts/${accountId}/purchases`)
}

export async function getCustomerBills(customerId: string): Promise<NessieBill[]> {
  return nessieGet(`/customers/${customerId}/bills`)
}

export async function createCustomer(input: {
  first_name: string
  last_name: string
  address: {
    street_number: string
    street_name: string
    city: string
    state: string
    zip: string
  }
}): Promise<{ _id: string }> {
  const data = await nessiePost('/customers', input)
  const id = (data && (data._id || data?.objectCreated?._id || (Array.isArray(data) && data[0]?._id))) || ''
  return { _id: id as string }
}

export async function createMerchant(input: {
  name: string
  category: string[]
  address: { street_number: string; street_name: string; city: string; state: string; zip: string }
  geocode?: { lat: number; lng: number }
}): Promise<{ _id: string }> {
  const data = await nessiePost('/merchants', input)
  const id = (data && (data._id || data?.objectCreated?._id || (Array.isArray(data) && data[0]?._id))) || ''
  return { _id: id as string }
}

export async function createAccount(customerId: string, input: {
  type: string
  nickname: string
  rewards?: number
  balance?: number
}): Promise<{ _id: string }> {
  const data = await nessiePost(`/customers/${customerId}/accounts`, input)
  const id = (data && (data._id || data?.objectCreated?._id || (Array.isArray(data) && data[0]?._id))) || ''
  return { _id: id as string }
}

export async function createPurchase(accountId: string, input: {
  merchant_id: string
  medium: 'balance' | 'rewards'
  purchase_date: string
  amount: number
  status?: string
  description?: string
}): Promise<{ _id: string }> {
  const data = await nessiePost(`/accounts/${accountId}/purchases`, input)
  const id = (data && (data._id || data?.objectCreated?._id || (Array.isArray(data) && data[0]?._id))) || ''
  return { _id: id as string }
}

export async function getMerchant(merchantId: string): Promise<any> {
  return nessieGet(`/merchants/${merchantId}`)
}


