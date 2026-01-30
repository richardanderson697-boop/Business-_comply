import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, BarChart3, Database, Shield, Zap, CheckCircle2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Business Comply</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link href="/upload">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              <Zap className="h-4 w-4" />
              AI-Powered Compliance
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Automate your compliance management
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Upload documents for intelligent AI analysis to detect non-compliance issues, 
              integrate with compliance data sources, and maintain regulatory standards effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/upload">
                <Button size="lg" className="w-full sm:w-auto">
                  <FileText className="mr-2 h-5 w-5" />
                  Upload Document
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Comprehensive compliance tools</h2>
            <p className="text-muted-foreground">Everything you need to stay compliant and secure</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/upload" className="block group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Document Analysis</CardTitle>
                  <CardDescription>
                    Upload documents for AI-powered compliance analysis and automated issue detection.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/dashboard" className="block group">
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Compliance Dashboard</CardTitle>
                  <CardDescription>
                    View analyzed documents, compliance scores, and track issues across your organization.
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Card className="h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Data Scraper API</CardTitle>
                <CardDescription>
                  Accept and analyze compliance data from external sources via our secure API endpoints.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Stay ahead of compliance requirements
              </h2>
              <p className="text-lg text-muted-foreground">
                Our AI-powered platform analyzes your documents in real-time, identifying potential compliance 
                issues before they become problems. Integrate seamlessly with your existing workflows.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Real-time analysis</h3>
                    <p className="text-muted-foreground">Get instant feedback on compliance status</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Automated monitoring</h3>
                    <p className="text-muted-foreground">Continuously track regulatory changes</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground">Audit-ready reports</h3>
                    <p className="text-muted-foreground">Generate comprehensive compliance documentation</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="space-y-6 p-0">
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-foreground">98%</div>
                  <p className="text-muted-foreground">Accuracy in issue detection</p>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-foreground">10x</div>
                  <p className="text-muted-foreground">Faster compliance reviews</p>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-bold text-foreground">24/7</div>
                  <p className="text-muted-foreground">Continuous monitoring</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Ready to transform your compliance workflow?
          </h2>
          <p className="text-lg text-muted-foreground">
            Start analyzing documents today and stay ahead of regulatory requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/upload">
              <Button size="lg">
                Start Free Analysis
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Business Comply</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered compliance management platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
