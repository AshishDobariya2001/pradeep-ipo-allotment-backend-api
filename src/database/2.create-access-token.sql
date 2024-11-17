CREATE TABLE access_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT NOT NULL,
    user_id BIGINT REFERENCES users(id),
    device_info JSONB,
    request_count INT DEFAULT 0,
    device_platform TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);