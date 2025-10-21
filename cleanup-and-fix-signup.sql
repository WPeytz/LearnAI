-- Cleanup script for new signup after deleting auth user
-- Run this in Supabase SQL Editor

-- =====================================================
-- STEP 1: Clean up any orphaned profiles
-- =====================================================

-- Delete profiles that don't have a corresponding auth user
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- =====================================================
-- STEP 2: Fix RLS Policies for Profiles
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create correct policies
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- STEP 3: Fix RLS Policies for Posts
-- =====================================================

-- Drop and recreate the posts INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STEP 4: Verify Setup
-- =====================================================

-- Check existing users and profiles
SELECT
  u.id,
  u.email,
  u.created_at as user_created,
  p.id as profile_id,
  p.username,
  p.created_at as profile_created
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('profiles', 'posts')
ORDER BY tablename, policyname;
