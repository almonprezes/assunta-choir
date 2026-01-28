-- Supabase Schema for Assunta Choir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member',
    first_name TEXT,
    last_name TEXT,
    voice_part TEXT,
    phone TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Concerts table
CREATE TABLE IF NOT EXISTS public.concerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location TEXT,
    is_past BOOLEAN DEFAULT false,
    report_highlights TEXT,
    report_photos TEXT,
    report_acknowledgments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rehearsals table
CREATE TABLE IF NOT EXISTS public.rehearsals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location TEXT NOT NULL,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recordings table
CREATE TABLE IF NOT EXISTS public.recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    duration INTEGER,
    is_public BOOLEAN DEFAULT false,
    uploaded_by UUID REFERENCES public.users(id),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sheet Music table
CREATE TABLE IF NOT EXISTS public.sheet_music (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    composer TEXT,
    description TEXT,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    voice_part TEXT,
    uploaded_by UUID REFERENCES public.users(id),
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_concerts_date ON public.concerts(date);
CREATE INDEX IF NOT EXISTS idx_rehearsals_date ON public.rehearsals(date);
