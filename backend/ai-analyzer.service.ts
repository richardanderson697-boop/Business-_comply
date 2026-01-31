// src/analysis/services/ai-analyzer.service.ts
import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { ChatOpenAI } from '@langchain/openai';

@Injectable()
export class AIAnalyzerService {
  async analyzePolicy(s3Key: string, frameworkRules: any[]) {
    // 1. Load document from S3 and split into chunks
    const docs = await this.loadAndSplit(s3Key);

    // 2. Create Vector Index for this specific analysis
    const vectorStore = await PineconeStore.fromDocuments(
      docs, 
      new OpenAIEmbeddings(), 
      { pineconeIndex: process.env.PINECONE_INDEX }
    );

    const results = [];

    // 3. Perform RAG for each compliance rule
    for (const rule of frameworkRules) {
      // Find relevant text in the uploaded document
      const relevantContext = await vectorStore.similaritySearch(rule.description, 3);
      
      // Ask AI to evaluate the context against the rule
      const analysis = await this.evaluateCompliance(rule, relevantContext);
      results.push(analysis);
    }

    return results;
  }
}
