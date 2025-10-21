-- Re-enable RLS after seeding
-- Run this in Supabase SQL Editor AFTER seeding is complete

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

-- RLS is now re-enabled and your data is protected!
