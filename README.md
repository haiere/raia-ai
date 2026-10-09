<div align="center">

# RAIA — Reflecting Tomorrow

**A symmetric AI chat assistant with multi-provider support**

Running entirely in your browser — no server, no tracking, no telemetry.

<br />

<a href="https://raia-ai.netlify.app/">
  <img src="https://img.shields.io/badge/Live_Demo-raia--ai.netlify.app-4C8BF5?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support_the_Project-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee" />
</a>

<br />

<img src="https://img.shields.io/badge/Version-v1.1.1-4C8BF5?style=flat-square" alt="Version v1.1.1" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
<img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="Vanilla JavaScript" />
<img src="https://img.shields.io/badge/No_Build_Step-4B0082?style=flat-square" alt="No build step" />

<br />

<img src="https://img.shields.io/badge/Privacy-No_Tracking-success?style=flat-square" alt="No tracking" />
<img src="https://img.shields.io/badge/Storage-Local_Browser-7FD8CB?style=flat-square" alt="Local storage" />
<img src="https://img.shields.io/badge/a11y-ARIA_Ready-B4788C?style=flat-square" alt="ARIA ready" />

</div>

---

<div align="center">

### Table of Contents

<table>
<tr>
<td valign="top" width="33%">

**Getting Started**

- [Overview](#overview)
- [What's New in v1.1.1](#whats-new-in-v111)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)

</td>
<td valign="top" width="33%">

**Reference**

- [Configuration](#configuration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Privacy and Security](#privacy-and-security)
- [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)

</td>
<td valign="top" width="33%">

**Community**

- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Development Setup](#development-setup)
- [Tech Stack](#tech-stack)
- [License](#license)
- [Author and Support](#author-and-support)

</td>
</tr>
</table>

</div>

---

## Overview

> **RAIA** is a client-side AI chat interface that connects to multiple large language model providers from a single, unified experience.

<table>
<tr>
<td width="50%" valign="top">

### Supported providers

- **OpenRouter**
- **OpenAI**
- **Perplexity**
- **Claude** (Anthropic)
- **Gemini** (Google)
- **Mistral**

</td>
<td width="50%" valign="top">

### What it gives you

- Unified chat experience
- Local history storage
- Model selection
- Configurable generation parameters
- Polished glassmorphic interface
- Responsive design for desktop and mobile

</td>
</tr>
</table>

> [!IMPORTANT]
> All communication with AI providers happens **directly from your browser**. No server is involved — your API keys and conversations stay on your device.

---

## What's New in v1.1.1

| Change | Details |
|---|---|
| **Support button** | A non-intrusive donation link has been added to the header and welcome screen — support development via Buy Me a Coffee without interrupting your workflow |
| **Enhanced SEO** | Complete Open Graph, Twitter Card, and JSON-LD structured data (`WebApplication`, `WebSite`, `FAQPage`) for better discoverability and rich search results |
| **Version badge** | A subtle version pill next to the logo makes the current release identifiable at a glance |
| **Feature pills on welcome** | Quick visual indicators (*Private · Fast · Multi-model*) that communicate the app's strengths to first-time visitors |
| **Improved accessibility** | All interactive elements now have proper ARIA labels, roles, and focus-visible states |
| **Refined responsive design** | Cleaner breakpoints from 320px up to 1920px+, with a mobile-friendly collapse of the donate and settings buttons |
| **`color-scheme` meta** | Browser UI (scrollbars, form controls) now matches the selected theme |

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### Providers & models

- **Multi-provider support** — Connect to OpenRouter, OpenAI, Perplexity, Claude, Gemini, and Mistral from a single interface
- **Model selection** — Choose from provider-specific model lists or enter a custom model ID
- **Adjustable generation parameters** — Control temperature and maximum token output via sliders

</td>
<td width="50%" valign="top">

### Chat experience

- **Local chat history** — Conversations are stored in your browser's `localStorage` and persist between sessions (up to 50 saved chats)
- **Copy and regenerate** — Each assistant message includes copy and regenerate buttons
- **Markdown rendering** — Bold, italics, inline code, code blocks, blockquotes, headings, lists, and auto-linked URLs
- **Streaming-style typing indicator** — Animated dots show when the assistant is thinking
- **Suggestion chips** — Quick-start prompts for common use cases (explain, write, review code, plan)

</td>
</tr>
<tr>
<td colspan="2" valign="top">

### Interface & privacy

- **Dark / light theme** — Toggle between themes manually or follow system preference. The logo swaps automatically to match the theme
- **Keyboard shortcuts** — Send with `Enter`, new line with `Shift+Enter`, focus with `Ctrl+K`, new chat with `Ctrl+N`, history with `Ctrl+H`
- **No tracking, no telemetry** — The application does not collect any usage data
- **Donation support** — Optional, non-intrusive Buy Me a Coffee link in the header and welcome screen

</td>
</tr>
</table>

---

## Requirements

| Requirement | Details |
|---|---|
| **Browser** | A modern web browser with JavaScript enabled — Chrome, Firefox, Edge, Safari, or similar |
| **API key** | An API key for at least one supported provider |
| **Installation** | The page is a single HTML file and requires no installation |

---

## Installation

> RAIA is a single-page application with no build step.

### Use the hosted version

<div align="center">

**[raia-ai.netlify.app](https://raia-ai.netlify.app/)**

</div>

### Run locally

Download the source files and open `index.html` locally in your browser.

### Self-host

Place the files on any static web server. All styles, icons, and scripts are self-contained — no build step required.

---

## Usage

### Step-by-step

| Step | Action |
|:-:|---|
| `1` | **Configure a provider** — Click the **Setup API** button in the header to open the settings panel |
| `2` | **Select a provider** — Choose from OpenRouter, OpenAI, Perplexity, Claude, Gemini, or Mistral |
| `3` | **Enter your API key** — Paste your key in the API Key field. You can choose to remember it locally |
| `4` | **Select a model** — Choose from the provider's model list or type a custom model ID |
| `5` | **Connect** — Click **Connect** to confirm your settings. A status indicator will show **Connected** |
| `6` | **Start chatting** — Type a message and press `Enter` to send |
| `7` | **Adjust parameters** — Use the temperature and max tokens sliders to control generation behaviour |
| `8` | **Access history** — Click the history icon (or press `Ctrl+H`) to view, load, or delete previous conversations |

### Supported providers and models

| Provider | Default models (examples) |
|---|---|
| OpenRouter | `anthropic/claude-sonnet-5`, `openai/gpt-5.6`, `google/gemini-3.5-flash`, `meta-llama/llama-4-maverick`, `mistralai/mistral-large-3`, `deepseek/deepseek-v4` |
| OpenAI | `gpt-5.6`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-4o`, `gpt-4o-mini` |
| Perplexity | `sonar`, `sonar-pro`, `sonar-reasoning-pro`, `sonar-deep-research` |
| Claude (Anthropic) | `claude-sonnet-5`, `claude-opus-4-8`, `claude-haiku-4-5-20251001`, `claude-fable-5` |
| Gemini (Google) | `gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, `gemini-2.5-flash` |
| Mistral | `mistral-large-latest`, `mistral-small-latest`, `magistral-medium-latest`, `codestral-latest` |

> [!TIP]
> Custom model IDs are supported — just type the ID into the model input field.

---

## Configuration

### Settings panel

> The settings panel provides the following options.

| Setting | Description |
|---|---|
| **Provider** | Dropdown to select the AI provider |
| **Model** | Text input with datalist support for provider-specific models |
| **API Key** | Password input with a visibility toggle and optional persistence (*Remember* checkbox) |
| **Custom Base URL** | Override the default API endpoint for the selected provider |
| **CORS Proxy URL** | Required for providers that block direct browser requests — OpenAI, Perplexity, Mistral |
| **Temperature** | Slider ranging from `0.0` to `2.0` (step `0.1`). Default: `0.7` |
| **Max Tokens** | Slider from `256` to `8192` (step `128`). Default: `1024` |

### Advanced options

<table>
<tr>
<td width="50%" valign="top">

**Custom Base URL**

Enter a custom endpoint if you are using a gateway, self-hosted model, or local service.

</td>
<td width="50%" valign="top">

**CORS Proxy URL**

Enter a proxy endpoint to handle requests for providers that do not support direct browser calls. The proxy should forward the request and the `X-Target-Url` header.

</td>
</tr>
</table>

> [!NOTE]
> **Why a proxy?** Browsers enforce the same-origin policy via CORS. OpenRouter, Claude, and Gemini allow direct browser requests. OpenAI, Perplexity, and Mistral do not — you'll need a small proxy (e.g. a Cloudflare Worker) to relay those requests.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Send message |
| `Shift+Enter` | New line in message |
| `Ctrl+K` | Focus message input |
| `Ctrl+N` | Start new chat |
| `Ctrl+H` | Toggle chat history drawer |
| `Ctrl+Enter` | Submit message (alternative) |
| `Escape` | Close settings panel or history drawer |

---

## Privacy and Security

> RAIA keeps everything on your device.

- All API keys are stored locally in your browser's `localStorage` if you choose to remember them
- Conversation history is stored locally and never sent to any third party
- No analytics, tracking, or telemetry is collected
- The application does not use cookies or external services beyond the AI provider APIs
- All requests go **directly from your browser** to the provider you select

---

## Accessibility

> RAIA is built with accessibility in mind.

| Area | Implementation |
|---|---|
| **Interactive controls** | All have descriptive `aria-label` attributes |
| **Keyboard navigation** | Focus-visible outlines |
| **Motion & color** | Respects `prefers-reduced-motion` and `prefers-color-scheme` |
| **Live regions** | `aria-live="polite"` for toasts and message updates |
| **Semantics** | HTML landmarks — `header`, `main`, `aside`, `role="log"`, `role="banner"` |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| **Connection fails** | Verify your API key is correct and that the selected model is available for your provider |
| **CORS errors (OpenAI / Perplexity / Mistral)** | These providers block direct browser requests. Set a **CORS Proxy URL** in the advanced settings, or switch to OpenRouter |
| **Model not found** | Ensure the model ID is spelled correctly and is supported by the chosen provider |
| **Rate limit errors (429)** | You may have exceeded your provider's rate limit. Wait a moment and try again, or check your provider dashboard |
| **Invalid API key (401)** | Check your key — no extra spaces — and confirm it has access to the selected model |
| **History not saving** | Check that your browser allows `localStorage` and that you are not in private/incognito mode |
| **Network error** | Often a CORS issue. Try the proxy workaround or switch to a provider that allows direct browser requests |

---

## Roadmap

> Future improvements may include:

<table>
<tr>
<td width="50%" valign="top">

- Streaming responses (token-by-token output)
- System prompt configuration
- Export and import of chat history (JSON / Markdown)
- Additional provider integrations — e.g. Groq, Together, Cohere

</td>
<td width="50%" valign="top">

- Response caching and offline support
- Syntax highlighting for code blocks
- Multi-language interface

</td>
</tr>
</table>

---

## Contributing

> Contributions are welcome. Areas for improvement include:

- Support for additional AI providers
- Enhanced markdown rendering with syntax highlighting
- Improved accessibility and internationalisation
- Performance optimisations
- Documentation improvements

Please fork the repository and submit a pull request with a clear description of your changes.

---

## Development Setup

> The application consists of three files.

```text
├── index.html   — markup & SVG icon sprite
├── style.css    — all styles, themes, and responsive rules
└── script.js    — provider logic, chat state, and UI wiring
```

To develop

1. Edit the files directly
2. Test by opening index.html in a browser
3. No build tools or compilation steps are required

Local hosting

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
Logic Vanilla JavaScript — no frameworks, no dependencies
Styling CSS custom properties — full theming with dark / light tokens
Icons Inline SVG sprite — all icons are stroke-based SVGs (Lucide-style)
Storage LocalStorage — for settings, API keys, and chat history
Typography Google Fonts — Inter, Outfit, JetBrains Mono

---

License

RAIA is released under the MIT License. See the LICENSE file for full details.

---

Author and Support

<div align="center">

Developed and maintained by Haiere and HajirStudio

<br />

Channel Purpose
Bug reports & feature requests Please use the project issue tracker
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
Last updated: 2026 · RAIA v1.1.1
</sub>
</div> 
