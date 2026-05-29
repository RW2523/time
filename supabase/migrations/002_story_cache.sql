-- ─────────────────────────────────────────────────────────────────────────────
-- SabAI Bible — Story Cache Table
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ── AI-generated story cache ─────────────────────────────────────────────────
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

-- RLS: anyone can read; API (anon key) can insert/upsert
ALTER TABLE story_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read story_cache"   ON story_cache;
DROP POLICY IF EXISTS "Public insert story_cache"  ON story_cache;
DROP POLICY IF EXISTS "Public update story_cache"  ON story_cache;

CREATE POLICY "Public read story_cache"
  ON story_cache FOR SELECT USING (true);

CREATE POLICY "Public insert story_cache"
  ON story_cache FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Public update story_cache"
  ON story_cache FOR UPDATE TO anon USING (true);
