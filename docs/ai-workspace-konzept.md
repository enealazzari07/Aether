# Konzept: Der KI-Native Workspace ("Aether Mind")

Dieses Dokument beschreibt die Transformation eines klassischen Workspaces in einen **KI-nativen Workspace**, in dem die KI (Aether AI) nicht nur ein passiver Chatbot ist, sondern als Co-Pilot direkten Zugriff auf den Browser-State (Tabs, DOM, Navigation) hat.

---

## 1. UI/UX Layout-Design

Um den Chat organisch zu integrieren, wechseln wir in diesem speziellen Workspace zu einem **3-Spalten-Layout** (Three-Pane-Layout), das den Content in den Mittelpunkt stellt, aber die KI allgegenwärtig macht.

### Visueller Aufbau
1. **Linke Spalte (Kompakt):** Vertikale Tab-Liste des aktuellen Workspaces. Tabs sind hier gestapelt statt horizontal, da KI-Recherchen oft viele Tabs gleichzeitig erfordern.
2. **Mitte (Main Stage):** Der eigentliche Browser-Inhalt (Webview). Dies ist die Drag-Quelle.
3. **Rechte Spalte (KI-Sidebar):** Der permanente Aether-Chat. 
   - **Drop-Zone:** Die gesamte Sidebar leuchtet subtil auf, sobald im Webview Text oder Bilder per Drag & Drop gezogen werden.
   - **Action-Bar:** Direkt über dem Chat-Eingabefeld schwebt ein Karussell mit kontextabhängigen "Smart Commands" (Action-Buttons).

### UX-Workflow (Drag & Drop)
- Der Nutzer markiert einen Text im mittleren Webview.
- Er zieht ihn nach rechts in die KI-Sidebar.
- Ein Drop-Menü erscheint mit Schnellaktionen: *"Erklären"*, *"Übersetzen"*, *"Zusammenfassen"* oder *"In Chat einfügen"*.

---

## 2. Praktische Funktionen & Benötigte APIs

Damit die KI mit dem Browser interagieren kann, muss der Main-Prozess (Electron) als Brücke zwischen der LLM-API (Groq/Local) und den Webviews fungieren.

### A. Tab-Kontext-Bewusstsein
**Funktion:** Die KI kann alle offenen Tabs analysieren ("Fasse alle Tabs zusammen", "Wo widersprechen sich diese Artikel?").
**Benötigte APIs:**
- `BrowserWindow.getAllViews()` oder Iteration über alle aktiven `<webview>`-Elemente.
- `webview.executeJavaScript('document.body.innerText')`: Um den Textinhalt aller Tabs des aktuellen Workspaces im Hintergrund zu extrahieren.
- **Technischer Flow:** 
  1. IPC-Call vom Renderer: `get-all-tabs-context`.
  2. Main-Process iteriert über alle WebContents der Partition.
  3. Texte werden gekürzt/gechunked (z.B. max 2000 Token pro Tab) und als gebündelter System-Prompt ("Tab 1 (URL): ... Tab 2 (URL): ...") an das LLM gesendet.

### B. Action-Buttons (Smart Commands)
**Funktion:** One-Click-Aktionen, die Scripts auf der Seite ausführen und die KI nutzen.
**Benötigte APIs & Flow:**
1. **'Extrahiere Termine' (Kalender-Events):**
   - DOM-Extraktion des sichtbaren Textes.
   - LLM-Prompt: *"Extrahiere alle Termine aus diesem Text und gib sie strikt als JSON-Array [{titel, start, ende, ort}] zurück."*
   - Node.js API: Generierung einer `.ics`-Datei (`fs.writeFileSync`) und Triggering eines Downloads.
2. **'Finde Impressum/Support-E-Mail':**
   - Heuristische Suche: Script Injection sucht nach `<a>`-Tags mit "Impressum", "Contact" oder "Support".
   - KI extrahiert die E-Mail-Adresse aus dem gefundenen DOM.
   - Lokale Browser-API: Öffnet einen neuen Tab mit dem internen Einweg-Mail-Generator (`aether://mail`).
3. **'Analysiere Abo-Kosten':**
   - Regex/LLM-Kombination durchsucht aktuelle Seite nach Preisen (z.B. "€9.99/Monat").
   - Lokale Storage-API (SQLite oder `localStorage` des Main Process): Gleicht den gefundenen Service mit der lokalen Abo-Manager-Datenbank ab und warnt bei Duplikaten.

### C. Cross-Tab-Automatisierung (Agentic AI)
**Funktion:** "Suche auf Tab A nach Produkt X und vergleiche mit Tab B."
**Benötigte APIs:**
Um der KI Autonomie zu geben, wird ein "Tool-Calling" (Function Calling) Ansatz benötigt. Das LLM bekommt eine Liste an ausführbaren Funktionen:
- `ai_tools.switchTab(tabId)`
- `ai_tools.searchOnPage(query)`
- `ai_tools.extractPrice(elementSelector)`
- `ai_tools.navigate(url)`
**Flow:** Die KI agiert als "Puppeteer" (Agent). Sie plant die Schritte: 
1. Gehe zu Tab A, lese Preis aus. 
2. Gehe zu Tab B, lese Preis aus. 
3. Generiere Antwort für den User.

---

## 3. Lokaler Datenschutz & Tracker-Radar

Da der Browser Tracker blockiert (Tracker-Radar), darf die App selbst nicht zur Datenschleuder werden, indem sie komplette Surfverläufe an Cloud-LLMs wie Groq/OpenAI sendet.

### Maßnahmen für den Datenschutz:

1. **Lokale KI (Local LLMs) für Sensible Daten:**
   - Die App sollte optional eine Schnittstelle zu lokalen Modellen bieten (z.B. via **Ollama** oder **LM Studio**). 
   - Aktionen wie "Abo-Kosten scannen" oder "Private Mails zusammenfassen" werden standardmäßig an `http://localhost:11434` gesendet. Es verlassen *null* Daten das Gerät.

2. **Daten-Minimierung & Anonymisierung (Cloud-Fallback):**
   - Wenn die Groq-API genutzt wird, schickt Aether niemals den ganzen HTML-Quelltext oder Cookies mit.
   - **PII-Stripping (Personal Identifiable Information):** Bevor der Text an die Cloud geht, entfernt ein lokales Regex-Script (oder kleines lokales NER-Modell) E-Mail-Adressen, IBANs, und Passwörter aus dem DOM-String.

3. **Vergänglicher KI-Kontext (Ephemeral Memory):**
   - Die KI-Historie in diesem Workspace wird nicht global gespeichert. Sobald der Tab oder Workspace geschlossen wird, wird der Vektor-Speicher im Main-Process gelöscht (RAM-only).
   - Das System-Prompt verbietet explizit das Tracking der Daten: *"You are an ephemeral assistant. Do not reference user identifiers."*

---

## Zusammenfassung der technischen Roadmap

Um dieses Konzept im bestehenden Code umzusetzen, wären folgende Architektur-Schritte nötig:

1. **Preload-Erweiterung (`webview-preload.js`):**
   - Funktion `getCleanText()` hinzufügen, die Boilerplate-Code (Navbars, Footer) ignoriert und nur Haupt-Content an den Main-Process schickt (`@mozilla/readability` ist hierfür ideal).
   - Drag & Drop Event-Listener implementieren, die selektierten Text via IPC an das Host-Fenster schicken.
2. **Main-Process (`main.js`):**
   - Neuen IPC-Handler `ai-agent-execute` bauen, der Tool-Calling für das LLM erlaubt.
   - Zugriff auf `win.webContents` vs. `<webview>`. (Bei Webviews muss der Main Process IPC-Nachrichten an das jeweilige Webview senden, um Scripts auszuführen).
3. **Renderer (`script.js` & `style.css`):**
   - Die Workspace-Grid-Ansicht für einen speziellen KI-Modus aufbrechen, bei dem die rechte Sidebar fest verankert und verbreitert wird.
   - Die Action-Buttons als Floating-UI-Elemente programmieren, die kontextsensitiv ein- und ausgeblendet werden (z.B. wenn eine URL `pricing` enthält, zeige den Button "Abo-Kosten analysieren").