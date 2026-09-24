# CampusFix Repository Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reshape the existing frontend and backend skeletons to match the P0 design's recommended repository structure while preserving every existing directory outside those roots and every existing child directory inside them.

**Architecture:** Rename the application roots to the design's lowercase `frontend/` and `backend/` names, then add the recommended modular-monolith and feature-oriented directory skeletons. Empty directories remain tracked with `.gitkeep`; no application code or dependencies are introduced in this structure-only change.

**Tech Stack:** Git, POSIX shell, repository directory skeletons

**Spec:** `docs/superpowers/specs/2026-09-22-campusfix-p0-design.md` section 8.3

## Global Constraints

- Use lowercase root names exactly: `backend/` and `frontend/`.
- Preserve the existing frontend directories `components/`, `services/`, `stores/`, and `views/`.
- Preserve the existing backend directories `src/controllers/`, `src/routes/`, and `src/services/`.
- Do not delete or rename directories outside the frontend and backend roots.
- Add `tests/e2e/` beneath the existing repository-level `tests/` directory without removing `tests/.gitkeep`.
- Keep empty directories version-controlled with `.gitkeep` files.
- Do not scaffold runtime source files, dependency manifests, containers, migrations, or tests beyond the directory placeholders requested here.
- Preserve the user's existing uncommitted `Fronted/` to `Frontend/` rename work.
- Do not resolve or modify the unrelated unmerged root `.DS_Store`; report it as pre-existing repository state.

## Review Focus

- Case-sensitive checkout behavior: a fresh checkout must contain lowercase `frontend/` and `backend/`, never `Fronted/`, `Frontend/`, or `Backend/`.
- Preservation: every pre-existing tracked placeholder under the two application roots must still exist at its renamed path.
- Scope: no directory under `docs/` or any other unrelated root may disappear.
- Trackability: every recommended empty directory must contain a `.gitkeep` so Git includes it.
- Clean content boundary: the change must not accidentally include `.DS_Store` files or resolve the pre-existing `.DS_Store` conflict.

---

### Task 1: Normalize Application Root Names Without Losing Existing Skeletons

**Files:**
- Rename: `Backend/` to `backend/`
- Rename: current working-tree `Frontend/` to `frontend/`
- Preserve: `backend/src/controllers/.gitkeep`
- Preserve: `backend/src/routes/.gitkeep`
- Preserve: `backend/src/services/.gitkeep`
- Preserve: `frontend/src/components/.gitkeep`
- Preserve: `frontend/src/services/.gitkeep`
- Preserve: `frontend/src/stores/.gitkeep`
- Preserve: `frontend/src/views/.gitkeep`

**Interfaces:**
- Consumes: the current tracked `Backend/` skeleton and the user's in-progress `Fronted/` to `Frontend/` rename
- Produces: canonical lowercase application roots used by every later task: `backend/` and `frontend/`

- [ ] **Step 1: Record the paths that must survive the rename**

Run:

```bash
find Backend Frontend -type f ! -name '.DS_Store' -print | sort
```

Expected: the seven existing `.gitkeep` paths are listed, with four frontend paths and three backend paths.

- [ ] **Step 2: Rename both roots through temporary names**

Run on the default case-insensitive macOS filesystem:

```bash
mv Backend __campusfix_backend_case_tmp
mv __campusfix_backend_case_tmp backend
mv Frontend __campusfix_frontend_case_tmp
mv __campusfix_frontend_case_tmp frontend
```

Expected: only `backend/` and `frontend/` exist; the temporary names no longer exist.

- [ ] **Step 3: Verify the preserved paths and casing**

Run:

```bash
find backend frontend -type f ! -name '.DS_Store' -print | sort
```

Expected: the same seven `.gitkeep` files from Step 1 are present below the lowercase roots.

- [ ] **Step 4: Inspect Git's rename interpretation**

Run:

```bash
git status --short
git diff --summary -- Backend Fronted backend frontend
```

Expected: Git reports the application paths as deletions/additions or renames caused by casing normalization; no unrelated directory deletion appears.

### Task 2: Add the Recommended Backend Modular-Monolith Skeleton

**Files:**
- Create: `backend/app/main.py`
- Create: `backend/app/core/config.py`
- Create: `backend/app/core/database.py`
- Create: `backend/app/core/security.py`
- Create: `backend/app/core/errors.py`
- Create: `backend/app/modules/auth/.gitkeep`
- Create: `backend/app/modules/users/.gitkeep`
- Create: `backend/app/modules/locations/.gitkeep`
- Create: `backend/app/modules/tickets/.gitkeep`
- Create: `backend/app/modules/workflow/.gitkeep`
- Create: `backend/app/modules/assignments/.gitkeep`
- Create: `backend/app/modules/comments/.gitkeep`
- Create: `backend/app/modules/attachments/.gitkeep`
- Create: `backend/app/modules/analytics/.gitkeep`
- Create: `backend/migrations/.gitkeep`
- Create: `backend/tests/.gitkeep`

**Interfaces:**
- Consumes: lowercase `backend/` from Task 1
- Produces: the complete backend directory shape specified in design section 8.3, while retaining the legacy `backend/src/` placeholders for future user files

- [ ] **Step 1: Create a structure assertion that initially fails**

Run:

```bash
test -f backend/app/main.py && test -f backend/app/core/config.py && test -d backend/app/modules/auth && test -d backend/app/modules/analytics && test -d backend/migrations && test -d backend/tests
```

Expected: non-zero exit because the recommended backend structure does not exist yet.

- [ ] **Step 2: Create the backend directories**

Run:

```bash
mkdir -p backend/app/core backend/app/modules/{auth,users,locations,tickets,workflow,assignments,comments,attachments,analytics} backend/migrations backend/tests
```

Expected: all listed directories are created and `backend/src/` remains unchanged.

- [ ] **Step 3: Add only minimal tracked placeholders**

Create empty `backend/app/main.py`, `backend/app/core/config.py`, `backend/app/core/database.py`, `backend/app/core/security.py`, and `backend/app/core/errors.py`. Add an empty `.gitkeep` to each module directory, `backend/migrations/`, and `backend/tests/`.

- [ ] **Step 4: Re-run the structure assertion**

Run:

```bash
test -f backend/app/main.py && test -f backend/app/core/config.py && test -f backend/app/core/database.py && test -f backend/app/core/security.py && test -f backend/app/core/errors.py && test -d backend/app/modules/auth && test -d backend/app/modules/users && test -d backend/app/modules/locations && test -d backend/app/modules/tickets && test -d backend/app/modules/workflow && test -d backend/app/modules/assignments && test -d backend/app/modules/comments && test -d backend/app/modules/attachments && test -d backend/app/modules/analytics && test -d backend/migrations && test -d backend/tests
```

Expected: exit code 0.

### Task 3: Add the Recommended Frontend and End-to-End Test Skeletons

**Files:**
- Create: `frontend/src/app/.gitkeep`
- Create: `frontend/src/api/.gitkeep`
- Create: `frontend/src/features/auth/.gitkeep`
- Create: `frontend/src/features/tickets/.gitkeep`
- Create: `frontend/src/features/dispatch/.gitkeep`
- Create: `frontend/src/features/technician/.gitkeep`
- Create: `frontend/src/features/locations/.gitkeep`
- Create: `frontend/src/features/users/.gitkeep`
- Create: `frontend/src/features/analytics/.gitkeep`
- Create: `frontend/src/routes/.gitkeep`
- Create: `frontend/src/test/.gitkeep`
- Create: `tests/e2e/.gitkeep`

**Interfaces:**
- Consumes: lowercase `frontend/` from Task 1 and the existing repository-level `tests/` directory
- Produces: the complete frontend and E2E directory shape specified in design section 8.3, while retaining all legacy frontend placeholders and `tests/.gitkeep`

- [ ] **Step 1: Create a structure assertion that initially fails**

Run:

```bash
test -d frontend/src/app && test -d frontend/src/api && test -d frontend/src/features/auth && test -d frontend/src/features/analytics && test -d frontend/src/routes && test -d frontend/src/test && test -d tests/e2e
```

Expected: non-zero exit because the recommended frontend and E2E directories do not exist yet.

- [ ] **Step 2: Create the frontend and E2E directories**

Run:

```bash
mkdir -p frontend/src/{app,api,routes,test} frontend/src/features/{auth,tickets,dispatch,technician,locations,users,analytics} tests/e2e
```

Expected: all listed directories are created without removing existing frontend or repository-level test directories.

- [ ] **Step 3: Add tracked placeholders**

Add an empty `.gitkeep` to each directory created in Step 2.

- [ ] **Step 4: Re-run the structure assertion**

Run:

```bash
test -d frontend/src/app && test -d frontend/src/api && test -d frontend/src/components && test -d frontend/src/features/auth && test -d frontend/src/features/tickets && test -d frontend/src/features/dispatch && test -d frontend/src/features/technician && test -d frontend/src/features/locations && test -d frontend/src/features/users && test -d frontend/src/features/analytics && test -d frontend/src/routes && test -d frontend/src/services && test -d frontend/src/stores && test -d frontend/src/test && test -d frontend/src/views && test -d tests/e2e
```

Expected: exit code 0.

### Task 4: Verify Preservation, Exact Structure, and Scope

**Files:**
- Verify: `backend/**`
- Verify: `frontend/**`
- Verify: `tests/e2e/.gitkeep`
- Verify unchanged: `docs/**`, `LICENSE`, `README.md`

**Interfaces:**
- Consumes: completed structure from Tasks 1–3 and the pre-change path inventory
- Produces: evidence that the requested structure is present and unrelated folders were not removed

- [ ] **Step 1: Check every required tracked path**

Run:

```bash
git status --short
find backend frontend tests/e2e -type f ! -name '.DS_Store' -print | sort
```

Expected: all recommended placeholders and all preserved legacy placeholders are present; no `.DS_Store` is included in the new structure.

- [ ] **Step 2: Verify unrelated tracked paths were not deleted**

Run:

```bash
git diff --name-status | awk '$1 == "D" && $2 !~ /^(Backend|Fronted)\// { print; failed=1 } END { exit failed }'
```

Expected: no output and exit code 0. The pre-existing unmerged root `.DS_Store` is not represented by this ordinary diff check and remains separately reported.

- [ ] **Step 3: Verify obsolete application root names are absent**

Run:

```bash
test ! -e Backend && test ! -e Fronted && test ! -e Frontend
```

Expected: exit code 0.

- [ ] **Step 4: Inspect the final scoped diff and repository state**

Run:

```bash
git diff --stat
git status --short --branch
```

Expected: changes are limited to the application-root rename, recommended placeholder additions, this plan, and the pre-existing unmerged `.DS_Store`; no commit, push, merge, deployment, or publication is performed.
