-- Comprehensive RLS Policy Fix for LearnAI
-- Run this in your Supabase SQL Editor (Production)
-- This will fix both profile creation and post creation issues

-- =====================================================
-- FIX PROFILES TABLE RLS POLICIES
-- =====================================================

-- Drop and recreate the profile INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Ensure users can read all profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Ensure users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- FIX POSTS TABLE RLS POLICIES
-- =====================================================

-- Drop and recreate the posts INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- VERIFY EXISTING USERS AND PROFILES
-- =====================================================

-- Check which users exist without profiles
SELECT
  u.id,
  u.email,
  u.created_at,
  p.id as profile_id,
  p.username
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- =====================================================
-- CREATE MISSING PROFILES (if any)
-- =====================================================

-- This will create profiles for any users that don't have one
INSERT INTO profiles (id, username, avatar)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'username',
    split_part(u.email, '@', 1)
  ) as username,
  COALESCE(
    u.raw_user_meta_data->>'avatar',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || u.id
  ) as avatar
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFY THE FIX
-- =====================================================

-- This should show all users with their profiles
SELECT
  u.id,
  u.email,
  p.username,
  p.avatar,
  p.created_at
FROM auth.users u
INNER JOIN profiles p ON u.id = p.id
ORDER BY p.created_at DESC;
