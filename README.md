# Aether Browser

## Local build (Windows)

```powershell
npm install
npm run build
```

Output: `dist/Aether Browser Setup 1.0.1.exe`

## GitHub release

### Option A: GitHub Actions (recommended)
Push a tag like `v1.0.2` and GitHub Actions builds + publishes the release assets.

### Option B: Local publish
Set `GH_TOKEN` (a GitHub Personal Access Token with repo access), then:

```powershell
npm run release
```
