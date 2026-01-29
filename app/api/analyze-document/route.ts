import { NextRequest, NextResponse } from 'next/server'

// Mock AI analysis function
function analyzeDocumentContent(content: string, fileName: string) {
  const issues = []
  const contentLower = content.toLowerCase()

  // Check for common compliance keywords
  if (contentLower.includes('gdpr') || contentLower.includes('data protection')) {
    issues.push({
      type: 'data_privacy',
      severity: 'high',
      description: 'Document mentions GDPR or data protection regulations',
      recommendation: 'Ensure data processing activities comply with GDPR requirements'
    })
  }

  if (contentLower.includes('security') || contentLower.includes('cybersecurity')) {
    issues.push({
      type: 'security',
      severity: 'medium',
      description: 'Security-related content detected',
      recommendation: 'Review security controls and implement necessary safeguards'
    })
  }

  if (contentLower.includes('compliance') || contentLower.includes('regulation')) {
    issues.push({
      type: 'compliance',
      severity: 'medium',
      description: 'Compliance or regulatory content identified',
      recommendation: 'Verify compliance with applicable regulations'
    })
  }

  // Calculate compliance score
  const score = Math.max(0, 100 - (issues.length * 15))

  return {
    score,
    issues,
    summary: `Analyzed ${fileName}: Found ${issues.length} potential compliance issues`,
    analyzed_at: new Date().toISOString()
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Read file content
    const buffer = await file.arrayBuffer()
    const content = Buffer.from(buffer).toString('utf-8')

    console.log('[v0] Analyzing document:', file.name)

    // Perform AI analysis
    const analysis = analyzeDocumentContent(content, file.name)

    console.log('[v0] Analysis complete:', analysis)

    return NextResponse.json({
      success: true,
      document: {
        id: Date.now().toString(),
        title: file.name,
        file_type: file.type,
        file_size: file.size,
        status: 'analyzed'
      },
      analysis
    })
  } catch (error: any) {
    console.error('[v0] Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze document' },
      { status: 500 }
    )
  }
}
