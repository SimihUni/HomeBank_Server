import assert from 'assert';
import { generateAuthTokens, authenticateBearer } from '../src/auth_utils.js';

describe("Example unit tests", () => {
    it('Create a Bearer token and refresh token', async () => {
        const tokens = await generateAuthTokens("example@example.com",false)
        expect( tokens.accessToken).not.toBe("")
        expect( tokens.refreshToken).not.toBe("")
    })

    it('Authenticate a Bearer and Refresh tokens', async () => {
        const tokens = await generateAuthTokens("example@example.com",false)
        expect(await authenticateBearer(tokens.accessToken)).toBe(true)
        expect(await authenticateBearer(tokens.refreshToken)).toBe(true)
    })
});
