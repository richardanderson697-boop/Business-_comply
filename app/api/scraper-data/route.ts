import { NextRequest, NextResponse } from 'next/server'

interface ScraperDataPayload {
  source_name: string
  source_url?: string
  data_type: string
  compliance_area?: string
  scraped_data: any
  metadata?: any
}

// In-memory storage for testing (in production, use a database)
const scrapedDataStore: any[] = []

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Scraper API: Received POST request')
    
    // Optional: Verify API key for authentication
    const apiKey = request.headers.get('x-api-key')
    console.log('[v0] API Key received:', apiKey ? 'Yes' : 'No')
    
    const payload: ScraperDataPayload = await request.json()
    console.log('[v0] Payload received:', JSON.stringify(payload, null, 2))

    // Validate required fields
    if (!payload.source_name || !payload.data_type || !payload.scraped_data) {
      return NextResponse.json(
        { error: 'Missing required fields: source_name, data_type, and scraped_data are required' },
        { status: 400 }
      )
    }

    // Create record
    const record = {
      id: `scraped_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      source_name: payload.source_name,
      source_url: payload.source_url || null,
      data_type: payload.data_type,
      compliance_area: payload.compliance_area || 'general',
      scraped_data: payload.scraped_data,
      metadata: payload.metadata || {},
      status: 'pending',
      scraped_at: new Date().toISOString()
    }

    console.log('[v0] Created record:', record.id)

    // Store in memory
    scrapedDataStore.push(record)

    // Analyze the scraped data
    const analysisResult = analyzeScrapedData(record)
    console.log('[v0] Analysis completed:', analysisResult)

    // Update status
    record.status = 'processed'
    record.processed_at = new Date().toISOString()
    record.analysis = analysisResult

    return NextResponse.json({
      success: true,
      id: record.id,
      analysis: analysisResult,
      message: 'Scraped data received and processed successfully',
      record: record
    })
  } catch (error: any) {
    console.error('[v0] Scraper API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process scraped data' },
      { status: 500 }
    )
  }
}

function analyzeScrapedData(record: any) {
  console.log('[v0] Analyzing scraped data from:', record.source_name)
  
  // Simulate AI analysis of scraped compliance data
  const complianceIssues = detectComplianceIssues(record.scraped_data)
  
  const analysis = {
    summary: `Analyzed ${record.data_type} data from ${record.source_name}`,
    compliance_area: record.compliance_area,
    data_type: record.data_type,
    key_findings: complianceIssues.findings,
    issues_detected: complianceIssues.issues.length,
    impact_score: complianceIssues.impact_score,
    issues: complianceIssues.issues,
    recommendations: complianceIssues.recommendations,
    analyzed_at: new Date().toISOString()
  }

  return analysis
}

function detectComplianceIssues(scrapedData: any) {
  // Simulate compliance issue detection based on scraped data
  const issues: any[] = []
  const findings: string[] = []
  const recommendations: string[] = []
  
  // Check if data contains compliance-related keywords
  const dataString = JSON.stringify(scrapedData).toLowerCase()
  
  if (dataString.includes('gdpr') || dataString.includes('data privacy')) {
    findings.push('Data privacy regulation detected')
    issues.push({
      severity: 'high',
      type: 'data_privacy',
      title: 'GDPR Compliance Required',
      description: 'New data privacy requirements identified',
      location: 'scraped_data.content'
    })
    recommendations.push('Review and update data privacy policies')
  }
  
  if (dataString.includes('security') || dataString.includes('encryption')) {
    findings.push('Security requirement identified')
    issues.push({
      severity: 'medium',
      type: 'security',
      title: 'Security Standards Update',
      description: 'Updated security requirements detected',
      location: 'scraped_data.security_requirements'
    })
    recommendations.push('Implement enhanced security measures')
  }
  
  if (dataString.includes('regulation') || dataString.includes('compliance')) {
    findings.push('New compliance regulation identified')
    issues.push({
      severity: 'high',
      type: 'regulatory',
      title: 'Regulatory Change Detected',
      description: 'New or updated regulations require attention',
      location: 'scraped_data.regulations'
    })
    recommendations.push('Schedule compliance audit')
  }
  
  // Default findings if no specific keywords found
  if (findings.length === 0) {
    findings.push('Compliance data successfully ingested')
    findings.push('Data available for review')
    recommendations.push('Review scraped data for relevant compliance information')
  }
  
  // Calculate impact score based on issues detected
  const impact_score = Math.min(100, 50 + (issues.length * 15) + Math.floor(Math.random() * 20))
  
  return {
    findings,
    issues,
    impact_score,
    recommendations
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[v0] Scraper API: Received GET request')
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const dataType = searchParams.get('data_type')
    const complianceArea = searchParams.get('compliance_area')
    const status = searchParams.get('status')

    console.log('[v0] Filters - dataType:', dataType, 'complianceArea:', complianceArea, 'status:', status)

    let filteredData = [...scrapedDataStore]

    if (dataType) {
      filteredData = filteredData.filter(item => item.data_type === dataType)
    }
    if (complianceArea) {
      filteredData = filteredData.filter(item => item.compliance_area === complianceArea)
    }
    if (status) {
      filteredData = filteredData.filter(item => item.status === status)
    }

    // Sort by most recent first
    filteredData.sort((a, b) => new Date(b.scraped_at).getTime() - new Date(a.scraped_at).getTime())

    console.log('[v0] Returning', filteredData.length, 'records')

    return NextResponse.json({
      success: true,
      data: filteredData,
      count: filteredData.length
    })
  } catch (error: any) {
    console.error('[v0] Error fetching scraped data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch scraped data' },
      { status: 500 }
    )
  }
}
