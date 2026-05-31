-- ─────────────────────────────────────────────────────────────────────────────
-- SabAI Bible — Video Storage
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. Add video_url column to story_cache ────────────────────────────────────
ALTER TABLE story_cache ADD COLUMN IF NOT EXISTS video_url TEXT;

-- ── 2. Create the story-videos storage bucket ────────────────────────────────
-- Public bucket so <video src="..."> works without auth headers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'story-videos',
  'story-videos',
  true,
  52428800,
  ARRAY['video/mp4', 'video/webm', 'video/ogg']
)
ON CONFLICT (id) DO UPDATE SET
  public           = EXCLUDED.public,
  file_size_limit  = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ── 3. Storage RLS policies ───────────────────────────────────────────────────
-- Allow anon to upload / replace story videos
DROP POLICY IF EXISTS "anon can upload story videos"  ON storage.objects;
DROP POLICY IF EXISTS "anon can update story videos"  ON storage.objects;
DROP POLICY IF EXISTS "public can read story videos"  ON storage.objects;

CREATE POLICY "public can read story videos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'story-videos');

CREATE POLICY "anon can upload story videos"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'story-videos');

CREATE POLICY "anon can update story videos"
  ON storage.objects FOR UPDATE TO anon
  USING (bucket_id = 'story-videos');
