CREATE TABLE IF NOT EXISTS public.ipo_scraper_log (
    id SERIAL PRIMARY KEY,
    scraper_name VARCHAR(255) NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    status VARCHAR(100),
    message TEXT
);
