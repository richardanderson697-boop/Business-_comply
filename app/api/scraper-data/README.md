# Compliance Data Scraper API

API endpoint for receiving compliance data from external scrapers.

## Endpoint

```
POST /api/scraper-data
```

## Authentication

Include an API key in the request headers (optional, currently not enforced):

```
x-api-key: your-api-key-here
```

## Request Body

```json
{
  "source_name": "Regulatory Website",
  "source_url": "https://example.com/regulations",
  "data_type": "regulation",
  "compliance_area": "data_privacy",
  "scraped_data": {
    "title": "New Data Privacy Regulation",
    "content": "Full regulation text...",
    "effective_date": "2024-01-01",
    "jurisdiction": "EU"
  },
  "metadata": {
    "scraper_version": "1.0.0",
    "scrape_timestamp": "2024-01-15T10:00:00Z"
  }
}
```

### Required Fields

- `source_name` (string): Name of the compliance data source
- `data_type` (string): Type of data (e.g., "regulation", "standard", "guideline")
- `scraped_data` (object): The actual compliance data scraped

### Optional Fields

- `source_url` (string): URL of the source
- `compliance_area` (string): Area of compliance (default: "general")
- `metadata` (object): Additional metadata about the scraping process

## Response

### Success Response (200)

```json
{
  "success": true,
  "id": "uuid-here",
  "analysis": {
    "summary": "Analyzed regulation data from Regulatory Website",
    "key_findings": [
      "New compliance regulation identified",
      "Updated requirements for data privacy"
    ],
    "impact_score": 85,
    "recommendations": [
      "Review current policies against new requirements",
      "Update documentation to reflect changes"
    ]
  },
  "message": "Scraped data received and processed successfully"
}
```

### Error Response (400/500)

```json
{
  "error": "Error message here"
}
```

## GET Endpoint

Retrieve stored scraped data:

```
GET /api/scraper-data?data_type=regulation&compliance_area=data_privacy&status=processed
```

### Query Parameters

- `data_type` (optional): Filter by data type
- `compliance_area` (optional): Filter by compliance area
- `status` (optional): Filter by processing status

## Example Usage

### Using cURL

```bash
curl -X POST https://your-domain.com/api/scraper-data \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{
    "source_name": "GDPR Portal",
    "source_url": "https://gdpr.eu/latest",
    "data_type": "regulation",
    "compliance_area": "data_privacy",
    "scraped_data": {
      "title": "GDPR Update 2024",
      "content": "Updated requirements...",
      "effective_date": "2024-03-01"
    }
  }'
```

### Using Python

```python
import requests

url = "https://your-domain.com/api/scraper-data"
headers = {
    "Content-Type": "application/json",
    "x-api-key": "your-api-key"
}
data = {
    "source_name": "GDPR Portal",
    "source_url": "https://gdpr.eu/latest",
    "data_type": "regulation",
    "compliance_area": "data_privacy",
    "scraped_data": {
        "title": "GDPR Update 2024",
        "content": "Updated requirements...",
        "effective_date": "2024-03-01"
    }
}

response = requests.post(url, json=data, headers=headers)
print(response.json())
```

### Using JavaScript/Node.js

```javascript
const response = await fetch('https://your-domain.com/api/scraper-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'your-api-key'
  },
  body: JSON.stringify({
    source_name: 'GDPR Portal',
    source_url: 'https://gdpr.eu/latest',
    data_type: 'regulation',
    compliance_area: 'data_privacy',
    scraped_data: {
      title: 'GDPR Update 2024',
      content: 'Updated requirements...',
      effective_date: '2024-03-01'
    }
  })
});

const result = await response.json();
console.log(result);
```
