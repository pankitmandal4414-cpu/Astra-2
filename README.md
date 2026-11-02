# ASTRA 2 — Personal AI Command Centre

A responsive, JARVIS-inspired front-end workspace for productivity, learning and responsible cybersecurity education.

## Included modules
- Overview dashboard with live local clock and activity log
- AI Assistant interface with local demo replies (no AI provider connected)
- Cyber Lab with a password-quality teaching aid, security checklist and fictional network simulation
- Device dashboard with clearly labelled sample entries
- Educational terminal with a small set of local demo commands
- Study Centre with a task checklist and 25-minute focus timer

## Deploy on GitHub Pages
1. Download and extract `ASTRA-2-Website.zip`.
2. Open your `Astra-2` repository on GitHub.
3. Choose **Add file → Upload files**.
4. Upload `index.html`, `style.css`, `app.js`, and this `README.md` from the extracted folder. (Upload the files themselves, not the ZIP.)
5. Commit the changes to the `main` branch.
6. Open **Settings → Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
8. Wait for GitHub Pages to publish the site. The Pages URL will appear in Settings → Pages.

## Important limitations
This is a static front-end starter. The assistant uses local demonstration replies; it is not connected to a live AI model. Device entries and network results are sample data only. The browser does not scan networks or access devices.

For a future live AI integration, use a backend service and keep API keys in server-side environment variables. Never put secret keys in `app.js`, `index.html`, or any public repository.

ASTRA 2 is intended for learning and managing devices you own or are explicitly authorized to manage. It does not provide covert access, surveillance or unauthorized scanning.
