import Link from 'next/link'
import { FileText, BarChart3, Database, ArrowRight, Shield, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Business Comply</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/upload" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <CheckCircle2 className="h-4 w-4" />
              AI-Powered Compliance
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
              Automated Compliance
              <span className="block text-primary">Management Platform</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Upload documents for RAG AI analysis to detect non-compliance issues, 
              integrate with compliance data scrapers, and maintain regulatory standards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="/upload" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Upload Document
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/dashboard" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20">
            <Link 
              href="/upload" 
              className="group p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Document Analysis</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Upload documents for AI-powered compliance analysis and automatic issue detection.
              </p>
            </Link>

            <Link 
              href="/dashboard" 
              className="group p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Compliance Dashboard</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                View analyzed documents, compliance scores, and detected issues in real-time.
              </p>
            </Link>

            <div className="group p-6 rounded-lg border border-border bg-card hover:border-muted-foreground/30 transition-all duration-200">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:bg-muted/80 transition-colors">
                <Database className="h-6 w-6 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Data Scraper API</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Accept and analyze data from external compliance scrapers via REST API.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20 pt-20 border-t border-border">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">AI-Powered</div>
              <div className="text-sm text-muted-foreground">Advanced RAG Analysis</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-accent">Real-Time</div>
              <div className="text-sm text-muted-foreground">Instant Compliance Checks</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-foreground">Automated</div>
              <div className="text-sm text-muted-foreground">Issue Detection</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Business Comply - AI-Powered Compliance Management</p>
        </div>
      </footer>
    </div>
  )
}
