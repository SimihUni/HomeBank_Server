# Documentation

The server doesn't support https yet, but
uses crypto keys with algorithm P-256.

#### Example for keys

The keys have to be saved as files in the src/keys directory.
Use the file names in these examples.

- src/keys/private.key.json
`{
  "kty": "EC",
  "x": "...",
  "y": "...",
  "crv": "P-256",
  "d": "..."
}`

- src/keys/public.key.json
`{
  "kty": "EC",
  "x": "...",
  "y": "...",
  "crv": "P-256"
}`

## CI in Github Actions

The workflow has checks for editorconfig, linter,
unit tests, sonar cloud and then builds a docker image, tests it with Trivy and if successful pushes the image to DockerHub.

## Deployment in kubernetes

When deploying the server to a kubernetes cluster add the following enviroment variables:
- PORT
- HOSTNAME
- DB_PORT
- DB_HOSTNAME
- DB_PASSWORD
  
To add the key files, use secrets then add them as a volume
mounted on this path: `/app/src/keys`

The default PORT is 3000.

To verify that the deplyment is successful make a GET request to http://{host}:{port}/auth/work. You should recieve two JWT tokens that are signed with the private key.
