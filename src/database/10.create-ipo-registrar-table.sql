CREATE TABLE IF NOT EXISTS public.registrar (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    server_url TEXT[] DEFAULT '{}',
    allotment_url TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT FALSE
);
