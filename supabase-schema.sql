-- LearnAI Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ARTICLES TABLE
-- =====================================================
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time INTEGER NOT NULL DEFAULT 5,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- QUIZZES TABLE
-- =====================================================
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- QUIZ QUESTIONS TABLE
-- =====================================================
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of 4 options
  correct_answer INTEGER NOT NULL CHECK (correct_answer >= 0 AND correct_answer <= 3),
  explanation TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- COMMUNITY POSTS TABLE
-- =====================================================
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- POST LIKES TABLE
-- =====================================================
CREATE TABLE post_likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id) -- Prevent duplicate likes
);

-- =====================================================
-- POST COMMENTS TABLE
-- =====================================================
CREATE TABLE post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- USER PROGRESS TABLE (Article Reading)
-- =====================================================
CREATE TABLE article_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- =====================================================
-- QUIZ ATTEMPTS TABLE
-- =====================================================
CREATE TABLE quiz_attempts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL, -- Store user's answers
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BOOKMARKS TABLE (for saved articles)
-- =====================================================
CREATE TABLE bookmarks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_featured ON articles(featured);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_quizzes_category ON quizzes(category);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts(quiz_id);
CREATE INDEX idx_article_progress_user_id ON article_progress(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Articles: Public read access, admin write (for now, all articles are public)
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (true);

-- Quizzes: Public read access
CREATE POLICY "Quizzes are viewable by everyone"
  ON quizzes FOR SELECT
  USING (true);

-- Quiz Questions: Public read access
CREATE POLICY "Quiz questions are viewable by everyone"
  ON quiz_questions FOR SELECT
  USING (true);

-- Posts: Everyone can view, only authenticated users can create, users can delete their own
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Post Likes: Everyone can view, authenticated users can manage their own likes
CREATE POLICY "Post likes are viewable by everyone"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own likes"
  ON post_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Post Comments: Everyone can view, authenticated users can create, users can delete their own
CREATE POLICY "Post comments are viewable by everyone"
  ON post_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own comments"
  ON post_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Article Progress: Users can only see and manage their own progress
CREATE POLICY "Users can view their own article progress"
  ON article_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own article progress"
  ON article_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own article progress"
  ON article_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Quiz Attempts: Users can only see their own attempts
CREATE POLICY "Users can view their own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Bookmarks: Users can only see and manage their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to create profile on signup
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
