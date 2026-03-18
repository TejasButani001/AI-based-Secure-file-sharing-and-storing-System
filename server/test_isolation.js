const fetch = require('node-fetch');

async function test() {
    try {
        // 1. register A
        const resA = await fetch('http://localhost:3001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `a${Date.now()}@test.com`, password: 'password', username: 'usera' })
        });
        const dataA = await resA.json();
        const tokenA = dataA.token;
        console.log("Token A acquired.");

        // 2. register B
        const resB = await fetch('http://localhost:3001/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `b${Date.now()}@test.com`, password: 'password', username: 'userb' })
        });
        const dataB = await resB.json();
        const tokenB = dataB.token;
        console.log("Token B acquired.");

        // 3. fetch default files as B
        let fb = await fetch('http://localhost:3001/api/files', {
            headers: { 'Authorization': `Bearer ${tokenB}` }
        });
        console.log("Files B initially:", await fb.json());

        // 4. Upload file as A
        const formData = new FormData();
        const blob = new Blob(['hello world'], { type: 'text/plain' });
        formData.append('file', blob, 'secretA.txt');

        console.log("Uploading file as A...");
        const resUpload = await fetch('http://localhost:3001/api/files/upload', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${tokenA}` },
            body: formData
        });
        console.log("Upload result:", await resUpload.json());

        // 5. Fetch files as B again
        fb = await fetch('http://localhost:3001/api/files', {
            headers: { 'Authorization': `Bearer ${tokenB}` }
        });
        console.log("Files B after A upload:", await fb.json());

        // 6. Fetch files as A
        const fa = await fetch('http://localhost:3001/api/files', {
            headers: { 'Authorization': `Bearer ${tokenA}` }
        });
        console.log("Files A after A upload:", await fa.json());

    } catch (e) {
        console.error(e);
    }
}

test();
