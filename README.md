# 🎄 Grand Luxury Interactive Christmas Tree

A stunning 3D interactive Christmas tree experience featuring hand gesture controls, real-time particle systems, and Trump-style luxury aesthetics. Built with React Three Fiber and TensorFlow.js.

![Christmas Tree](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-r163-000000?style=for-the-badge&logo=three.js)
![TensorFlow](https://img.shields.io/badge/TensorFlow.js-4.17-FF6F00?style=for-the-badge&logo=tensorflow)

## ✨ Features

- 🤲 **Hand Gesture Control**: Open hand to unleash chaos, close hand to reform the tree
- 🎨 **15,000 Particle System**: Dynamic foliage with emerald green shades
- 🎁 **Instanced Ornaments**: Optimized rendering of gifts, balls, and lights
- 📸 **Customizable Polaroid Photos**: Add your own memories to the tree
- 💎 **Luxury Aesthetics**: Deep emerald green + high-gloss gold with cinematic bloom
- 📱 **Mobile Responsive**: Touch controls and optimized performance
- 🎥 **Camera Controls**: Hand movement controls perspective on desktop

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern browser with WebGL support
- Webcam (optional, for hand gesture control)

### Installation

```bash
# Clone or extract the project
cd luxury-christmas-tree

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 📸 Customizing Photos

### Adding Your Own Photos

1. Navigate to the `public/photos/` directory
2. Add your photos with these names:
   - `photo-1.jpg` through `photo-12.jpg`
   - Recommended size: 512x512px or 1024x1024px
   - Supported formats: `.jpg`, `.png`, `.webp`

3. The app will automatically load your custom photos on the tree!

### Photo Guidelines

- **Aspect Ratio**: Square (1:1) works best for Polaroid style
- **Resolution**: 512px - 2048px (higher = better quality but slower loading)
- **File Size**: Keep under 500KB per photo for optimal performance
- **Naming**: Use sequential numbers: photo-1.jpg, photo-2.jpg, etc.

### Example Structure
```
public/
├── photos/
│   ├── photo-1.jpg    ← Your family photo
│   ├── photo-2.jpg    ← Holiday memory
│   ├── photo-3.jpg    ← Pet photo
│   └── ...
```

## 🎮 Controls

### Desktop
- **Open Hand (5 fingers)** → Unleash chaos mode
- **Closed Hand** → Reform into tree
- **Move Hand** → Control camera perspective
- **Mouse Drag** → Rotate view (with OrbitControls)
- **Mouse Scroll** → Zoom in/out
- **Camera Toggle** → Top-right button to enable/disable gesture control

### Mobile
- **Tap Screen** → Toggle between chaos and formed states
- **Pinch** → Zoom in/out
- **Swipe** → Rotate tree
- **Two-finger drag** → Pan camera

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Build and Deploy**
```bash
npm run build
vercel --prod
```

3. **Or use Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel auto-detects Vite and deploys!

### Deploy to Netlify

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build and Deploy**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

1. **Install gh-pages**
```bash
npm install --save-dev gh-pages
```

2. **Add to package.json**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/luxury-christmas-tree"
}
```

3. **Deploy**
```bash
npm run deploy
```

### Other Hosting Options

- **Firebase Hosting**: `firebase deploy`
- **AWS S3 + CloudFront**: Upload `dist/` folder
- **DigitalOcean App Platform**: Connect GitHub repo
- **Render**: Static site deployment

## 🛠️ Project Structure

```
luxury-christmas-tree/
├── public/
│   ├── photos/              ← Add your custom photos here!
│   │   ├── photo-1.jpg
│   │   ├── photo-2.jpg
│   │   └── ...
│   └── christmas-tree-icon.svg
├── src/
│   ├── components/
│   │   ├── ChristmasScene.jsx    ← Main 3D scene
│   │   ├── FoliageSystem.jsx     ← 15K particle system
│   │   ├── Ornaments.jsx         ← Instanced ornaments
│   │   ├── PolaroidPhotos.jsx    ← Photo system
│   │   ├── GoldenStar.jsx        ← Animated star
│   │   ├── TreeTrunk.jsx         ← Tree trunk
│   │   ├── HandGestureDetector.jsx  ← Webcam + TensorFlow
│   │   ├── CameraController.jsx  ← Hand-based camera
│   │   ├── LoadingScreen.jsx     ← Loading animation
│   │   └── UIOverlay.jsx         ← UI elements
│   ├── utils/
│   │   └── deviceDetection.js    ← Mobile/desktop detection
│   ├── App.jsx                   ← Main app component
│   ├── main.jsx                  ← Entry point
│   └── index.css                 ← Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Customization Guide

### Changing Colors

Edit `src/components/FoliageSystem.jsx`:
```javascript
const greenShades = [
  new THREE.Color(0x0d5c3d), // Deep emerald
  new THREE.Color(0x1a7a50), // Rich emerald
  // Add your colors here!
]
```

### Adjusting Particle Count

In `src/components/FoliageSystem.jsx`:
```javascript
const particleCount = 15000  // Lower for better performance
```

### Modifying Ornament Colors

In `src/components/Ornaments.jsx`:
```javascript
const giftColors = ['#8B0000', '#C41E3A', ...] // Red shades
const ballColors = ['#FFD700', '#FFA500', ...] // Gold shades
```

### Changing Tree Shape

In `src/components/FoliageSystem.jsx`:
```javascript
const treeY = Math.random() * 10 - 1  // Height range
const treeRadius = (10 - treeY) * 0.4  // Cone width
```

## 🐛 Troubleshooting

### Camera Not Working
- Grant browser camera permissions
- Check camera toggle button (top-right)
- Desktop only feature (disabled on mobile)

### Low Performance
- Reduce particle count in `FoliageSystem.jsx`
- Lower photo resolution to 512x512px
- Disable bloom effect in `ChristmasScene.jsx`
- Close other browser tabs

### Photos Not Loading
- Check file names: `photo-1.jpg`, `photo-2.jpg`, etc.
- Verify photos are in `public/photos/` directory
- Try smaller file sizes (< 500KB)
- Check browser console for errors

### Hand Gestures Not Responsive
- Ensure good lighting conditions
- Position hand 1-2 feet from camera
- Keep palm facing camera
- Spread fingers clearly for "open" gesture

## 📱 Mobile Optimization

The app automatically detects mobile devices and:
- Disables hand gesture detection (no webcam needed)
- Enables tap-to-toggle between states
- Optimizes rendering performance
- Adjusts UI for smaller screens

## 🔧 Technology Stack

- **React 18.3** - UI framework
- **React Three Fiber** - Three.js React renderer
- **Three.js** - 3D graphics library
- **TensorFlow.js** - Hand pose detection
- **@react-three/drei** - Useful R3F helpers
- **@react-three/postprocessing** - Bloom effects
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and dev server

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes!

## 🎁 Credits

Created with ❤️ for spreading holiday cheer

- Design inspiration: Trump Tower luxury aesthetics
- Hand gesture detection: TensorFlow.js HandPose model
- 3D rendering: Three.js community

---

**Made with React Three Fiber** | **Powered by TensorFlow.js** | **Deployed on Vercel**

## 🌟 Star this project on GitHub!

If you enjoy this Christmas tree, please give it a ⭐ to spread the holiday spirit!
