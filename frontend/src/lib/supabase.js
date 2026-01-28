import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
    async signUp(email, password, userData) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userData
            }
        });

        if (error) throw error;
        return data;
    },

    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
};

// Database helper functions
export const db = {
    // Users
    async getUserProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return data;
    },

    async updateUserProfile(userData) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('users')
            .update(userData)
            .eq('id', user.id)
            .select()
            .single();

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

    async approveMember(userId) {
        const { data, error } = await supabase
            .from('users')
            .update({ is_approved: true })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async rejectMember(userId) {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) throw error;
    },

    // Concerts
    async getConcerts() {
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
    async getRehearsals() {
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
    async getRecordings() {
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
    async getSheetMusic() {
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
    },

    // Storage
    async uploadFile(bucket, path, file) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file);

        if (error) throw error;
        return data;
    },

    async getPublicUrl(bucket, path) {
        const { data } = await supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return data.publicUrl;
    },

    async deleteFile(bucket, path) {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
    }
};
