import React, { useEffect, useMemo, useReducer } from 'react';
import type { WorkspaceId, WorkspaceState } from './workspaces';
import {
  createDefaultState,
  focusAccentColor,
  focusTimeRemainingMs,
  reclaimMemory,
  sleepTabInState,
  startFocusSession,
  tickFocusTimer,
} from './workspaces';

type Action =
  | { type: 'activate_workspace'; workspaceId: WorkspaceId; nowMs: number }
  | { type: 'focus_start'; nowMs: number }
  | { type: 'focus_tick'; nowMs: number }
  | { type: 'sleep_tab'; tabId: string }
  | { type: 'hydrate'; state: WorkspaceState };

function reducer(state: WorkspaceState, action: Action): WorkspaceState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'activate_workspace':
      return { ...state, activeWorkspaceId: action.workspaceId };
    case 'focus_start':
      return startFocusSession(state, action.nowMs);
    case 'focus_tick':
      return tickFocusTimer(state, action.nowMs).next;
    case 'sleep_tab':
      return sleepTabInState(state, action.tabId);
    default:
      return state;
  }
}

export interface WorkspaceSidebarProps {
  initialState?: WorkspaceState;

  // Side-effects: Main Process / TabManager integration.
  onActivateWorkspace?: (workspaceId: WorkspaceId) => void;
  onSleepTab?: (tabId: string) => void;
  onFocusExpired?: () => void;
}

export function WorkspaceSidebar(props: WorkspaceSidebarProps) {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    () => props.initialState ?? createDefaultState(Date.now())
  );

  // Fokus: Timer-Tick (UI) + Main-enforced Timer (real) sollten koordiniert werden.
  useEffect(() => {
    const id = window.setInterval(() => dispatch({ type: 'focus_tick', nowMs: Date.now() }), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Smart tab management: alle 60s pruefen und "sleepen".
  useEffect(() => {
    const id = window.setInterval(() => {
      const nowMs = Date.now();
      const decisions = reclaimMemory(state, nowMs, { idleMinutes: 20, skipPinned: true });
      for (const d of decisions) {
        props.onSleepTab?.(d.tabId);
        dispatch({ type: 'sleep_tab', tabId: d.tabId });
      }
    }, 60_000);
    return () => window.clearInterval(id);
  }, [state, props]);

  // Visuelles Feedback: Akzentfarbe ueber Fokus-Fortschritt (nur wenn Fokus aktiv).
  const focusUi = useMemo(() => {
    const nowMs = Date.now();
    const remainingMs = focusTimeRemainingMs(state, nowMs);
    const focus = state.workspaces.fokus.focus!;
    const totalMs = focus.policy.maxMinutes * 60_000;
    const progress01 = remainingMs == null ? 0 : 1 - remainingMs / totalMs;
    const accent = focus.status === 'active' ? focusAccentColor(progress01) : 'transparent';
    return { remainingMs, progress01, accent, focus };
  }, [state]);

  useEffect(() => {
    if (focusUi.focus.status === 'active') {
      document.documentElement.style.setProperty('--focus-accent', focusUi.accent);
    } else {
      document.documentElement.style.removeProperty('--focus-accent');
    }
  }, [focusUi.accent, focusUi.focus.status]);

  function onWorkspaceClick(workspaceId: WorkspaceId) {
    const nowMs = Date.now();
    const fokus = state.workspaces.fokus;
    const focus = fokus.focus!;

    if (workspaceId === 'fokus') {
      if (focus.status === 'locked' && focus.lockedUntilMs && nowMs < focus.lockedUntilMs) {
        // Erzwinge Pause: Wechsel zu Freizeit
        props.onActivateWorkspace?.('freizeit');
        dispatch({ type: 'activate_workspace', workspaceId: 'freizeit', nowMs });
        return;
      }
      // Startet (oder erneuert) Fokus-Session.
      dispatch({ type: 'focus_start', nowMs });
    }

    props.onActivateWorkspace?.(workspaceId);
    dispatch({ type: 'activate_workspace', workspaceId, nowMs });
  }

  const order: WorkspaceId[] = ['schule', 'freizeit', 'programmieren', 'fokus'];

  return (
    <nav className="workspace-sidebar" aria-label="Workspaces">
      {order.map((id) => {
        const ws = state.workspaces[id];
        const isActive = state.activeWorkspaceId === id;

        const isFocus = id === 'fokus';
        const focus = isFocus ? ws.focus! : undefined;
        const remainingMs = isFocus ? focusUi.remainingMs : null;
        const remainingLabel =
          isFocus && focus?.status === 'active' && remainingMs != null
            ? formatMmSs(remainingMs)
            : isFocus && focus?.status === 'locked' && focus.lockedUntilMs
              ? `gesperrt (${formatMmSs(focus.lockedUntilMs - Date.now())})`
              : null;

        const focusRing = isFocus && focus?.status === 'active' ? focusUi.progress01 : null;

        return (
          <button
            key={id}
            className={[
              'workspace-btn',
              isActive ? 'is-active' : '',
              isFocus ? 'is-focus' : '',
              isFocus && focus?.status === 'locked' ? 'is-locked' : '',
            ].join(' ')}
            onClick={() => onWorkspaceClick(id)}
            title={ws.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="workspace-icon" aria-hidden="true">
              {iconFor(ws.icon)}
            </span>
            <span className="workspace-label">{ws.label}</span>
            {remainingLabel ? <span className="workspace-meta">{remainingLabel}</span> : null}
            {focusRing != null ? (
              <span className="focus-ring" aria-hidden="true">
                {Math.round(focusRing * 100)}%
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function formatMmSs(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const mm = Math.floor(totalSeconds / 60);
  const ss = totalSeconds % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}

function iconFor(name: string): React.ReactNode {
  // Placeholder: in echt z.B. lucide-react oder eigene SVGs.
  const map: Record<string, string> = {
    'graduation-cap': 'SCH',
    smile: 'FUN',
    code: '</>',
    timer: 'FOK',
  };
  return map[name] ?? '*';
}
