import { supabase } from './supabaseClient';

/**
 * setupDatabase.ts
 * 
 * Verifies that all 10 required tables exist in Supabase.
 * 
 * USAGE:
 *   1. First, paste the contents of server/schema.sql into the
 *      Supabase Dashboard → SQL Editor and run it.
 *   2. Make sure server/.env has your SUPABASE_URL and SUPABASE_KEY.
 *   3. Run: npx ts-node src/setupDatabase.ts
 */

const REQUIRED_TABLES = [
    'users',
    'files',
    'file_access_permission',
    'login_logs',
    'access_logs',
    'alerts',
    'ml_activity_data',
    'sessions',
    'audit_trail',
    'admin_actions',
];

async function verifyTable(tableName: string): Promise<{ table: string; exists: boolean; error?: string }> {
    try {
        const { data, error } = await supabase.from(tableName).select('*').limit(1);

        if (error) {
            // Code 42P01 = relation does not exist (table missing)
            if (error.code === '42P01' || error.message?.includes('does not exist')) {
                return { table: tableName, exists: false, error: 'Table does not exist' };
            }
            // PGRST116 = no rows found — table exists but is empty (this is fine)
            if (error.code === 'PGRST116') {
                return { table: tableName, exists: true };
            }
            return { table: tableName, exists: false, error: error.message };
        }

        return { table: tableName, exists: true };
    } catch (err: any) {
        return { table: tableName, exists: false, error: err.message };
    }
}

async function main() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║   Supabase Database Setup — Table Verification Script   ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    // Step 1: Check connectivity
    console.log('🔌 Checking Supabase connection...');
    try {
        const { error } = await supabase.from('users').select('user_id').limit(1);
        if (error && error.code === '42P01') {
            console.log('⚠️  Connected to Supabase, but tables are not yet created.');
            console.log('');
            console.log('📋 NEXT STEP: Copy the contents of server/schema.sql');
            console.log('   and paste it into Supabase Dashboard → SQL Editor → Run');
            console.log('');
            console.log('   Then re-run this script to verify.');
            process.exit(1);
        } else if (error && !error.code?.startsWith('PGRST')) {
            throw new Error(error.message);
        }
        console.log('✅ Connected to Supabase successfully!\n');
    } catch (err: any) {
        console.error('❌ Failed to connect to Supabase:', err.message);
        console.error('');
        console.error('   Make sure your .env file has valid:');
        console.error('     SUPABASE_URL=https://your-project.supabase.co');
        console.error('     SUPABASE_KEY=your-anon-key');
        process.exit(1);
    }

    // Step 2: Verify each table
    console.log('📊 Verifying all 10 required tables...\n');

    let allExist = true;
    const results: { table: string; exists: boolean; error?: string }[] = [];

    for (const tableName of REQUIRED_TABLES) {
        const result = await verifyTable(tableName);
        results.push(result);
        const icon = result.exists ? '✅' : '❌';
        const status = result.exists ? 'EXISTS' : `MISSING — ${result.error}`;
        console.log(`  ${icon} ${tableName.padEnd(25)} ${status}`);
        if (!result.exists) allExist = false;
    }

    console.log('');

    // Step 3: Summary
    const existCount = results.filter(r => r.exists).length;
    const missingCount = results.filter(r => !r.exists).length;

    if (allExist) {
        console.log('═══════════════════════════════════════════════════');
        console.log(`🎉 All ${REQUIRED_TABLES.length} tables verified successfully!`);
        console.log('═══════════════════════════════════════════════════');
        console.log('');
        console.log('Your database is ready. You can now run the server:');
        console.log('  npm run dev');
        console.log('');
        console.log('Health check endpoint:');
        console.log('  http://localhost:3001/api/health');
    } else {
        console.log('═══════════════════════════════════════════════════');
        console.log(`⚠️  ${existCount}/${REQUIRED_TABLES.length} tables found, ${missingCount} missing.`);
        console.log('═══════════════════════════════════════════════════');
        console.log('');
        console.log('To create the missing tables:');
        console.log('  1. Open Supabase Dashboard → SQL Editor');
        console.log('  2. Paste the contents of server/schema.sql');
        console.log('  3. Click "Run"');
        console.log('  4. Re-run this script: npx ts-node src/setupDatabase.ts');
    }

    process.exit(allExist ? 0 : 1);
}

main();
