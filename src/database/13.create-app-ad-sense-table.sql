CREATE TABLE IF NOT EXISTS public.app_ad_sense (
    id SERIAL PRIMARY KEY,
    app_name VARCHAR,
    ad_list JSONB,
    ad_status BOOLEAN,
    is_app_maintains BOOLEAN,
    CONSTRAINT app_ad_sense_pkey PRIMARY KEY (id)
);
