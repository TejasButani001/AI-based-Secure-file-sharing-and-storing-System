
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const admins = [
        { name: "Tejas", email: "tejas@gmail.com", password: "tejas@123" },
        { name: "Aryan", email: "aryan@gmail.com", password: "aryan@123" },
        { name: "Het", email: "het@gmail.com", password: "het@123" },
        { name: "Abhay", email: "abhay@gmail.com", password: "abhay@123" },
    ];

    console.log(`Start seeding ${admins.length} admins...`);

    for (const admin of admins) {
        const passwordHash = await bcrypt.hash(admin.password, 10);

        const user = await prisma.users.upsert({
            where: { email: admin.email },
            update: {
                role: 'admin', // Ensure they remain admins
                username: admin.name,
                password_hash: passwordHash // Update password if it changed
            },
            create: {
                email: admin.email,
                username: admin.name,
                password_hash: passwordHash,
                role: 'admin',
                status: 'active'
            },
        });
        console.log(`Created/Updated admin: ${user.email}`);
    }

    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
