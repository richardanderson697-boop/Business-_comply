import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import styles from './styles.module.css'

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

function getStatusClass(status: string) {
  switch (status) {
    case 'completed':
      return styles.statusCompleted
    case 'analyzing':
      return styles.statusAnalyzing
    case 'pending':
      return styles.statusPending
    case 'failed':
      return styles.statusFailed
    default:
      return ''
  }
}

function getSeverityClass(severity: string) {
  switch (severity) {
    case 'high':
      return styles.severityHigh
    case 'medium':
      return styles.severityMedium
    case 'low':
      return styles.severityLow
    default:
      return ''
  }
}

export default async function DashboardPage() {
  const documents = await getDocumentsWithAnalysis()

  return (
    <div className={styles.container}>
      <div className={`${styles.maxWidth} ${styles.spacing}`}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.headerTitle}>
              Compliance Dashboard
            </h1>
            <p className={styles.headerSubtitle}>
              Monitor document compliance and detected issues
            </p>
          </div>
          <Link href="/upload" className={styles.button}>
            Upload Document
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              No documents uploaded yet. Upload your first compliance document to get started.
            </p>
            <Link href="/upload" className={styles.button} style={{ marginTop: '1rem' }}>
              Upload Document
            </Link>
          </div>
        ) : (
          <div className={styles.spacing}>
            {documents.map((doc: any) => {
              const analysis = doc.analysis_results?.[0]
              const issues = doc.compliance_issues || []

              return (
                <div key={doc.id} className={styles.documentCard}>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <div style={{ flex: 1 }}>
                        <h2 className={styles.cardTitle}>{doc.title}</h2>
                        <p className={styles.cardSubtitle}>
                          Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`${styles.badge} ${getStatusClass(doc.status)}`}>
                        {doc.status}
                      </span>
                    </div>

                    {analysis && (
                      <div className={styles.statsGrid}>
                        <div className={styles.statBox}>
                          <p className={styles.statLabel}>Compliance Score</p>
                          <p className={styles.statValue}>{analysis.compliance_score}%</p>
                        </div>
                        <div className={styles.statBox}>
                          <p className={styles.statLabel}>Issues Found</p>
                          <p className={styles.statValue}>{analysis.issues_found}</p>
                        </div>
                        <div className={styles.statBox}>
                          <p className={styles.statLabel}>Analyzed</p>
                          <p className={styles.statValueSmall}>
                            {new Date(analysis.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {analysis && (
                      <div className={styles.summary}>
                        <p className={styles.summaryTitle}>Summary</p>
                        <p className={styles.summaryText}>{analysis.summary}</p>
                      </div>
                    )}

                    {issues.length > 0 && (
                      <div className={styles.issuesSection}>
                        <h3 className={styles.issuesTitle}>Compliance Issues Detected</h3>
                        {issues.map((issue: ComplianceIssue) => (
                          <div key={issue.id} className={styles.issueCard}>
                            <div className={styles.issueHeader}>
                              <div style={{ flex: 1 }}>
                                <div className={styles.issueTagRow}>
                                  <span className={`${styles.badge} ${getSeverityClass(issue.severity)}`}>
                                    {issue.severity}
                                  </span>
                                  <span className={styles.issueType}>{issue.issue_type}</span>
                                </div>
                                <p className={styles.issueLocation}>{issue.location}</p>
                              </div>
                            </div>
                            <p className={styles.issueDescription}>{issue.description}</p>
                            <div className={styles.recommendation}>
                              <p className={styles.recommendationLabel}>Recommendation</p>
                              <p className={styles.recommendationText}>{issue.recommendation}</p>
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
