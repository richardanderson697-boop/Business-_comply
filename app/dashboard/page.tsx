import Link from 'next/link'
import styles from './styles.module.css'

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

export default function DashboardPage() {
  const documents = mockDocuments

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
                        {issues.map((issue: any) => (
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
