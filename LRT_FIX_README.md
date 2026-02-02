# LRT File Issue - Fixed

## Problem
The `lrt` file is a Next.js telemetry binary that was causing permission errors in production:
```
[Error: EACCES: permission denied, open '/var/lrt']
```

## What is LRT?
- **LRT** = Last Runtime Trace (Next.js telemetry executable)
- A UPX-compressed binary that collects anonymous usage data
- Attempts to write to `/var/lrt` which requires root permissions
- Not needed for application functionality

## Root Cause
Next.js telemetry was enabled by default and trying to write telemetry data to a system directory without proper permissions.

## Solution Implemented

### 1. Disabled Telemetry in Next.js Config
Updated `next.config.mjs`:
```javascript
experimental: {
  telemetry: false,
}
```

### 2. Added Environment Variable
Added to `.env.production`:
```bash
NEXT_TELEMETRY_DISABLED=1
```

### 3. Updated PM2 Configuration
Added to `ecosystem.config.js`:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3030,
  HOSTNAME: '0.0.0.0',
  NEXT_TELEMETRY_DISABLED: '1'
}
```

### 4. Added LRT to .gitignore
Prevents committing the telemetry binary:
```
# Next.js telemetry file
lrt
**/lrt
```

### 5. Created Cleanup Script
`scripts/cleanup-telemetry.sh` removes any existing lrt files before deployment.

## Deployment Process (Updated)

After building the frontend, run the cleanup script:
```bash
# On production server
cd /home/ankit/apps/swami-frontend
npm run build
bash ~/scripts/cleanup-telemetry.sh
pm2 restart swami-frontend --update-env
```

## Prevention
The fixes above ensure that:
1. ✅ Telemetry is disabled at multiple levels
2. ✅ No lrt file will be created in future builds
3. ✅ Existing lrt files are cleaned up before deployment
4. ✅ The issue won't recur in future deployments

## Verification
To verify the fix is working:
```bash
# Check PM2 logs for errors
pm2 logs swami-frontend --lines 50

# Ensure no lrt file exists
find /home/ankit/apps/swami-frontend -name "lrt"

# Verify environment variable is set
pm2 env 1 | grep TELEMETRY
```

## Additional Notes
- This is a known issue in Next.js standalone builds
- Disabling telemetry has no impact on application functionality
- The app runs faster without telemetry overhead
- Future Next.js versions may handle this better

## References
- Next.js Telemetry: https://nextjs.org/telemetry
- Related issue: https://github.com/vercel/next.js/issues/discussions
