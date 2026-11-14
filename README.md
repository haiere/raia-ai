<div align="center">

<img src="https://i.postimg.cc/28bKx4xC/raia2.webp" alt="Raia AI logo" width="240" />

# RAIA: Reflecting Tomorrow

<a href="https://hajir.is-a.dev/raia-ai/">
  <img src="https://readme-typing-svg.demolab.com?font=DM+Sans&weight=600&size=22&pause=1000&color=3B82F6&center=true&vCenter=true&width=600&lines=A+multi-provider+AI+chat+client;Bring+your+own+API+key;Running+entirely+in+your+browser;Built-in+Gemini,+no+tracking,+no+telemetry" alt="Typing SVG" />
</a>

<br />

<a href="https://hajir.is-a.dev/raia-ai/">
  <img src="https://img.shields.io/badge/Live_Demo-hajir.is--a.dev%2Fraia--ai-3B82F6?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
</a>
<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Support_the_Project-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee" />
</a>

<br />

<img src="https://img.shields.io/badge/Version-v1.2.3-3B82F6?style=flat-square" alt="Version v1.2.3" />
<img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="MIT License" />
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />

<br />

<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
<img src="https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="Vanilla JavaScript" />
<img src="https://img.shields.io/badge/GSAP-3.12.5-88CE02?style=flat-square&logo=greensock&logoColor=white" alt="GSAP 3.12.5" />
<img src="https://img.shields.io/badge/No_Build_Step-4B0082?style=flat-square" alt="No build step" />

<br />

<img src="https://img.shields.io/badge/Privacy-No_Tracking-success?style=flat-square" alt="No tracking" />
<img src="https://img.shields.io/badge/Storage-Local_Browser-7FD8CB?style=flat-square" alt="Local storage" />
<img src="https://img.shields.io/badge/i18n-ID_%26_EN-9B59B6?style=flat-square" alt="Bahasa Indonesia and English" />
<img src="https://img.shields.io/badge/Math-KaTeX-008080?style=flat-square" alt="KaTeX math rendering" />

</div>

---

## Table of Contents

- [Overview](#overview)
- [What's New in v1.2.3](#whats-new-in-v123)
- [What's New in v1.2.2](#whats-new-in-v122)
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

RAIA is a client-side AI chat interface that connects to several large language model providers from one place.

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

- One chat experience for several providers
- Local chat history
- Model selection, or any custom model ID
- Adjustable temperature and answer length
- Markdown and LaTeX math rendering
- Interface in Bahasa Indonesia and English
- Dark and light themes
- Layout for phones and desktops

</td>
</tr>
</table>

> [!IMPORTANT]
> With your own API key, requests go **directly from your browser** to the provider. The optional built-in Gemini option sends its requests through a small proxy on Cloudflare Workers, which holds the Google API key on the server. The proxy does not store conversations. Your own API keys stay on your device.

---

## What's New in v1.2.3

This release adds a built-in Gemini option, updates the logo, and tidies the mobile layout.

| Change | Details |
|---|---|
| **Built-in Gemini** | Gemini 2.5 Flash-Lite is the default provider. It works without your own key through a small proxy, with a free daily quota per IP address. |
| **Logo** | The header shows the RAIA wordmark. |
| **Mobile keyboard hint** | The "Enter to send, Shift+Enter for a new line" hint is hidden on phones. It still shows on desktop. |
| **Version display** | The version badge was removed from the header. |

---

## What's New in v1.2.2

This release fixes the header layout on phones, moves settings to its own page, and adds motion.

| Change | Details |
|---|---|
| **Send button** | The send button is a round button beside a pill-shaped message field. It never uses the native `disabled` attribute, so it always responds. An empty message shows a short notice. While a reply is loading, the same button stops the response. |
| **Routes** | The app uses hash routes: `#/chat` for conversations and `#/setting` for settings. Hash routes work on any static host. |
| **Settings page** | Settings moved from a collapsible panel to the `#/setting` page, with separate cards for provider, API key, and generation parameters. |
| **Missing API key** | A friendly notice in the chat explains what to do and links to the settings page. The typed message is kept. |
| **Code and math** | Fenced code blocks show their language and a copy button. Inline and display math render with KaTeX, so formulas such as `$^{235}\text{U}$` no longer appear as raw text. |
| **Motion (GSAP)** | Entrance animations for the welcome screen, new messages, the settings page, the history list, and notices. Only `transform` and `opacity` are animated. Motion is skipped when reduced motion is requested. |
| **Mobile header** | On phones the brand shrinks to fit, and the header keeps 44 px touch targets. The Chat link is reached through the logo, and support moved to the settings page. |
| **Stop and retry** | A running reply can be stopped. Failed replies show a retry button. |
| **History** | Up to 30 chats are kept. Each chat can be opened or deleted, and all history can be cleared with confirmation. |

<details>
<summary><strong>Previous releases (v1.2.1, v1.2.0, v1.1.1)</strong></summary>

<br />

### v1.2.1

| Change | Details |
|---|---|
| **Send button fix** | The send button used a `data-disabled` attribute so it always received clicks. Empty input showed a friendly toast. |
| **Double-submit prevention** | A per-request ID and a loading flag stopped duplicate submissions. |
| **Full Markdown rendering** | Migrated to `marked.js` with GitHub-Flavored Markdown. |
| **LaTeX math via KaTeX** | Inline and block math rendering. |
| **XSS sanitization** | Assistant output is sanitized with DOMPurify. |
| **Code block copy buttons** | Every fenced code block gets a copy button. |
| **Retry button for errors** | Failed requests can be retried. |
| **Responsive layout** | Layout uses `100dvh` with internal scroll. |
| **Mobile keyboard fix** | `interactive-widget=resizes-content` keeps the input visible when the keyboard opens. |

### v1.2.0

- Bilingual interface (Bahasa Indonesia and English) through `i18n.js`.
- Built-in system prompt for the assistant.
- Two-minute request timeout.
- Online and offline status with localized notices.
- Confirmation before deleting a chat.

### v1.1.1

- Support link in the header.
- Open Graph, Twitter Card, and JSON-LD metadata.
- Version badge and feature pills.
- Accessibility labels and focus states.

</details>

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### Providers and Models

- **Multi-provider support:** OpenRouter, OpenAI, Perplexity, Claude, Gemini, and Mistral.
- **Model selection:** provider-specific model lists, or a custom model ID.
- **Generation parameters:** temperature (0.0 to 2.0) and maximum answer length (256 to 8192 tokens).
- **Connection test:** checks the key and model with a short request.

</td>
<td width="50%" valign="top">

### Chat Experience

- **Local chat history:** up to 30 saved chats in `localStorage`.
- **Markdown rendering:** headings, lists, tables, blockquotes, inline code, and code blocks with copy buttons.
- **LaTeX math rendering:** inline and display formulas via KaTeX.
- **Copy and retry:** each assistant reply can be copied. The last reply can be retried.
- **Stop generation:** a running reply can be stopped at any time.
- **Suggestion chips:** quick-start prompts for common tasks.

</td>
</tr>
<tr>
<td colspan="2" valign="top">

### Interface and Privacy

- **Bilingual UI:** switch between Bahasa Indonesia and English. The choice is remembered.
- **Dark and light theme:** toggled from the header. Dark is the default.
- **Motion:** GSAP animations for key moments, disabled when reduced motion is requested.
- **Online and offline status:** notices reflect the browser's network state.
- **Keyboard shortcuts:** send, new line, focus, new chat, and history.
- **No tracking, no telemetry:** the application does not collect usage data.
- **Optional support link:** a Buy Me a Coffee link in the header and on the settings page.

</td>
</tr>
</table>

---

## Requirements

| Requirement | Details |
|---|---|
| **Browser** | A modern browser with JavaScript enabled, such as Chrome, Firefox, Edge, or Safari. |
| **API key** | An API key for any supported provider. Gemini also works without one, within the free daily quota. |
| **Installation** | No installation. The app is a static page made of four files. The optional built-in Gemini option also needs the proxy in `proxy/`. |

---

## Installation

RAIA is a static web app with no build step.

### Use the hosted version

**[hajir.is-a.dev/raia-ai](https://hajir.is-a.dev/raia-ai/)**

### Run locally

Download the source files into one folder and open `index.html` in your browser. An internet connection is needed for the vendor libraries (marked.js, DOMPurify, KaTeX, GSAP, and Google Fonts), which load from CDN. The built-in Gemini option only works from an origin listed in the proxy's `ALLOWED_ORIGINS`. For local tests, add `http://localhost:8080` there or use your own key.

### Self-host

Place the files on any static web server. Styles, icons, and application logic are included in the project. The vendor libraries load from jsDelivr and Google Fonts.

---

## Usage

| Step | Action |
|:-:|---|
| 1 | **Open settings.** Select **Pengaturan** (Settings) in the header, or go to `#/setting`. |
| 2 | **Pick a language.** Bahasa Indonesia or English. The app detects the browser language on the first visit. |
| 3 | **Select a provider.** OpenRouter, OpenAI, Perplexity, Claude, Gemini, or Mistral. |
| 4 | **Enter your API key.** Paste it into the API key field. Choose whether to remember it in this browser. |
| 5 | **Select a model.** Choose from the list, or type a custom model ID. |
| 6 | **Save and test.** Select **Simpan** (Save). The status shows **Terhubung** (Connected). Select **Tes koneksi** (Test connection) to check the setup. |
| 7 | **Start chatting.** Go to `#/chat`, type a message, and press `Enter`. |
| 8 | **Open history.** Select the history icon or press `Ctrl+H` to open, load, or delete a chat. |

If no API key is saved for a provider other than Gemini, the chat page shows a notice with a link to settings. The typed message stays in the box. With Gemini selected, you can chat without a key until the free daily quota runs out.

### Routes

| Route | Page |
|---|---|
| `#/chat` | Conversations. This is the default page. |
| `#/setting` | Language, provider, model, API key, and generation settings. |

### Built-in Gemini (Free Quota)

Gemini (Google) is the default provider. It uses the app owner's Gemini API key through the proxy, so you can try it without your own key. Each IP address gets a limited number of requests per day. When the limit is reached, the chat asks you to add your own key in settings. The other providers always require your own key.

### Supported Providers and Example Models

| Provider | Models (examples) |
|---|---|
| OpenRouter | `anthropic/claude-sonnet-5`, `openai/gpt-5.6`, `google/gemini-3.5-flash`, `meta-llama/llama-4-maverick`, `mistralai/mistral-large-3`, `deepseek/deepseek-v4` |
| OpenAI | `gpt-5.6`, `gpt-5.6-terra`, `gpt-5.6-luna`, `gpt-4o`, `gpt-4o-mini` |
| Perplexity | `sonar`, `sonar-pro`, `sonar-reasoning-pro`, `sonar-deep-research` |
| Claude (Anthropic) | `claude-sonnet-5`, `claude-opus-4-8`, `claude-haiku-4-5-20251001`, `claude-fable-5` |
| Gemini (Google) | `gemini-2.5-flash-lite` (built-in default), `gemini-3.5-flash`, `gemini-3.1-pro-preview`, `gemini-3.1-flash-lite`, `gemini-2.5-flash` |
| Mistral | `mistral-large-latest`, `mistral-small-latest`, `magistral-medium-latest`, `codestral-latest` |

> [!TIP]
> Custom model IDs are supported. Type the ID into the model field.

---

## Configuration

### Settings Page (`#/setting`)

| Setting | Description |
|---|---|
| **Language** | Bahasa Indonesia or English. |
| **Provider** | The AI provider to use. |
| **Model** | A text field with suggestions for the selected provider. |
| **API key** | Password field with a show and hide toggle, and an option to remember the key. |
| **Custom base URL** | Overrides the default endpoint. Found under Advanced. |
| **CORS proxy URL** | Used for providers that block direct browser requests: OpenAI, Perplexity, and Mistral. Found under Advanced. |
| **Creativity (temperature)** | Slider from `0.0` to `2.0`, step `0.1`. Default `0.7`. Claude accepts up to `1.0`, and Mistral up to `1.5`. |
| **Maximum answer length** | Slider from `256` to `8192`, step `128`. Default `1024`. |
| **Reset all** | Restores the default settings and removes the saved API key. Chat history is kept. |

### Advanced Options

<table>
<tr>
<td width="50%" valign="top">

**Custom base URL**

Enter a custom endpoint for a gateway, a self-hosted model, or a local service.

</td>
<td width="50%" valign="top">

**CORS proxy URL**

Enter a proxy for providers that block direct browser calls. The proxy receives the request and the target address in the `X-Target-Url` header.

</td>
</tr>
</table>

> [!IMPORTANT]
> **Why a proxy?** Browsers enforce the same-origin policy through CORS. OpenRouter, Claude, and Gemini accept direct browser requests. OpenAI, Perplexity, and Mistral do not. A small proxy, such as a Cloudflare Worker, can relay those requests.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` | Send the message |
| `Shift + Enter` | New line in the message |
| `Ctrl + K` | Focus the message field and open chat |
| `Ctrl + N` | Start a new chat |
| `Ctrl + H` | Open the history drawer |
| `Escape` | Close the history drawer |

On a Mac, use `Cmd` in place of `Ctrl`.

---

## Privacy and Security

RAIA keeps your data on your device, except for the built-in Gemini option described below.

- The API key is stored in `localStorage` when you choose to remember it. Otherwise it is kept in `sessionStorage` and cleared when the browser session ends.
- Chat history is stored in `localStorage` and is never sent to a third party.
- No analytics, tracking, or telemetry is collected.
- The app uses no cookies and no external services besides the provider APIs, the optional proxy, and the vendor libraries from CDN.
- Requests go **directly from your browser** to the provider you select, when you use your own key.
- The built-in Gemini option sends requests through the proxy. The proxy checks each request, adds the Google API key on the server, and forwards it. It stores only a daily request counter per IP address. It does not store chats.
- Assistant output is sanitized with DOMPurify before it is added to the page. Links in replies open in a new tab with `noopener noreferrer`.

---

## Accessibility

| Area | Implementation |
|---|---|
| **Labels** | Interactive controls have descriptive labels, translated with the active language. |
| **Keyboard** | Focus outlines are visible on all controls. `Escape` closes the history drawer. |
| **Motion** | GSAP animations and CSS transitions are skipped when `prefers-reduced-motion` is set. |
| **Contrast** | Text and controls use the dark and light theme tokens. Higher contrast is applied when `prefers-contrast: more` is set. |
| **Live regions** | The message list uses `role="log"` and `aria-live="polite"`. Notices use `role="status"`. |
| **Screen readers** | The typing indicator includes a text label. Visually hidden labels are used where a visible label is not needed. |
| **Landmarks** | `header`, `main`, and `aside` elements, with a skip link to the content. |

---

## Troubleshooting

| Problem | Solution |
|---|---|
| **Send button looks dimmed** | The button is dimmed while the message field is empty. It still responds. Select it to see a notice. |
| **Notice says no API key** | Open settings, enter your key, and select **Simpan** (Save). |
| **Connection fails** | Check the API key and confirm the model is available for your account. |
| **CORS error (OpenAI, Perplexity, Mistral)** | Set a **CORS proxy URL** under Advanced settings, or use OpenRouter. |
| **Model not found** | Check the model ID spelling and that the provider supports it. |
| **Rate limit error (429)** | You have reached the provider's limit. Wait and try again. |
| **Invalid key (401 or 403)** | Check the key for extra spaces, and confirm it can access the selected model. |
| **Request takes too long** | Requests stop after two minutes. Check the connection or proxy, then try again. |
| **Math does not render** | Check that `cdn.jsdelivr.net` is reachable. If KaTeX cannot load, the formula appears as plain text. |
| **Animations are missing** | GSAP loads from jsDelivr. If it is blocked, the page still works without motion. |
| **History is not saved** | Check that the browser allows `localStorage`, and that you are not in private mode. |
| **Language resets** | Private mode can block `localStorage`. In normal mode, the language is remembered. |
| **Free Gemini quota reached** | The built-in daily limit is used up. Add your own Gemini key in settings, or try again tomorrow. |
| **CORS error with built-in Gemini** | The site's origin is missing from the proxy's `ALLOWED_ORIGINS`. Add it in `proxy/worker.js`, then deploy the Worker again. |

---

## Roadmap

Possible future improvements:

<table>
<tr>
<td width="50%" valign="top">

- Streaming responses, token by token
- A user-editable system prompt
- Export and import of chat history (JSON, Markdown)
- Syntax highlighting for code blocks

</td>
<td width="50%" valign="top">

- More provider integrations
- Response caching and offline support
- More interface languages
- A virtualized message list for very long chats

</td>
</tr>
</table>

---

## Contributing

Contributions are welcome. Useful areas include:

- Support for more AI providers.
- Syntax highlighting in code blocks.
- New translations in `i18n.js`.
- Performance and accessibility improvements.
- Documentation.

Fork the repository and open a pull request with a clear description of the change.

---

## Development Setup

The application has four source files, plus an optional proxy Worker.

```text
.
├── index.html   Markup, SVG icon sprite, routes, and vendor script tags
├── style.css    Design tokens, layout, themes, and responsive rules
├── i18n.js      Translations for Bahasa Indonesia (id) and English (en)
├── script.js    Routing, providers, chat state, and the Markdown and KaTeX pipeline
├── README.md
└── proxy/
    └── worker.js  Optional Cloudflare Worker for built-in Gemini
```

### Local development

1. Edit the files directly.
2. Open `index.html` in a browser to test.
3. No build tools are needed.

> [!WARNING]
> **Load order matters.** `marked`, `DOMPurify`, and `katex` must load before `script.js`. `gsap` must also load before `script.js`. `i18n.js` must load before `script.js`. `index.html` already includes the scripts in this order.

### Local hosting

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

Then open `http://localhost:8080` in your browser.

---

## Tech Stack

| Layer | Used |
|---|---|
| Logic | Vanilla JavaScript, no framework |
| Routing | Hash routes (`#/chat`, `#/setting`) |
| Styling | CSS custom properties with dark and light theme tokens |
| Icons | Inline SVG sprite with stroke icons |
| Motion | GSAP 3.12.5 from jsDelivr |
| Markdown | marked 12.0.0 from jsDelivr |
| Sanitization | DOMPurify 3.0.8 from jsDelivr |
| Math | KaTeX 0.16.9 from jsDelivr |
| i18n | `i18n.js`, with no dependencies (id and en) |
| Storage | `localStorage` for settings, language, theme, API key, and history. `sessionStorage` when the key is not remembered. |
| Backend (optional) | Cloudflare Worker with KV for the daily quota. The Gemini key is stored as a secret. |
| Typography | Google Fonts: Syne (headings), DM Sans (body), JetBrains Mono (code) |

---

## Deployment

RAIA has two parts, and they are deployed to different places.

| Part | Files | Where |
|---|---|---|
| Frontend | `index.html`, `style.css`, `i18n.js`, `script.js`, and this README | Any static host, such as GitHub Pages |
| Gemini proxy (optional) | `proxy/worker.js` | Cloudflare Workers, not GitHub Pages |

GitHub Pages only serves static files, so it cannot run `worker.js` or keep an API key. Deploy the proxy with Wrangler, add `GEMINI_API_KEY` as a secret, and bind a KV namespace named `RAIA_QUOTA`. Set the Worker URL in `BUILTIN_PROXY_URL` in `script.js`, and add the site's origin to `ALLOWED_ORIGINS` in the Worker.

---

## Changelog

### v1.2.3 (November 14, 2026)

- Added built-in Gemini 2.5 Flash-Lite through a Cloudflare Worker proxy, with a free daily quota per IP address.
- Made Gemini the default provider.
- Replaced the header logo with the RAIA wordmark.
- Hid the keyboard hint on phones.
- Removed the version badge from the header.

### v1.2.2 (November 13, 2026)

- Fixed the mobile header, where the brand and navigation overlapped.
- Added hash routes `#/chat` and `#/setting`.
- Moved settings to their own page.
- Redesigned the message field as a pill with a separate round send button.
- Fixed the send button so it always responds.
- Added a friendly notice with a link to settings when no API key is saved.
- Added KaTeX rendering for inline and display math, and copyable code blocks.
- Added GSAP animations, skipped when reduced motion is requested.
- Replaced the built-in system prompt with a neutral assistant prompt.
- Reduced history to 30 saved chats, with per-chat delete and a clear-all action.

### v1.2.1

- Fixed the send button interaction.
- Prevented double submission.
- Added full Markdown rendering through marked.js with GFM support.
- Added LaTeX math rendering through KaTeX.
- Added XSS sanitization through DOMPurify.
- Added copy buttons to code blocks.
- Added a retry button to error messages.
- Added a clear-chat action with confirmation.
- Redesigned the layout with `100dvh` and internal scrolling.
- Fixed the mobile keyboard overlay with `interactive-widget=resizes-content`.
- Improved accessibility with `role="log"` and localized labels.
- Moved the production domain to `hajir.is-a.dev/raia-ai`.

### v1.2.0

- Added internationalization (Bahasa Indonesia and English).
- Added a built-in system prompt.
- Added a two-minute request timeout.
- Added online and offline awareness.
- Added confirmation for destructive history actions.

### v1.1.1

- Added the support button in the header.
- Added Open Graph, Twitter Card, and JSON-LD metadata.
- Added the version badge.
- Added feature pills.
- Improved accessibility across interactive elements.
- Improved responsive breakpoints.

---

## License

RAIA is released under the MIT License. See the `LICENSE` file for details.

---

## Author and Support

<div align="center">

Developed and maintained by Haiere and HajirStudio.

<br />

| Channel | Purpose |
|---|---|
| Bug reports and feature requests | Use the project issue tracker |
| Questions | Contact through the repository |
| Support the project | Buy me a coffee |

<br />

<a href="https://buymeacoffee.com/hajirstudio">
  <img src="https://img.shields.io/badge/Buy_Me_a_Coffee-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee" />
</a>

<br />
<br />

<sub>Your support helps keep RAIA free, ad-free, and focused on privacy.</sub>

</div>

---

<div align="center">
<sub>
Last updated: November 14, 2026 · RAIA v1.2.3
</sub>
</div>
