import { generateAuthTokens, authenticateBearer } from '../src/auth_utils.js'
import { publicJWK, privateJWK } from '../src/enviroments.js'
import * as jose from 'jose'

describe("Example unit tests", () => {
    it('Create a Bearer token and refresh token', async () => {
        const tokens = await generateAuthTokens("example@example.com",false,privateJWK)
        expect( tokens.accessToken).not.toBe("")
        expect( tokens.refreshToken).not.toBe("")
    })

    it('Authenticate a Bearer and Refresh tokens', async () => {
        const tokens = await generateAuthTokens("example@example.com",false,privateJWK)
        expect(await authenticateBearer(tokens.accessToken,publicJWK)).toBe(true)
        expect(await authenticateBearer(tokens.refreshToken,publicJWK)).toBe(true)
    })
});
