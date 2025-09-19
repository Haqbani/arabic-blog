#!/usr/bin/env python3
"""
Kai's Advanced Blog Helper for سنام
This module provides Python functions for managing Mohammed's blog
"""

import os
import subprocess
import datetime
import re
from pathlib import Path
import json

class BlogManager:
    def __init__(self):
        self.blog_dir = Path("/Users/mohammedalhaqbani/Downloads/Manual Library/Projects/Jekyll_blog/watery")
        self.posts_dir = self.blog_dir / "_posts"
        self.author = "محمد الحقباني"

    def create_post(self, title, content, tags=None, add_margin_notes=False):
        """Create a new blog post with proper formatting"""
        date = datetime.datetime.now()
        filename_title = re.sub(r'[^\w\s-]', '', title.lower())
        filename_title = re.sub(r'[-\s]+', '-', filename_title)

        filename = f"{date.strftime('%Y-%m-%d')}-{filename_title}.md"
        filepath = self.posts_dir / filename

        # Process content for margin notes if requested
        if add_margin_notes:
            content = self._add_margin_note_syntax(content)

        # Generate excerpt
        excerpt = content[:160] + "..." if len(content) > 160 else content

        # Create front matter
        front_matter = f"""---
layout: post
title: "{title}"
date: {date.strftime("%Y-%m-%d %H:%M:%S %z")}
tags: [{', '.join(tags) if tags else 'عام'}]
author: {self.author}
excerpt: "{excerpt}"
---

{content}
"""

        filepath.write_text(front_matter, encoding='utf-8')
        return f"✅ Post created: {filename}"

    def _add_margin_note_syntax(self, content):
        """Convert [[note]] syntax to proper margin note HTML"""
        pattern = r'\[\[(.+?)\]\]'

        def replace_note(match):
            note_text = match.group(1)
            # Find the last word before the note marker
            return f'<span class="margin-trigger">كلمة</span><span class="margin-note">{note_text}</span>'

        return re.sub(pattern, replace_note, content)

    def quick_thought(self, thought):
        """Post a quick thought or note"""
        date = datetime.datetime.now()
        filename = f"{date.strftime('%Y-%m-%d')}-thought-{date.strftime('%H%M%S')}.md"
        filepath = self.posts_dir / filename

        content = f"""---
layout: post
title: "خاطرة: {date.strftime('%Y/%m/%d')}"
date: {date.strftime("%Y-%m-%d %H:%M:%S %z")}
tags: [خواطر, أفكار]
author: {self.author}
---

{thought}
"""

        filepath.write_text(content, encoding='utf-8')
        return f"✅ Quick thought posted: {filename}"

    def create_series(self, series_name, post_title, content, part_number=1):
        """Create a post as part of a series"""
        full_title = f"{series_name} - الجزء {part_number}: {post_title}"
        tags = [series_name, "سلسلة"]

        # Add series navigation
        series_nav = f"""
---
هذا المقال جزء من سلسلة: **{series_name}**

[عرض جميع أجزاء السلسلة](/tags/#{series_name.replace(' ', '-')})

---

"""

        full_content = series_nav + content
        return self.create_post(full_title, full_content, tags)

    def list_recent_posts(self, count=10):
        """List recent blog posts"""
        posts = sorted(self.posts_dir.glob("*.md"), key=os.path.getmtime, reverse=True)
        result = ["📚 Recent posts:"]
        for post in posts[:count]:
            result.append(f"  • {post.name}")
        return "\n".join(result)

    def search_posts(self, keyword):
        """Search posts by keyword"""
        results = []
        for post in self.posts_dir.glob("*.md"):
            content = post.read_text(encoding='utf-8')
            if keyword.lower() in content.lower():
                results.append(post.name)

        if results:
            return f"🔍 Found {len(results)} posts containing '{keyword}':\n" + "\n".join(f"  • {r}" for r in results)
        else:
            return f"❌ No posts found containing '{keyword}'"

    def get_post_stats(self):
        """Get blog statistics"""
        posts = list(self.posts_dir.glob("*.md"))

        stats = {
            "total_posts": len(posts),
            "latest_post": max(posts, key=os.path.getmtime).name if posts else "None",
            "oldest_post": min(posts, key=os.path.getmtime).name if posts else "None",
            "blog_url": "https://haqbani.github.io/arabic-blog"
        }

        return f"""📊 Blog Statistics:
• Total posts: {stats['total_posts']}
• Latest: {stats['latest_post']}
• Oldest: {stats['oldest_post']}
• Live URL: {stats['blog_url']}"""

    def deploy(self, commit_message=None):
        """Deploy blog to GitHub"""
        os.chdir(self.blog_dir)

        # Default commit message
        if not commit_message:
            commit_message = f"Update blog - {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}"

        try:
            # Git add
            subprocess.run(["git", "add", "-A"], check=True)

            # Git commit
            result = subprocess.run(["git", "commit", "-m", commit_message],
                                  capture_output=True, text=True)

            if result.returncode == 0:
                # Git push
                subprocess.run(["git", "push", "origin", "main"], check=True)
                return f"✅ Blog deployed successfully!\n🌐 Live at: https://haqbani.github.io/arabic-blog"
            elif "nothing to commit" in result.stdout:
                return "ℹ️ No changes to deploy"
            else:
                return f"❌ Commit failed: {result.stderr}"

        except subprocess.CalledProcessError as e:
            return f"❌ Deployment failed: {e}"

    def create_draft(self, title, outline):
        """Create a draft post with an outline"""
        date = datetime.datetime.now()
        filename = f"draft-{date.strftime('%Y%m%d')}-{title.lower().replace(' ', '-')}.md"
        filepath = self.blog_dir / "_drafts" / filename

        # Ensure drafts directory exists
        filepath.parent.mkdir(exist_ok=True)

        content = f"""---
layout: post
title: "{title}"
date: {date.strftime("%Y-%m-%d %H:%M:%S %z")}
tags: [مسودة]
author: {self.author}
published: false
---

# {title}

## مخطط المقال:

{outline}

---
*هذه مسودة - يجب إكمالها قبل النشر*
"""

        filepath.write_text(content, encoding='utf-8')
        return f"📝 Draft created: {filename}"

# Global instance for easy access
blog = BlogManager()

# Quick access functions
def new_post(title, content, tags=None):
    """Quick function to create a new post"""
    return blog.create_post(title, content, tags)

def quick_note(thought):
    """Quick function to post a thought"""
    return blog.quick_thought(thought)

def deploy():
    """Quick deploy function"""
    return blog.deploy()

def stats():
    """Quick stats function"""
    return blog.get_post_stats()

# CLI interface
if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("""
Kai's Blog Helper - سنام
Usage:
  python kai_blog_helper.py new "Title" "Content" "tag1,tag2"
  python kai_blog_helper.py note "Quick thought"
  python kai_blog_helper.py list
  python kai_blog_helper.py search "keyword"
  python kai_blog_helper.py stats
  python kai_blog_helper.py deploy "commit message"
        """)
    else:
        command = sys.argv[1]

        if command == "new" and len(sys.argv) >= 4:
            title = sys.argv[2]
            content = sys.argv[3]
            tags = sys.argv[4].split(',') if len(sys.argv) > 4 else None
            print(blog.create_post(title, content, tags))

        elif command == "note" and len(sys.argv) >= 3:
            print(blog.quick_thought(sys.argv[2]))

        elif command == "list":
            print(blog.list_recent_posts())

        elif command == "search" and len(sys.argv) >= 3:
            print(blog.search_posts(sys.argv[2]))

        elif command == "stats":
            print(blog.get_post_stats())

        elif command == "deploy":
            msg = sys.argv[2] if len(sys.argv) > 2 else None
            print(blog.deploy(msg))