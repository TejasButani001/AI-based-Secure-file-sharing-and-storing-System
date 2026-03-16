import { supabase } from './supabaseClient';

async function seed() {
    console.log("Seeding data to all tables...");

    const { data: user } = await supabase.from('users').select('user_id').limit(1).single();
    if (!user) { console.log("No users found. Please create a user first."); return; }
    const userId = user.user_id;

    // files
    const { data: file } = await supabase.from('files').insert({
        file_name: 'test_file.txt',
        encrypted_path: '/dummy/path/test_file.txt',
        owner_id: userId,
        size: 1024,
        checksum: '1234abcd',
    }).select().single();
    
    if (file) {
        const fileId = file.file_id;
        // file_access_permission
        await supabase.from('file_access_permission').insert({
            file_id: fileId,
            user_id: userId,
            access_type: 'read'
        });

        // access_logs
        await supabase.from('access_logs').insert({
            user_id: userId,
            file_id: fileId,
            action: 'download'
        });
    }

    // login_logs (ensure at least one exists)
    await supabase.from('login_logs').insert({
        user_id: userId,
        ip_address: '127.0.0.1',
        success: true
    });

    // alerts
    await supabase.from('alerts').insert({
        user_id: userId,
        alert_type: 'suspicious_login',
        risk_score: 0.85,
        description: 'Login from anomalous IP',
        status: 'open'
    });

    // ml_activity_data
    await supabase.from('ml_activity_data').insert({
        user_id: userId,
        login_hour: 14,
        failed_attempts: 0,
        file_count: 5,
        ip_change_count: 1,
        label: 'normal'
    });

    // sessions
    await supabase.from('sessions').insert({
        user_id: userId,
        expiry: new Date(Date.now() + 86400000).toISOString()
    });

    // audit_trail
    await supabase.from('audit_trail').insert({
        user_id: userId,
        event: 'file_deleted',
        details: 'User deleted temporary file'
    });

    // admin_actions
    await supabase.from('admin_actions').insert({
        admin_id: userId,
        action: 'system_configured',
        target_user: userId
    });

    console.log("Seeding complete! All 10 tables now have data.");
}

seed().catch(console.error);
