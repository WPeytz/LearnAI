-- Fix RLS policy for creating posts
-- Run this in Supabase SQL Editor

-- Drop the problematic policy
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;

-- Create a simpler, correct policy
-- Users can only create posts as themselves (auth.uid() must match user_id)
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Verify the policy
SELECT
  schemaname,
  tablename,
  policyname,
  cmd as command,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'posts' AND cmd = 'INSERT';
