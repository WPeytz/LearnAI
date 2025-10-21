-- COMPLETE Authentication Fix for LearnAI
-- This is a comprehensive fix for all auth and RLS issues
-- Run this ONCE in Supabase SQL Editor

-- =====================================================
-- PART 1: Create the Auto-Profile Trigger (CRITICAL!)
-- =====================================================

-- This trigger automatically creates profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar', 'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.id)
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PART 2: Fix RLS Policies for Profiles
-- =====================================================

-- Drop all existing profile policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create correct policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- PART 3: Fix RLS Policies for Posts
-- =====================================================

-- Drop all existing post policies
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;

-- Create correct policies
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- PART 4: Create Missing Profiles for Existing Users
-- =====================================================

-- This creates profiles for any existing users without them
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
-- PART 5: Clean Up Orphaned Profiles
-- =====================================================

-- Delete profiles without corresponding auth users
DELETE FROM profiles
WHERE id NOT IN (SELECT id FROM auth.users);

-- =====================================================
-- PART 6: VERIFICATION - Check Everything Works
-- =====================================================

-- 1. Verify trigger exists
SELECT
  tgname as trigger_name,
  tgenabled as enabled,
  CASE tgenabled
    WHEN 'O' THEN 'ENABLED'
    WHEN 'D' THEN 'DISABLED'
    ELSE 'UNKNOWN'
  END as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- 2. Verify function exists
SELECT
  proname as function_name,
  prosecdef as is_security_definer
FROM pg_proc
WHERE proname = 'handle_new_user';

-- 3. Check users and their profiles
SELECT
  u.id,
  u.email,
  u.created_at as user_created,
  p.id as profile_id,
  p.username,
  p.created_at as profile_created,
  CASE
    WHEN p.id IS NOT NULL THEN '✓ Has Profile'
    ELSE '✗ MISSING PROFILE'
  END as profile_status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 4. Check all RLS policies
SELECT
  schemaname,
  tablename,
  policyname,
  cmd as command,
  permissive,
  CASE
    WHEN cmd = 'SELECT' THEN 'Read'
    WHEN cmd = 'INSERT' THEN 'Create'
    WHEN cmd = 'UPDATE' THEN 'Update'
    WHEN cmd = 'DELETE' THEN 'Delete'
  END as operation
FROM pg_policies
WHERE tablename IN ('profiles', 'posts')
ORDER BY tablename, cmd;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Authentication setup complete!';
  RAISE NOTICE 'Trigger: Created and enabled';
  RAISE NOTICE 'RLS Policies: Fixed for profiles and posts';
  RAISE NOTICE 'Existing users: Profiles created if missing';
  RAISE NOTICE 'You can now test login/signup!';
END $$;
