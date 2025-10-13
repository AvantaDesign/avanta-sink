# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| < 0.2   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to the repository maintainers. You should receive a response within 48 hours. If for some reason you do not, please follow up to ensure we received your original message.

Please include the following information in your report:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Best Practices

### For Deploying This Application

1. **Authentication Token**:
   - Use a strong, randomly generated token (minimum 16 characters)
   - Never commit the token to version control
   - Store it securely in environment variables or secrets management
   - Rotate tokens regularly (at least every 90 days)

2. **Environment Variables**:
   - Always use `.env` files for local development (already gitignored)
   - Use GitHub Secrets or Cloudflare Workers secrets for production
   - Never commit `.env` files to version control

3. **API Security**:
   - All API endpoints require Bearer token authentication
   - CORS should be configured restrictively (avoid `NUXT_API_CORS=true` in production)
   - Monitor API usage for suspicious patterns

4. **Cloudflare Configuration**:
   - Use minimal permissions for API tokens
   - Enable Cloudflare WAF rules for additional protection
   - Regularly review Cloudflare security settings

5. **Dependencies**:
   - Keep all dependencies up to date
   - Run `pnpm audit` regularly to check for vulnerabilities
   - Review dependency updates before applying

### Repository Security

1. **Repository Visibility**:
   - Consider making the repository **PRIVATE** if it contains:
     - Production configuration
     - Company-specific business logic
     - Any references to internal systems
   - Use public repositories only for open-source projects without sensitive data

2. **Branch Protection**:
   - Enable branch protection on `main` branch
   - Require pull request reviews before merging
   - Require status checks to pass before merging
   - Enable "Require signed commits" for additional security

3. **Secret Scanning**:
   - Enable GitHub's secret scanning feature
   - Enable push protection to prevent accidental secret commits
   - Regularly audit for exposed secrets

4. **Dependabot**:
   - Enable Dependabot security updates
   - Enable Dependabot version updates
   - Review and merge security patches promptly

## Security Features

This application includes the following security features:

- ✅ Token-based authentication for all API endpoints
- ✅ Input validation using Zod schemas
- ✅ Cloudflare Workers environment for edge security
- ✅ Environment variable configuration for secrets
- ✅ `.gitignore` configured to prevent committing sensitive files
- ✅ HTTPS-only with Cloudflare
- ✅ URL validation to prevent malicious redirects

## Known Limitations

- No built-in rate limiting (rely on Cloudflare rate limiting rules)
- No built-in 2FA support (single token authentication)
- Console logging in production code should be reviewed/removed

## Security Updates

Security updates will be released as patch versions. Subscribe to repository releases or watch the repository to be notified of security updates.

## Acknowledgments

We appreciate the security community's help in keeping this project secure. Contributors who report valid security issues will be acknowledged in the repository (with their permission).
