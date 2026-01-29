export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Business Comply
          </h1>
          <p className="text-xl text-muted-foreground">
            Business compliance management platform
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 space-y-2">
            <h2 className="text-xl font-semibold">Compliance Tracking</h2>
            <p className="text-sm text-muted-foreground">
              Monitor and track compliance requirements across your organization.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 space-y-2">
            <h2 className="text-xl font-semibold">Risk Assessment</h2>
            <p className="text-sm text-muted-foreground">
              Identify and assess potential compliance risks and vulnerabilities.
            </p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 space-y-2">
            <h2 className="text-xl font-semibold">Reporting</h2>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive compliance reports and documentation.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
