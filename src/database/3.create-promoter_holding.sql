CREATE TABLE IF NOT EXISTS public.promoter_holding (
    id SERIAL PRIMARY KEY,
    pre_issue VARCHAR(50) NOT NULL,
    post_issue VARCHAR(50) NOT NULL,
    ipo_details_id INTEGER NOT NULL,
    
    CONSTRAINT promoter_holding_ipo_details_id_fkey FOREIGN KEY (ipo_details_id)
        REFERENCES public.ipo_details (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
