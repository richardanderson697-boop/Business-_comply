import Link from 'next/link'
import { ShieldCheck, Upload, FileText, AlertCircle } from 'lucide-react'
import { DocumentUpload } from './components/document-upload'
import { DocumentList } from './components/document-list'

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

export default function DashboardPage() {
  const documents = mockDocuments

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg">Business Comply</span>
            </Link>
            <div className="text-sm text-muted-foreground">
              Dashboard
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            Upload documents for AI analysis against regulatory requirements
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8">
          <DocumentUpload />
        </div>

        {/* Documents Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Documents</h2>
          
          {documents.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                No documents uploaded yet. Upload your first compliance document to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {documents.map((doc: any) => {
                const analysis = doc.analysis_results?.[0]
                const issues = doc.compliance_issues || []

                return (
                  <div key={doc.id} className="bg-card border border-border rounded-lg p-6 space-y-6">
                    {/* Document Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{doc.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Uploaded {new Date(doc.uploaded_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                        doc.status === 'analyzing' ? 'bg-blue-500/10 text-blue-500' :
                        doc.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {doc.status}
                      </span>
                    </div>

                    {/* Analysis Stats */}
                    {analysis && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Compliance Score</p>
                          <p className="text-2xl font-bold text-primary">{analysis.compliance_score}%</p>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Issues Found</p>
                          <p className="text-2xl font-bold">{analysis.issues_found}</p>
                        </div>
                        <div className="bg-background rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-1">Analyzed</p>
                          <p className="text-sm font-medium">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    {analysis && (
                      <div className="bg-background rounded-lg p-4">
                        <p className="text-sm font-medium mb-2">Analysis Summary</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
                      </div>
                    )}

                    {/* Issues */}
                    {issues.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-destructive" />
                            Compliance Issues Detected
                          </h4>
                          <Link
                            href={`/reports/${doc.id}`}
                            className="text-sm text-primary hover:underline font-medium"
                          >
                            View Full Report →
                          </Link>
                        </div>
                        {issues.map((issue: any) => (
                          <div key={issue.id} className="bg-background border-l-4 rounded-lg p-4 space-y-3" style={{
                            borderLeftColor: issue.severity === 'high' ? 'rgb(239 68 68)' : 
                                           issue.severity === 'medium' ? 'rgb(251 146 60)' : 
                                           'rgb(234 179 8)'
                          }}>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    issue.severity === 'high' ? 'bg-red-500/10 text-red-500' :
                                    issue.severity === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                                    'bg-yellow-500/10 text-yellow-500'
                                  }`}>
                                    {issue.severity.toUpperCase()}
                                  </span>
                                  <span className="text-sm font-medium">{issue.issue_type}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{issue.location}</p>
                              </div>
                            </div>
                            <p className="text-sm">{issue.description}</p>
                            <div className="bg-muted/50 rounded p-3">
                              <p className="text-xs font-medium mb-1 text-muted-foreground">Recommendation</p>
                              <p className="text-sm">{issue.recommendation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
