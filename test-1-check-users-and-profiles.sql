-- TEST: Check which users have profiles
-- This will show if the trigger is creating profiles correctly

SELECT
  u.id,
  u.email,
  u.created_at as user_created,
  p.id as profile_id,
  p.username,
  p.created_at as profile_created,
  CASE
    WHEN p.id IS NOT NULL THEN '✓ Has Profile'
    ELSE '✗ MISSING PROFILE - WILL CAUSE TIMEOUT'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
