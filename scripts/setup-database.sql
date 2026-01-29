-- Create documents table for storing uploaded files
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending', -- pending, processing, analyzed, error
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create compliance_issues table for detected issues
CREATE TABLE IF NOT EXISTS compliance_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL, -- regulatory, policy, legal, risk
  severity TEXT NOT NULL, -- critical, high, medium, low
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  regulation_reference TEXT,
  affected_section TEXT,
  recommendation TEXT,
  status TEXT DEFAULT 'open', -- open, acknowledged, resolved, false_positive
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analysis_results table for full AI analysis
CREATE TABLE IF NOT EXISTS analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  analysis_type TEXT NOT NULL, -- rag_analysis, compliance_check, risk_assessment
  model_used TEXT,
  summary TEXT,
  full_analysis JSONB NOT NULL,
  compliance_score DECIMAL(3,2), -- overall compliance score 0.00 to 1.00
  issues_found INTEGER DEFAULT 0,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scraped_compliance_data table for external data sources
CREATE TABLE IF NOT EXISTS scraped_compliance_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_name TEXT NOT NULL,
  source_url TEXT,
  data_type TEXT NOT NULL, -- regulation, standard, guideline, update
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  effective_date DATE,
  jurisdiction TEXT,
  industry TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create analysis_history table for tracking all analyses
CREATE TABLE IF NOT EXISTS analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL, -- document, scraped_data
  entity_id UUID NOT NULL,
  action TEXT NOT NULL, -- uploaded, analyzed, updated, scraped
  user_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date DESC);

CREATE INDEX IF NOT EXISTS idx_compliance_issues_document_id ON compliance_issues(document_id);
CREATE INDEX IF NOT EXISTS idx_compliance_issues_severity ON compliance_issues(severity);
CREATE INDEX IF NOT EXISTS idx_compliance_issues_status ON compliance_issues(status);
CREATE INDEX IF NOT EXISTS idx_compliance_issues_detected_at ON compliance_issues(detected_at DESC);

CREATE INDEX IF NOT EXISTS idx_analysis_results_document_id ON analysis_results(document_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_scraped_data_source ON scraped_compliance_data(source_name);
CREATE INDEX IF NOT EXISTS idx_scraped_data_type ON scraped_compliance_data(data_type);
CREATE INDEX IF NOT EXISTS idx_scraped_data_effective_date ON scraped_compliance_data(effective_date DESC);

CREATE INDEX IF NOT EXISTS idx_analysis_history_entity ON analysis_history(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_analysis_history_created_at ON analysis_history(created_at DESC);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE scraped_compliance_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents (users can only see their own documents)
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON documents
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for compliance_issues (users can see issues for their documents)
CREATE POLICY "Users can view issues for their documents" ON compliance_issues
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = compliance_issues.document_id 
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert issues" ON compliance_issues
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update issues for their documents" ON compliance_issues
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = compliance_issues.document_id 
      AND documents.user_id = auth.uid()
    )
  );

-- RLS Policies for analysis_results
CREATE POLICY "Users can view analysis for their documents" ON analysis_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = analysis_results.document_id 
      AND documents.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert analysis" ON analysis_results
  FOR INSERT WITH CHECK (true);

-- RLS Policies for scraped_compliance_data (public read access)
CREATE POLICY "Anyone can view scraped compliance data" ON scraped_compliance_data
  FOR SELECT USING (true);

CREATE POLICY "Service role can manage scraped data" ON scraped_compliance_data
  FOR ALL USING (true);

-- RLS Policies for analysis_history
CREATE POLICY "Users can view their own history" ON analysis_history
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Service role can insert history" ON analysis_history
  FOR INSERT WITH CHECK (true);
