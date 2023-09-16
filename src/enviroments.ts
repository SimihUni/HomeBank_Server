import privateJWK from './keys/private.key.json';
import publicJWK from './keys/public.key.json';
//TODO check if priveteJWK and publicJWK are in the right format

const port = 3000;
process.env.port = port.toString();
const host = "http://" + "localhost:" + process.env.port;

export { port, host, privateJWK, publicJWK };
