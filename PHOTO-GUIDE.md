# 📸 Photo Customization Guide

The **Polaroid Floating Gallery** automatically loads images from the local file system. Follow this guide to add your own memories.

## Location
All photos must be placed in the public static folder:
`public/photos/`

## Naming Convention
The code looks for exactly **12 files** with the following naming pattern:
* `photo-1.jpg`
* `photo-2.jpg`
* ...
* `photo-12.jpg`

## Recommended Specs
* **Format**: JPG or PNG.
* **Aspect Ratio**: Square (1:1) works best, but Portrait (3:4) is also acceptable.
* **Size**: Keep file sizes under 300KB each for optimal loading speed.
* **Dimensions**: 512x512 pixels is sufficient.

## How it Works
1.  **Chaos Mode**: Photos split to the front of the camera (Z-axis 12~16) forming a floating wall.
2.  **Formed Mode**: Photos spiral back and attach to the surface of the tree.
3.  **Mobile**: On mobile devices, the spread width is reduced to fit vertical screens.