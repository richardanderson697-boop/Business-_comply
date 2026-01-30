import Link from 'next/link'
import { Shield, Upload, FileText, AlertTriangle, CheckCircle2, Clock, TrendingUp } from 'lucide-react'

// Mock data for demonstration
const mockDocuments = [
  {
    id: '1',
    title: 'Sample Compliance Document.pdf',
    uploaded_at: new Date().toISOString(),
    status: 'completed',
    analysis_results: [{
      compliance_score: 87,
      issues_found: 3,
      summary: 'Document shows generally good compliance with minor issues identified in data handling procedures and consent documentation.',
      created_at: new Date().toISOString()
    }],
    compliance_issues: [
      {
        id: '1',
        issue_type: 'Data Protection',
        severity: 'high',
        description: 'Missing explicit consent for data processing activities in Section 3.2',
        location: 'Page 5, Section 3.2',
        recommendation: 'Add explicit consent clauses and update privacy policy to align with GDPR Article 6(1)(a)'
      },
      {
        id: '2',
        issue_type: 'Documentation',
        severity: 'medium',
        description: 'Incomplete audit trail documentation for access controls',
        location: 'Page 12, Section 7.1',
        recommendation: 'Implement comprehensive logging system and maintain records for minimum 3 years'
      },
      {
        id: '3',
        issue_type: 'Security',
        severity: 'low',
        description: 'Password policy does not specify expiration requirements',
        location: 'Page 8, Section 5.3',
        recommendation: 'Define password expiration policy (recommended: 90 days) and enforce regular updates'
      }
    ]
  }
]

function getStatusConfig(status: string) {
  switch (status) {
    case 'completed':
      return { color: 'text-accent bg-accent/10 border-accent/20', icon: CheckCircle2 }
    case 'analyzing':
      return { color: 'text-primary bg-primary/10 border-primary/20', icon: Clock }
    case 'pending':
      return { color: 'text-muted-foreground bg-muted border-border', icon: Clock }
    case 'failed':
      return { color: 'text-destructive bg-destructive/10 border-destructive/20', icon: AlertTriangle }
    default:
      return { color: 'text-muted-foreground bg-muted border-border', icon: FileText }
  }
}

function getSeverityConfig(severity: string) {
  switch (severity) {
    case 'high':
      return { color: 'text-destructive bg-destructive/10 border-destructive/20', icon: AlertTriangle }
    case 'medium':
      return { color: 'text-orange-400 bg-orange-400/10 border-orange-400/20', icon: AlertTriangle }
    case 'low':
      return { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: AlertTriangle }
    default:
      return { color: 'text-muted-foreground bg-muted border-border', icon: AlertTriangle }
  }
}

export default function DashboardPage() {
  const documents = mockDocuments

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Business Comply</span>
          </Link>
          <Link 
            href="/upload" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Compliance Dashboard</h1>
          <p className="text-muted-foreground leading-relaxed">
            Monitor document compliance scores and detected issues
          </p>
        </div>

        {documents.length === 0 ? (
          // Empty State
          <div className="max-w-md mx-auto text-center py-16">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Upload your first compliance document to get started with AI-powered analysis
            </p>
            <Link 
              href="/upload" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {documents.map((doc: any) => {
              const analysis = doc.analysis_results?.[0]
              const issues = doc.compliance_issues || []
              const statusConfig = getStatusConfig(doc.status)
              const StatusIcon = statusConfig.icon

              return (
                <div key={doc.id} className="rounded-lg border border-border bg-card overflow-hidden">
                  {/* Document Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg font-semibold mb-1 truncate">{doc.title}</h2>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {new Date(doc.uploaded_at).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {doc.status}
                      </div>
                    </div>

                    {/* Stats Grid */}
                    {analysis && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-secondary border border-border">
                          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                            <TrendingUp className="h-3.5 w-3.5" />
                            Compliance Score
                          </div>
                          <div className="text-2xl font-bold text-primary">{analysis.compliance_score}%</div>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary border border-border">
                          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Issues Found
                          </div>
                          <div className="text-2xl font-bold">{analysis.issues_found}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary border border-border">
                          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                            <Clock className="h-3.5 w-3.5" />
                            Analyzed
                          </div>
                          <div className="text-xs font-medium mt-1">
                            {new Date(analysis.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary */}
                  {analysis && (
                    <div className="p-6 border-b border-border bg-secondary/50">
                      <h3 className="text-sm font-semibold mb-2">Analysis Summary</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {analysis.summary}
                      </p>
                    </div>
                  )}

                  {/* Issues */}
                  {issues.length > 0 && (
                    <div className="p-6">
                      <h3 className="text-sm font-semibold mb-4">Compliance Issues Detected</h3>
                      <div className="space-y-4">
                        {issues.map((issue: any) => {
                          const severityConfig = getSeverityConfig(issue.severity)
                          const SeverityIcon = severityConfig.icon

                          return (
                            <div 
                              key={issue.id} 
                              className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${severityConfig.color}`}>
                                  <SeverityIcon className="h-3 w-3" />
                                  {issue.severity}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-muted-foreground">
                                      {issue.issue_type}
                                    </span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <span className="text-xs text-muted-foreground">
                                      {issue.location}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm mb-3 leading-relaxed">{issue.description}</p>
                              
                              <div className="rounded-md bg-accent/5 border border-accent/10 p-3">
                                <div className="flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-xs font-medium text-accent mb-1">Recommendation</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {issue.recommendation}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
