const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

interface ApiResponse<T> {
  data?: T
  error?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    // Load token from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { error: errorData.message || "Request failed" }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error("[v0] API request failed:", error)
      return { error: "Network error" }
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ access_token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(data: {
    email: string
    password: string
    firstName: string
    lastName: string
    organizationName: string
  }) {
    return this.request<{ access_token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCurrentUser() {
    return this.request<any>("/users/me")
  }

  // Document endpoints
  async uploadDocument(file: File) {
    const formData = new FormData()
    formData.append("file", file)

    const headers: Record<string, string> = {}
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}/documents/upload`, {
        method: "POST",
        headers,
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        return { error: errorData.message || "Upload failed" }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      console.error("[v0] Document upload failed:", error)
      return { error: "Upload failed" }
    }
  }

  async getDocuments(page = 1, limit = 20) {
    return this.request<{ documents: any[]; total: number }>(`/documents?page=${page}&limit=${limit}`)
  }

  async getDocument(id: string) {
    return this.request<any>(`/documents/${id}`)
  }

  async deleteDocument(id: string) {
    return this.request<{ success: boolean }>(`/documents/${id}`, {
      method: "DELETE",
    })
  }

  // Analysis endpoints
  async createAnalysis(data: { documentId: string; frameworks: string[] }) {
    return this.request<{ analysisId: string }>("/analysis", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getAnalysis(id: string) {
    return this.request<any>(`/analysis/${id}`)
  }

  async listAnalyses() {
    return this.request<any[]>("/analysis")
  }

  async getDashboardStats() {
    return this.request<any>("/analysis/dashboard-stats")
  }

  // PDF endpoints
  async generatePDF(analysisId: string) {
    return this.request<{ pdfUrl: string }>(`/pdf/generate/${analysisId}`, {
      method: "POST",
    })
  }

  async downloadPDF(analysisId: string) {
    // This returns a blob, handle differently
    const headers: Record<string, string> = {}
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(`${this.baseUrl}/pdf/download/${analysisId}`, {
        headers,
      })

      if (!response.ok) {
        return { error: "Download failed" }
      }

      const blob = await response.blob()
      return { data: blob }
    } catch (error) {
      console.error("[v0] PDF download failed:", error)
      return { error: "Download failed" }
    }
  }

  // Billing endpoints
  async createCheckout(priceId: string) {
    return this.request<{ url: string }>("/billing/create-checkout", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    })
  }

  async getSubscription() {
    return this.request<any>("/billing/subscription")
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request<any>("/admin/stats")
  }

  async getUsageLogs(page = 1, limit = 50) {
    return this.request<any>(`/admin/usage-logs?page=${page}&limit=${limit}`)
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
