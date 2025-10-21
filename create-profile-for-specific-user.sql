-- Create profile for the specific user that's trying to log in
-- User ID from console: 711bd88b-5deb-47de-b552-f84d7d45fa5d

-- First, check if this user exists
SELECT
  id,
  email,
  created_at,
  raw_user_meta_data
FROM auth.users
WHERE id = '711bd88b-5deb-47de-b552-f84d7d45fa5d';

-- Create the profile for this specific user
INSERT INTO profiles (id, username, avatar)
VALUES (
  '711bd88b-5deb-47de-b552-f84d7d45fa5d',
  'williamhkp',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=711bd88b-5deb-47de-b552-f84d7d45fa5d'
)
ON CONFLICT (id) DO NOTHING;

-- Verify it was created
SELECT * FROM profiles WHERE id = '711bd88b-5deb-47de-b552-f84d7d45fa5d';

-- Also, let's see ALL users and their profiles
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
