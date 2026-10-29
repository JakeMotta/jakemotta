// Gets the refresh token the Worker uses to read what Jake's Spotify is playing. Run it once, on your
// own computer:
//
//   SPOTIFY_CLIENT_ID=… SPOTIFY_CLIENT_SECRET=… node scripts/spotify-auth.mjs | npx wrangler secret put SPOTIFY_REFRESH_TOKEN
//
// The Spotify app must list http://127.0.0.1:8888/callback as a redirect URI (Spotify no longer
// accepts "localhost" there). Sign in with Jake's account when the link opens. Instructions go to
// stderr and only the token to stdout, so it can be piped straight into wrangler without being shown.

import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
// Just enough to see what's playing, to read Jake's playlist (SPOTIFY_PLAYLIST) if it's private, and
// his top artists and songs (the library's Favorite artists, since 2026-10-28)
const SCOPE = 'user-read-currently-playing playlist-read-private user-top-read';

const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
    console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first (from developer.spotify.com/dashboard).');
    process.exit(1);
}

const state = randomBytes(16).toString('hex');
const authorize = `https://accounts.spotify.com/authorize?${new URLSearchParams({ client_id: clientId, response_type: 'code', redirect_uri: REDIRECT_URI, scope: SCOPE, state })}`;

const server = createServer(async (request, response) => {
    const url = new URL(request.url, REDIRECT_URI);
    if (url.pathname !== '/callback') {
        response.writeHead(404).end();
        return;
    }
    const finish = (message, code = 0) => {
        response.writeHead(code ? 400 : 200, { 'Content-Type': 'text/plain' }).end(message);
        server.close();
        if (code) {
            console.error(message);
            process.exit(code);
        }
    };

    if (url.searchParams.get('state') !== state) return finish('The sign-in came back with the wrong state. Run the script again.', 1);
    if (url.searchParams.get('error')) return finish(`Spotify said: ${url.searchParams.get('error')}`, 1);

    const token = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ grant_type: 'authorization_code', code: url.searchParams.get('code') ?? '', redirect_uri: REDIRECT_URI }),
    }).then((answer) => answer.json());

    if (!token.refresh_token) return finish(`Spotify didn't return a refresh token: ${token.error_description ?? token.error ?? 'no reason given'}`, 1);
    process.stdout.write(token.refresh_token);
    console.error('\nGot it. You can close the browser tab.');
    finish('Signed in. You can close this tab and go back to the terminal.');
});

server.listen(PORT, '127.0.0.1', () => {
    console.error(`Open this link and sign in to Spotify:\n\n${authorize}\n`);
});
