# Hawler Delivery Management System | سیستەمی بەڕێوەبردنی گەیاندنی هەولێر

Professional delivery and driver management system for Erbil (Hawler), Iraqi Kurdistan, built with React, TypeScript, Vite, Tailwind CSS, Leaflet / OpenStreetMap, Turf.js, and PWA (Progressive Web App) capabilities ready for APK conversion.

## Features / تایبەتمەندییەکان

1. **Leaflet & OpenStreetMap**: Interactive map centered on Erbil Citadel (`36.1912, 44.0092`), zoom level 13, supporting roadmap/satellite layers, GPS location tracking, and 150m ring boundary visualization.
2. **5 Drivers & Pie-Sector Zones**: Usama, Rozh, Dyar, Hama, Basit with distinct color coding, vehicle details, sector angles, and exhaustive neighborhood lists under each driver.
3. **Verified Erbil Neighborhoods Dataset**: Comprehensive dataset of 60 Erbil neighborhoods with Kurdish (Sorani) and English names.
4. **Driver Dashboard**: Filtered sector view, ordered delivery checklist, completion progress bar, daily reset feature, and navigation launcher.
5. **Admin Dashboard & Data Audit**: Complete management panel to add/edit/delete neighborhoods, reassign drivers, export/import JSON backups, and run automated Data Audit Inspector (`پشکنینی داتا`).
6. **PWA & APK Ready**: Service Worker (`sw.js`) and Web App Manifest (`manifest.json`) fully configured for offline use and Android APK building.

## GitHub & APK Deployment Instructions / ڕێنمایی بڵاوکردنەوە بۆ گیتهاب و گۆڕین بۆ APK

1. **Push to GitHub**:
   - Initialize git repository and push all project files to a GitHub repository.
2. **Deploy to Vercel / Netlify / Cloud Run**:
   - Link your GitHub repository to Vercel, Netlify, or GitHub Pages.
3. **Convert PWA to Android APK**:
   - Go to [PWABuilder](https://www.pwabuilder.com/).
   - Enter your hosted web app URL.
   - Click **Generate Android App** (Bubblewrap / Trusted Web Activity) to instantly download your signed Android `.apk` file for mobile devices.

## Local Development / کارپێکردن لە ناوخۆدا
```bash
npm install
npm run dev
```

## License / مۆڵەت
Apache-2.0
