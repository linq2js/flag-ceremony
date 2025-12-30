# Netlify Environment Variables Setup

## Required Environment Variables

To fix the "Supabase not configured" error in production, you need to add the following environment variables to your Netlify site:

### Steps to Add Environment Variables in Netlify

1. **Go to Netlify Dashboard**

   - Navigate to: https://app.netlify.com/
   - Select your site: `vn-flag-ceremony`

2. **Open Site Settings**

   - Click on your site
   - Go to **Site configuration** → **Environment variables**

3. **Add the following variables:**

   | Variable Name                   | Value                                     | Description                 |
   | ------------------------------- | ----------------------------------------- | --------------------------- |
   | `EXPO_PUBLIC_SUPABASE_URL`      | `https://xxxxx.supabase.co`               | Your Supabase project URL   |
   | `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Your Supabase anonymous key |

4. **Get Your Supabase Credentials**

   - Go to: https://supabase.com/dashboard
   - Select your project
   - Navigate to: **Settings** → **API**
   - Copy:
     - **Project URL** → Use as `EXPO_PUBLIC_SUPABASE_URL`
     - **anon public** key → Use as `EXPO_PUBLIC_SUPABASE_ANON_KEY`

5. **Redeploy**
   - After adding the variables, trigger a new deployment:
     - Go to **Deploys** tab
     - Click **Trigger deploy** → **Deploy site**
   - Or push a new commit to trigger automatic deployment

## Verification

After deployment, check the browser console - the "Supabase not configured" error should be gone.

## Security Notes

- ✅ The `anon` key is safe to expose in client-side code (protected by Row Level Security)
- ✅ Never commit these values to git (they're in `.gitignore`)
- ✅ Environment variables are encrypted in Netlify

## Troubleshooting

If you still see the error after adding variables:

1. **Check variable names** - Must be exactly:

   - `EXPO_PUBLIC_SUPABASE_URL`
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

2. **Check for typos** - Copy-paste from Supabase dashboard

3. **Redeploy** - Environment variables only apply to new deployments

4. **Check build logs** - Verify variables are available during build:
   ```
   Build command: npm run build:web
   ```
