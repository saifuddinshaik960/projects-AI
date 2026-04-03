# CareerBoost Backend API

A Node.js Express backend providing AI-powered career development APIs using OpenAI's GPT-4o-mini model for skill roadmaps and job preparation tips.

## Features

- **POST /roadmap** - Get AI-generated learning roadmap for any skill
- **POST /job** - Get AI-generated job preparation tips for any role
- **GET /health** - Health check endpoint
- CORS enabled for cross-origin requests
- JSON middleware for request parsing
- Clean error handling with OpenAI API integration
- Environment variable configuration for API keys

## Prerequisites

1. **Node.js** (v14 or higher)
2. **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/api-keys)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_actual_openai_api_key_here
```

## Running the Server

### Production Mode
```bash
npm start
```

### Development Mode (with auto-restart)
```bash
npm install -g nodemon
npm run dev
```

The server will start on port 3000 by default.

## API Endpoints

### POST /roadmap
Get an AI-generated learning roadmap for a specific skill.

**Request:**
```json
{
  "skill": "machine learning"
}
```

**Response:**
```json
{
  "skill": "machine learning",
  "roadmap": [
    "Master Python programming fundamentals",
    "Learn linear algebra and calculus basics",
    "Study statistics and probability theory",
    "Understand machine learning algorithms",
    "Practice with scikit-learn and TensorFlow",
    "Work on real-world datasets",
    "Learn deep learning and neural networks",
    "Build a portfolio of ML projects"
  ]
}
```

### POST /job
Get AI-generated job preparation tips for a specific role.

**Request:**
```json
{
  "role": "data scientist"
}
```

**Response:**
```json
{
  "role": "data scientist",
  "preparationTips": [
    "Master Python, SQL, and statistics",
    "Build a portfolio of data science projects",
    "Practice machine learning algorithms",
    "Learn data visualization tools",
    "Study SQL and database management",
    "Prepare for technical interviews",
    "Understand business acumen and communication",
    "Stay updated with industry trends"
  ]
}
```

### GET /health
Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "CareerBoost API is running",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## Testing with curl

### Test Roadmap API
```bash
curl -X POST http://localhost:3000/roadmap \
  -H "Content-Type: application/json" \
  -d '{"skill": "blockchain development"}'
```

### Test Job API
```bash
curl -X POST http://localhost:3000/job \
  -H "Content-Type: application/json" \
  -d '{"role": "product manager"}'
```

### Health Check
```bash
curl http://localhost:3000/health
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
```

## OpenAI Integration

The backend uses OpenAI's GPT-4o-mini model to generate:

- **Skill Roadmaps**: Step-by-step learning paths for any technical or non-technical skill
- **Job Preparation Tips**: Tailored advice for any job role or position

### Model Configuration
- **Model**: `gpt-4o-mini`
- **Max Tokens**: 500
- **Temperature**: 0.7
- **Response Format**: Numbered lists with exactly 8 items

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- `400` - Bad Request (missing required parameters)
- `500` - Internal Server Error (OpenAI API issues, configuration problems)

## Cost Considerations

- GPT-4o-mini is cost-effective for this use case
- Each API call generates approximately 100-200 tokens
- Monitor your OpenAI API usage to control costs

## Security Notes

- Never commit your `.env` file to version control
- Keep your OpenAI API key secure
- Consider implementing rate limiting for production use
- Add authentication if deploying to production
