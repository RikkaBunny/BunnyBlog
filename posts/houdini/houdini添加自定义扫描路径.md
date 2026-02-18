---
title: "Houdini添加自定义扫描路径"
categories: ["Houdini"]
date: "2023-07-07"
created: "2023-07-07T16:30:00.000Z"
updated: "2023-07-07T16:30:00.000Z"
notion_url: "https://www.notion.so/Houdini-a3205d1d333140d29e1ea09d0aeb823d"
database: "Houdini Technical"
---

打开houdini.env 

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/826ac7c4-16ea-47db-b704-f30f496469c3/24b924fa-8345-4e32-b003-a9ebb049ce6f/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466TOWZ6BZQ%2F20260218%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20260218T055013Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEJX%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJIMEYCIQDVUIoF4LrHVzhkDxqkMdu%2FMDRNzz5hcHs3X8kpJkBLLgIhAPN6H15ivnrdlKHD93BGnxp6BRZ41zC8%2FyuqWUDfJ0lYKv8DCF4QABoMNjM3NDIzMTgzODA1Igw8LRhxjXQH3HeilP0q3APVgeIURNt7n6RiThb9%2FFXTzVEfWynuOl%2BMtZMqCxELJ%2FIzrRev7GFA2Jev9W9ryXbkq228%2B7A8QM34z4izs1Pjrx%2BDMrP%2FnB8E13Hgeczt8y00kuYp4XzWqIidhkbkWiMtoCCglF7cFjOmt9KeXAlh0nyvVoFN%2BPZLmHJu5NlaVL7wOZ7gkfh8zSI6T8%2FzDkkO1HLRPfpaDrlkL775sOZnSf%2F%2BypmahG%2F8VszGHLRMJxIFT0QI7lkWLY8UW1l264bZog8h8sh0GGCjR1J4uCB15ADR65Oj6IQB7Jnm9AvjcZrwXL%2F6dKiCFBKyuTV1gFyHVs6qxl1shV7Ji%2Bj2TfoeJWYHvp6V4B1yYMXXVYiOEWZbSHIUlEAr3iawxAK2epcWiYQlM0Zq1Hc8u3uSPaB06cMcSSRSav0oG0h%2FhUj%2BNGdok8KEmesJ5vwZBclImt93umuHYcmD94H%2F42lGZVowv0A5vt99gj%2F8ipPIbO6KQ0Wq3wAK2PV1Q2%2BQx2v5BAGcLggs%2BBG7OUlZpib2uShidjiUcmbjglXQtzVPHV78X%2BrlP5kXfw3Yts4o5t9rg9DOmqnSoH0gZ1r%2BzhHkmRCXltVhbTul%2Bv7uTwaNiKfYr%2FMs3l4A%2Bhd%2FUIadxjDRltXMBjqkATI1GpOgUIhAFw3gtn%2Bzprt614x2ZTDZRzXaIVrl8TLeXVwmgz%2Fa0vTwJ9Q%2F%2FV4SpHNS%2BmoPnpDAHP6c1nJMKchtf5UwhNbL0oKP9ANeC5aRNKhVlE45i94aWhjrhj4Z%2FxVfk%2BBedsWLA7tl67rDpKXwgi4iruxCNNAt%2FZmZ8yH8N8QwQ1lG8tV1jscxMJVPhpvr0%2BVc5eECgcjfE8Ql9%2FAd6tll&X-Amz-Signature=6d87734e2a1bb56d2963a5858fe6de6e0b43076c0f9fae8cdfca761f62b9aaef&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)


HOUDINI_OTLSCAN_PATH = ;&


记得斜杠要反过来


