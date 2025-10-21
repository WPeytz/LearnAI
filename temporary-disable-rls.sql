-- TEMPORARY: Disable RLS on profiles to test if that's the blocker
-- WARNING: This makes all profiles public readable without auth
-- Use this ONLY for testing, then re-enable RLS after

-- Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Verify it's disabled
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'profiles';

-- To re-enable RLS later, run:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
