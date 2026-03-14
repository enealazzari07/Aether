export type WorkspaceId = 'schule' | 'freizeit' | 'programmieren' | 'fokus';

export type WorkspaceStatus = 'open' | 'closing';
export type FocusStatus = 'inactive' | 'active' | 'locked';

export type TabLifecycle = 'live' | 'sleeping';

export interface TabNavState {
  currentUrl: string;
  title?: string;
  faviconUrl?: string;
  // Optional: app-seitige Historie fuer Sleep/Restore.
  history?: { url: string; title?: string; atMs: number }[];
}

export interface Tab {
  id: string;
  workspaceId: WorkspaceId;
  lifecycle: TabLifecycle;
  createdAtMs: number;
  lastFocusedAtMs: number;
  pinned: boolean;
  saved: boolean; // "gespeichert" im Sinne von: soll beim Reset bleiben
  nav: TabNavState;

  // Implementation detail: Main Process haelt die konkrete View/WebContents.
  viewRef?: { kind: 'browserView'; webContentsId: number } | { kind: 'webview'; elementId: string };
}

export interface FocusPolicy {
  maxMinutes: number; // default: 180
  breakMinutes: number; // default: 15 (wie lange Fokus gesperrt bleibt)
  onExpire: 'lock_and_switch' | 'switch_only' | 'lock_only';
  switchToWorkspaceId: WorkspaceId; // default: 'freizeit'
}

export interface FocusTimer {
  status: FocusStatus;
  startedAtMs?: number;
  deadlineAtMs?: number;
  lockedUntilMs?: number;
  policy: FocusPolicy;
}

export interface Workspace {
  id: WorkspaceId;
  label: string;
  icon: string; // UI: z.B. SVG path oder Icon-Name
  status: WorkspaceStatus;

  // Harte Session-Trennung in Electron:
  // BrowserView/webview: partition = `persist:${partitionKey}`
  partitionKey: string;

  // Dashboard route fuer leere Workspaces
  dashboardUrl: string; // z.B. "aether://dashboard/schule"

  // Tabs und Historie sind pro Workspace logisch getrennt.
  tabIds: string[];
  focus?: FocusTimer; // nur fuer 'fokus' gesetzt
}

export interface ReadingListItem {
  id: string;
  workspaceId: WorkspaceId; // Quelle
  url: string;
  title?: string;
  faviconUrl?: string;
  addedAtMs: number;
  reason: 'workspace_closed' | 'focus_expired' | 'manual';
}

export interface WorkspaceState {
  activeWorkspaceId: WorkspaceId;
  workspaces: Record<WorkspaceId, Workspace>;
  tabs: Record<string, Tab>;
  readingList: ReadingListItem[];
}

export const DEFAULT_FOCUS_POLICY: FocusPolicy = {
  maxMinutes: 180,
  breakMinutes: 15,
  onExpire: 'lock_and_switch',
  switchToWorkspaceId: 'freizeit',
};

export function createDefaultState(nowMs: number): WorkspaceState {
  const workspaces: Record<WorkspaceId, Workspace> = {
    schule: {
      id: 'schule',
      label: 'Schule',
      icon: 'graduation-cap',
      status: 'open',
      partitionKey: 'aether-ws-schule',
      dashboardUrl: 'aether://dashboard/schule',
      tabIds: [],
    },
    freizeit: {
      id: 'freizeit',
      label: 'Freizeit',
      icon: 'smile',
      status: 'open',
      partitionKey: 'aether-ws-freizeit',
      dashboardUrl: 'aether://dashboard/freizeit',
      tabIds: [],
    },
    programmieren: {
      id: 'programmieren',
      label: 'Programmieren',
      icon: 'code',
      status: 'open',
      partitionKey: 'aether-ws-programmieren',
      dashboardUrl: 'aether://dashboard/programmieren',
      tabIds: [],
    },
    fokus: {
      id: 'fokus',
      label: 'Fokus',
      icon: 'timer',
      status: 'open',
      partitionKey: 'aether-ws-fokus',
      dashboardUrl: 'aether://dashboard/fokus',
      tabIds: [],
      focus: {
        status: 'inactive',
        policy: DEFAULT_FOCUS_POLICY,
      },
    },
  };

  return {
    activeWorkspaceId: 'freizeit',
    workspaces,
    tabs: {},
    readingList: [],
  };
}

export interface FocusTickResult {
  next: WorkspaceState;
  events: Array<
    | { type: 'focus_expired'; atMs: number }
    | { type: 'focus_locked'; untilMs: number }
    | { type: 'workspace_switched'; to: WorkspaceId }
    | { type: 'workspace_reset'; workspaceId: WorkspaceId; movedToReadingList: number }
  >;
}

export function startFocusSession(state: WorkspaceState, nowMs: number): WorkspaceState {
  const fokus = state.workspaces.fokus;
  const focus = fokus.focus!;
  if (focus.status === 'locked' && focus.lockedUntilMs && nowMs < focus.lockedUntilMs) return state;
  const deadlineAtMs = nowMs + focus.policy.maxMinutes * 60_000;
  return {
    ...state,
    workspaces: {
      ...state.workspaces,
      fokus: {
        ...fokus,
        focus: { ...focus, status: 'active', startedAtMs: nowMs, deadlineAtMs, lockedUntilMs: undefined },
      },
    },
  };
}

export function tickFocusTimer(state: WorkspaceState, nowMs: number): FocusTickResult {
  const fokus = state.workspaces.fokus;
  const focus = fokus.focus!;
  const events: FocusTickResult['events'] = [];

  if (focus.status === 'locked' && focus.lockedUntilMs && nowMs >= focus.lockedUntilMs) {
    const next: WorkspaceState = {
      ...state,
      workspaces: {
        ...state.workspaces,
        fokus: { ...fokus, focus: { ...focus, status: 'inactive', lockedUntilMs: undefined } },
      },
    };
    return { next, events };
  }

  if (focus.status !== 'active' || !focus.deadlineAtMs) return { next: state, events };

  if (nowMs < focus.deadlineAtMs) return { next: state, events };

  events.push({ type: 'focus_expired', atMs: nowMs });

  let nextState = state;

  // Reset Fokus-Workspace: unsaved Tabs -> Reading List
  const resetRes = resetWorkspaceIntoReadingList(nextState, 'fokus', nowMs, 'focus_expired');
  nextState = resetRes.next;
  events.push({ type: 'workspace_reset', workspaceId: 'fokus', movedToReadingList: resetRes.moved });

  // Timer policy anwenden
  if (focus.policy.onExpire === 'lock_and_switch' || focus.policy.onExpire === 'lock_only') {
    const untilMs = nowMs + focus.policy.breakMinutes * 60_000;
    nextState = {
      ...nextState,
      workspaces: {
        ...nextState.workspaces,
        fokus: {
          ...nextState.workspaces.fokus,
          focus: { ...nextState.workspaces.fokus.focus!, status: 'locked', lockedUntilMs: untilMs },
        },
      },
    };
    events.push({ type: 'focus_locked', untilMs });
  } else {
    nextState = {
      ...nextState,
      workspaces: {
        ...nextState.workspaces,
        fokus: { ...nextState.workspaces.fokus, focus: { ...nextState.workspaces.fokus.focus!, status: 'inactive' } },
      },
    };
  }

  if (focus.policy.onExpire === 'lock_and_switch' || focus.policy.onExpire === 'switch_only') {
    nextState = { ...nextState, activeWorkspaceId: focus.policy.switchToWorkspaceId };
    events.push({ type: 'workspace_switched', to: focus.policy.switchToWorkspaceId });
  }

  return { next: nextState, events };
}

export interface ReclaimDecision {
  tabId: string;
  reason: 'inactive_workspace_idle';
  idleMinutes: number;
}

export function reclaimMemory(
  state: WorkspaceState,
  nowMs: number,
  opts?: {
    idleMinutes?: number; // default: 20
    skipPinned?: boolean; // default: true
    skipSaved?: boolean; // default: false
  }
): ReclaimDecision[] {
  const idleMinutes = opts?.idleMinutes ?? 20;
  const skipPinned = opts?.skipPinned ?? true;
  const skipSaved = opts?.skipSaved ?? false;

  const thresholdMs = idleMinutes * 60_000;
  const decisions: ReclaimDecision[] = [];

  for (const tab of Object.values(state.tabs)) {
    if (tab.lifecycle !== 'live') continue;
    if (tab.workspaceId === state.activeWorkspaceId) continue;
    if (skipPinned && tab.pinned) continue;
    if (skipSaved && tab.saved) continue;

    const idleMs = nowMs - tab.lastFocusedAtMs;
    if (idleMs <= thresholdMs) continue;
    decisions.push({
      tabId: tab.id,
      reason: 'inactive_workspace_idle',
      idleMinutes: Math.floor(idleMs / 60_000),
    });
  }

  return decisions;
}

export function sleepTabInState(state: WorkspaceState, tabId: string): WorkspaceState {
  const tab = state.tabs[tabId];
  if (!tab || tab.lifecycle !== 'live') return state;
  return {
    ...state,
    tabs: {
      ...state.tabs,
      [tabId]: { ...tab, lifecycle: 'sleeping', viewRef: undefined },
    },
  };
}

export function wakeTabInState(state: WorkspaceState, tabId: string, nowMs: number): WorkspaceState {
  const tab = state.tabs[tabId];
  if (!tab || tab.lifecycle !== 'sleeping') return state;
  return {
    ...state,
    tabs: {
      ...state.tabs,
      [tabId]: { ...tab, lifecycle: 'live', lastFocusedAtMs: nowMs },
    },
  };
}

export function resetWorkspaceIntoReadingList(
  state: WorkspaceState,
  workspaceId: WorkspaceId,
  nowMs: number,
  reason: ReadingListItem['reason']
): { next: WorkspaceState; moved: number } {
  const ws = state.workspaces[workspaceId];
  const movedItems: ReadingListItem[] = [];
  const nextTabs: Record<string, Tab> = { ...state.tabs };

  for (const tabId of ws.tabIds) {
    const tab = nextTabs[tabId];
    if (!tab) continue;
    if (tab.saved || tab.pinned) continue;
    movedItems.push({
      id: `rl-${workspaceId}-${tabId}-${nowMs}`,
      workspaceId,
      url: tab.nav.currentUrl,
      title: tab.nav.title,
      faviconUrl: tab.nav.faviconUrl,
      addedAtMs: nowMs,
      reason,
    });
    delete nextTabs[tabId];
  }

  const remainingTabIds = ws.tabIds.filter((id) => {
    const t = state.tabs[id];
    return t && (t.saved || t.pinned);
  });

  const nextState: WorkspaceState = {
    ...state,
    tabs: nextTabs,
    readingList: [...movedItems, ...state.readingList],
    workspaces: {
      ...state.workspaces,
      [workspaceId]: { ...ws, tabIds: remainingTabIds },
    },
  };

  return { next: nextState, moved: movedItems.length };
}

export function moveTabToWorkspace(
  state: WorkspaceState,
  tabId: string,
  targetWorkspaceId: WorkspaceId,
  nowMs: number
): WorkspaceState {
  const tab = state.tabs[tabId];
  if (!tab) return state;
  if (tab.workspaceId === targetWorkspaceId) return state;

  // Harte Session-Trennung: nicht "umhaengen", sondern neu anlegen.
  const newTabId = `${targetWorkspaceId}-${tabId}-${nowMs}`;
  const cloned: Tab = {
    ...tab,
    id: newTabId,
    workspaceId: targetWorkspaceId,
    lifecycle: 'sleeping', // wird beim Aktivieren/Click neu geladen
    createdAtMs: nowMs,
    lastFocusedAtMs: nowMs,
    viewRef: undefined,
  };

  const sourceWs = state.workspaces[tab.workspaceId];
  const targetWs = state.workspaces[targetWorkspaceId];

  const nextTabs = { ...state.tabs };
  delete nextTabs[tabId];
  nextTabs[newTabId] = cloned;

  return {
    ...state,
    tabs: nextTabs,
    workspaces: {
      ...state.workspaces,
      [sourceWs.id]: { ...sourceWs, tabIds: sourceWs.tabIds.filter((id) => id !== tabId) },
      [targetWs.id]: { ...targetWs, tabIds: [...targetWs.tabIds, newTabId] },
    },
  };
}

export function focusTimeRemainingMs(state: WorkspaceState, nowMs: number): number | null {
  const focus = state.workspaces.fokus.focus!;
  if (focus.status !== 'active' || !focus.deadlineAtMs) return null;
  return Math.max(0, focus.deadlineAtMs - nowMs);
}

// Visuelles Feedback: Blau -> Rot (HSL)
export function focusAccentColor(progress01: number): string {
  const t = Math.max(0, Math.min(1, progress01));
  const hue = 210 - 210 * t; // 210 (blue) -> 0 (red)
  const sat = 85;
  const light = 55;
  return `hsl(${hue} ${sat}% ${light}%)`;
}

