const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Database helper functions
const db = {
    // Users
    async getUserByUsername(username) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
            throw error;
        }

        return data;
    },

    async getUserByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    },

    async createUser(userData) {
        const { data, error } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateUser(id, userData) {
        const { data, error } = await supabase
            .from('users')
            .update(userData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async getAllUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getPendingUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('is_approved', false)
            .neq('role', 'admin')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Concerts
    async getAllConcerts() {
        const { data, error } = await supabase
            .from('concerts')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        return data;
    },

    async createConcert(concertData) {
        const { data, error } = await supabase
            .from('concerts')
            .insert([concertData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Rehearsals
    async getAllRehearsals() {
        const { data, error } = await supabase
            .from('rehearsals')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        return data;
    },

    async createRehearsal(rehearsalData) {
        const { data, error } = await supabase
            .from('rehearsals')
            .insert([rehearsalData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Recordings
    async getAllRecordings() {
        const { data, error } = await supabase
            .from('recordings')
            .select(`
                *,
                users(username)
            `)
            .order('upload_date', { ascending: false });

        if (error) throw error;
        return data;
    },

    async createRecording(recordingData) {
        const { data, error } = await supabase
            .from('recordings')
            .insert([recordingData])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Sheet Music
    async getAllSheetMusic() {
        const { data, error } = await supabase
            .from('sheet_music')
            .select(`
                *,
                users(username)
            `)
            .order('upload_date', { ascending: false });

        if (error) throw error;
        return data;
    },

    async createSheetMusic(sheetData) {
        const { data, error } = await supabase
            .from('sheet_music')
            .insert([sheetData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

module.exports = { supabase, db };
