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

    async getAllMembers() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getPendingMembers() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('is_approved', false)
            .neq('role', 'admin')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    async getUserProfile(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    },

    async updateUserProfile(id, userData) {
        const { data, error } = await supabase
            .from('users')
            .update(userData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async approveMember(id) {
        const { data, error } = await supabase
            .from('users')
            .update({ is_approved: true })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async rejectMember(id) {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async deleteMember(id) {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', id);

        if (error) throw error;
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

    async getConcertById(id) {
        const { data, error } = await supabase
            .from('concerts')
            .select('*')
            .eq('id', id)
            .single();

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

    async updateConcert(id, updates) {
        const { data, error } = await supabase
            .from('concerts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteConcert(id) {
        const { error } = await supabase
            .from('concerts')
            .delete()
            .eq('id', id);

        if (error) throw error;
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

    async getRehearsalById(id) {
        const { data, error } = await supabase
            .from('rehearsals')
            .select('*')
            .eq('id', id)
            .single();

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

    async updateRehearsal(id, updates) {
        const { data, error } = await supabase
            .from('rehearsals')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteRehearsal(id) {
        const { error } = await supabase
            .from('rehearsals')
            .delete()
            .eq('id', id);

        if (error) throw error;
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

    async getRecordingById(id) {
        const { data, error } = await supabase
            .from('recordings')
            .select(`
                *,
                users(username)
            `)
            .eq('id', id)
            .single();

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

    async updateRecording(id, updates) {
        const { data, error } = await supabase
            .from('recordings')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteRecording(id) {
        const { error } = await supabase
            .from('recordings')
            .delete()
            .eq('id', id);

        if (error) throw error;
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

    async getSheetMusicById(id) {
        const { data, error } = await supabase
            .from('sheet_music')
            .select(`
                *,
                users(username)
            `)
            .eq('id', id)
            .single();

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
    },

    async updateSheetMusic(id, updates) {
        const { data, error } = await supabase
            .from('sheet_music')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteSheetMusic(id) {
        const { error } = await supabase
            .from('sheet_music')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

module.exports = { supabase, db };
