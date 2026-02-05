
import bcrypt from 'bcryptjs';

// Types mimicking Prisma models
interface User {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
    role: string;
    status: string;
    created_at: Date;
    last_login: Date | null;
}

interface FileModel {
    file_id: number;
    file_name: string;
    encrypted_path: string;
    owner_id: number;
    size: number;
    upload_time: Date;
    checksum: string;
    // mock relation
    owner?: Partial<User>;
}

interface LoginLog {
    log_id: number;
    user_id: number;
    ip_address: string;
    login_time: Date;
    success: boolean;
}

interface AuditTrail {
    audit_id: number;
    user_id: number;
    event: string;
    event_time: Date;
    details: string;
}

// In-memory storage
const users: User[] = [];
const files: FileModel[] = [];
const loginLogs: LoginLog[] = [];
const auditTrail: AuditTrail[] = [];

// ID counters
let userIdCounter = 1;
let fileIdCounter = 1;
let logIdCounter = 1;
let auditIdCounter = 1;

// Seed Admins
const seedAdmins = async () => {
    const admins = [
        { name: "Tejas", email: "tejas@gmail.com", password: "tejas@123" },
        { name: "Aryan", email: "aryan@gmail.com", password: "aryan@123" },
        { name: "Het", email: "het@gmail.com", password: "het@123" },
        { name: "Abhay", email: "abhay@gmail.com", password: "abhay@123" },
    ];

    for (const admin of admins) {
        const passwordHash = await bcrypt.hash(admin.password, 10);
        users.push({
            user_id: userIdCounter++,
            username: admin.name,
            email: admin.email,
            password_hash: passwordHash,
            role: 'admin',
            status: 'active',
            created_at: new Date(),
            last_login: null
        });
    }
    console.log(`[MockDB] Seeded ${admins.length} admins.`);
};

// Start seeding immediately (async)
seedAdmins();


// Mock Prisma Client Client
export const db = {
    users: {
        count: async () => users.length,
        findUnique: async ({ where }: any) => {
            return users.find(u => u.email === where.email) || null;
        },
        findFirst: async () => users[0] || null,
        findMany: async (args?: any) => {
            // Basic support for select/include if needed, but for now returning all data
            // If the query asks for specific fields, we might need to map, but for this simple app, 
            // returning the full object usually works fine as long as the caller handles it.
            // However, `_count` in /api/users needs handling.

            if (args?.select) {
                return users.map(u => {
                    const result: any = { ...u };
                    if (args.select._count) {
                        result._count = { files: files.filter(f => f.owner_id === u.user_id).length };
                    }
                    return result;
                });
            }
            return users;
        },
        create: async ({ data }: any) => {
            const newUser: User = {
                user_id: userIdCounter++,
                username: data.username,
                email: data.email,
                password_hash: data.password_hash,
                role: data.role,
                status: data.status,
                created_at: new Date(),
                last_login: null
            };
            users.push(newUser);
            return newUser;
        },
        update: async ({ where, data }: any) => {
            const userIndex = users.findIndex(u => u.user_id === where.user_id);
            if (userIndex > -1) {
                if (data.last_login) users[userIndex].last_login = data.last_login;
                return users[userIndex];
            }
            throw new Error("User not found");
        }
    },
    files: {
        count: async () => files.length,
        create: async ({ data }: any) => {
            const newFile: FileModel = {
                file_id: fileIdCounter++,
                file_name: data.file_name,
                encrypted_path: data.encrypted_path,
                size: data.size,
                checksum: data.checksum,
                owner_id: data.owner_id,
                upload_time: new Date()
            };
            files.push(newFile);
            return newFile;
        },
        findMany: async (args?: any) => {
            let result = [...files];
            if (args?.orderBy?.upload_time === 'desc') {
                result.sort((a, b) => b.upload_time.getTime() - a.upload_time.getTime());
            }
            // Handle include owner
            if (args?.include?.owner) {
                return result.map(f => ({
                    ...f,
                    owner: users.find(u => u.user_id === f.owner_id)
                }));
            }
            return result;
        }
    },
    loginLogs: {
        create: async ({ data }: any) => {
            const newLog: LoginLog = {
                log_id: logIdCounter++,
                user_id: data.user_id,
                ip_address: data.ip_address,
                success: data.success,
                login_time: new Date()
            };
            loginLogs.push(newLog);
            return newLog;
        }
    },
    auditTrail: {
        count: async () => auditTrail.length,
        findMany: async (args?: any) => {
            let result = [...auditTrail];
            if (args?.orderBy?.event_time === 'desc') {
                result.sort((a, b) => b.event_time.getTime() - a.event_time.getTime());
            }
            if (args?.take) {
                result = result.slice(0, args.take);
            }
            return result;
        }
    },

    // Helper for raw queries if any remain (though we plan to remove them)
    $queryRaw: async () => { return []; }
};
