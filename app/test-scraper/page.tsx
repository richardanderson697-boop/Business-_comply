'use client'

import { useState } from 'react'
import styles from './styles.module.css'

const samplePayloads = {
  gdpr_update: {
    source_name: "GDPR Compliance Portal",
    source_url: "https://gdpr.eu/compliance/2024",
    data_type: "regulation",
    compliance_area: "data_privacy",
    scraped_data: {
      title: "GDPR Data Privacy Update 2024",
      content: "New GDPR requirements for data privacy and user consent. Organizations must implement enhanced encryption and data protection measures.",
      effective_date: "2024-03-01",
      jurisdiction: "EU",
      requirements: [
        "Enhanced data encryption",
        "User consent management",
        "Data breach notification within 72 hours"
      ]
    },
    metadata: {
      scraper_version: "1.0.0",
      scrape_timestamp: new Date().toISOString()
    }
  },
  security_standard: {
    source_name: "ISO Security Standards",
    source_url: "https://iso.org/security/27001",
    data_type: "standard",
    compliance_area: "information_security",
    scraped_data: {
      title: "ISO 27001:2024 Security Update",
      content: "Updated security standards for information security management. Organizations must implement new encryption protocols and access control measures.",
      version: "2024.1",
      requirements: [
        "Multi-factor authentication required",
        "AES-256 encryption for data at rest",
        "Regular security audits quarterly"
      ]
    },
    metadata: {
      scraper_version: "1.0.0",
      scrape_timestamp: new Date().toISOString()
    }
  },
  financial_regulation: {
    source_name: "Financial Regulatory Authority",
    source_url: "https://finra.gov/regulations/2024",
    data_type: "regulation",
    compliance_area: "financial_compliance",
    scraped_data: {
      title: "Financial Reporting Regulation Update",
      content: "New financial compliance and reporting requirements. Enhanced transparency and audit trail requirements for all financial transactions.",
      effective_date: "2024-06-01",
      jurisdiction: "US",
      requirements: [
        "Quarterly financial audits",
        "Enhanced transaction logging",
        "Real-time compliance monitoring"
      ]
    },
    metadata: {
      scraper_version: "1.0.0",
      scrape_timestamp: new Date().toISOString()
    }
  }
}

export default function TestScraperPage() {
  const [selectedPayload, setSelectedPayload] = useState<string>('gdpr_update')
  const [customPayload, setCustomPayload] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSendTest = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      let payload
      if (customPayload.trim()) {
        payload = JSON.parse(customPayload)
      } else {
        payload = samplePayloads[selectedPayload as keyof typeof samplePayloads]
      }

      console.log('[v0] Sending test payload:', payload)

      const res = await fetch('/api/scraper-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-api-key'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      console.log('[v0] API Response:', data)

      if (!res.ok) {
        throw new Error(data.error || 'API request failed')
      }

      setResponse(data)
    } catch (err: any) {
      console.error('[v0] Test error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewData = async () => {
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/scraper-data')
      const data = await res.json()
      console.log('[v0] Fetched data:', data)
      setResponse(data)
    } catch (err: any) {
      console.error('[v0] Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const currentPayload = samplePayloads[selectedPayload as keyof typeof samplePayloads]

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Test Compliance Data Scraper API</h1>
        <p className={styles.subtitle}>
          Send test data to your scraper API endpoint and view the AI analysis results
        </p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Select Sample Payload</h2>
          
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="gdpr_update"
                checked={selectedPayload === 'gdpr_update'}
                onChange={(e) => setSelectedPayload(e.target.value)}
              />
              <span>GDPR Data Privacy Update</span>
            </label>
            
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="security_standard"
                checked={selectedPayload === 'security_standard'}
                onChange={(e) => setSelectedPayload(e.target.value)}
              />
              <span>ISO Security Standards</span>
            </label>
            
            <label className={styles.radioLabel}>
              <input
                type="radio"
                value="financial_regulation"
                checked={selectedPayload === 'financial_regulation'}
                onChange={(e) => setSelectedPayload(e.target.value)}
              />
              <span>Financial Regulation</span>
            </label>
          </div>

          <div className={styles.payloadPreview}>
            <h3 className={styles.previewTitle}>Payload Preview:</h3>
            <pre className={styles.codeBlock}>
              {JSON.stringify(currentPayload, null, 2)}
            </pre>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Or Use Custom Payload</h2>
          <textarea
            className={styles.textarea}
            placeholder="Paste your custom JSON payload here..."
            value={customPayload}
            onChange={(e) => setCustomPayload(e.target.value)}
            rows={10}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.buttonPrimary}
            onClick={handleSendTest}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Test Data'}
          </button>
          
          <button
            className={styles.buttonSecondary}
            onClick={handleViewData}
            disabled={loading}
          >
            View All Scraped Data
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {response && (
          <div className={styles.response}>
            <h2 className={styles.responseTitle}>API Response</h2>
            <pre className={styles.responseBlock}>
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        <div className={styles.info}>
          <h3 className={styles.infoTitle}>API Endpoint Information</h3>
          <p><strong>POST:</strong> /api/scraper-data</p>
          <p><strong>GET:</strong> /api/scraper-data (with optional query params)</p>
          <p className={styles.infoText}>
            This endpoint accepts compliance data from external scrapers, analyzes it with AI,
            and returns compliance issues, impact scores, and recommendations.
          </p>
        </div>
      </div>
    </div>
  )
}
