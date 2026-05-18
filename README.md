# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
# stroageApp-frontend

## CI/CD (S3 + CloudFront)

This repo deploys automatically on every push to `main` via `.github/workflows/main.yml`:

- `npm ci` → `npm run build`
- Upload `dist/` to S3 (hashed assets cached long, `index.html` no-cache)
- CloudFront invalidation

### Required GitHub Variables (Settings → Secrets and variables → Actions → Variables)

- `S3_BUCKET_NAME`
- `CLOUDFRONT_DISTRIBUTION_ID`
- `AWS_REGION` (optional, default `us-east-1`)
- `AWS_ROLE_ARN` (recommended; enables GitHub OIDC, avoids long-lived keys)
- `CLOUDFRONT_INVALIDATION_PATHS` (optional, default `/index.html`, example: `/*`)
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_BACKEND_BASE_URL`

### Required GitHub Secrets (only if NOT using `AWS_ROLE_ARN`)

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
