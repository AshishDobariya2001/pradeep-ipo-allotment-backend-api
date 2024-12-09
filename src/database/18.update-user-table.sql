ALTER TABLE public.users
ADD COLUMN temp_otp TEXT,
ADD COLUMN temp_otp_expire_time TIMESTAMP,
ADD COLUMN is_mobile_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN status VARCHAR(20) DEFAULT 'pending';