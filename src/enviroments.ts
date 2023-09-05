const port = 3000;
process.env.port = port.toString();
const host = "http://" + "localhost:" + process.env.port;

export { port, host };
