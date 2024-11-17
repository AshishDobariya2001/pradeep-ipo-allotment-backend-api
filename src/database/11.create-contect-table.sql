CREATE TABLE IF NOT EXISTS public.contacts (
    id SERIAL PRIMARY KEY,
    pan_number VARCHAR(20),
    legal_name VARCHAR(255),
    name VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contacts_pkey PRIMARY KEY (id)
);
