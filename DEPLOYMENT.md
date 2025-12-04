# 🚀 Deployment Guide

This guide will help you deploy your Grand Luxury Christmas Tree to the web so others can interact with it!

## 🎯 Best Option: Vercel (Easiest & Free)

### Method 1: Vercel CLI (Command Line)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd luxury-christmas-tree
vercel
```

4. **For Production**
```bash
vercel --prod
```

✅ Done! You'll get a URL like: `https://luxury-christmas-tree.vercel.app`

### Method 2: Vercel Dashboard (No Code)

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository (or upload folder)
5. Vercel automatically detects Vite
6. Click "Deploy"

✅ Your site is live in 2 minutes!

---

## 🌐 Alternative: Netlify

### Netlify CLI

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

### Netlify Drag & Drop

1. Go to [netlify.com](https://netlify.com)
2. Drag the `dist` folder after running `npm run build`
3. Done!

---

## 📦 Alternative: GitHub Pages

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json**
```json
{
  "homepage": "https://YOUR_USERNAME.github.io/luxury-christmas-tree",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update vite.config.js** - Add base path:
```javascript
export default defineConfig({
  base: '/luxury-christmas-tree/',
  // ... rest of config
})
```

4. **Deploy**
```bash
npm run deploy
```

5. **Enable GitHub Pages**
   - Go to your repo → Settings → Pages
   - Source: `gh-pages` branch
   - Save

✅ Live at: `https://YOUR_USERNAME.github.io/luxury-christmas-tree`

---

## ☁️ Alternative: Firebase Hosting

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
firebase login
```

2. **Initialize Firebase**
```bash
firebase init hosting
```

Select:
- Use `dist` as public directory
- Configure as single-page app: Yes
- Don't overwrite index.html

3. **Build and Deploy**
```bash
npm run build
firebase deploy
```

---

## 🔧 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] All dependencies are in `package.json`
- [ ] Build completes successfully: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Add your custom photos to `public/photos/`
- [ ] Update meta tags in `index.html` (title, description)
- [ ] Test on mobile browser
- [ ] Camera permissions work (HTTPS required)

---

## 📱 Mobile Access

After deployment, anyone can visit your URL on:
- ✅ Desktop browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome, Samsung Internet)
- ✅ Tablets

**Note**: Hand gesture control only works on desktop with webcam. Mobile users can tap to toggle!

---

## 🔒 HTTPS Requirement

For webcam access, your site MUST be served over HTTPS. All the hosting options above provide HTTPS automatically.

---

## 💰 Pricing

All recommended options have free tiers:

| Platform | Free Tier | Best For |
|----------|-----------|----------|
| **Vercel** | Unlimited projects, 100GB bandwidth | Best overall |
| **Netlify** | 100GB bandwidth, 300 build minutes | Great alternative |
| **GitHub Pages** | Unlimited (public repos) | Open source projects |
| **Firebase** | 10GB storage, 360MB/day transfer | Google ecosystem |

---

## 🎨 Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., `christmas.yourdomain.com`)
3. Update DNS records as shown

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Follow DNS instructions

### GitHub Pages
1. Add `CNAME` file in `public/` with your domain
2. Update DNS at your registrar

---

## 🔄 Continuous Deployment

Push to GitHub → Automatic deployment!

### Setup:
1. Connect your GitHub repo to Vercel/Netlify
2. Every push to `main` branch auto-deploys
3. Pull request = preview deployment

---

## 📊 Analytics (Optional)

Track visitors:

### Google Analytics
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to `src/main.jsx`:
```javascript
import { inject } from '@vercel/analytics'
inject()
```

---

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version: `node -v` (need 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for syntax errors: `npm run build`

### Site Loads but Blank Screen
- Check browser console (F12)
- Verify base URL in `vite.config.js`
- Test locally first: `npm run preview`

### Photos Don't Load
- Photos must be in `public/photos/` folder
- Check file names: `photo-1.jpg`, not `photo1.jpg`
- Verify photos deploy with site (check Vercel/Netlify dashboard)

### Camera Doesn't Work
- Site must use HTTPS (not HTTP)
- Browser must grant camera permissions
- Test on localhost first

---

## 🎉 Success!

Your Christmas tree is now live! Share the URL:
- 📧 Via email
- 💬 Social media
- 🎁 Holiday cards
- 📱 QR codes

**Pro Tip**: Create a short URL with [bit.ly](https://bit.ly) for easier sharing!

---

Need help? Check the main [README.md](README.md) or open an issue on GitHub!
