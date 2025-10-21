-- TEST: Check RLS policies on profiles table
-- This shows if the SELECT policy exists for reading profiles

SELECT
  tablename,
  policyname,
  cmd as command,
  permissive,
  roles,
  qual as using_expression
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;
