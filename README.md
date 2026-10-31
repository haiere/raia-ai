<div align="center">

<img src="https://i.postimg.cc/28bKx4xC/raia2.webp" alt="Raia AI logo" width="120" />

# RAIA — Reflecting Tomorrow

<a href="https://hajir.is-a.dev/raia-ai/">
  <img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=600&size=22&pause=1000&color=4C8BF5&center=true&vCenter=true&width=600&lines=A+symmetric+AI+chat+assistant;Multi-provider+support;Running+entirely+in+your+browser;No+server,+no+tracking,+no+telemetry" alt="Typing SVG" />
</a>

<br />

<a href="https://hajir.is-a.dev/raia-ai/">
  <img src="https://img.shields.io/badge/Live_Demo-raia.is--a.bot-4C8BF5?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support_the_Project-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee" />
</a>

<br />

<img src="https://img.shields.io/badge/Version-v1.2.1-4C8BF5?style=flat-square" alt="Version v1.2.1" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />

<br />

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
<img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="Vanilla JavaScript" />
<img src="https://img.shields.io/badge/No_Build_Step-4B0082?style=flat-square" alt="No build step" />

<br />

<img src="https://img.shields.io/badge/Privacy-No_Tracking-success?style=flat-square" alt="No tracking" />
<img src="https://img.shields.io/badge/Storage-Local_Browser-7FD8CB?style=flat-square" alt="Local storage" />
<img src="https://img.shields.io/badge/i18n-ID_%26_EN-9B59B6?style=flat-square" alt="Bahasa Indonesia and English" />
<img src="https://img.shields.io/badge/Math-KaTeX-008080?style=flat-square" alt="KaTeX math rendering" />
<img src="https://img.shields.io/badge/a11y-ARIA_Ready-B4788C?style=flat-square" alt="ARIA ready" />

</div>

---

## Table of Contents

- [Overview](#overview)
- [What's New in v1.2.1](#whats-new-in-v121)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Privacy and Security](#privacy-and-security)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Development Setup](#development-setup)
- [Tech Stack](#tech-stack)
- [Deployment](#deployment)
- [Changelog](#changelog)
- [License](#license)
- [Author and Support](#author-and-support)

---

## Overview

RAIA is a client-side AI chat interface that connects to multiple large language model providers from a single, unified experience.

<table>
<tr>
<td width="50%" valign="top">

### Supported Providers

- OpenRouter
- OpenAI
- Perplexity
- Claude (Anthropic)
- Gemini (Google)
- Mistral

</td>
<td width="50%" valign="top">

### What It Gives You

- Unified chat experience
- Local history storage
- Model selection
- Configurable generation parameters
- Full Markdown and LaTeX math rendering
- Bilingual interface (Bahasa Indonesia and English)
- Polished glassmorphic interface
- Responsive design for desktop and mobile

</td>
</tr>
</table>

> [!IMPORTANT]
> All communication with AI providers happens **directly from your browser**. No server is involved. Your API keys and conversations stay on your device.

---

## What's New in v1.2.1

This release focuses on reliability, rendering quality, and mobile polish.

| Change | Details |
|---|---|
| **Send button fix** | The send button now uses a `data-disabled` attribute instead of the native `disabled` attribute, so it always receives clicks. Empty input shows a friendly toast instead of silently doing nothing. A single `updateSendButtonState()` function is the only source of truth for the button state. |
| **Double-submit prevention** | A per-request ID counter prevents stale responses from overwriting newer ones, and `state.loading` guards against duplicate submissions. |
| **Full Markdown rendering** | Migrated to `marked.js` with GitHub-Flavored Markdown support: headings, lists, tables, task lists, blockquotes, inline code, and fenced code blocks. |
| **LaTeX math via KaTeX** | Inline (`$...$`, `\(...\)`) and block (`$$...$$`, `\[...\]`) math rendering. Fractions, roots, exponents, integrals, sums, and matrices render cleanly on all screen sizes. |
| **XSS sanitization** | All assistant output is sanitized with DOMPurify. `style` attributes are scoped to KaTeX elements only via the `uponSanitizeAttribute` hook. |
| **Code block copy buttons** | Every fenced code block gets a copy button with "Copied" feedback and a localized toast. |
| **Retry button for errors** | Failed requests render an error message with a Retry button that re-sends the original prompt. |
| **Clear chat** | A new trash icon in the history drawer clears the current conversation with confirmation. |
| **Responsive redesign** | Layout uses `100dvh` with internal scroll for a proper chat-app feel on all viewports. Tested from 320px to 1920px with no horizontal overflow. |
| **Mobile keyboard fix** | `interactive-widget=resizes-content` in the viewport meta keeps the input visible when the virtual keyboard opens. |
| **Accessibility improvements** | `role="log"` and `aria-live="polite"` on the message list, descriptive labels on all controls, focus-visible outlines. |

<details>
<summary><strong>Click to view previous releases (v1.2.0 and v1.1.1)</strong></summary>

<br />

### v1.2.0

| Change | Details |
|---|---|
| **Internationalization (i18n)** | Full bilingual UI via a zero-dependency `i18n.js` module. Language is detected from the browser on first visit, persisted in `localStorage`, and switchable from the settings panel. |
| **Raia AI personality** | A built-in system prompt gives Raia a distinct personality, sent in the provider-native format (`system` role, `system` parameter, or `systemInstruction`). |
| **Request timeout** | Chat requests abort after 2 minutes with a localized timeout message. |
| **Online/offline awareness** | Connection status reacts to browser network events with localized toasts. |
| **Safer destructive actions** | Deleting a conversation from history asks for confirmation first. |

### v1.1.1

| Change | Details |
|---|---|
| **Support button** | Non-intrusive Buy Me a Coffee link in the header and welcome screen. |
| **Enhanced SEO** | Open Graph, Twitter Card, and JSON-LD structured data (`WebApplication`, `WebSite`, `FAQPage`). |
| **Version badge** | Version pill next to the logo. |
| **Feature pills** | Private, Fast, and Multi-model indicators on the welcome screen. |
| **Accessibility** | ARIA labels, roles, and focus-visible states across all interactive elements. |
| **Responsive** | Breakpoints from 320px up to 1920px and beyond. |
| **`color-scheme` meta** | Browser UI matches the selected theme. |

</details>

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### Providers and Models

- **Multi-provider support** — OpenRouter, OpenAI, Perplexity, Claude, Gemini, and Mistral from a single interface.
- **Model selection** — Provider-specific model lists or custom model IDs.
- **Adjustable generation parameters** — Temperature and max token output via sliders.

</td>
<td width="50%" valign="top">

### Chat Experience

- **Local chat history** — Conversations stored in `localStorage` (up to 50 saved chats).
- **Markdown rendering** — Headings, lists, tables, blockquotes, inline code, and code blocks with copy buttons.
- **LaTeX math rendering** — Inline and display math via KaTeX.
- **Copy and regenerate** — Every assistant message includes copy and regenerate actions.
- **Retry on error** — Failed requests show a retry button.
- **Streaming-style typing indicator** — Animated dots with a screen-reader label.
- **Suggestion chips** — Quick-start prompts for common use cases.

</td>
</tr>
<tr>
<td colspan="2" valign="top">

### Interface and Privacy

- **Bilingual UI** — Switch between Bahasa Indonesia and English; the choice is remembered and applied instantly.
- **Dark and light theme** — Manual toggle or follow system preference; the logo swaps to match.
- **Online and offline status** — The connection badge reflects real browser network state.
- **Keyboard shortcuts** — Send with `Enter`, new line with `Shift+Enter`, focus with `Ctrl+K`, new chat with `Ctrl+N`, history with `Ctrl+H`.
- **No tracking, no telemetry** — The application does not collect any usage data.
- **Donation support** — Optional, non-intrusive Buy Me a Coffee link in the header and welcome screen.

</td>
</tr>
</table>

---

## Requirements

| Requirement | Details |
|---|---|
| **Browser** | A modern web browser with JavaScript enabled — Chrome, Firefox, Edge, Safari, or similar. |
| **API Key** | An API key for at least one supported provider. |
| **Installation** | The page is a single HTML file and requires no installation. |

---

## Installation

RAIA is a single-page application with no build step.

### Use the hosted version
**[hajir.is-a.dev/raia-ai](https://hajir.is-a.dev/raia-ai/)**

### Run locally
Download the source files and open `index.html` in your browser. An internet connection is required for the vendor libraries (marked.js, DOMPurify, KaTeX) loaded from CDN.

### Self-host
Place the files on any static web server. All styles, icons, and logic are self-contained except for the vendor libraries loaded from jsDelivr.

---

## Usage

| Step | Action |
|:-:|---|
| 1 | **Configure a provider** — Click **Setup API** in the header to open the settings panel. |
| 2 | **Pick your language** — Bahasa Indonesia or English (detected automatically on first visit). |
| 3 | **Select a provider** — OpenRouter, OpenAI, Perplexity, Claude, Gemini, or Mistral. |
| 4 | **Enter your API key** — Paste your key in the API Key field. You can choose to remember it locally. |
| 5 | **Select a model** — Choose from the provider's list or type a custom model ID. |
| 6 | **Connect** — Click **Connect**. The status badge shows **Connected**. |
| 7 | **Start chatting** — Type a message and press `Enter` to send. |
| 8 | **Adjust parameters** — Temperature and max tokens sliders. |
| 9 | **Access history** — Click the history icon or press `Ctrl+H` to view, load, or delete conversations. |

### Supported Providers and Example Models

| Provider | Default models (examples) |
|---|---|
| OpenRouter | `anthropic/claude-sonnet-5`, `openai/gpt-5.6`, `google/gemini-3.5-flash`, `meta-llama/llama-4-maverick`, `mistralai/mistral-large-3`, `deepseek/deepseek-v4` |
| OpenAI | `gpt-5.6`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-4o`, `gpt-4o-mini` |
| Perplexity | `sonar`, `sonar-pro`, `sonar-reasoning-pro`, `sonar-deep-research` |
| Claude (Anthropic) | `claude-sonnet-5`, `claude-opus-4-8`, `claude-haiku-4-5-20251001`, `claude-fable-5` |
| Gemini (Google) | `gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, `gemini-2.5-flash` |
| Mistral | `mistral-large-latest`, `mistral-small-latest`, `magistral-medium-latest`, `codestral-latest` |

> [!TIP]
> Custom model IDs are supported. Just type the ID into the model input field.

---

## Configuration

### Settings Panel

| Setting | Description |
|---|---|
| **Language** | Switch the interface between Bahasa Indonesia and English. |
| **Provider** | Select the AI provider. |
| **Model** | Text input with datalist support for provider-specific models. |
| **API Key** | Password input with visibility toggle and optional persistence. |
| **Custom Base URL** | Override the default API endpoint for the selected provider. |
| **CORS Proxy URL** | Required for providers that block direct browser requests — OpenAI, Perplexity, Mistral. |
| **Temperature** | Slider from `0.0` to `2.0` (step `0.1`). Default: `0.7`. |
| **Max Tokens** | Slider from `256` to `8192` (step `128`). Default: `1024`. |

### Advanced Options

<table>
<tr>
<td width="50%" valign="top">

**Custom Base URL**

Enter a custom endpoint if you are using a gateway, self-hosted model, or local service.

</td>
<td width="50%" valign="top">

**CORS Proxy URL**

Enter a proxy endpoint for providers that block direct browser calls. The proxy should forward the request and the `X-Target-Url` header.

</td>
</tr>
</table>

> [!IMPORTANT]
> **Why a proxy?** Browsers enforce the same-origin policy via CORS. OpenRouter, Claude, and Gemini allow direct browser requests. OpenAI, Perplexity, and Mistral do not. You will need a small proxy (for example, a Cloudflare Worker) to relay those requests.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Send message |
| `Shift + Enter` | New line in message |
| `Ctrl + K` | Focus message input |
| `Ctrl + N` | Start new chat |
| `Ctrl + H` | Toggle chat history drawer |
| `Ctrl + Enter` | Submit message (alternative) |
| `Escape` | Close settings panel or history drawer |

---

## Privacy and Security

RAIA keeps everything on your device.

- All API keys are stored locally in your browser's `localStorage` if you choose to remember them.
- Conversation history is stored locally and never sent to any third party.
- No analytics, tracking, or telemetry is collected.
- The application does not use cookies or external services beyond the AI provider APIs and the vendor library CDN.
- All requests go **directly from your browser** to the provider you select.
- All assistant output is sanitized with DOMPurify before being inserted into the DOM to prevent XSS.

---

## Accessibility

RAIA is built with accessibility in mind.

| Area | Implementation |
|---|---|
| **Interactive controls** | All controls have descriptive `aria-label` attributes, localized with the active language. |
| **Keyboard navigation** | Focus-visible outlines throughout; `Escape` closes panels and drawers. |
| **Motion and color** | Respects `prefers-reduced-motion` and `prefers-color-scheme`. |
| **Live regions** | `aria-live="polite"` and `role="log"` on the message list, plus `aria-live` toasts. |
| **Screen readers** | Typing indicator includes a visually hidden status label. |
| **Semantics** | HTML landmarks — `header`, `main`, `aside`, `role="banner"`, `role="region"`. |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| **Send button appears greyed out** | The button is styled as inactive when the input is empty. Type a non-empty message to activate it, or click to see the empty-input toast. |
| **Connection fails** | Verify your API key is correct and that the selected model is available for your provider. |
| **CORS errors (OpenAI, Perplexity, Mistral)** | These providers block direct browser requests. Set a **CORS Proxy URL** in the advanced settings, or switch to OpenRouter. |
| **Model not found** | Ensure the model ID is spelled correctly and supported by the chosen provider. |
| **Rate limit errors (429)** | You may have exceeded your provider's rate limit. Wait a moment and try again. |
| **Invalid API key (401)** | Check your key — no extra spaces — and confirm it has access to the selected model. |
| **Request times out** | The request is stopped after 2 minutes. Check your connection or proxy, then try again. |
| **Math not rendering** | Ensure the KaTeX CDN (`cdn.jsdelivr.net`) is reachable. Blocked CDNs fall back to a plain-text representation. |
| **Code blocks not highlighted** | Currently only copy buttons are provided. Syntax highlighting is on the roadmap. |
| **History not saving** | Check that your browser allows `localStorage` and that you are not in private or incognito mode. |
| **Language keeps resetting** | Your browser may be blocking `localStorage` in private mode. Otherwise, language is remembered between visits. |
| **Network error** | Often a CORS issue. Try the proxy workaround or switch to a provider that allows direct browser requests. |

---

## Roadmap

Future improvements may include:

<table>
<tr>
<td width="50%" valign="top">

- Streaming responses (token-by-token output)
- User-editable system prompt
- Export and import of chat history (JSON, Markdown)
- Syntax highlighting for code blocks

</td>
<td width="50%" valign="top">

- Additional provider integrations (Groq, Together, Cohere)
- Response caching and offline support
- More interface languages
- Virtualized message list for very long conversations

</td>
</tr>
</table>

---

## Contributing

Contributions are welcome. Areas for improvement include:

- Support for additional AI providers.
- Enhanced markdown rendering with syntax highlighting.
- New translations for the i18n module (`i18n.js`).
- Performance optimizations.
- Documentation improvements.

Please fork the repository and submit a pull request with a clear description of your changes.

---

## Development Setup

The application consists of six files.

```text
.
├── index.html      # markup, SVG icon sprite, vendor library includes
├── style.css       # all styles, themes, and responsive rules
├── i18n.js         # lightweight i18n module (id and en translations)
├── script.js       # provider logic, chat state, markdown + KaTeX pipeline
└── README.md
```

Local Development

1. Edit the files directly.
2. Test by opening index.html in a browser.
3. No build tools or compilation steps are required.

[!WARNING]
Load order matters. 
i18n.js must load before script.js. The vendor libraries (marked, DOMPurify, katex) must load before script.js as well. index.html already includes the scripts in the correct order.

Local Hosting

<table>
<tr>
<td width="50%" valign="top">

Python

```bash
python -m http.server 8080
```

</td>
<td width="50%" valign="top">

Node.js

```bash
npx serve
```

</td>
</tr>
</table>

Then open http://localhost:8080 in your browser.

---

Tech Stack

Layer Used
Logic Vanilla JavaScript — no frameworks
Styling CSS custom properties with full dark and light theme tokens
Icons Inline SVG sprite — Lucide-style stroke icons
Markdown marked via jsDelivr CDN
Sanitization DOMPurify via jsDelivr CDN
Math Rendering KaTeX via jsDelivr CDN
i18n i18n.js — zero-dependency translation module (id and en)
Storage localStorage for settings, language, API keys, and chat history
Typography Google Fonts — Inter, Outfit, JetBrains Mono

---

Deployment

RAIA is a static site with no build step.

---

Changelog

v1.2.1

· Fixed send button interaction (data-attribute based, always clickable).
· Prevented double submit with a per-request ID counter.
· Added full Markdown rendering via marked.js with GFM support.
· Added LaTeX math rendering via KaTeX (inline and block).
· Added XSS sanitization with scoped style attributes via DOMPurify.
· Added copy buttons to code blocks.
· Added retry button to error messages.
· Added clear chat action with confirmation.
· Redesigned layout with 100dvh and internal scroll.
· Fixed mobile keyboard overlay with interactive-widget=resizes-content.
· Improved accessibility with role="log" and localized ARIA labels.
· Migrated production domain to hajir.is-a.dev/raia-ai.

v1.2.0

· Added internationalization (Bahasa Indonesia and English).
· Added Raia AI system prompt.
· Added 2-minute request timeout.
· Added online and offline awareness.
· Added confirmation for destructive history actions.

v1.1.1

· Added support button in header and welcome screen.
· Added Open Graph, Twitter Card, and JSON-LD structured data.
· Added version badge.
· Added feature pills (Private, Fast, Multi-model).
· Improved accessibility across all interactive elements.
· Improved responsive breakpoints from 320px to 1920px.

---

License

RAIA is released under the MIT License. See the LICENSE file for full details.

---

Author and Support

<div align="center">

Developed and maintained by Haiere and HajirStudio.

<br />

Channel Purpose
Bug reports and feature requests Please use the project issue tracker
Questions Contact via the repository
Support the project Buy me a coffee

<br />

<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Buy_Me_a_Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee" />
</a>

<br />
<br />

<sub>Your support keeps RAIA free, ad-free, and privacy-focused. Thank you.</sub>

</div>

---

<div align="center">
<sub>
Last updated: October 2026 · RAIA v1.2.1
</sub>
</div>
