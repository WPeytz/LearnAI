-- TEST: Try to read profiles as anonymous user (simulates what app does)
-- If this fails or returns no results, RLS is blocking the query

SET ROLE anon;
SELECT id, username, avatar FROM profiles LIMIT 5;
RESET ROLE;

-- Also check: is RLS even enabled?
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'profiles';
