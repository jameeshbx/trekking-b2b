export const fetchDMCs = async (params: {
  search?: string
  sortBy?: string
  sortOrder?: string
  page?: number
  limit?: number
}) => {
  const query = new URLSearchParams()
  
  if (params.search) query.set('search', params.search)
  if (params.sortBy) query.set('sortBy', params.sortBy)
  if (params.sortOrder) query.set('sortOrder', params.sortOrder)
  if (params.page) query.set('page', params.page.toString())
  if (params.limit) query.set('limit', params.limit.toString())

  const response = await fetch(`/api/dmc?${query.toString()}`)
  if (!response.ok) {
    throw new Error('Failed to fetch DMCs')
  }
  return response.json()
}

export const createDMC = async (data: any) => {
  const response = await fetch('/api/dmc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    throw new Error('Failed to create DMC')
  }
  return response.json()
}