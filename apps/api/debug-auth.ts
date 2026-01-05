
import axios from 'axios';

import * as fs from 'fs';

function log(msg: string) {
    console.log(msg);
    fs.appendFileSync('debug-auth.log', msg + '\n');
}

async function testAuth() {
    fs.writeFileSync('debug-auth.log', '--- Debug Log ---\n');
    log('--- Testing Authentication ---');
    const baseUrl = 'http://localhost:3000';

    // 1. Test Admin Login
    log('\n[1] Testing Admin Login (infoservicos@imovelintel.com)...');
    try {
        const res = await axios.post(`${baseUrl}/auth/login`, {
            email: 'infoservicos@imovelintel.com',
            password: '14082025Eu*'
        });
        log('SUCCESS: Admin logged in.');
        log('Token received: ' + (res.data.access_token ? 'YES' : 'NO'));
    } catch (error: any) {
        log('FAIL: Admin login failed.');
        printError(error);
    }

    // 2. Test Registration
    const randomEmail = `test-${Date.now()}@example.com`;
    log(`\n[2] Testing Registration (${randomEmail})...`);
    try {
        const res = await axios.post(`${baseUrl}/auth/register`, {
            email: randomEmail,
            fullName: 'Test User',
            password: 'password123',
            role: 'USER'
        });
        log('SUCCESS: User registered.');
    } catch (error: any) {
        log('FAIL: Registration failed.');
        printError(error);
    }
}

function printError(error: any) {
    if (error.response) {
        log('Status: ' + error.response.status);
        log('Data: ' + JSON.stringify(error.response.data));
    } else {
        log('Error: ' + error.message);
    }
}

testAuth();
