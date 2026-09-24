const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('dt_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && typeof window !== 'undefined') {
          // Token expired or invalid
          localStorage.removeItem('dt_token');
          localStorage.removeItem('dt_user');
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error(`[API Error] ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Auth methods
  async login(credentials: { email: string; password: string }) {
    return this.request<{ success: boolean; token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMe() {
    return this.request<{ success: boolean; user: any }>('/auth/me');
  }

  // Doctors methods
  async getDoctors(params: Record<string, string | number | undefined> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') query.append(key, String(val));
    });
    return this.request<any>(`/doctors?${query.toString()}`);
  }

  async getDoctorById(id: string) {
    return this.request<any>(`/doctors/${id}`);
  }

  async createDoctor(data: { name: string; specialization: string; hospital: string; phone: string; email: string }) {
    return this.request<any>('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDoctorPatients(doctorId: string, params: Record<string, string | number | undefined> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') query.append(key, String(val));
    });
    return this.request<any>(`/doctors/${doctorId}/patients?${query.toString()}`);
  }

  async addPatientToDoctor(doctorId: string, data: any) {
    return this.request<any>(`/doctors/${doctorId}/patients`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removePatientFromDoctor(doctorId: string, patientId: string) {
    return this.request<any>(`/doctors/${doctorId}/patients/${patientId}`, {
      method: 'DELETE',
    });
  }

  // Patients methods
  async getPatients(params: Record<string, string | number | undefined> = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') query.append(key, String(val));
    });
    return this.request<any>(`/patients?${query.toString()}`);
  }

  async getPatientById(id: string) {
    return this.request<any>(`/patients/${id}`);
  }

  async updatePatient(id: string, data: any) {
    return this.request<any>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePatient(id: string) {
    return this.request<any>(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics methods
  async getAnalyticsSummary() {
    return this.request<any>('/analytics/summary');
  }

  async getAnalyticsTrends(range = '30days') {
    return this.request<any>(`/analytics/trends?range=${range}`);
  }

  async getPatientsPerDoctor() {
    return this.request<any>('/analytics/patients-per-doctor');
  }
}

export const api = new ApiClient();
