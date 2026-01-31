import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * GET /api/documents
 * Fetch all documents with their analysis results and compliance issues
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch documents
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select(`
        *,
        analysis_results (*),
        compliance_issues (*)
      `)
      .order('created_at', { ascending: false })

    if (docsError) {
      console.error('[v0] Error fetching documents:', docsError)
      return NextResponse.json({ error: docsError.message }, { status: 500 })
    }

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}
