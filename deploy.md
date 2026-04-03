# Deployment Guide

## Frontend Deployment

### 1. Update Production URL
In `careerboost-ai.html`, update this line:
```javascript
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:3000' 
  : 'https://your-production-domain.com'; // <-- UPDATE THIS
```

### 2. Deploy to Static Hosting
Upload `careerboost-ai.html` to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting

## Backend Deployment

### 1. Environment Setup
Copy production environment file:
```bash
cp .env.production .env
```

Update the values:
- `GOOGLE_API_KEY`: Your production Google API key
- `NODE_ENV`: Keep as "production"

### 2. Update CORS Configuration
In `server.js`, update this line:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-production-domain.com'] // <-- UPDATE THIS
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'file://'],
```

### 3. Deploy to Cloud Service
Choose a hosting provider:
- **Heroku**: Easy Node.js deployment
- **Vercel**: Serverless functions
- **AWS**: EC2 or Lambda
- **DigitalOcean**: Droplets
- **Railway**: Simple Node.js hosting

### 4. Install Dependencies
```bash
npm install --production
```

### 5. Start Server
```bash
npm start
```

## Environment Variables

### Development (.env)
```env
GOOGLE_API_KEY=your_dev_api_key
PORT=3000
```

### Production (.env)
```env
GOOGLE_API_KEY=your_production_api_key
PORT=3000
NODE_ENV=production
```

## Security Notes

1. **Never commit `.env` files** to version control
2. **Use different API keys** for development and production
3. **Enable rate limiting** in production
4. **Monitor API usage** and costs
5. **Use HTTPS** in production

## Testing Production

1. Test both endpoints:
   - `POST /roadmap`
   - `POST /job`

2. Verify CORS is working
3. Check error handling
4. Test with various inputs

## Example Deployment Commands

### Heroku
```bash
heroku create your-app-name
heroku config:set GOOGLE_API_KEY=your_key
heroku config:set NODE_ENV=production
git push heroku main
```

### Vercel
```bash
vercel --prod
```

### Railway
```bash
railway login
railway init
railway up
```

## Post-Deployment Checklist

- [ ] Frontend URL is updated
- [ ] Backend CORS is configured
- [ ] Environment variables are set
- [ ] API endpoints are working
- [ ] Error handling is functional
- [ ] HTTPS is enabled
- [ ] Monitoring is set up
