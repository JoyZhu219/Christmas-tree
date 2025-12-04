# 🎄 Grand Luxury Interactive Christmas Tree

A high-fidelity, interactive 3D Web experience built with React 19, Three.js (R3F), and TensorFlow.js. This project features a "Trump-style" luxury aesthetic with deep emerald greens, solid gold ornaments, and movie-grade post-processing effects.

![Status](https://img.shields.io/badge/Status-Production%20Ready-gold)
![Tech](https://img.shields.io/badge/Tech-React%20%7C%20R3F%20%7C%20TensorFlow-0d5c3d)

## ✨ Key Features

* **Dual-State Physics Engine**: Seamlessly transforms between `CHAOS` (exploded galaxy) and `FORMED` (elegant tree) states.
* **AI Hand Gesture Control**: Uses TensorFlow.js Handpose to control the tree with gestures (Open hand to unleash, Fist to form, Move to rotate).
* **Smart Mobile Optimization**: Automatically downgrades particle counts (25k → 6k) and disables expensive shadows/reflections on mobile devices for smooth 60fps performance.
* **Luxury Aesthetics**: "Deep Forest Green" foliage mixed with 1% gold dust, combined with ribbon-tied gift boxes and diamonds.
* **Interactive Polaroid Gallery**: A floating photo gallery that splits to the front in Chaos mode and attaches to the tree in Formed mode.

## 🛠 Tech Stack

* **Core**: React 19, Vite
* **3D Engine**: React Three Fiber (R3F), Three.js
* **Helpers**: @react-three/drei
* **AI Vision**: @tensorflow-models/handpose, @tensorflow/tfjs
* **VFX**: @react-three/postprocessing (Bloom, Noise, Vignette)
* **Styling**: Tailwind CSS

## 🚀 Getting Started

See [QUICKSTART.md](./QUICKSTART.md) for installation instructions.

## 📖 Documentation

* [Project Architecture](./PROJECT_SUMMARY.md)
* [File Structure Index](./FILE_INDEX.md)
* [Customizing Photos](./PHOTO_GUIDE.md)
* [Deployment Guide](./DEPLOYMENT.md)