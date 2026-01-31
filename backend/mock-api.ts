// Mock API service for testing without real integrations
type User = {
  id: string
  email: string
  name: string
  role: "Admin" | "Compliance Officer" | "Department Head" | "Viewer"
  organizationId: string
  subscription: "Basic" | "Pro" | "Enterprise"
  mfaEnabled: boolean
}

type Document = {
  id: string
  name: string
  uploadedAt: string
  status: "processing" | "completed" | "failed"
  analysisResult?: AnalysisResult
}

type AnalysisResult = {
  overallScore: number
  riskLevel: "Low" | "Medium" | "High"
  findings: Array<{
    category: string
    severity: "Low" | "Medium" | "High" | "Critical"
    description: string
    recommendation: string
  }>
  complianceGaps: string[]
  regulatoryReferences: string[]
}

// Mock data store
const mockUsers = new Map<string, User>()
const mockDocuments = new Map<string, Document>()
const mockAnalytics = {
  totalAnalyses: 42,
  tokensUsed: 125430,
  estimatedCost: 3.76,
  avgResponseTime: 2.3,
}

// Initialize with demo user
mockUsers.set("demo@regbus.com", {
  id: "user-1",
  email: "demo@regbus.com",
  name: "Demo User",
  role: "Admin",
  organizationId: "org-1",
  subscription: "Enterprise",
  mfaEnabled: false,
})

export const mockApi = {
  // Auth
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const user = mockUsers.get(email)
    if (!user || password !== "demo123") {
      throw new Error("Invalid credentials")
    }

    return {
      user,
      token: "mock-jwt-token-" + Date.now(),
    }
  },

  async getCurrentUser(): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockUsers.get("demo@regbus.com")!
  },

  // Document Upload
  async uploadDocument(file: File): Promise<{ documentId: string; uploadUrl: string }> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const documentId = "doc-" + Date.now()
    const doc: Document = {
      id: documentId,
      name: file.name,
      uploadedAt: new Date().toISOString(),
      status: "processing",
    }

    mockDocuments.set(documentId, doc)

    return {
      documentId,
      uploadUrl: "https://mock-s3-url.com/" + documentId,
    }
  },

  // Compliance Analysis (Mock RAG)
  async analyzeDocument(documentId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const doc = mockDocuments.get(documentId)
    if (!doc) throw new Error("Document not found")

    // Mock analysis result
    const analysisResult: AnalysisResult = {
      overallScore: Math.floor(Math.random() * 30) + 70, // 70-100
      riskLevel: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)] as any,
      findings: [
        {
          category: "Data Privacy",
          severity: "Medium",
          description: "Personal data retention period not clearly specified",
          recommendation: "Define explicit data retention policies in accordance with GDPR Article 5",
        },
        {
          category: "Access Control",
          severity: "Low",
          description: "Multi-factor authentication not enforced for all users",
          recommendation: "Implement mandatory MFA for users with elevated privileges",
        },
        {
          category: "Audit Logging",
          severity: "High",
          description: "Insufficient audit trail for administrative actions",
          recommendation: "Enhance logging to capture all system configuration changes",
        },
        {
          category: "Encryption",
          severity: "Critical",
          description: "Data-at-rest encryption not documented",
          recommendation: "Implement AES-256 encryption for sensitive data storage",
        },
      ],
      complianceGaps: [
        "GDPR Article 5 - Data retention principles need clarification",
        "SOC 2 CC6.1 - Logical access controls require enhancement",
        "ISO 27001 A.12.4.1 - Event logging completeness gap identified",
      ],
      regulatoryReferences: [
        "GDPR Article 5, 25, 32",
        "SOC 2 Type II - CC6.1, CC6.6",
        "ISO 27001:2013 - A.9.4.1, A.12.4.1",
        "NIST 800-53 - AC-2, AU-2, SC-13",
      ],
    }

    doc.status = "completed"
    doc.analysisResult = analysisResult
  },

  // Get Documents
  async getDocuments(): Promise<Document[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return Array.from(mockDocuments.values()).sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
  },

  async getDocument(documentId: string): Promise<Document | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockDocuments.get(documentId) || null
  },

  // Admin Analytics
  async getAnalytics() {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return {
      ...mockAnalytics,
      recentAnalyses: [
        { timestamp: new Date(Date.now() - 3600000).toISOString(), tokensUsed: 4230, cost: 0.13 },
        { timestamp: new Date(Date.now() - 7200000).toISOString(), tokensUsed: 5680, cost: 0.17 },
        { timestamp: new Date(Date.now() - 10800000).toISOString(), tokensUsed: 3920, cost: 0.12 },
      ],
    }
  },

  // Subscription
  async upgradeSubscription(tier: "Basic" | "Pro" | "Enterprise"): Promise<{ checkoutUrl: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return {
      checkoutUrl: "https://mock-stripe-checkout.com/session-" + Date.now(),
    }
  },
}
