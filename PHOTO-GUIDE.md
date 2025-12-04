# 📸 Photo Customization Guide

Learn how to add your personal photos to the Christmas tree!

## 🎯 Quick Start

1. Navigate to `public/photos/` folder
2. Add your photos: `photo-1.jpg`, `photo-2.jpg`, etc.
3. Refresh the app - your photos appear on the tree!

## 📂 File Requirements

### File Names
```
photo-1.jpg   ← First photo
photo-2.jpg   ← Second photo
photo-3.jpg   ← Third photo
...
photo-12.jpg  ← Twelfth photo
```

**Important**: 
- Use sequential numbers (1-12)
- Include hyphen: `photo-1.jpg` NOT `photo1.jpg`
- Lowercase only

### Supported Formats
- ✅ `.jpg` / `.jpeg` (Best for photos)
- ✅ `.png` (Best for graphics with transparency)
- ✅ `.webp` (Modern format, smaller files)

### Image Specifications

**Optimal Size**: 512x512px or 1024x1024px
- Square aspect ratio (1:1) recommended
- Minimum: 256x256px
- Maximum: 2048x2048px

**File Size**: Keep under 500KB each
- Smaller = faster loading
- Use image compression tools if needed

## 🖼️ Preparing Your Photos

### Option 1: Online Tools (Easy)

**Resize & Crop**:
- [Squoosh.app](https://squoosh.app) - Free, no signup
- [TinyPNG](https://tinypng.com) - Compress images
- [Photopea](https://photopea.com) - Free Photoshop alternative

**Steps**:
1. Upload your photo
2. Crop to square (1:1 ratio)
3. Resize to 1024x1024px
4. Export as JPG quality 85%
5. Download and rename

### Option 2: Photoshop

1. Open image
2. **Crop**: Select Crop Tool → 1:1 ratio
3. **Resize**: Image → Image Size → 1024x1024px
4. **Export**: File → Export As → JPG (Quality: 80-85%)
5. Save as `photo-1.jpg`

### Option 3: Command Line (MacOS/Linux)

Using ImageMagick:
```bash
# Install ImageMagick
brew install imagemagick  # MacOS
sudo apt install imagemagick  # Linux

# Batch convert all images
for i in *.jpg; do
  magick "$i" -resize 1024x1024^ -gravity center -extent 1024x1024 "photo-$(printf "%d" $n).jpg"
  n=$((n+1))
done
```

### Option 4: Python Script

```python
from PIL import Image
import os

def prepare_photo(input_path, output_number):
    img = Image.open(input_path)
    
    # Make square by cropping
    width, height = img.size
    size = min(width, height)
    left = (width - size) // 2
    top = (height - size) // 2
    img = img.crop((left, top, left + size, top + size))
    
    # Resize
    img = img.resize((1024, 1024), Image.LANCZOS)
    
    # Save
    img.save(f'public/photos/photo-{output_number}.jpg', 'JPEG', quality=85)

# Process your photos
prepare_photo('my-vacation.jpg', 1)
prepare_photo('family-pic.jpg', 2)
# ... etc
```

## 🎨 Photo Ideas

### Personal Memories
- 📷 Family gatherings
- 🎄 Past Christmas celebrations
- 🎁 Gift opening moments
- 👨‍👩‍👧‍👦 Family portraits
- 🐕 Pet photos

### Holiday Themes
- ❄️ Winter landscapes
- 🎅 Santa visits
- 🍪 Cookie baking
- 🎭 Holiday performances
- ⛄ Snowmen and snow activities

### Creative Ideas
- 🎨 Children's artwork
- 📝 Handwritten notes
- 🎨 Digital art
- 📸 Photo collages
- 🖼️ Vintage family photos

## 🔄 Advanced: Loading Custom Photos

### Method 1: Static Import (Current)

Place photos in `public/photos/` and the app loads them automatically.

### Method 2: Dynamic Loading

Edit `src/components/PolaroidPhotos.jsx`:

```javascript
const photoUrls = [
  'https://i.imgur.com/yourphoto1.jpg',
  'https://i.imgur.com/yourphoto2.jpg',
  // ... more URLs
]
```

### Method 3: Upload Feature (Advanced)

Want users to upload photos? You'll need:
1. File upload component
2. Store photos (Firebase Storage, AWS S3)
3. Load dynamically from storage

Example with Firebase:
```javascript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const uploadPhoto = async (file) => {
  const storageRef = ref(storage, `photos/${file.name}`)
  await uploadBytes(storageRef, file)
  const url = await getDownloadURL(storageRef)
  return url
}
```

## 🎯 Pro Tips

### Optimizing Loading Speed
- Use JPG for photos (smaller than PNG)
- Compress images to 500KB or less
- Consider using WebP format (modern browsers)
- Lazy load images (load as needed)

### Maintaining Quality
- Start with high-res originals
- Don't resize below 512x512px
- Use 1024x1024px for best quality
- Export at 80-90% JPG quality

### Batch Processing
If you have many photos:

```bash
# Using mogrify (ImageMagick)
mogrify -resize 1024x1024^ -gravity center -extent 1024x1024 -quality 85 *.jpg
```

## 🖼️ Example Photo Set

Here's a sample setup for a family tree:

```
public/photos/
├── photo-1.jpg   ← Grandparents wedding (1960)
├── photo-2.jpg   ← Parents wedding (1985)
├── photo-3.jpg   ← First child born (1990)
├── photo-4.jpg   ← Family vacation (1995)
├── photo-5.jpg   ← Christmas 2000
├── photo-6.jpg   ← Pet dog Max (2005)
├── photo-7.jpg   ← Kids graduation (2010)
├── photo-8.jpg   ← Christmas 2015
├── photo-9.jpg   ← New baby (2018)
├── photo-10.jpg  ← Family reunion (2020)
├── photo-11.jpg  ← Holiday card (2022)
└── photo-12.jpg  ← This year! (2024)
```

## 🎨 Styling Tips

### Add Text to Photos
Use Canva or Photoshop:
- Add names
- Add dates
- Add captions
- Add holiday greetings

### Photo Filters
Apply these for festive feel:
- Warm tone filter
- Slight vignette
- Increased saturation
- Soft glow effect

### Consistency
For professional look:
- Use same filter on all photos
- Maintain similar brightness
- Keep consistent color tones
- Add white border to all

## 🐛 Troubleshooting

### Photos Don't Appear
- ✅ Check file names: `photo-1.jpg` not `Photo-1.JPG`
- ✅ Verify files are in `public/photos/` folder
- ✅ Clear browser cache (Ctrl+Shift+R)
- ✅ Check browser console for errors (F12)

### Photos Look Blurry
- ❌ Original resolution too low
- ✅ Use at least 512x512px
- ✅ Export at higher quality (85-95%)
- ✅ Don't upscale small images

### Photos Load Slowly
- ❌ File sizes too large (> 1MB each)
- ✅ Compress to 500KB or less
- ✅ Use JPG format instead of PNG
- ✅ Reduce resolution to 512x512px

### Wrong Photo Order
- Photos appear in numerical order (1-12)
- Rename files if order is wrong
- Use leading zeros for 10+: `photo-01.jpg`

## 📚 Resources

### Image Editing
- [Photopea](https://photopea.com) - Free online Photoshop
- [GIMP](https://gimp.org) - Free desktop editor
- [Paint.NET](https://www.getpaint.net) - Simple Windows editor

### Compression
- [TinyPNG](https://tinypng.com) - Best for PNG/JPG
- [Squoosh](https://squoosh.app) - Google's tool
- [Compressor.io](https://compressor.io) - Batch compression

### Stock Photos (If Needed)
- [Unsplash](https://unsplash.com)
- [Pexels](https://pexels.com)
- [Pixabay](https://pixabay.com)

---

## 🎄 Make It Yours!

Your personal photos make this tree truly special. Spend time selecting meaningful memories that will bring joy to viewers!

Happy decorating! 🎅✨
