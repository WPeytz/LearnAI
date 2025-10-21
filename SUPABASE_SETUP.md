# Supabase Setup Guide for LearnAI

This guide will walk you through setting up Supabase as the backend for LearnAI.

## Phase 1: Create Supabase Project

### Step 1: Sign Up for Supabase

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign in"
3. Sign up using GitHub, Google, or email

### Step 2: Create a New Project

1. Click "New Project" from your Supabase dashboard
2. Fill in the project details:
   - **Name**: `learnai` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is perfect to start
3. Click "Create new project"
4. Wait 2-3 minutes for your project to be provisioned

### Step 3: Get Your API Credentials

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Click on **API** in the settings menu
3. You'll see:
   - **Project URL**: Something like `https://xxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. Keep this tab open - you'll need these values!

## Phase 2: Configure Your Local Environment

### Step 1: Create Environment File

1. In your LearnAI project root, create a `.env` file:

```bash
cp .env.example .env
```

2. Edit the `.env` file and replace the placeholder values with your actual Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit the `.env` file to git! It's already in `.gitignore`.

## Phase 3: Set Up Database Schema

### Step 1: Access SQL Editor

1. In your Supabase project dashboard, click **SQL Editor** from the sidebar
2. Click "New query"

### Step 2: Run Schema Script

1. Open the `supabase-schema.sql` file from your LearnAI project
2. Copy the entire contents
3. Paste it into the SQL Editor in Supabase
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. Wait for execution to complete (should take 10-20 seconds)

You should see a success message! This creates all necessary tables, indexes, and security policies.

### Step 3: Verify Tables Were Created

1. Click **Table Editor** from the sidebar
2. You should see all these tables:
   - `profiles`
   - `articles`
   - `quizzes`
   - `quiz_questions`
   - `posts`
   - `post_likes`
   - `post_comments`
   - `article_progress`
   - `quiz_attempts`
   - `bookmarks`

## Phase 4: Import Existing Data

### Articles Data

1. Go back to **SQL Editor**
2. I'll provide you with the articles data migration script shortly
3. Run the script to populate your articles

### Quizzes Data

1. In **SQL Editor**, create a new query
2. I'll provide you with the quizzes data migration script shortly
3. Run the script to populate your quizzes and questions

## Phase 5: Configure Authentication

### Step 1: Email Authentication Settings

1. Go to **Authentication** > **Providers** in Supabase
2. Enable **Email** provider (should be enabled by default)
3. Configure settings:
   - **Enable Email Confirmations**: OFF (for development; turn ON for production)
   - **Enable Email Signup**: ON

### Step 2: (Optional) Add Social Auth

For production, you can enable Google, GitHub, etc.:
1. Go to **Authentication** > **Providers**
2. Choose a provider (Google, GitHub, etc.)
3. Follow the setup instructions for each provider

## Phase 6: Test the Connection

### Step 1: Start Your Development Server

```bash
npm run dev
```

### Step 2: Check Browser Console

Open your browser's developer console. You should NOT see any errors about missing Supabase environment variables.

### Step 3: Test Auth (After Frontend Integration)

Once we update the frontend code:
1. Try creating a new account
2. Check **Authentication** > **Users** in Supabase to see if the user was created
3. Check **Table Editor** > **profiles** to verify the profile was auto-created

## What's Next?

After completing this setup, we'll:
1. ✅ Update `useAuth` composable to use Supabase Auth
2. ✅ Update `usePosts` composable to use Supabase database
3. ✅ Create `useProgress` composable for tracking learning progress
4. ✅ Update all views to fetch data from Supabase
5. ✅ Migrate from localStorage to real database persistence

## Troubleshooting

### "Cannot read environment variables"

- Make sure you created `.env` file (not `.env.txt`)
- Restart your dev server after creating/editing `.env`
- Environment variables must start with `VITE_` to work in Vite

### "Invalid API key"

- Double-check you copied the **anon public** key (not the service_role key!)
- Make sure there are no extra spaces or line breaks

### SQL errors when running schema

- Make sure you copied the entire schema file
- Run it in a single execution
- If you get "already exists" errors, the tables are already created - you're good!

### RLS (Row Level Security) blocking queries

- If authenticated users can't access data, check the RLS policies in the schema
- You can temporarily disable RLS on a table for testing (not recommended for production)

## Security Notes

- The `.env` file is git-ignored and won't be committed
- The **anon public** key is safe to use in frontend code
- **Never** expose the `service_role` key in frontend code
- Row Level Security (RLS) policies protect your data
- For production, enable email confirmations and add rate limiting

## Support

If you run into issues:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Visit [Supabase Discord](https://discord.supabase.com)
3. Check the browser console for specific error messages
