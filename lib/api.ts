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

// Define a type for the DMC data
type DMCCreateData = {
  dmcName: string
  primaryContact: string
  phoneNumber: string
  primaryPhoneExtension: string
  designation: string
  ownerName: string
  ownerPhoneNumber: string
  ownerPhoneExtension: string
  email: string
  website?: string
  primaryCountry: string
  destinationsCovered?: string
  cities?: string
  gstRegistration: string
  gstNo?: string
  yearOfRegistration?: string
  panNo: string
  panType: string
  headquarters?: string
  country: string
  yearOfExperience?: string
}

export const createDMC = async (data: DMCCreateData) => {
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