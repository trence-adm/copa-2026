# Football-Data.org Integration Setup

## API Token Setup

The app now uses real data from **football-data.org** for World Cup 2026 and Brazilian Série A matches.

### Step 1: Get Your API Token

1. Go to https://www.football-data.org/client/register
2. Create a free account
3. Copy your API token from your account dashboard

### Step 2: Configure the Token

Edit the file: `src/features/games/data/apiFootballDataProvider.ts`

Find this line (line 5):
```typescript
const API_TOKEN = 'YOUR_TOKEN_HERE'; // User should replace this
```

Replace `YOUR_TOKEN_HERE` with your actual token:
```typescript
const API_TOKEN = 'your-actual-token-from-football-data.org';
✅ **CONFIGURED**: Token `bec332496092468cbbc62f3ffe3ced76` is already set up. The app is ready to fetch real World Cup and Série A data!
```

### Step 3: Test It

The app will automatically use the real API on the next build. Metro will reload and you should see:
	- ✅ Real Copa 2026 groups and matches (live from football-data.org)
	- ✅ Real Série A (Brasileirão) matches
	- ⚠️ Libertadores/Copa do Brasil require paid tier (not available with free account)

## Rate Limits

- **Free tier without token**: 100 requests per 24 hours
- **Free tier with token**: 10 requests per minute
- **Upgrade to Standard**: 30 requests/min (paid)
- **Upgrade to Professional**: 60 requests/min (paid)

For this app, a free token is sufficient.

## Available Data

✅ **Copa 2026** (Free - Tier One)
- All matches (group stage + knockout)
- Final standings
- Group information

✅ **Série A (Brasileirão)** (Free - Tier One)
- All matches
- Current standings

❌ **Libertadores** (Paid - Tier Four)
❌ **Copa do Brasil** (Paid - Tier Four)
❌ **Sud-Americana** (Paid - Tier Four)

If you want these competitions, you'll need to upgrade to a paid plan on football-data.org.

## Fallback Behavior

If the API call fails, the app automatically falls back to mock data (which is always available). This ensures the app never crashes due to network issues.
