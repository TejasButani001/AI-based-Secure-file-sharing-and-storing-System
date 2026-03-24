import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const token = jwt.sign(
    { userId: 1, role: 'admin', email: 'tejas@gmail.com', username: 'tejas' },
    JWT_SECRET,
    { expiresIn: '1d' }
);

async function check() {
    try {
        const res = await fetch('http://localhost:3001/api/logs', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text.substring(0, 500));
    } catch (e) {
        console.error(e);
    }
}
check();
