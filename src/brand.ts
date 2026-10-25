/**
 * The Postemi values the CLI uses in more than one place: the name a person
 * reads, the command they type, the environment variables, the config
 * folder, the default API host and the links.
 */

interface Brand {
  /** The product name in a sentence. */
  name: string;
  /** The command a person types. */
  cli: string;
  /** Prefix of the environment variables (`POSTEMI_API_KEY`). */
  envPrefix: string;
  /** Folder under the home directory for credentials.json and config.json. */
  configDirName: string;
  /** API base when nothing else says otherwise. */
  defaultApiUrl: string;
  /** Where `auth:login` starts the device flow. */
  defaultAuthServer: string;
  /** Shown on the approval page. */
  clientName: string;
  homepage: string;
  termsUrl: string;
  privacyUrl: string;
  /** Where a person creates an account in the browser. */
  signupUrl: string;
  /** The IANA zone used in examples. */
  exampleTimezone: string;
  /** "in London time" in the config:set example. */
  exampleTimezoneCity: string;
  /** The plan slugs as the help text names them. */
  tierList: string;
  /** The plan without API access, by name. */
  basicPlanName: string;
}

export const BRAND: Brand = {
  name: 'Postemi',
  cli: 'postemi',
  envPrefix: 'POSTEMI',
  configDirName: '.postemi',
  // api.postemi.com serves the API at the root (its proxy adds /api).
  defaultApiUrl: 'https://api.postemi.com',
  defaultAuthServer: 'https://api.postemi.com',
  clientName: 'Postemi CLI',
  homepage: 'https://postemi.com',
  termsUrl: 'https://postemi.com/terms',
  privacyUrl: 'https://postemi.com/privacy',
  signupUrl: 'https://postemi.com/app/signup',
  exampleTimezone: 'Europe/London',
  exampleTimezoneCity: 'London',
  tierList: 'basic, pro, creator or team',
  basicPlanName: 'Basic',
};

/** `API_KEY` -> `POSTEMI_API_KEY`. */
export const envName = (name: string): string => `${BRAND.envPrefix}_${name}`;

/** Read `POSTEMI_<name>` from the environment. */
export function readEnv(name: string): string | undefined {
  return process.env[envName(name)];
}

/** Write `POSTEMI_<name>` (the `--workspace` middleware uses it). */
export function writeEnv(name: string, value: string): void {
  process.env[envName(name)] = value;
}

/*
  PLAN NAMES. The CLI shows the plans as Basic, Pro, Creator and Team. The
  API knows `pro` and `creator` by those names but the other two by older
  slugs, so `basic` and `team` are translated before the request. Only these
  display names are mapped.
*/
const TIER_ALIASES: Record<string, string> = {
  basic: 'alap',
  team: 'csapat',
};

export function tierForApi(tier: string): string {
  return TIER_ALIASES[tier.trim().toLowerCase()] ?? tier;
}

/*
  A failed fetch() says only "fetch failed"; the reason is in `error.cause`.
  This names it (a host that does not resolve, a refused connection, a
  timeout).
*/
const NETWORK_REASONS: Record<string, string> = {
  ENOTFOUND: 'the host name does not resolve',
  EAI_AGAIN: 'the host name could not be looked up',
  ECONNREFUSED: 'the connection was refused',
  ECONNRESET: 'the connection was reset',
  ETIMEDOUT: 'the connection timed out',
  UND_ERR_CONNECT_TIMEOUT: 'the connection timed out',
  CERT_HAS_EXPIRED: 'the TLS certificate has expired',
  DEPTH_ZERO_SELF_SIGNED_CERT: 'the TLS certificate is self-signed',
};

export function networkError(prefix: string, error: any, variable = 'API_URL'): string {
  const plain = `${prefix}: ${error?.message}`;
  const code: string | undefined = error?.cause?.code ?? error?.code;
  const reason = code ? NETWORK_REASONS[code] ?? code : null;
  return reason
    ? `${prefix}: ${reason} (${code}). Check the connection, or point ${envName(variable)} at another server.`
    : plain;
}
