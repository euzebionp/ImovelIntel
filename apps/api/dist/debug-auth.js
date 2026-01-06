"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const fs = require("fs");
function log(msg) {
    console.log(msg);
    fs.appendFileSync('debug-auth.log', msg + '\n');
}
async function testAuth() {
    fs.writeFileSync('debug-auth.log', '--- Debug Log ---\n');
    log('--- Testing Authentication ---');
    const baseUrl = 'http://localhost:3000';
    log('\n[1] Testing Admin Login (infoservicos@imovelintel.com)...');
    try {
        const res = await axios_1.default.post(`${baseUrl}/auth/login`, {
            email: 'infoservicos@imovelintel.com',
            password: '14082025Eu*'
        });
        log('SUCCESS: Admin logged in.');
        log('Token received: ' + (res.data.access_token ? 'YES' : 'NO'));
    }
    catch (error) {
        log('FAIL: Admin login failed.');
        printError(error);
    }
    const randomEmail = `test-${Date.now()}@example.com`;
    log(`\n[2] Testing Registration (${randomEmail})...`);
    try {
        const res = await axios_1.default.post(`${baseUrl}/auth/register`, {
            email: randomEmail,
            fullName: 'Test User',
            password: 'password123',
            role: 'USER'
        });
        log('SUCCESS: User registered.');
    }
    catch (error) {
        log('FAIL: Registration failed.');
        printError(error);
    }
}
function printError(error) {
    if (error.response) {
        log('Status: ' + error.response.status);
        log('Data: ' + JSON.stringify(error.response.data));
    }
    else {
        log('Error: ' + error.message);
    }
}
testAuth();
//# sourceMappingURL=debug-auth.js.map