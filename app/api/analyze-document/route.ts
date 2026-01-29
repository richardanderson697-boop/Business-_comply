import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { documentId, fileUrl, fileName } = await request.json()

    if (!documentId || !fileUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Update document status to analyzing
    await supabase
      .from('documents')
      .update({ status: 'analyzing' })
      .eq('id', documentId)

    // Simulate AI analysis (replace with actual AI service call)
    // In production, this would call your backend AI analyzer service
    const mockAnalysis = {
      compliance_score: Math.floor(Math.random() * 30) + 70, // 70-100
      issues_found: Math.floor(Math.random() * 5) + 1,
      summary: `Analysis of ${fileName} completed. Document reviewed for compliance with applicable regulations.`,
      details: {
        document_type: fileName.split('.').pop(),
        pages_analyzed: Math.floor(Math.random() * 20) + 5,
        processing_time: Math.random() * 10 + 2
      }
    }

    // Save analysis result
    const { data: analysisResult, error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        document_id: documentId,
        compliance_score: mockAnalysis.compliance_score,
        issues_found: mockAnalysis.issues_found,
        summary: mockAnalysis.summary,
        analysis_details: mockAnalysis.details
      })
      .select()
      .single()

    if (analysisError) {
      throw analysisError
    }

    // Generate mock compliance issues
    const mockIssues = [
      {
        analysis_id: analysisResult.id,
        document_id: documentId,
        issue_type: 'Data Privacy',
        severity: 'high',
        description: 'Missing data retention policy statement',
        location: 'Section 3.2',
        recommendation: 'Add clear data retention and deletion policies in accordance with GDPR Article 17'
      },
      {
        analysis_id: analysisResult.id,
        document_id: documentId,
        issue_type: 'Security',
        severity: 'medium',
        description: 'Insufficient encryption standards mentioned',
        location: 'Section 5.1',
        recommendation: 'Specify use of AES-256 encryption for data at rest and TLS 1.3 for data in transit'
      },
      {
        analysis_id: analysisResult.id,
        document_id: documentId,
        issue_type: 'Compliance',
        severity: 'low',
        description: 'Minor formatting inconsistency in legal disclaimers',
        location: 'Appendix A',
        recommendation: 'Standardize disclaimer formatting across all sections'
      }
    ]

    // Insert random number of issues (1-3)
    const issuesToInsert = mockIssues.slice(0, mockAnalysis.issues_found)
    const { error: issuesError } = await supabase
      .from('compliance_issues')
      .insert(issuesToInsert)

    if (issuesError) {
      console.error('[v0] Error inserting issues:', issuesError)
    }

    // Update document status to completed
    await supabase
      .from('documents')
      .update({ 
        status: 'completed',
        analyzed_at: new Date().toISOString()
      })
      .eq('id', documentId)

    return NextResponse.json({
      success: true,
      analysisId: analysisResult.id,
      complianceScore: mockAnalysis.compliance_score,
      issuesFound: mockAnalysis.issues_found
    })
  } catch (error: any) {
    console.error('[v0] Analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze document' },
      { status: 500 }
    )
  }
}
