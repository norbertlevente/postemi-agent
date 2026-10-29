# Official MCP Registry: com.postemi/postemi

Postemi's remote MCP server in the official MCP Registry
(https://registry.modelcontextprotocol.io), under the postemi.com domain.

| Field | Value |
|---|---|
| Name | `com.postemi/postemi` |
| Entry | [`../server.json`](../server.json) (repo root) |
| Remote | `streamable-http`, `https://mcp.postemi.com/mcp` |
| Auth method | HTTP domain proof, Ed25519 |
| Public key | `https://postemi.com/.well-known/mcp-registry-auth` (postemi repo, `src/app/.well-known/mcp-registry-auth/route.ts`) |
| Private key | Infisical project `5459eb12-72ad-4f3e-981e-34e3da3bdae9`, env `prod`, secret `MCP_REGISTRY_POSTEMI_ED25519_HEX` (64 hex chars). Nowhere else. |
| Publisher | `mcp-publisher` 1.8.6 (`brew install mcp-publisher`) |

Naming rule: with domain auth for `postemi.com` the name must start with
`com.postemi/`. HTTP auth covers `postemi.com` itself; DNS auth would also
cover subdomains (`com.postemi.*`). The description is at most 100 characters.

## 1. Before the first publish

The web app must serve the proof file. It is committed to the postemi repo;
push and deploy it, then check:

```bash
curl -si https://postemi.com/.well-known/mcp-registry-auth
# HTTP 200, content-type: text/plain; charset=utf-8
# v=MCPv1; k=ed25519; p=cKPGmrtTagOIvI8vSaKqaACXICf5XXIACHwXPv1niWk=
```

## 2. Validate

From the postemi-agent repo root:

```bash
mcp-publisher validate server.json
```

## 3. Log in and publish

```bash
mcp-publisher login http --domain postemi.com \
  --private-key "$(infisical secrets get MCP_REGISTRY_POSTEMI_ED25519_HEX \
      --projectId 5459eb12-72ad-4f3e-981e-34e3da3bdae9 --env prod --plain --silent)"

mcp-publisher publish          # reads ./server.json
```

The login token is stored in `~/.mcp_publisher_token` and expires; log in
again when `publish` says the token is invalid.

## 4. Check

```bash
curl -s "https://registry.modelcontextprotocol.io/v0.1/servers?search=com.postemi/postemi"
```

## Updating the entry

The registry keeps every version and does not accept the same version twice.
To change the title, description, icons or URL, raise `version` in
`server.json` (1.0.0, 1.0.1, ...), validate, log in, publish. To retire a
version: `mcp-publisher status --help`.

## Rotating the key

```bash
umask 077; T=$(mktemp -d); cd "$T"
openssl genpkey -algorithm Ed25519 -out key.pem
echo "v=MCPv1; k=ed25519; p=$(openssl pkey -in key.pem -pubout -outform DER | tail -c 32 | base64)"   # goes into route.ts
printf 'MCP_REGISTRY_POSTEMI_ED25519_HEX=%s\n' \
  "$(openssl pkey -in key.pem -noout -text | grep -A3 'priv:' | tail -n +2 | tr -d ' :\n')" > s.env
infisical secrets set --file=s.env --projectId 5459eb12-72ad-4f3e-981e-34e3da3bdae9 --env prod --silent > /dev/null
cd /; rm -rf "$T"
```

Then update `PROOF` in the postemi repo's
`src/app/.well-known/mcp-registry-auth/route.ts`, deploy, and log in again.
The route is static and sent with a long `s-maxage`; purge the CDN cache for
that path if a proxy keeps the old value.
