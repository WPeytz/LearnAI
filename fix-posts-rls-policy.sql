-- Fix the posts INSERT policy to ensure user_id matches authenticated user
-- Run this in your Supabase SQL Editor (Production)

-- Drop the existing policy
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;

-- Create a better policy that verifies user_id matches auth.uid()
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Also verify that profiles exist for the user trying to post
-- This query will show any users without profiles
SELECT
  u.id,
  u.email,
  p.id as profile_id
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;
