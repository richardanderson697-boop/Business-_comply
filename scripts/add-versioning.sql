-- Add version control columns to documents table
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS version_number INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_version_id UUID REFERENCES documents(id),
ADD COLUMN IF NOT EXISTS is_latest_version BOOLEAN DEFAULT true;

-- Add version control to analysis_results
ALTER TABLE analysis_results
ADD COLUMN IF NOT EXISTS report_version TEXT DEFAULT '1.0',
ADD COLUMN IF NOT EXISTS report_generated_by UUID,
ADD COLUMN IF NOT EXISTS audit_trail_id UUID;

-- Create document_versions table for detailed version tracking
CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  changed_by UUID,
  change_description TEXT,
  changes_summary JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create report_audit_trail table for compliance audit logging
CREATE TABLE IF NOT EXISTS report_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  analysis_id UUID REFERENCES analysis_results(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- generated, viewed, exported, printed
  user_id UUID,
  user_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  export_format TEXT, -- pdf, json, csv
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for version queries
CREATE INDEX IF NOT EXISTS idx_documents_version ON documents(version_number DESC);
CREATE INDEX IF NOT EXISTS idx_documents_parent_version ON documents(parent_version_id);
CREATE INDEX IF NOT EXISTS idx_documents_is_latest ON documents(is_latest_version) WHERE is_latest_version = true;
CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_report_audit_trail_document_id ON report_audit_trail(document_id);
CREATE INDEX IF NOT EXISTS idx_report_audit_trail_analysis_id ON report_audit_trail(analysis_id);
CREATE INDEX IF NOT EXISTS idx_report_audit_trail_created_at ON report_audit_trail(created_at DESC);

-- Enable RLS
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_audit_trail ENABLE ROW LEVEL SECURITY;

-- RLS Policies for document_versions
CREATE POLICY "Users can view versions of their documents" ON document_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = document_versions.document_id 
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert versions" ON document_versions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for report_audit_trail
CREATE POLICY "Users can view their own audit trail" ON report_audit_trail
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert audit entries" ON report_audit_trail
  FOR INSERT WITH CHECK (true);

-- Function to automatically increment version numbers
CREATE OR REPLACE FUNCTION increment_document_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Set previous version to not latest
  UPDATE documents 
  SET is_latest_version = false 
  WHERE id = NEW.parent_version_id;
  
  -- Auto-increment version number if it's a new version
  IF NEW.parent_version_id IS NOT NULL THEN
    SELECT version_number + 1 INTO NEW.version_number
    FROM documents 
    WHERE id = NEW.parent_version_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for version tracking
DROP TRIGGER IF EXISTS trigger_increment_document_version ON documents;
CREATE TRIGGER trigger_increment_document_version
  BEFORE INSERT ON documents
  FOR EACH ROW
  WHEN (NEW.parent_version_id IS NOT NULL)
  EXECUTE FUNCTION increment_document_version();
