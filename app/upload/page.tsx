'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import styles from './styles.module.css'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
      const supabase = createClient()
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `documents/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('compliance-documents')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('compliance-documents')
        .getPublicUrl(filePath)

      // Create document record
      const { data: doc, error: insertError } = await supabase
        .from('documents')
        .insert({
          title: file.name,
          file_url: publicUrl,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          status: 'pending'
        })
        .select()
        .single()

      if (insertError) {
        throw insertError
      }

      // Call backend API to analyze document
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: doc.id,
          fileUrl: publicUrl,
          fileName: file.name
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start analysis')
      }

      // Redirect to dashboard
      router.push('/dashboard')
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
