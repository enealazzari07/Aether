# KI: Live-Daten, OneNote (optional) und Datenschutz

## Aktueller Stand (Repo)
- KI-Requests laufen im **Main Process** via IPC (`ai-chat`). Der Renderer kennt keinen API-Key.
- Web-Recherche (`Recherchiere: ...`) nutzt eine **Live-Quelle** (DuckDuckGo Instant Answer API) im Main Process.

## Konfiguration (ohne Speicherung im Browser)

### Groq API (Chat / Vision)
- Setze den Key als Umgebungsvariable vor dem Start:
  - PowerShell: `$env:GROQ_API_KEY="..." ; npm start`
  - Der Key wird **nicht** in `localStorage`, Dateien oder `index.html/script.js` gespeichert.

### Live-Recherche
- Standard: DuckDuckGo Instant Answer API (kein Key).
- Hinweis: Das ist kein vollwertiger SERP-Crawler. Fuer "richtige" Websuche braucht man typischerweise einen Provider mit API-Key.

## OneNote-Integration (optional, empfohlen ueber Microsoft Graph)

### Ziel
Im Workspace `Schule` kann die KI (auf Wunsch) OneNote-Inhalte als Kontext nutzen, z.B.:
- Notizsuche (Titel/Text)
- Seiten-Inhalt (Snippet)
- Notebook-/Abschnitts-Listen

### Datenschutz/Threat-Model (wichtig)
- **Passwoerter nie speichern**: Keine Passwort-Eingabe im App-UI speichern oder loggen.
- **OAuth statt Passwort**: Verbindung zu Microsoft ausschliesslich ueber OAuth (Microsoft Graph).
- **Token-Handling**:
  - Default: Access Token nur **im RAM** halten (Session-only). App-Neustart = erneuter Login.
  - Optional (nur wenn User explizit will): Refresh Token in OS Keychain (Windows Credential Manager) speichern, nicht in `localStorage`.
- **Least privilege**: Nur minimal notwendige Scopes anfordern (z.B. OneNote Read-only).
- **No exfiltration by default**: Inhalte aus OneNote nur als Kontext an die KI schicken, wenn der User das Feature aktiv einschaltet (und am besten pro Anfrage bestaetigt).

### Implementations-Skizze
1. Main Process startet OAuth Flow (Device Code oder PKCE) und erhaelt `access_token`.
2. Token wird im Main Process in-memory gehalten (z.B. `tokenStore` Map nach Workspace/User).
3. Renderer fragt via IPC nach OneNote-Snippets:
   - `onenote:search(query)` -> liefert kurze Treffer (Titel, URL, Snippet)
   - `onenote:getPage(pageId)` -> optional, stark begrenzen/trunkieren
4. KI-Request bekommt zusaetzlichen Kontext nur, wenn:
   - aktiver Workspace = `Schule`
   - Connector aktiv
   - User-Opt-in (Toggle + evtl. per Prompt bestaetigt)

