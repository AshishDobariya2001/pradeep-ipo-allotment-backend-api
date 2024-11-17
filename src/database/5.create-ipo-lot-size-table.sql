CREATE TABLE IF NOT EXISTS public.ipo_lot_size (
    id SERIAL PRIMARY KEY,
    application VARCHAR(255),
    lots VARCHAR(255),
    shares VARCHAR(255),
    amount VARCHAR(255),
    ipo_details_id INTEGER NOT NULL,

    CONSTRAINT ipo_lot_size_ipo_details_id_fkey FOREIGN KEY (ipo_details_id)
        REFERENCES public.ipo_details (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);