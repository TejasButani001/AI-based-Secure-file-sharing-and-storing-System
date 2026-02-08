import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs';

const admins = [
    { name: "Tejas", email: "tejas@gmail.com", password: "Tejas@123" },
    { name: "Aryan", email: "aryan@gmail.com", password: "Aryan@123" },
    { name: "Het", email: "het@gmail.com", password: "Het@123" },
    { name: "Abhay", email: "abhay@gmail.com", password: "Abhay@123" },
];

async function seedAdmins() {
    console.log("Seeding admins...");

    for (const admin of admins) {
        const passwordHash = await bcrypt.hash(admin.password, 10);

        const { data, error } = await supabase.from('users').upsert({
            username: admin.name,
            email: admin.email,
            password_hash: passwordHash,
            role: 'admin',
            status: 'active',
            created_at: new Date().toISOString()
        }, { onConflict: 'email' }).select();

        if (error) {
            console.error(`Error seeding ${admin.name}:`, error.message);
        } else {
            console.log(`Seeded admin: ${admin.name}`);
        }
    }
    console.log("Seeding complete.");
}

seedAdmins();
