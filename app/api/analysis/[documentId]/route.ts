import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/analysis/[documentId]
 * Fetch detailed analysis results for a specific document
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { documentId } = params

    // Fetch document with all related data
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select(`
        *,
        analysis_results (*),
        compliance_issues (*)
      `)
      .eq('id', documentId)
      .single()

    if (docError) {
      console.error('[v0] Error fetching document:', docError)
      return NextResponse.json({ error: docError.message }, { status: 500 })
    }

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch analysis' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/analysis/[documentId]
 * Trigger re-analysis of a document
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { documentId } = params

    // Verify document exists
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Update status to analyzing
    await supabase
      .from('documents')
      .update({ status: 'analyzing' })
      .eq('id', documentId)

    // TODO: Trigger actual RAG analysis job here
    // For now, return success
    console.log('[v0] Re-analysis triggered for document:', documentId)

    return NextResponse.json({
      success: true,
      message: 'Analysis triggered',
      documentId,
    })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to trigger analysis' },
      { status: 500 }
    )
  }
}
