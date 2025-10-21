-- Test RLS Policies to Diagnose Timeout Issues
-- Run this in Supabase SQL Editor to verify RLS is working

-- =====================================================
-- TEST 1: Check if RLS is enabled
-- =====================================================
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('profiles', 'posts')
ORDER BY tablename;

-- =====================================================
-- TEST 2: Check all RLS policies
-- =====================================================
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE tablename IN ('profiles', 'posts')
ORDER BY tablename, policyname;

-- =====================================================
-- TEST 3: Try to read profiles as anonymous user
-- =====================================================
-- This simulates what happens when the app tries to read profiles
SET ROLE anon;
SELECT id, username, avatar FROM profiles LIMIT 5;
RESET ROLE;

-- =====================================================
-- TEST 4: Check if profiles exist for all users
-- =====================================================
SELECT
  u.id,
  u.email,
  p.username,
  CASE
    WHEN p.id IS NOT NULL THEN '✓ Profile exists'
    ELSE '✗ NO PROFILE (This will cause timeouts!)'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- =====================================================
-- TEST 5: Check if trigger exists and is enabled
-- =====================================================
SELECT
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  tgenabled as enabled,
  CASE tgenabled
    WHEN 'O' THEN '✓ ENABLED'
    WHEN 'D' THEN '✗ DISABLED'
    ELSE 'UNKNOWN'
  END as status
FROM pg_trigger
WHERE tgname = 'on_auth_user_created';

-- =====================================================
-- TEST 6: Manually test profile query for a specific user
-- =====================================================
-- Replace the UUID below with your actual user ID
-- You can get your user ID from TEST 4 above
DO $$
DECLARE
  test_user_id UUID;
  profile_exists BOOLEAN;
BEGIN
  -- Get the first user ID
  SELECT id INTO test_user_id FROM auth.users LIMIT 1;

  IF test_user_id IS NOT NULL THEN
    -- Check if profile exists
    SELECT EXISTS(SELECT 1 FROM profiles WHERE id = test_user_id) INTO profile_exists;

    RAISE NOTICE 'Test user ID: %', test_user_id;
    RAISE NOTICE 'Profile exists: %', profile_exists;

    -- Try to select the profile
    IF profile_exists THEN
      RAISE NOTICE 'Profile query should work for this user';
    ELSE
      RAISE WARNING 'NO PROFILE FOUND - This will cause timeout!';
    END IF;
  ELSE
    RAISE NOTICE 'No users found in database';
  END IF;
END $$;

-- =====================================================
-- DIAGNOSTIC SUMMARY
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS DIAGNOSTIC COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Check the results above for any issues:';
  RAISE NOTICE '1. RLS should be ENABLED on profiles and posts';
  RAISE NOTICE '2. Policies should exist for SELECT, INSERT, UPDATE';
  RAISE NOTICE '3. Anonymous role should be able to read profiles';
  RAISE NOTICE '4. All users should have profiles';
  RAISE NOTICE '5. Trigger should be ENABLED';
  RAISE NOTICE '========================================';
END $$;
