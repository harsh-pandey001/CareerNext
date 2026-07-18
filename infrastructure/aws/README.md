# infrastructure/aws — PLACEHOLDER (V3)

AWS-specific configuration and policy documents (not provisioning — that lives
in `../terraform`). **Not implemented yet.**

Intended contents:

- S3 bucket policies / CORS for document uploads (AWS S3)
- IAM policy JSON for CI/CD deploy roles
- EC2 user-data / bootstrap scripts
- RDS parameter notes

Credentials are never committed — they are provided via GitHub Actions secrets
and environment configuration.
