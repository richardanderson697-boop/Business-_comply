import Link from 'next/link'
import styles from './styles.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={`${styles.maxWidth} ${styles.spacingLarge}`}>
        <div className={`${styles.textCenter} ${styles.spacingMedium}`}>
          <h1 className={styles.heading}>
            Business Comply
          </h1>
          <p className={styles.subheading}>
            AI-Powered Compliance Management Platform
          </p>
          <p className={styles.textMuted} style={{ maxWidth: '42rem', margin: '0 auto' }}>
            Upload documents for RAG AI analysis to detect non-compliance issues, 
            integrate with compliance data scrapers, and maintain regulatory standards.
          </p>
        </div>
        
        <div className={styles.grid}>
          <Link href="/upload" className={styles.card}>
            <h2 className={styles.cardTitle}>Document Analysis</h2>
            <p className={styles.textMuted}>
              Upload documents for AI-powered compliance analysis and issue detection.
            </p>
          </Link>
          
          <Link href="/dashboard" className={styles.card}>
            <h2 className={styles.cardTitle}>Compliance Dashboard</h2>
            <p className={styles.textMuted}>
              View analyzed documents, compliance scores, and detected issues.
            </p>
          </Link>
          
          <Link href="/test-scraper" className={styles.card}>
            <h2 className={styles.cardTitle}>Test Scraper API</h2>
            <p className={styles.textMuted}>
              Test your scraper API with sample data and view AI analysis results.
            </p>
          </Link>
        </div>

        <div className={styles.flex}>
          <Link href="/upload" className={`${styles.button} ${styles.buttonPrimary}`}>
            Upload Document
          </Link>
          <Link href="/test-scraper" className={`${styles.button} ${styles.buttonPrimary}`}>
            Test Scraper API
          </Link>
          <Link href="/dashboard" className={`${styles.button} ${styles.buttonSecondary}`}>
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
