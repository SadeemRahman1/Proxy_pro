# Deployment Guide: GitHub & Netlify

Apni site ko GitHub ke zariye Netlify par host karne ke liye niche diye gaye steps follow karein:

## Step 1: AI Studio se GitHub par Connect karein
AI Studio Build mein direct GitHub export ka option maujood hai:
1. AI Studio ke interface mein upar right side par **Settings** (gear icon) par click karein.
2. Wahan aapko **"Export to GitHub"** ya **"Connect to GitHub"** ka option milega.
3. Apna GitHub account authorize karein aur ek naya repository name dein (e.g., `ood56-proxy-marketing`).
4. **Export** par click karein. Aapka sara code GitHub par upload ho jayega.

## Step 2: Netlify par Host karein
Jab aapka code GitHub par chala jaye, tab ye steps follow karein:
1. [Netlify](https://www.netlify.com/) par login karein.
2. **"Add new site"** button par click karein aur **"Import an existing project"** select karein.
3. **GitHub** ko select karein aur apne account ko authorize karein.
4. Apni banayi hui repository (`ood56-proxy-marketing`) ko select karein.
5. **Build Settings** check karein (ye aksar khud hi set ho jate hain):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. **"Deploy site"** par click karein.

## Step 3: Domain & Updates
- Netlify aapko ek random URL dega (e.g., `vibrant-shannon-123.netlify.app`). Aap isay settings mein ja kar change kar sakte hain.
- Ab jab bhi aap GitHub par code push karenge, Netlify khud hi site ko update kar dega.

---
**Zaroori Baat:** Agar aapne koi environment variables (API keys) use ki hain, to unhe Netlify ki **Site Settings > Environment variables** mein add karna mat bhooliye ga.
