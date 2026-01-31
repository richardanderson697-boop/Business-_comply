import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * API endpoint for external scrapers to ingest regulatory data
 * 
 * Expected payload:
 * {
 *   source_name: string,
 *   regulation_title: string,
 *   regulation_text: string,
 *   effective_date: string (ISO date),
 *   url: string,
 *   jurisdiction: string,
 *   category: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log('[v0] Receiving regulatory data from scraper:', data.source_name)

    // Validate required fields
    const required = ['source_name', 'regulation_title', 'regulation_text']
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Insert scraped compliance data
    const { data: inserted, error } = await supabase
      .from('scraped_compliance_data')
      .insert({
        source_name: data.source_name,
        regulation_title: data.regulation_title,
        regulation_text: data.regulation_text,
        effective_date: data.effective_date || null,
        url: data.url || null,
        jurisdiction: data.jurisdiction || null,
        category: data.category || null,
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] Database insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[v0] Regulatory data ingested successfully:', inserted.id)

    // TODO: In production, you would:
    // 1. Generate embeddings for the regulatory text
    // 2. Store embeddings in a vector database
    // 3. Update your RAG knowledge base
    // 4. Optionally re-analyze existing documents against new regulations

    return NextResponse.json({
      success: true,
      id: inserted.id,
      message: 'Regulatory data ingested successfully',
    })
  } catch (error) {
    console.error('[v0] Scraper ingest error:', error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Ingest failed',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Regulatory Data Ingestion API',
    endpoint: '/api/scraper/ingest',
    method: 'POST',
    description: 'Endpoint for external scrapers to submit regulatory data',
    required_fields: ['source_name', 'regulation_title', 'regulation_text'],
    optional_fields: ['effective_date', 'url', 'jurisdiction', 'category'],
  })
}
