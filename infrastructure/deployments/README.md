# infrastructure/deployments — PLACEHOLDER (V3)

Environment-specific deployment manifests and release configuration consumed by
GitHub Actions (`.github/workflows/`). **Not implemented yet.**

Intended contents:

```
deployments/
  development/     # dev environment overrides
  staging/         # staging environment overrides (AWS EC2)
```

Each holds environment values (non-secret), compose overrides, and health-check
definitions. Secrets are injected at deploy time from GitHub Actions secrets.
