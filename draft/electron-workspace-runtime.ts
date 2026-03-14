// Draft: Main-Process Runtime fuer Workspace Sessions + Sleeping Tabs (BrowserView).
// Ziel: harte Session-Trennung via `partition`, Memory reclaim via `webContents.destroy()`.

import { BrowserView, BrowserWindow, session } from 'electron';
import type { WorkspaceId } from './workspaces';

export interface RuntimeTab {
  tabId: string;
  workspaceId: WorkspaceId;
  partition: string; // e.g. "persist:aether-ws-schule"
  view?: BrowserView; // wenn sleeping: undefined
  url: string;
  title?: string;
  faviconUrl?: string;
  lastFocusedAtMs: number;
}

export class WorkspaceRuntime {
  private win: BrowserWindow;
  private activeWorkspaceId: WorkspaceId = 'freizeit';
  private tabs = new Map<string, RuntimeTab>();

  constructor(win: BrowserWindow) {
    this.win = win;
  }

  setActiveWorkspace(workspaceId: WorkspaceId) {
    this.activeWorkspaceId = workspaceId;
    this.relayout();
  }

  createTab(tabId: string, workspaceId: WorkspaceId, url: string, partitionKey: string) {
    const partition = `persist:${partitionKey}`;
    // Optional: Session vorab erstellen (Cookies/Storage isolated)
    session.fromPartition(partition);

    const view = new BrowserView({
      webPreferences: {
        partition,
        // In echten Browsern: `sandbox: true`, `contextIsolation: true`, eigenes preload usw.
        sandbox: true,
      },
    });

    view.webContents.loadURL(url);

    const tab: RuntimeTab = {
      tabId,
      workspaceId,
      partition,
      view,
      url,
      lastFocusedAtMs: Date.now(),
    };

    view.webContents.on('page-title-updated', (_e, title) => {
      const t = this.tabs.get(tabId);
      if (t) t.title = title;
    });
    view.webContents.on('page-favicon-updated', (_e, favicons) => {
      const t = this.tabs.get(tabId);
      if (t) t.faviconUrl = favicons?.[0];
    });
    view.webContents.on('did-navigate', (_e, nextUrl) => {
      const t = this.tabs.get(tabId);
      if (t) t.url = nextUrl;
    });

    this.tabs.set(tabId, tab);
    this.relayout();
  }

  focusTab(tabId: string) {
    const tab = this.tabs.get(tabId);
    if (!tab) return;
    tab.lastFocusedAtMs = Date.now();
    this.relayout(tabId);
  }

  sleepTab(tabId: string) {
    const tab = this.tabs.get(tabId);
    if (!tab || !tab.view) return;
    const view = tab.view;

    try {
      this.win.removeBrowserView(view);
    } catch {
      // ignore
    }
    // Hard kill guest renderer; keeps metadata in `tab`.
    view.webContents.destroy();

    tab.view = undefined;
  }

  wakeTab(tabId: string) {
    const tab = this.tabs.get(tabId);
    if (!tab || tab.view) return;

    const view = new BrowserView({
      webPreferences: {
        partition: tab.partition,
        sandbox: true,
      },
    });
    tab.view = view;
    view.webContents.loadURL(tab.url);
    tab.lastFocusedAtMs = Date.now();
    this.relayout(tabId);
  }

  private relayout(focusedTabId?: string) {
    // Minimal-Draft: zeigt genau eine View (den zuletzt fokussierten Tab) im aktiven Workspace.
    // In echt: Tab-Leiste + Layout Engine.
    const bounds = this.win.getContentBounds();
    const contentBounds = { x: 0, y: 32, width: bounds.width, height: bounds.height - 32 };

    // Remove all views first (avoid stacking)
    for (const tab of this.tabs.values()) {
      if (tab.view) {
        try {
          this.win.removeBrowserView(tab.view);
        } catch {
          // ignore
        }
      }
    }

    const candidates = [...this.tabs.values()].filter((t) => t.workspaceId === this.activeWorkspaceId && t.view);
    const toShow =
      (focusedTabId && candidates.find((t) => t.tabId === focusedTabId)?.view) ??
      candidates[0]?.view ??
      undefined;

    if (!toShow) return;
    this.win.addBrowserView(toShow);
    toShow.setBounds(contentBounds);
    toShow.setAutoResize({ width: true, height: true });
  }
}

