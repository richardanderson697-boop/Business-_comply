import Link from 'next/link'
import { FileSearch, Database, ShieldCheck, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              <span className="font-semibold text-lg">Business Comply</span>
            </div>
            <Link 
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-5xl font-bold tracking-tight text-balance">
            AI-Powered Compliance <br />
            <span className="text-primary">Management Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Automatically analyze business documents against regulatory requirements using semantic RAG technology. 
            Get detailed compliance reports with citations and sources.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileSearch className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Document Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload business documents for AI-powered semantic analysis. Our RAG system cross-references 
              against current regulatory requirements to detect potential compliance issues.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Regulatory Feed Integration</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automatically ingest regulatory updates from external scrapers. Keep your compliance 
              knowledge base current with the latest requirements and standards.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Detailed Reports with Citations</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receive comprehensive compliance reports highlighting non-compliant sections with direct 
              citations to specific regulatory sources and recommended remediation steps.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-card border border-border rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to ensure compliance?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start analyzing your business documents today and maintain regulatory standards with confidence.
          </p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Access Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
