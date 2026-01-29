import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ScraperDataPayload {
  source_name: string
  source_url: string
  data_type: string
  compliance_area: string
  scraped_data: any
  metadata?: any
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify API key for authentication
    const apiKey = request.headers.get('x-api-key')
    
    // In production, verify the API key
    // if (!apiKey || apiKey !== process.env.SCRAPER_API_KEY) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const payload: ScraperDataPayload = await request.json()

    // Validate required fields
    if (!payload.source_name || !payload.data_type || !payload.scraped_data) {
      return NextResponse.json(
        { error: 'Missing required fields: source_name, data_type, and scraped_data are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Store scraped data
    const { data: scrapedRecord, error: insertError } = await supabase
      .from('scraped_compliance_data')
      .insert({
        source_name: payload.source_name,
        source_url: payload.source_url || null,
        data_type: payload.data_type,
        compliance_area: payload.compliance_area || 'general',
        scraped_data: payload.scraped_data,
        metadata: payload.metadata || {},
        status: 'pending'
      })
      .select()
      .single()

    if (insertError) {
      console.error('[v0] Error inserting scraped data:', insertError)
      throw insertError
    }

    // Optionally: Trigger AI analysis on the scraped data
    // This could analyze the scraped compliance data and generate insights
    const analysisResult = await analyzeScrapedData(scrapedRecord, supabase)

    // Update status to processed
    await supabase
      .from('scraped_compliance_data')
      .update({ 
        status: 'processed',
        processed_at: new Date().toISOString()
      })
      .eq('id', scrapedRecord.id)

    return NextResponse.json({
      success: true,
      id: scrapedRecord.id,
      analysis: analysisResult,
      message: 'Scraped data received and processed successfully'
    })
  } catch (error: any) {
    console.error('[v0] Scraper API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to process scraped data' },
      { status: 500 }
    )
  }
}

async function analyzeScrapedData(scrapedRecord: any, supabase: any) {
  // Simulate AI analysis of scraped compliance data
  // In production, this would call your AI analyzer service
  
  const mockAnalysis = {
    summary: `Analyzed ${scrapedRecord.data_type} data from ${scrapedRecord.source_name}`,
    key_findings: [
      'New compliance regulation identified',
      'Updated requirements for data privacy',
      'Changes to industry standards'
    ],
    impact_score: Math.floor(Math.random() * 30) + 70,
    recommendations: [
      'Review current policies against new requirements',
      'Update documentation to reflect changes',
      'Schedule compliance audit'
    ]
  }

  // Store analysis history
  await supabase
    .from('analysis_history')
    .insert({
      analysis_type: 'scraped_data',
      source_id: scrapedRecord.id,
      analysis_result: mockAnalysis,
      status: 'completed'
    })

  return mockAnalysis
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams
    const dataType = searchParams.get('data_type')
    const complianceArea = searchParams.get('compliance_area')
    const status = searchParams.get('status')

    let query = supabase
      .from('scraped_compliance_data')
      .select('*')
      .order('scraped_at', { ascending: false })

    if (dataType) {
      query = query.eq('data_type', dataType)
    }
    if (complianceArea) {
      query = query.eq('compliance_area', complianceArea)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    })
  } catch (error: any) {
    console.error('[v0] Error fetching scraped data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch scraped data' },
      { status: 500 }
    )
  }
}
