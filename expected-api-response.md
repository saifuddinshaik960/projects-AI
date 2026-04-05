# Sample API Response Output (Expected)

When the chat API is called with: "what jobs are available for React developers right now?"

## Console Logs:
```
Chat API called with message: what jobs are available for React developers right now?
Extracted keywords: react developer
Search term: react developer
FULL API RESPONSE: {
  "job-count": 127,
  "total-job-count": 127,
  "jobs": [
    {
      "id": 2069746,
      "title": "Senior React Developer",
      "company_name": "Mitre Media",
      "category": "Software Development",
      "candidate_required_location": "Remote",
      "publication_date": "2025-01-15T10:00:00Z",
      "salary": "$160,000-$200,000 CAD/USD"
    },
    {
      "id": 2069745,
      "title": "React Frontend Developer",
      "company_name": "TechCorp",
      "category": "Software Development",
      "candidate_required_location": "Remote Only",
      "publication_date": "2025-01-14T09:30:00Z",
      "salary": "$80,000-$100,000"
    },
    {
      "id": 2069744,
      "title": "Full Stack React Engineer",
      "company_name": "StartupXYZ",
      "category": "Software Development",
      "candidate_required_location": "US Remote",
      "publication_date": "2025-01-13T14:15:00Z",
      "salary": "$100,000-$130,000"
    }
  ]
}
Jobs found: 3
RealTimeData result: found data
```

## API Response:
```json
{
  "message": "what jobs are available for React developers right now?",
  "response": "Based on current real-time data, there are excellent React developer opportunities available. Mitre Media is offering a Senior React Developer position with a competitive salary of $160,000-$200,000 CAD/USD, fully remote. TechCorp has a React Frontend Developer role paying $80,000-$100,000 with remote-only work. StartupXYZ is looking for Full Stack React Engineers at $100,000-$130,000 for US-based remote positions. These positions were posted very recently, showing active demand for React skills.",
  "realTimeData": "REAL-TIME JOB MARKET DATA (Remotive API — live listings):\nSearch term: \"react developer\"\nTotal on platform: 127\n3 current openings (showing first 3):\n  • Senior React Developer @ Mitre Media (Software Development) | Location: Remote | Salary: $160,000-$200,000 CAD/USD | Posted: 2025-01-15\n  • React Frontend Developer @ TechCorp (Software Development) | Location: Remote Only | Salary: $80,000-$100,000 | Posted: 2025-01-14\n  • Full Stack React Engineer @ StartupXYZ (Software Development) | Location: US Remote | Salary: $100,000-$130,000 | Posted: 2025-01-13\nFetched: Tue, 15 Apr 2025 12:00:00 GMT"
}
```

## Key Features:
✅ Specific company names: Mitre Media, TechCorp, StartupXYZ
✅ Specific job titles: Senior React Developer, React Frontend Developer, Full Stack React Engineer
✅ Specific salaries: $160,000-$200,000, $80,000-$100,000, $100,000-$130,000
✅ Specific locations: Remote, Remote Only, US Remote
✅ Real posting dates: 2025-01-15, 2025-01-14, 2025-01-13
✅ Based on real-time data, not generic advice
✅ Total job market context: 127 total React jobs on platform
