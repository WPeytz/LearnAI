-- LearnAI Data Seeding Script
-- Run this in Supabase SQL Editor AFTER running supabase-schema.sql
-- This will populate your database with articles and quizzes

-- =====================================================
-- SEED ARTICLES
-- =====================================================

-- Article 1: What is Artificial Intelligence?
INSERT INTO articles (id, title, slug, excerpt, content, category, image, date, read_time, featured)
SELECT 1, 'What is Artificial Intelligence?', 'what-is-artificial-intelligence',
'A comprehensive introduction to Artificial Intelligence, exploring its definition, history, applications, and impact on our daily lives.',
'<h2>Introduction: What is Artificial Intelligence?</h2><p>Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. At its core, AI enables computers to perform tasks that typically require human intelligence: learning from experience, recognizing patterns, understanding language, making decisions, and solving complex problems.</p><p>But AI is more than just a single technology—it''s a broad field encompassing multiple approaches, techniques, and applications. From the voice assistant on your phone to the recommendation algorithm on your favorite streaming service, AI has become an invisible but integral part of modern life.</p>',
'Fundamentals',
'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
'2025-10-19', 15, true
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE id = 1);

-- Note: Due to length, for full article content, use the JavaScript seeding approach
-- or manually copy content from src/data/articles.js

-- =====================================================
-- ALTERNATIVE: Use Supabase's service_role key
-- =====================================================
-- To seed properly, create a .env file with your SERVICE_ROLE key:
-- VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
-- Then run: npm run db:seed:admin

-- For now, let's use a simpler approach...
