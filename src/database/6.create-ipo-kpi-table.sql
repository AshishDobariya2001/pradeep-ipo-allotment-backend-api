CREATE TABLE IF NOT EXISTS public.ipo_kpi (
    id SERIAL PRIMARY KEY,
    kpi_name VARCHAR(255) NOT NULL,
    kpi_value VARCHAR(255) NOT NULL,
    ipo_details_id INTEGER NOT NULL,

    CONSTRAINT ipo_kpi_ipo_details_id_fkey FOREIGN KEY (ipo_details_id)
        REFERENCES public.ipo_details (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
