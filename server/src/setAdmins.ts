import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';

const ADMIN_USERS = [
    { username: 'Tejas', email: 'tejas@gmail.com', password: 'Tejas@123' },
    { username: 'Aryan', email: 'aryan@gmail.com', password: 'Aryan@123' },
    { username: 'Het', email: 'het@gmail.com', password: 'Het@123' },
    { username: 'Abhay', email: 'abhay@gmail.com', password: 'Abhay@123' }
];

async function configureAdmins() {
    console.log("Starting admin configuration...");

    // 1. Demote all existing admins to regular users
    const { error: demoteError } = await supabase
        .from('users')
        .update({ role: 'user' })
        .eq('role', 'admin');

    if (demoteError) {
        console.error("Error demoting current admins:", demoteError);
        return;
    }
    console.log("Demoted any existing admins.");

    // 2. Iterate through our target list
    for (const admin of ADMIN_USERS) {
        // Hash the password
        const password_hash = await bcrypt.hash(admin.password, 10);

        // Check if user exists
        const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('user_id')
            .eq('email', admin.email)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error(`Error checking user ${admin.email}:`, checkError);
            continue;
        }

        if (existingUser) {
            // Update existing user to admin
            const { error: updateError } = await supabase
                .from('users')
                .update({ role: 'admin', password_hash, username: admin.username })
                .eq('user_id', existingUser.user_id);

            if (updateError) {
                console.error(`Failed to update ${admin.email} to admin:`, updateError);
            } else {
                console.log(`Updated existing user ${admin.email} to admin.`);
            }
        } else {
            // Create new admin user
            const { error: insertError } = await supabase
                .from('users')
                .insert({
                    username: admin.username,
                    email: admin.email,
                    password_hash: password_hash,
                    role: 'admin',
                    status: 'active',
                    created_at: new Date().toISOString()
                });

            if (insertError) {
                console.error(`Failed to create admin user ${admin.email}:`, insertError);
            } else {
                console.log(`Created new admin user ${admin.email}.`);
            }
        }
    }

    console.log("Admin configuration complete!");
}

configureAdmins().catch(console.error);
