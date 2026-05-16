import api from './axiosInstance'

export const getEventsAPI = () => api.get('/api/events')
export const createEventAPI = (data) => api.post('/api/events', data)
export const deleteEventAPI = (id) => api.delete(`/api/events/${id}`)
