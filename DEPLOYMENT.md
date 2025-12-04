# 🚀 Deployment Guide

This project is optimized for deployment on **Vercel**.

## Important: HTTPS Requirement
**Crucial:** Mobile browsers (iOS Safari, Chrome on Android) require a secure context (**HTTPS**) to access the camera. You cannot test the AI features on your phone using `http://192.168.x.x`. You must deploy it to a server with SSL.

## Deploying with Vercel (Recommended)

1.  **Push to GitHub**
    Initialize a git repo and push your code to GitHub.
    *Note: Ensure your filenames in `import` statements match exactly with the file system (case-sensitive).*

2.  **Import to Vercel**
    * Log in to [Vercel](https://vercel.com).
    * Click "Add New Project".
    * Select your GitHub repository.

3.  **Configure Build**
    * **Framework Preset**: Vite
    * **Build Command**: `npm run build`
    * **Output Directory**: `dist`

4.  **Deploy**
    Click deploy. Vercel will handle the rest.

## Common Issues

### "Module not found" / Case Sensitivity
Linux servers (Vercel) are case-sensitive.
* ❌ `import ... from './Utils/deviceDetection'`
* ✅ `import ... from './utils/deviceDetection'`

Ensure your folder is named `utils` (lowercase) in the file system if you import it as such.

### Buffer Attribute Crash on Mobile
If the app crashes when switching between devices or resizing:
* Ensure `FoliageSystem` and `Ornaments` use the `key={count}` prop. This forces React to unmount/remount the component when particle counts change, preventing buffer resize errors.