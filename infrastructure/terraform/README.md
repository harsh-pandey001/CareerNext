# infrastructure/terraform — PLACEHOLDER (V3)

Infrastructure as Code for the staging (and future production) environments.
**Not implemented yet.**

Planned resources (cloud stack):

- AWS EC2 — compute for web + api containers
- AWS RDS (PostgreSQL) — managed database
- AWS S3 — resume/document storage
- Networking (VPC, security groups), IAM roles

Suggested layout when implemented:

```
terraform/
  modules/            # reusable modules (ec2, rds, s3, network)
  environments/
    staging/
    production/
  backend.tf          # remote state (S3 + DynamoDB lock)
```
