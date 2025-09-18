# 🚀 Complete Guide: Jekyll Arabic Blog with GitHub Pages

## Table of Contents
1. [Jekyll Installation](#1-jekyll-installation)
2. [GitHub Pages Setup](#2-github-pages-setup)
3. [RTL Arabic Support Implementation](#3-rtl-arabic-support-implementation)
4. [Font Customization](#4-font-customization)
5. [Content Management](#5-content-management)
6. [Deployment & Testing](#6-deployment--testing)
7. [Advanced Features](#7-advanced-features)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Jekyll Installation

### Prerequisites

#### macOS Installation
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Ruby
brew install ruby

# Add Ruby to PATH
echo 'export PATH="/usr/local/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify Ruby installation
ruby -v  # Should show 3.0 or higher
```

#### Install Jekyll and Bundler
```bash
# Install Jekyll and Bundler gems
gem install jekyll bundler

# Verify Jekyll installation
jekyll -v  # Should show Jekyll 4.3.x
```

### Initialize Your Jekyll Blog

```bash
# Navigate to your watery directory
cd ~/Downloads/Manual\ Library/Projects/Jekyll_blog/watery

# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve
# Your site is now available at http://localhost:4000
```

---

## 2. GitHub Pages Setup

### Method 1: Traditional GitHub Pages (Limited Jekyll Version)

#### Step 1: Create GitHub Repository
```bash
# Initialize git
git init

# Create a new repository on GitHub named: username.github.io
# Or create a project repository: project-name
```

#### Step 2: Configure for GitHub Pages
Add to `_config.yml`:
```yaml
# GitHub Pages Configuration
baseurl: "" # For user site (username.github.io)
# baseurl: "/project-name" # For project site
url: "https://username.github.io"

# GitHub Pages compatibility
plugins:
  - jekyll-feed
  - jekyll-seo-tag
  - jekyll-sitemap
  - jekyll-paginate
```

#### Step 3: Create Gemfile for GitHub Pages
```ruby
source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "webrick" # Required for Ruby 3.0+

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-paginate"
end
```

#### Step 4: Push to GitHub
```bash
git add .
git commit -m "Initial Jekyll blog setup"
git branch -M main
git remote add origin https://github.com/username/username.github.io.git
git push -u origin main
```

### Method 2: GitHub Actions (Jekyll 4+ with Full Control)

#### Step 1: Create GitHub Actions Workflow
Create `.github/workflows/jekyll.yml`:
```yaml
name: Deploy Jekyll with GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Ruby
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.1'
          bundler-cache: true
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Build with Jekyll
        run: bundle exec jekyll build
        env:
          JEKYLL_ENV: production
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### Step 2: Enable GitHub Pages
1. Go to Settings → Pages
2. Source: GitHub Actions
3. Branch: main

---

## 3. RTL Arabic Support Implementation

### Core Configuration

#### Update `_config.yml`
```yaml
# Language and RTL Configuration
lang: ar
dir: rtl
rtl_support: true

# Localization
locale: ar_SA
timezone: Asia/Riyadh

# Arabic-specific settings
arabic:
  font_family: "Tajawal"  # Options: Tajawal, Cairo, Amiri, Noto Sans Arabic
  reading_time: true
  hijri_dates: false

# Multi-language support
languages:
  - ar
  - en

default_lang: ar
```

### HTML Structure Updates

#### Update `_layouts/default.html`
```html
<!DOCTYPE html>
<html lang="{{ page.lang | default: site.lang | default: 'ar' }}" 
      dir="{{ page.dir | default: site.dir | default: 'rtl' }}">
<head>
  {% include head.html %}
  {% if page.lang == 'ar' or site.lang == 'ar' %}
    <link rel="stylesheet" href="{{ '/assets/arabic-fonts.css' | relative_url }}">
    <link rel="stylesheet" href="{{ '/assets/rtl.css' | relative_url }}">
  {% endif %}
</head>
<body class="{% if page.lang == 'ar' %}arabic{% endif %}">
  <!-- Language Switcher -->
  <div class="language-switcher">
    <button onclick="toggleLanguage()" aria-label="تبديل اللغة">
      <span class="lang-ar">عربي</span>
      <span class="lang-en">English</span>
    </button>
  </div>
  
  {{ content }}
  
  <script src="{{ '/assets/rtl-switcher.js' | relative_url }}"></script>
</body>
</html>
```

---

## 4. Font Customization

### Option 1: Google Fonts (Recommended)

Add to `_includes/head.html`:
```html
<!-- Arabic Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Choose your preferred font -->
<!-- Option 1: Tajawal (Modern, Clean) -->
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;900&display=swap" rel="stylesheet">

<!-- Option 2: Cairo (Popular, Versatile) -->
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet">

<!-- Option 3: Amiri (Traditional, Elegant) -->
<link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet">

<!-- Option 4: Noto Sans Arabic (Universal, Complete) -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Option 2: Self-Hosted Fonts

1. Download font files from [Google Fonts](https://fonts.google.com/?subset=arabic)
2. Place in `assets/fonts/` directory
3. Create `assets/custom-fonts.css`:

```css
@font-face {
  font-family: 'MyArabicFont';
  src: url('/assets/fonts/MyFont-Regular.woff2') format('woff2'),
       url('/assets/fonts/MyFont-Regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+204F, U+2E41, U+FB50-FDFF, U+FE70-FEFF;
}

/* Apply font */
body.arabic {
  font-family: 'MyArabicFont', 'Segoe UI', Tahoma, sans-serif;
}
```

### Font Configuration in CSS

Update `assets/rtl.css` with your font preferences:
```css
:root {
  /* Primary Arabic font stack */
  --arabic-font-primary: 'Tajawal', 'Segoe UI', 'Arial Unicode MS', sans-serif;
  --arabic-font-heading: 'Cairo', 'Tajawal', sans-serif;
  --arabic-font-traditional: 'Amiri', 'Traditional Arabic', serif;
  
  /* Font sizes for Arabic (slightly larger for readability) */
  --arabic-font-size-base: 1.1rem;
  --arabic-line-height: 1.8;
  --arabic-letter-spacing: 0.02em;
}

/* Typography hierarchy */
[dir="rtl"] body {
  font-family: var(--arabic-font-primary);
  font-size: var(--arabic-font-size-base);
  line-height: var(--arabic-line-height);
  letter-spacing: var(--arabic-letter-spacing);
}

[dir="rtl"] h1, 
[dir="rtl"] h2, 
[dir="rtl"] h3 {
  font-family: var(--arabic-font-heading);
  font-weight: 700;
}

/* Traditional style for quotes */
[dir="rtl"] blockquote {
  font-family: var(--arabic-font-traditional);
  font-size: 1.2em;
}
```

---

## 5. Content Management

### Writing Arabic Blog Posts

#### Post Front Matter
Create `_posts/2024-09-18-my-arabic-post.md`:
```yaml
---
layout: post
title: "مقالتي الأولى باللغة العربية"
author: "محمد الحقباني"
date: 2024-09-18
categories: [تقنية, برمجة]
tags: [جيكل, مدونة, عربي]
lang: ar
dir: rtl
excerpt: "هذه مقالة تجريبية لعرض دعم اللغة العربية في مدونة جيكل"
---

# مرحباً بكم في مدونتي العربية

هذا مثال على محتوى عربي في مدونة Jekyll مع دعم كامل لـ RTL.

## الميزات المدعومة

- النص العربي الكامل
- الخطوط العربية المُحسَّنة
- التخطيط من اليمين إلى اليسار
- المحتوى المختلط (عربي/إنجليزي)
```

### Mixed Content Handling

For mixed Arabic/English content:
```markdown
---
layout: post
lang: ar
dir: rtl
---

هذا نص عربي with some English words مختلط معاً.

<!-- For English paragraphs within Arabic post -->
<div dir="ltr" lang="en">
This is a complete English paragraph within an Arabic post.
It will be displayed left-to-right.
</div>

<!-- For inline English -->
استخدم <span dir="ltr">Jekyll</span> لبناء موقعك.
```

### Category and Tag Pages in Arabic

Create `_pages/categories-ar.html`:
```html
---
layout: page
title: التصنيفات
permalink: /categories-ar/
lang: ar
dir: rtl
---

<div class="categories-container">
  {% for category in site.categories %}
    <h2>{{ category[0] }}</h2>
    <ul class="post-list">
      {% for post in category[1] %}
        {% if post.lang == 'ar' %}
          <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <span class="post-date">{{ post.date | date: "%d/%m/%Y" }}</span>
          </li>
        {% endif %}
      {% endfor %}
    </ul>
  {% endfor %}
</div>
```

---

## 6. Deployment & Testing

### Local Testing

```bash
# Test locally with Arabic content
bundle exec jekyll serve --livereload

# Test production build
JEKYLL_ENV=production bundle exec jekyll build

# Check for issues
bundle exec jekyll doctor
```

### Browser Testing Checklist

✅ **Desktop Browsers:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

✅ **Mobile Testing:**
- iOS Safari
- Chrome Mobile
- Samsung Internet

✅ **RTL Features to Test:**
- [ ] Text alignment (right-aligned)
- [ ] Navigation menu (right to left)
- [ ] Form inputs (right-aligned placeholders)
- [ ] Tables (RTL column order)
- [ ] Lists (bullet points on right)
- [ ] Images with captions
- [ ] Code blocks (LTR within RTL)
- [ ] Pagination (reversed order)

### Deployment to GitHub Pages

```bash
# Ensure all changes are committed
git add .
git commit -m "إضافة دعم اللغة العربية الكامل"

# Push to GitHub
git push origin main

# Check deployment status
# Go to: https://github.com/username/repo/actions
```

### Custom Domain Setup (Optional)

1. Create `CNAME` file in root:
```
myblog.com
```

2. Configure DNS:
```
A Records:
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153

CNAME:
www -> username.github.io
```

---

## 7. Advanced Features

### Bilingual Blog Setup

#### Language Switcher Implementation

Add to `_includes/language-switcher.html`:
```html
<div class="lang-switch">
  {% assign posts=site.posts | where:"ref", page.ref | sort: 'lang' %}
  {% for post in posts %}
    <a href="{{ post.url }}" class="{{ post.lang }}">
      {% if post.lang == 'ar' %}عربي{% else %}English{% endif %}
    </a>
  {% endfor %}
</div>
```

#### Linked Posts (Same content, different languages)

Arabic post:
```yaml
---
ref: "welcome-post"
lang: ar
---
```

English post:
```yaml
---
ref: "welcome-post"
lang: en
---
```

### Arabic Search Implementation

Create `assets/arabic-search.js`:
```javascript
// Lunr.js with Arabic stemmer
const arabicSearch = {
  init: function() {
    // Load Arabic stemmer
    lunr.ar = function() {
      this.pipeline.add(
        lunr.ar.trimmer,
        lunr.ar.stopWordFilter,
        lunr.ar.stemmer
      );
    };
    
    // Arabic-specific text processing
    lunr.ar.trimmer = function(token) {
      return token.update(function(s) {
        // Remove Arabic diacritics
        return s.replace(/[\u064B-\u065F]/g, '');
      });
    };
  }
};
```

### Hijri Date Support

Add Hijri dates using JavaScript:
```javascript
// Convert Gregorian to Hijri
function toHijri(date) {
  // Use Intl.DateTimeFormat with Islamic calendar
  return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Display in posts
document.querySelectorAll('.post-date').forEach(el => {
  const gregorian = new Date(el.dataset.date);
  const hijri = toHijri(gregorian);
  el.innerHTML += ` | ${hijri}`;
});
```

### Arabic SEO Optimization

Add to `_includes/seo-arabic.html`:
```html
<!-- Arabic SEO Meta Tags -->
<meta name="description" content="{{ page.excerpt | default: site.description }}" />
<meta property="og:locale" content="ar_SA" />
<meta property="og:site_name" content="{{ site.title }}" />
<meta property="article:author" content="{{ page.author | default: site.author }}" />

<!-- Arabic Schema.org markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "{{ page.title }}",
  "inLanguage": "ar",
  "author": {
    "@type": "Person",
    "name": "{{ page.author | default: site.author }}"
  },
  "datePublished": "{{ page.date | date_to_xmlschema }}"
}
</script>
```

---

## 8. Troubleshooting

### Common Issues and Solutions

#### Issue: Fonts Not Loading
```css
/* Solution: Add fallback fonts */
font-family: 'Tajawal', 'Segoe UI', Tahoma, 'Arial Unicode MS', sans-serif;
```

#### Issue: Mixed Content Alignment
```css
/* Solution: Use logical properties */
.content {
  padding-inline-start: 1rem; /* Instead of padding-left */
  margin-block-end: 1rem;     /* Instead of margin-bottom */
}
```

#### Issue: Code Blocks in RTL
```css
/* Solution: Force LTR for code */
pre, code {
  direction: ltr !important;
  text-align: left !important;
}
```

#### Issue: Pagination Order
```liquid
<!-- Solution: Reverse pagination for RTL -->
{% if site.dir == 'rtl' %}
  {% assign posts = paginator.posts | reverse %}
{% else %}
  {% assign posts = paginator.posts %}
{% endif %}
```

#### Issue: Form Inputs RTL
```css
/* Solution: RTL form styling */
[dir="rtl"] input,
[dir="rtl"] textarea {
  text-align: right;
  direction: rtl;
}

[dir="rtl"] input::placeholder {
  text-align: right;
}
```

### Performance Optimization

#### Font Loading Strategy
```html
<!-- Preload critical fonts -->
<link rel="preload" 
      href="https://fonts.gstatic.com/s/tajawal/v9/Iurf6YBj_oCad4k1l4qkHrFpiQ.woff2" 
      as="font" 
      type="font/woff2" 
      crossorigin>

<!-- Use font-display: swap -->
<style>
  @font-face {
    font-family: 'Tajawal';
    font-display: swap; /* Prevent invisible text */
  }
</style>
```

#### CSS Optimization
```bash
# Minify CSS for production
cssnano assets/rtl.css assets/rtl.min.css

# Use in production
{% if jekyll.environment == 'production' %}
  <link rel="stylesheet" href="{{ '/assets/rtl.min.css' | relative_url }}">
{% else %}
  <link rel="stylesheet" href="{{ '/assets/rtl.css' | relative_url }}">
{% endif %}
```

### Debug Mode

Add to `_config.yml` for debugging:
```yaml
# Debug settings
debug: true
verbose: true
strict_front_matter: true
```

---

## 📚 Resources & References

### Official Documentation
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Liquid Template Language](https://shopify.github.io/liquid/)

### Arabic Typography Resources
- [Google Fonts Arabic](https://fonts.google.com/?subset=arabic)
- [Arabic Web Fonts Guide](https://design.google/library/modernizing-arabic-typography-type-design)
- [W3C Arabic Layout Requirements](https://www.w3.org/TR/alreq/)

### Jekyll Themes with RTL Support
- [jekyll-theme-mehdix-rtl](https://github.com/mehdisadeghi/jekyll-theme-mehdix-rtl)
- [Watery Theme (Your Current Theme)](https://github.com/yourusername/watery)

### Testing Tools
- [RTL CSS Test](https://rtlcss.com/playground/)
- [Arabic Text Generator](https://generator.lorem-ipsum.info/_arabic)
- [Browser Stack for Cross-browser Testing](https://www.browserstack.com/)

---

## 🎉 Congratulations!

Your Jekyll blog now has full RTL Arabic support with:
- ✅ Beautiful Arabic typography
- ✅ Complete RTL layout
- ✅ GitHub Pages deployment
- ✅ Responsive design
- ✅ SEO optimization
- ✅ Bilingual capability

For questions or issues, refer to the troubleshooting section or check the Jekyll community forums.

**Happy Blogging! | مدونة سعيدة!** 🚀