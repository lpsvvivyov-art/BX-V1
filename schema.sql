CREATE TABLE IF NOT EXISTS subscriptions (
 token TEXT PRIMARY KEY, name TEXT NOT NULL, file_name TEXT NOT NULL,
 config_text TEXT NOT NULL, country TEXT, uid TEXT,
 total_bytes INTEGER NOT NULL DEFAULT 0, used_bytes INTEGER NOT NULL DEFAULT 0,
 online_seconds INTEGER NOT NULL DEFAULT 0, last_handshake INTEGER,
 last_seen INTEGER, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expiry ON subscriptions(expires_at);
