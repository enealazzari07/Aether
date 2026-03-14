# Vertikales Workspace-Sidebar-System (Electron-Browser) – Technisches Konzept

## Zielbild
- Links eine vertikale Workspace-Leiste: `Schule`, `Freizeit`, `Programmieren`, `Fokus` (Icons).
- Jeder Workspace ist eine *harte* Session-Grenze: Cookies, Cache, LocalStorage/IndexedDB, ServiceWorker, Login-Status und Tab-Historie sind getrennt.
- `Fokus` ist zeitlich begrenzt (max. 180 Minuten). Danach: Workspace wird gesperrt und/oder automatisch zu `Freizeit` gewechselt.
- Smart Tab Management: Tabs in inaktiven Workspaces, die > 20 Minuten nicht fokussiert wurden, werden „schlafen gelegt“ (Content-Prozess weg, Tab bleibt sichtbar und schnell reloadbar).
- Auto-Reset: Beim Schließen eines Workspaces oder Timer-Ablauf gehen „nicht gespeicherte“ Tabs in eine „Spaeter lesen“-Liste.

## Stack-Annahme (pragmatisch)
- Electron (Main Process) steuert Tabs/Views und ist die „Source of Truth“ fuer Sessions und Ressourcen.
- Renderer (UI) zeigt Sidebar, Tab-Leiste, Dashboard, Reading List; kommuniziert via IPC.
- Tabs laufen als `BrowserView` (empfohlen) oder alternativ als `webview` (wenn bereits vorhanden).

## Kernideen

### 1) Harte Session-Trennung pro Workspace
Electron unterstuetzt isolierte Storage-Kontexte ueber `session`/`partition`.

**BrowserView-Variante (empfohlen):**
- Pro Workspace eine persistente Partition: `persist:aether-ws-<workspaceId>`.
- Jeden Tab als `BrowserView` mit `webPreferences.partition = partitionId` erstellen.
- Ergebnis: Cookies/LocalStorage/Cache sind physisch getrennt.

**webview-Variante (renderer):**
- Beim Erzeugen jedes `<webview>` das Attribut `partition="persist:aether-ws-<workspaceId>"` setzen.

**Tab-Historie:**
- Browser-Historie (Back/Forward) ist an `webContents` gebunden.
- Zusaetzlich eine app-seitige Historie pro Workspace pflegen (z.B. `did-navigate`/`did-navigate-in-page` Events), damit Sleep/Restore nicht „alles vergisst“.

### 2) Fokus-Timer als State Machine (Main enforced, Renderer zeigt nur an)
Warum Main Process?
- Renderer kann einfrieren / manipuliert werden.
- Timer muss robust laufen, auch wenn UI kurz nicht tickt.

State:
- `focus.startedAtMs`, `focus.deadlineAtMs` (startedAt + 180min).
- `focus.status`: `inactive | active | locked`.
- On `deadline`:
  - Auto-Switch `activeWorkspaceId = freizeit`.
  - `fokus` wird `locked` fuer eine Pause (z.B. 15min) oder bis manueller Reset.
  - Auto-Reset fuer Fokus-Workspace (Tabs -> Reading List, dann schließen/sleepen).

### 3) Sleeping Tabs (reclaimMemory)
Heuristik:
- Nur in inaktiven Workspaces.
- Nur Tabs, die `now - lastFocusedAtMs > 20min`.
- Nie: angepinnte Tabs, aktive Downloads, Medienwiedergabe, Formulareingaben (optional Guards).

Mechanik:
- `sleepTab(tabId)`:
  - Metadaten behalten: `url`, `title`, `favicon`, optional `navStack`.
  - Content vernichten:
    - BrowserView: `view.webContents.destroy()` und View aus Window entfernen.
    - webview: Element entfernen (Guest wird entsorgt); Metadaten im Store halten.
  - Tab bleibt in der Leiste als `sleeping=true`; Klick laedt URL neu (same partition).

### 4) Auto-Reset -> Reading List statt Tab-Muell
Definition „nicht gespeichert“:
- `saved=false` (Default), `pinned=false` (Default).
- Wenn Workspace geschlossen wird oder Fokus-Timer ablaeuft:
  - Alle Tabs mit `saved=false && pinned=false` -> `readingList`.
  - Tabs schließen (und ggf. deren Views zerstören).
  - Gespeicherte/pinned Tabs optional behalten oder nur sleepen (Policy).

### 5) Workspace-Dashboards (praktisch)
Beim Aktivieren eines Workspaces:
- Wenn keine Tabs offen: oeffne eine interne Seite `aether://dashboard/<workspaceId>` (Renderer-Route) oder ein „Dashboard-Tab“.
Inhalt:
- Workspace-spezifische Lesezeichen, Aufgaben, zuletzt offen, Reading List Filter.

### 6) Visuelles Feedback fuer Fokus
UI: Akzentfarbe interpolieren nach Timer-Fortschritt.
- `t = clamp(1 - remainingMs/totalMs, 0..1)`
- Farbe: Blau -> Rot (linear oder in HSL).
- Anwendung: CSS Variable `--accent` oder gezielt nur Fokus-UI.

### 7) Kontext-Switching („In Workspace verschieben“)
Weil Sessions hart getrennt sind, kann man `webContents` nicht einfach umhaengen.
Stattdessen:
- `moveTab(tabId, targetWorkspaceId)` = „dupliziere URL + Metadaten im Ziel-Workspace“, schließe Original.
- Optional: Vorher in Reading List ablegen (Audit-Trail).

## IPC-Schnittstellen (Vorschlag)
- `workspace:list` -> Workspaces + Status
- `workspace:activate(workspaceId)`
- `workspace:close(workspaceId)` -> Auto-Reset
- `workspace:focusStatus` -> remainingMs, status, lockedUntilMs
- `tab:create({workspaceId, url})`
- `tab:move({tabId, targetWorkspaceId})`
- `tab:sleep({tabId})` / `tab:wake({tabId})`
- `memory:reclaim({nowMs})` -> sleeps
- `readingList:add(items[])` / `readingList:list({workspaceId?})`

