#!/bin/bash

# Kai's Blog Management System for سنام
# This script allows Kai to manage Mohammed's blog from anywhere in Claude Code

BLOG_DIR="/Users/mohammedalhaqbani/Downloads/Manual Library/Projects/Jekyll_blog/watery"
POSTS_DIR="$BLOG_DIR/_posts"
AUTHOR="محمد الحقباني"

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to create a new blog post
create_post() {
    local title="$1"
    local content="$2"
    local tags="$3"

    # Generate filename with today's date
    local date=$(date +%Y-%m-%d)
    local filename_title=$(echo "$title" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
    local filename="$POSTS_DIR/${date}-${filename_title}.md"

    # Create the post with front matter
    cat > "$filename" << EOF
---
layout: post
title: "$title"
date: $(date +"%Y-%m-%d %H:%M:%S %z")
tags: [$tags]
author: $AUTHOR
excerpt: "${content:0:160}..."
---

$content
EOF

    echo -e "${GREEN}✓${NC} Blog post created: $filename"
    return 0
}

# Function to create a quick note/thought
quick_note() {
    local thought="$1"
    local date=$(date +%Y-%m-%d)
    local time=$(date +%H%M%S)
    local filename="$POSTS_DIR/${date}-thought-${time}.md"

    cat > "$filename" << EOF
---
layout: post
title: "خاطرة: $(date +'%Y/%m/%d')"
date: $(date +"%Y-%m-%d %H:%M:%S %z")
tags: [خواطر, أفكار]
author: $AUTHOR
---

$thought
EOF

    echo -e "${GREEN}✓${NC} Quick thought posted: $filename"
    return 0
}

# Function to list recent posts
list_posts() {
    echo -e "${BLUE}Recent blog posts:${NC}"
    ls -lt "$POSTS_DIR" | head -10 | grep -E "\.md$" | awk '{print $NF}'
}

# Function to edit a post
edit_post() {
    local post_name="$1"
    local post_file="$POSTS_DIR/$post_name"

    if [ ! -f "$post_file" ]; then
        # Try to find the post by partial name
        post_file=$(find "$POSTS_DIR" -name "*${post_name}*.md" | head -1)
    fi

    if [ -f "$post_file" ]; then
        echo -e "${YELLOW}Opening for edit:${NC} $post_file"
        echo "$post_file"
        return 0
    else
        echo -e "${RED}Post not found:${NC} $post_name"
        return 1
    fi
}

# Function to deploy/publish the blog
deploy_blog() {
    cd "$BLOG_DIR"

    echo -e "${YELLOW}Deploying blog to GitHub...${NC}"

    # Add all changes
    git add -A

    # Create commit message
    local commit_msg="${1:-Update blog content}"
    git commit -m "$commit_msg" || {
        echo -e "${YELLOW}No changes to commit${NC}"
        return 0
    }

    # Push to GitHub
    git push origin main

    echo -e "${GREEN}✓${NC} Blog deployed successfully!"
    echo -e "${BLUE}Live at:${NC} https://haqbani.github.io/arabic-blog"
    return 0
}

# Function to serve blog locally
serve_local() {
    cd "$BLOG_DIR"
    echo -e "${YELLOW}Starting local blog server...${NC}"
    bundle exec jekyll serve --host 0.0.0.0 &
    echo -e "${GREEN}✓${NC} Blog running at: http://localhost:4000"
}

# Function to create a post with margin notes
create_post_with_notes() {
    local title="$1"
    local content="$2"
    local tags="$3"

    # Generate filename
    local date=$(date +%Y-%m-%d)
    local filename_title=$(echo "$title" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
    local filename="$POSTS_DIR/${date}-${filename_title}.md"

    # Create the post with margin note examples
    cat > "$filename" << EOF
---
layout: post
title: "$title"
date: $(date +"%Y-%m-%d %H:%M:%S %z")
tags: [$tags]
author: $AUTHOR
---

$content

<!-- Example of using margin notes in this post:
<span class="margin-trigger">نص مع هامش</span><span class="margin-note">هذا هامش جانبي</span>
-->
EOF

    echo -e "${GREEN}✓${NC} Blog post with margin notes created: $filename"
    return 0
}

# Function to show blog stats
blog_stats() {
    echo -e "${BLUE}Blog Statistics:${NC}"
    echo "Total posts: $(ls "$POSTS_DIR"/*.md 2>/dev/null | wc -l)"
    echo "Latest post: $(ls -t "$POSTS_DIR"/*.md 2>/dev/null | head -1 | xargs basename)"
    echo "Blog location: $BLOG_DIR"
    echo "Live URL: https://haqbani.github.io/arabic-blog"
}

# Main command handler
case "$1" in
    new|create)
        create_post "$2" "$3" "$4"
        ;;
    note|quick)
        quick_note "$2"
        ;;
    list|ls)
        list_posts
        ;;
    edit)
        edit_post "$2"
        ;;
    deploy|publish)
        deploy_blog "$2"
        ;;
    serve|local)
        serve_local
        ;;
    margin|withnotes)
        create_post_with_notes "$2" "$3" "$4"
        ;;
    stats|info)
        blog_stats
        ;;
    *)
        echo "Kai's Blog Manager for سنام"
        echo "Usage: $0 {command} [options]"
        echo ""
        echo "Commands:"
        echo "  new <title> <content> <tags>  - Create new blog post"
        echo "  note <content>                 - Quick thought/note"
        echo "  list                          - List recent posts"
        echo "  edit <post-name>              - Edit existing post"
        echo "  deploy [message]              - Publish blog to GitHub"
        echo "  serve                         - Run blog locally"
        echo "  margin <title> <content> <tags> - Create post with margin notes"
        echo "  stats                         - Show blog statistics"
        ;;
esac