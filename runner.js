// Usage: node runner.js <NODE_ENV>

const { spawn } = require('child_process');
const path = require('path');

const env = process.argv[2] || 'development';
const client
    = spawn('npm', ['run', 'start'], { cwd: path.join(__dirname, 'client'), env: { ...process.env, NODE_ENV: env } });
const server
    = spawn('npm', ['run', 'start'], { cwd: path.join(__dirname, 'server'), env: { ...process.env, NODE_ENV: env } });

client.stdout.on('data', (data) => {
    console.log(`client: ${data}`);
});

server.stdout.on('data', (data) => {
    console.log(`server: ${data}`);
});

client.stderr.on('data', (data) => {
    console.error(`client: ${data}`);
});

server.stderr.on('data', (data) => {
    console.error(`server: ${data}`);
});

client.on('close', (code) => {
    console.log(`client process exited with code ${code}`);
});

server.on('close', (code) => {
    console.log(`server process exited with code ${code}`);
});

client.on('error', (err) => {
    console.error(`client process error: ${err}`);
});

server.on('error', (err) => {
    console.error(`server process error: ${err}`);
});
