import { supabase } from './supabaseClient';

async function listTables() {
    console.log("Checking tables in database...");

    // Attempt to select from information_schema (might fail due to permissions, but worth a try)
    // Supabase JS client doesn't support querying information_schema easily directly via .from() usually, 
    // but let's try a raw RPC if available or just a known table check.

    // Actually, a better test is just to try to select * from USERS and print the error 
    // to see if it's permission vs existence.

    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
        console.error("Error accessing USERS table:");
        console.error(JSON.stringify(error, null, 2));
    } else {
        console.log("Success! USERS table exists.");
        console.log("Data sample:", data);
    }
}

listTables();
