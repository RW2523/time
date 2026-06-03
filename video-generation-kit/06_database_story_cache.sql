-- ──────────────────────────────────────────────────────────────────────────────
-- FILE 06 — supabase/migrations/002_story_cache.sql
-- ──────────────────────────────────────────────────────────────────────────────
-- PURPOSE:  Creates the Supabase table used to cache generated story manifests.
--           Run once in the Supabase Dashboard → SQL Editor → Run.
--
-- WHY CACHE?
--   Generating a 4-scene story (text + 4 images + TTS audio) takes ~50-90s
--   and costs Gemini API credits. Caching means repeat visitors see the result
--   in < 5 seconds with no additional API cost.
--
-- TABLE: story_cache
--   event_id     TEXT PK  — matches the Bible event's `id` field
--   story_data   JSONB    — the full manifest returned by /api/events/:id/story
--                           (scenes with base64 images + WAV audio data URL)
--   scene_count  INT      — quick metadata for the /story/meta endpoint
--   has_audio    BOOLEAN  — quick metadata for the /story/meta endpoint
--   mode         TEXT     — 'gemini' | 'demo-fallback'
--   generated_at TIMESTAMPTZ
--   updated_at   TIMESTAMPTZ (auto-updated by trigger)
--
-- RLS:  Public read — any browser can read cached stories.
--       Anon insert/update — the API uses the anon key to write.
-- ──────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS story_cache (
  event_id      TEXT        PRIMARY KEY,
  event_title   TEXT        NOT NULL DEFAULT '',
  story_data    JSONB       NOT NULL DEFAULT '{}',
  scene_count   INT         NOT NULL DEFAULT 0,
  has_audio     BOOLEAN     NOT NULL DEFAULT FALSE,
  mode          TEXT        NOT NULL DEFAULT 'gemini',
  generated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION update_story_cache_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS story_cache_updated_at ON story_cache;
CREATE TRIGGER story_cache_updated_at
  BEFORE UPDATE ON story_cache
  FOR EACH ROW EXECUTE FUNCTION update_story_cache_timestamp();

-- Row-Level Security
ALTER TABLE story_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read story_cache"    ON story_cache;
DROP POLICY IF EXISTS "Public insert story_cache"  ON story_cache;
DROP POLICY IF EXISTS "Public update story_cache"  ON story_cache;

CREATE POLICY "Public read story_cache"
  ON story_cache FOR SELECT USING (true);

CREATE POLICY "Public insert story_cache"
  ON story_cache FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Public update story_cache"
  ON story_cache FOR UPDATE TO anon USING (true);
