import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Business Comply
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Compliance Management Platform
          </p>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Upload documents for RAG AI analysis to detect non-compliance issues, 
            integrate with compliance data scrapers, and maintain regulatory standards.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/upload" className="rounded-lg border bg-card p-6 space-y-2 hover:bg-card/80 transition-colors">
            <h2 className="text-xl font-semibold">Document Analysis</h2>
            <p className="text-sm text-muted-foreground">
              Upload documents for AI-powered compliance analysis and issue detection.
            </p>
          </Link>
          
          <Link href="/dashboard" className="rounded-lg border bg-card p-6 space-y-2 hover:bg-card/80 transition-colors">
            <h2 className="text-xl font-semibold">Compliance Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              View analyzed documents, compliance scores, and detected issues.
            </p>
          </Link>
          
          <div className="rounded-lg border bg-card p-6 space-y-2">
            <h2 className="text-xl font-semibold">Data Scraper API</h2>
            <p className="text-sm text-muted-foreground">
              Accept and analyze data from external compliance scrapers via API.
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            href="/upload"
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Upload Document
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border bg-card px-6 py-3 text-sm font-semibold hover:bg-card/80"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
