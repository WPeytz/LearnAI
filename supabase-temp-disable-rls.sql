-- Temporarily disable RLS for seeding
-- Run this in Supabase SQL Editor BEFORE seeding

ALTER TABLE articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions DISABLE ROW LEVEL SECURITY;

-- After running npm run db:seed, run supabase-re-enable-rls.sql
