CREATE TABLE IF NOT EXISTS public.ipo_reservation (
    id SERIAL PRIMARY KEY,
    ipo_details_id INTEGER NOT NULL,
    anchor_investor_shares_offered VARCHAR(255),
    qib_shares_offered VARCHAR(255),
    nii_hni_shares_offered VARCHAR(255),
    retail_shares_offered VARCHAR(255),
    total_shares_offered VARCHAR(255),
    market_maker_shares_offered VARCHAR(255),
    other_shares_offered VARCHAR(255),
    employee_shares_offered VARCHAR(255),

    CONSTRAINT ipo_reservation_ipo_details_id_fkey FOREIGN KEY (ipo_details_id)
        REFERENCES public.ipo_details (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
