# Deployment Fix - TODO

## ✅ Completed

### 1. Fixed client/package.json
- ✅ Moved `react` and `react-dom` from `peerDependencies` to `dependencies` (ensures Vercel installs them)
- ✅ Changed package name from `@figma/my-make-file` to `@ai-career-guidance-platform/client`
- ✅ Removed `pnpm.overrides` section (conflicts with npm workspaces)
- ✅ Fixed version consistency for `react-router` and `react-router-dom`

### 2. Created/Updated vercel.json
- ✅ Added `vercel.json` with proper `rootDirectory: "client"` 
- ✅ Build command: `vite build`
- ✅ Output directory: `dist`
- ✅ SPA rewrites for client-side routing
- ✅ Excluded server directory from deployment

### 3. Fixed code issues
- ✅ `AppRoutes.tsx`: Fixed `Landing` → `LandingPage` (was causing runtime error)
- ✅ `index.html`: Cleaned up formatting, removed extra whitespace causing Vite HTML proxy issues

### 4. Cleaned up workspace
- ✅ Verified package-lock.json consistency
- ✅ npm workspaces properly configured

### 5. Build Verification
- ✅ `npm install` - Success (606 packages)
- ✅ `npm run build` - Success (3047 modules, 15.93s)

## Remaining (Optional)
- Code-splitting to reduce chunk sizes (1.5MB bundle warning)
- Remove unused dependencies (MUI, etc.) to reduce bundle size

