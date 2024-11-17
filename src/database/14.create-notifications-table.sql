CREATE TABLE IF NOT EXISTS public.notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR NOT NULL,
    message VARCHAR NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    data JSONB,
    is_read BOOLEAN,
    is_send BOOLEAN,
    ipo_details_id INTEGER,
    CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
