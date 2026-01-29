import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

interface Document {
  id: string
  title: string
  status: string
  uploaded_at: string
  analyzed_at: string | null
  file_size: number
}

interface AnalysisResult {
  id: string
  document_id: string
  compliance_score: number
  issues_found: number
  summary: string
  created_at: string
}

interface ComplianceIssue {
  id: string
  issue_type: string
  severity: string
  description: string
  location: string
  recommendation: string
}

async function getDocumentsWithAnalysis() {
  const supabase = await createClient()
  
  const { data: documents, error } = await supabase
    .from('documents')
    .select(`
      *,
      analysis_results (
        id,
        compliance_score,
        issues_found,
        summary,
        created_at
      ),
      compliance_issues (
        id,
        issue_type,
        severity,
        description,
        location,
        recommendation
      )
    `)
    .order('uploaded_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching documents:', error)
    return []
  }

  return documents || []
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'high':
      return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'medium':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    case 'low':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'completed':
      return 'bg-green-500/10 text-green-600 border-green-500/20'
    case 'analyzing':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    case 'failed':
      return 'bg-destructive/10 text-destructive border-destructive/20'
    default:
      return 'bg-muted text-muted-foreground border-border'
  }
}

export default async function DashboardPage() {
  const documents = await getDocumentsWithAnalysis()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Compliance Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor document compliance and detected issues
            </p>
          </div>
          <Link
            href="/upload"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Upload Document
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              No documents uploaded yet. Upload your first compliance document to get started.
            </p>
            <Link
              href="/upload"
              className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {documents.map((doc: any) => {
              const analysis = doc.analysis_results?.[0]
              const issues = doc.compliance_issues || []

              return (
                <div
                  key={doc.id}
                  className="rounded-lg border bg-card overflow-hidden"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold">{doc.title}</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                          Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`rounded-md border px-3 py-1 text-xs font-medium ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>
                    </div>

                    {analysis && (
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-xs text-muted-foreground">
                            Compliance Score
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {analysis.compliance_score}%
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-xs text-muted-foreground">
                            Issues Found
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {analysis.issues_found}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted p-4">
                          <p className="text-xs text-muted-foreground">
                            Analyzed
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {new Date(analysis.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {analysis && (
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm font-medium">Summary</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {analysis.summary}
                        </p>
                      </div>
                    )}

                    {issues.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold">
                          Compliance Issues Detected
                        </h3>
                        {issues.map((issue: ComplianceIssue) => (
                          <div
                            key={issue.id}
                            className="rounded-lg border bg-background p-4 space-y-2"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`rounded-md border px-2 py-0.5 text-xs font-medium ${getSeverityColor(
                                      issue.severity
                                    )}`}
                                  >
                                    {issue.severity}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {issue.issue_type}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {issue.location}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm">{issue.description}</p>
                            <div className="rounded-md bg-muted p-3 mt-2">
                              <p className="text-xs font-medium text-muted-foreground">
                                Recommendation
                              </p>
                              <p className="text-sm mt-1">{issue.recommendation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
