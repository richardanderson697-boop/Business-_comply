import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log('[v0] Processing file upload:', file.name)

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, buffer, {
        contentType: file.type,
      })

    if (uploadError) {
      console.error('[v0] Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(fileName)

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        file_path: publicUrl,
        status: 'pending',
      })
      .select()
      .single()

    if (docError) {
      console.error('[v0] Document insert error:', docError)
      return NextResponse.json({ error: docError.message }, { status: 500 })
    }

    console.log('[v0] Document uploaded successfully:', document.id)

    // Trigger RAG analysis (in a real app, this would be a background job)
    // For now, we'll do a simple simulation
    setTimeout(async () => {
      await performRagAnalysis(document.id, buffer.toString('utf-8'))
    }, 1000)

    return NextResponse.json({ 
      success: true, 
      document 
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 })
  }
}

async function performRagAnalysis(documentId: string, content: string) {
  console.log('[v0] Starting RAG analysis for document:', documentId)
  
  // Update status to analyzing
  await supabase
    .from('documents')
    .update({ status: 'analyzing' })
    .eq('id', documentId)

  // Simulate RAG analysis (in production, this would call your AI/RAG service)
  // This would:
  // 1. Extract text from the document
  // 2. Query your regulatory database using semantic search
  // 3. Use AI to cross-reference and identify issues
  // 4. Generate compliance report with citations
  
  const mockAnalysis = {
    compliance_score: Math.floor(Math.random() * 30) + 70, // 70-100
    issues_found: Math.floor(Math.random() * 5) + 1,
    summary: 'Document has been analyzed against current regulatory requirements. Several areas require attention to ensure full compliance.',
  }

  // Insert analysis results
  const { data: analysis } = await supabase
    .from('analysis_results')
    .insert({
      document_id: documentId,
      ...mockAnalysis,
    })
    .select()
    .single()

  // Insert mock compliance issues
  const mockIssues = [
    {
      document_id: documentId,
      analysis_id: analysis?.id,
      issue_type: 'Data Protection',
      severity: 'high',
      description: 'Missing explicit consent documentation for data processing activities',
      location: 'Section 3.2',
      recommendation: 'Add explicit consent clauses and update privacy policy to align with GDPR Article 6(1)(a)',
      regulatory_citation: 'GDPR Article 6(1)(a) - Lawfulness of processing',
    },
    {
      document_id: documentId,
      analysis_id: analysis?.id,
      issue_type: 'Documentation',
      severity: 'medium',
      description: 'Incomplete audit trail documentation for access controls',
      location: 'Section 7.1',
      recommendation: 'Implement comprehensive logging system and maintain records for minimum 3 years',
      regulatory_citation: 'ISO 27001:2013 A.12.4.1 - Event logging',
    },
  ]

  await supabase
    .from('compliance_issues')
    .insert(mockIssues)

  // Update document status
  await supabase
    .from('documents')
    .update({ status: 'completed' })
    .eq('id', documentId)

  console.log('[v0] RAG analysis completed for document:', documentId)
}
