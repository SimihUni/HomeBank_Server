import { generateAuthTokens, authenticateBearer } from '../src/auth_utils.js'
import { publicJWK, privateJWK } from '../src/enviroments.js'
import * as jose from 'jose'

describe("Example unit tests", () => {
    it('Create a Bearer token and refresh token', async () => {
        const tokens = await generateAuthTokens("example@example.com",false,(await jose.generateKeyPair("ES256")).privateKey)
        expect( tokens.accessToken).not.toBe("")
        expect( tokens.refreshToken).not.toBe("")
    })

    it('Authenticate a Bearer and Refresh tokens', async () => {
        const keyPair = await jose.generateKeyPair("ES256")
        const tokens = await generateAuthTokens("example@example.com",false,keyPair.privateKey)
        expect(await authenticateBearer(tokens.accessToken,keyPair.publicKey)).toBe(true)
        expect(await authenticateBearer(tokens.refreshToken,keyPair.publicKey)).toBe(true)
    })
});
