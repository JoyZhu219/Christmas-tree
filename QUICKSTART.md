# 🚀 Quick Start Guide

Get your Grand Luxury Christmas Tree running in 5 minutes!

## ⚡ Super Quick Setup

### Windows
```bash
# Extract the project
# Open Command Prompt in the project folder
setup.bat
```

### Mac/Linux
```bash
# Extract the project
cd luxury-christmas-tree
chmod +x setup.sh
./setup.sh
```

### Manual Setup
```bash
cd luxury-christmas-tree
npm install
npm run dev
```

Open http://localhost:3000 🎄

---

## 📸 Add Your Photos (2 minutes)

1. Go to `public/photos/` folder
2. Add photos named:
   - `photo-1.jpg`
   - `photo-2.jpg`
   - `photo-3.jpg`
   - ... up to `photo-12.jpg`
3. Refresh browser - Done!

**Requirements**: Square images (512x512px to 1024x1024px), under 500KB each

---

## 🌐 Deploy to Web (3 minutes)

### Easiest: Vercel
```bash
npm install -g vercel
vercel login
vercel
```

Get instant URL like: `https://your-tree.vercel.app`

### Alternative: Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for more options!

---

## 🎮 How to Use

### Desktop 💻
- **Open hand** (5 fingers) → Chaos mode
- **Close hand** → Tree mode
- **Move hand** → Control camera
- **Mouse drag** → Rotate
- **Scroll** → Zoom

### Mobile 📱
- **Tap** → Toggle chaos/tree
- **Pinch** → Zoom
- **Swipe** → Rotate

---

## ❓ Troubleshooting

**Can't install?**
- Need Node.js 18+: https://nodejs.org
- Run: `rm -rf node_modules && npm install`

**Photos not showing?**
- Check file names: `photo-1.jpg` not `photo1.jpg`
- Must be in `public/photos/` folder
- Refresh browser (Ctrl+Shift+R)

**Camera not working?**
- Grant camera permissions
- Site must use HTTPS (automatic on Vercel/Netlify)
- Desktop only feature

**Low performance?**
- Lower particle count in `FoliageSystem.jsx`
- Use smaller photos (512x512px)
- Close other browser tabs

---

## 📚 Full Documentation

- **README.md** - Complete feature list & tech details
- **PHOTO-GUIDE.md** - Detailed photo customization
- **DEPLOYMENT.md** - All deployment options

---

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Read the documentation
3. Try running: `npm run build` to check for issues
4. Test on different browser

---

## 🎁 Quick Tips

✨ **Best Photos**: Family memories, holidays, pets
🎨 **Make square**: Use Photopea.com (free)
💾 **Compress**: Use TinyPNG.com
🌐 **Share**: Deploy to Vercel (free)
📱 **Mobile**: Works on all devices!

---

**That's it! You're ready to spread holiday cheer! 🎄✨**

Questions? Read the full README.md or documentation files!
