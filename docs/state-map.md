# 🧠 Vault Global State Map

| State Name       | Type        | File/Hook Location            | Description                                      |
|------------------|-------------|-------------------------------|--------------------------------------------------|
| `hovered`        | string      | `page.tsx` (global state)     | Current hovered pylon for glow/commentary sync   |
| `glowLevel`      | number      | `page.tsx` (derived)          | Current glow intensity (based on XP or manual)   |
| `pylonStates`    | object      | `DashboardPage` props         | Active/Inactive toggles for all pylons           |
| `enicCommentary` | string      | `page.tsx`                    | Text used in ENIC.0 floating chat bubble         |
| `userXP`         | number      | (mocked or Supabase pending)  | XP used to determine glowLevel                   | 