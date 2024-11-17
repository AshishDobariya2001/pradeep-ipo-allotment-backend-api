CREATE TABLE IF NOT EXISTS public.timeline (
    id SERIAL PRIMARY KEY,
    ipo_open_date DATE,
    ipo_close_date DATE,
    basis_of_allotment DATE,
    initiation_of_refunds DATE,
    credit_of_shares_to_demat DATE,
    listing_date DATE,
    cut_off_time_for_upi_mandate_confirmation VARCHAR(255),
    ipo_details_id INTEGER NOT NULL,
    
    CONSTRAINT timeline_ipo_details_id_fkey FOREIGN KEY (ipo_details_id)
        REFERENCES public.ipo_details (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
