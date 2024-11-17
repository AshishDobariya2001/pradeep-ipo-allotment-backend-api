CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    phone VARCHAR(20),
    email TEXT,
    legal_name TEXT,
    pancard VARCHAR(20),
    pin TEXT,
    reset_pin_code_link TEXT,
    role TEXT,
    sub_role TEXT,
    is_ipo_screener_access BOOLEAN DEFAULT FALSE,
    is_ipo_allotment_access BOOLEAN DEFAULT FALSE,
    is_ipo_screener_web_access BOOLEAN DEFAULT FALSE,
    country_code VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
