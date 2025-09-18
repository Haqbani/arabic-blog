#!/bin/bash

# 🚀 Jekyll Arabic Blog Setup Script
# This script automates the setup of RTL Arabic support for your Jekyll blog

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
echo "========================================"
echo "    Jekyll Arabic Blog Setup Script"
echo "        RTL Support Installer"
echo "========================================"
echo -e "${NC}"

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Check if running in the correct directory
if [ ! -f "_config.yml" ]; then
    print_error "Error: _config.yml not found!"
    print_info "Please run this script from your Jekyll blog root directory."
    exit 1
fi

print_success "Found Jekyll configuration"

# Backup existing configuration
print_info "Creating backups..."
mkdir -p backups/$(date +%Y%m%d)
cp _config.yml backups/$(date +%Y%m%d)/_config.yml.bak 2>/dev/null || true
print_success "Backups created"

# Update _config.yml with Arabic support
print_info "Updating Jekyll configuration for Arabic support..."

# Check if RTL configuration already exists
if grep -q "rtl_support" _config.yml; then
    print_info "RTL configuration already exists, skipping..."
else
    cat >> _config.yml << 'EOL'

# =======================================
# Arabic Language and RTL Configuration
# =======================================
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

# Arabic SEO
twitter:
  username: # your Twitter username
  card: summary

author:
  name: "محمد الحقباني"  # Your name in Arabic
  email: your-email@example.com

EOL
    print_success "Jekyll configuration updated"
fi

# Check if RTL CSS files already exist
if [ -f "assets/rtl.css" ] && [ -f "assets/arabic-fonts.css" ]; then
    print_success "RTL CSS files already exist"
else
    print_info "RTL CSS files not found. Please ensure they are created."
fi

# Update Gemfile for GitHub Pages
print_info "Checking Gemfile dependencies..."
if ! grep -q "github-pages" Gemfile; then
    print_info "Adding GitHub Pages gem..."
    cat >> Gemfile << 'EOL'

# GitHub Pages
gem "github-pages", group: :jekyll_plugins
gem "webrick"  # Required for Ruby 3.0+
EOL
    print_success "Gemfile updated"
else
    print_success "GitHub Pages gem already configured"
fi

# Install dependencies
print_info "Installing Ruby dependencies..."
if command -v bundle &> /dev/null; then
    bundle install
    print_success "Dependencies installed"
else
    print_error "Bundler not found. Please install it with: gem install bundler"
    exit 1
fi

# Create sample Arabic post
print_info "Creating sample Arabic blog post..."
mkdir -p _posts

if [ ! -f "_posts/$(date +%Y-%m-%d)-arabic-welcome.md" ]; then
    cat > "_posts/$(date +%Y-%m-%d)-arabic-welcome.md" << 'EOL'
---
layout: post
title: "أهلاً وسهلاً بكم في مدونتي"
author: "محمد الحقباني"
categories: [عام, ترحيب]
tags: [جيكل, عربي, RTL]
lang: ar
dir: rtl
excerpt: "هذه أول تدوينة باللغة العربية على مدونة Jekyll مع دعم RTL كامل"
---

# مرحباً بكم في مدونتي العربية

هذه أول تدوينة على مدونتي باللغة العربية. أنا سعيد جداً لمشاركة أفكاري وخبراتي معكم.

## ما هي Jekyll؟

Jekyll هي مولّد مواقع ثابتة بسيط وقوي. يمكنك استخدامه لبناء مدونة شخصية أو موقع ويب بسهولة.

## ميزات مدونتي

- **دعم كامل للغة العربية**: تم تكوين المدونة لدعم النص العربي بالكامل
- **تخطيط RTL**: جميع عناصر الصفحة معكوسة للقراءة من اليمين إلى اليسار
- **خطوط عربية جميلة**: استخدام خطوط عربية عصرية وواضحة
- **محتوى مختلط**: يمكنني كتابة محتوى باللغة العربية والإنجليزية معاً

### مثال على كود برمجي

```javascript
// هذا مثال على كود JavaScript
function مرحبا(الاسم) {
    console.log(`مرحباً ${الاسم}!`);
}

مرحبا('محمد');
```

## قائمة مرتبة

1. العنصر الأول
2. العنصر الثاني
3. العنصر الثالث

## اقتباس

> النجاح ليس نهائياً، الفشل ليس قاتلاً. ما يهم هو الشجاعة للاستمرار.

## الخلاصة

هذه نهاية أول تدوينة لي. أتمنى أن تكونوا قد استمتعتم بقراءتها. تابعوني للمزيد من المحتوى الرائع!

---

شكراً لزيارتكم! 🚀
EOL
    print_success "Sample Arabic post created"
else
    print_info "Sample Arabic post already exists"
fi

# Create GitHub Actions workflow
print_info "Setting up GitHub Actions for deployment..."
mkdir -p .github/workflows

if [ ! -f ".github/workflows/jekyll.yml" ]; then
    cat > .github/workflows/jekyll.yml << 'EOL'
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
EOL
    print_success "GitHub Actions workflow created"
else
    print_info "GitHub Actions workflow already exists"
fi

# Test the setup
print_info "Testing Jekyll build..."
if bundle exec jekyll build --quiet; then
    print_success "Jekyll build successful!"
else
    print_error "Jekyll build failed. Please check for errors."
    exit 1
fi

# Final summary
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}    ✅ Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}\n"

print_success "Your Jekyll blog is now configured for Arabic!"
print_info "Next steps:"
echo "  1. Run locally: bundle exec jekyll serve"
echo "  2. Visit: http://localhost:4000"
echo "  3. Push to GitHub: git push origin main"
echo "  4. Enable GitHub Pages in repository settings"
echo ""
print_info "Important files:"
echo "  - Configuration: _config.yml"
echo "  - RTL Styles: assets/rtl.css"
echo "  - Arabic Fonts: assets/arabic-fonts.css"
echo "  - Sample Post: _posts/$(date +%Y-%m-%d)-arabic-welcome.md"
echo ""
print_info "Documentation: COMPLETE-ARABIC-JEKYLL-GUIDE.md"
echo -e "\n${BLUE}مدونة سعيدة! Happy Blogging! 🚀${NC}\n"