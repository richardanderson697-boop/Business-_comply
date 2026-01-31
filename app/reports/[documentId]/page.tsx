import Link from 'next/link'
import { ShieldCheck, ArrowLeft, FileText, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

// This would fetch from API in production
const mockDocument = {
  id: '1',
  title: 'Q4 2025 Compliance Audit Report.pdf',
  uploaded_at: new Date().toISOString(),
  status: 'completed',
  analysis_results: [{
    id: 'ar1',
    compliance_score: 87,
    issues_found: 3,
    summary: 'Document shows generally good compliance with minor issues identified in data handling procedures and consent documentation. The analysis cross-referenced 247 regulatory requirements across GDPR, CCPA, and industry-specific standards.',
    created_at: new Date().toISOString(),
    regulations_checked: ['GDPR', 'CCPA', 'ISO 27001', 'SOC 2', 'HIPAA'],
    total_sections_analyzed: 12,
    compliant_sections: 9,
  }],
  compliance_issues: [
    {
      id: '1',
      issue_type: 'Data Protection',
      severity: 'high',
      description: 'Missing explicit consent for data processing activities in Section 3.2. The current language implies consent but does not provide clear opt-in mechanisms as required by regulatory standards.',
      location: 'Page 5, Section 3.2 - Data Collection Procedures',
      recommendation: 'Add explicit consent clauses with clear opt-in checkboxes. Update privacy policy to align with GDPR Article 6(1)(a) requirements for freely given, specific, informed and unambiguous consent.',
      regulatory_citation: 'GDPR Article 6(1)(a) - Lawfulness of processing based on consent',
      citation_url: 'https://gdpr-info.eu/art-6-gdpr/',
    },
    {
      id: '2',
      issue_type: 'Documentation',
      severity: 'medium',
      description: 'Incomplete audit trail documentation for access controls. Current logs do not capture sufficient detail for compliance verification including timestamp precision and user authentication methods.',
      location: 'Page 12, Section 7.1 - Access Control Logs',
      recommendation: 'Implement comprehensive logging system that captures: user ID, timestamp (to millisecond precision), resource accessed, action performed, IP address, and authentication method. Maintain records for minimum 3 years as per regulatory requirements.',
      regulatory_citation: 'ISO 27001:2013 A.12.4.1 - Event logging',
      citation_url: 'https://www.iso.org/standard/54534.html',
    },
    {
      id: '3',
      issue_type: 'Security',
      severity: 'low',
      description: 'Password policy does not specify expiration requirements or complexity standards that meet current best practices for credential management.',
      location: 'Page 8, Section 5.3 - Authentication Requirements',
      recommendation: 'Define comprehensive password policy including: minimum 12 characters, mixture of uppercase/lowercase/numbers/symbols, 90-day expiration, prevention of last 5 passwords reuse, and mandatory MFA for privileged accounts.',
      regulatory_citation: 'NIST SP 800-63B - Digital Identity Guidelines',
      citation_url: 'https://pages.nist.gov/800-63-3/sp800-63b.html',
    },
  ],
}

export default function ReportPage({ params }: { params: { documentId: string } }) {
  const document = mockDocument
  const analysis = document.analysis_results[0]
  const issues = document.compliance_issues

  const highIssues = issues.filter(i => i.severity === 'high').length
  const mediumIssues = issues.filter(i => i.severity === 'medium').length
  const lowIssues = issues.filter(i => i.severity === 'low').length

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg">Business Comply</span>
            </Link>
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Report Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{document.title}</h1>
              <p className="text-muted-foreground">
                Compliance Analysis Report • Generated {new Date(analysis.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Compliance Score</p>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-4xl font-bold text-primary">{analysis.compliance_score}%</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Issues</p>
            <p className="text-4xl font-bold">{analysis.issues_found}</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-red-500">{highIssues} high</span>
              <span className="text-orange-500">{mediumIssues} med</span>
              <span className="text-yellow-500">{lowIssues} low</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">Sections Analyzed</p>
            <p className="text-4xl font-bold">{analysis.total_sections_analyzed}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {analysis.compliant_sections} compliant
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-sm text-muted-foreground mb-2">Regulations Checked</p>
            <p className="text-4xl font-bold">{analysis.regulations_checked.length}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {analysis.regulations_checked.join(', ')}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Executive Summary</h2>
          <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Compliance Issues */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-destructive" />
            <h2 className="text-2xl font-semibold">Compliance Issues Found</h2>
          </div>

          {issues.map((issue, index) => (
            <div 
              key={issue.id} 
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              {/* Issue Header */}
              <div className={`p-6 border-l-4 ${
                issue.severity === 'high' ? 'border-l-red-500 bg-red-500/5' :
                issue.severity === 'medium' ? 'border-l-orange-500 bg-orange-500/5' :
                'border-l-yellow-500 bg-yellow-500/5'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        issue.severity === 'high' ? 'bg-red-500 text-white' :
                        issue.severity === 'medium' ? 'bg-orange-500 text-white' :
                        'bg-yellow-500 text-black'
                      }`}>
                        {issue.severity} Priority
                      </span>
                      <span className="text-sm font-semibold">{issue.issue_type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{issue.location}</p>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-3">Issue Description</h3>
                <p className="leading-relaxed mb-4">{issue.description}</p>

                <div className="bg-background/50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-semibold mb-2 text-green-600">Recommended Action</h4>
                  <p className="text-sm leading-relaxed">{issue.recommendation}</p>
                </div>

                <div className="bg-background/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">Regulatory Citation</h4>
                  <p className="text-sm mb-2">{issue.regulatory_citation}</p>
                  <a 
                    href={issue.citation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View full regulation →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Items */}
        <div className="mt-8 bg-primary/10 border border-primary/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">1.</span>
              <span>Review all {highIssues} high-priority issues and assign owners for immediate remediation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">2.</span>
              <span>Create action plan for {mediumIssues} medium-priority issues within 30 days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">3.</span>
              <span>Schedule follow-up compliance scan after implementing recommended changes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">4.</span>
              <span>Document all remediation efforts for audit trail purposes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
