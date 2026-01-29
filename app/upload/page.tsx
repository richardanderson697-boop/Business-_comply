'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './styles.module.css'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setUploading(true)
    setError(null)

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Call API to upload and analyze
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload document')
      }

      const result = await response.json()
      console.log('[v0] Upload successful:', result)
      
      setSuccess(true)
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } catch (err: any) {
      console.error('[v0] Upload error:', err)
      setError(err.message || 'Failed to upload document')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Upload Compliance Document</h1>
          <p className={styles.subtitle}>
            Upload documents for AI-powered compliance analysis
          </p>
        </div>

        <div className={styles.card}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span className={styles.labelText}>Select Document</span>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt"
                className={styles.fileInput}
                disabled={uploading}
              />
            </label>

            {file && (
              <div className={styles.filePreview}>
                <p className={styles.fileName}>{file.name}</p>
                <p className={styles.fileSize}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                <p className={styles.errorText}>{error}</p>
              </div>
            )}

            {success && (
              <div className={styles.success}>
                <p className={styles.successText}>Document uploaded successfully! Redirecting to dashboard...</p>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={styles.uploadButton}
          >
            {uploading ? 'Uploading and Analyzing...' : 'Upload and Analyze'}
          </button>
        </div>

        <div className={styles.footer}>
          <button
            onClick={() => router.push('/dashboard')}
            className={styles.backLink}
          >
            View Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
