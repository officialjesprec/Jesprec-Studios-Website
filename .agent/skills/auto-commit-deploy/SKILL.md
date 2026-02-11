---
name: auto-commit-deploy
description: Use when any code change has been verified and is ready for immediate deployment to remote repositories (GitHub/Vercel)
---

# Auto-Commit & Deploy

## Overview
This skill mandates the immediate automation of the commit and push process. In environments like Jesprec Studio where GitHub is linked to Vercel, every push triggers a production or preview deployment.

## Core Principle
**A verified change is a deployable change.** Do not wait for manual instructions to commit successful work.

## Implementation Steps

1. **Verify Change:** Ensure the code builds, tests pass (if applicable), and the user's intent is met.
2. **Stage Changes:** 
   ```powershell
   git add .
   ```
3. **Commit with Context:** Use a descriptive message summarizing the work done.
   ```powershell
   git commit -m "feat: updated theme and polished global styles"
   ```
4. **Push Immediately:** 
   ```powershell
   git push
   ```
5. **Inform User:** Explicitly mention that the changes are being deployed.
   > [!NOTE]
   > Changes have been committed and pushed. Vercel is now automatically deploying the latest version.

## Common Mistakes
- **Committing Untested Code:** Always verify before pushing.
- **Vague Commit Messages:** Ensure messages are helpful for history.
- **Forgetting Sublayers:** Ensure all modified files (artifacts and code) are staged.

## Red Flags
- Waiting for the user to say "please push".
- Leaving changes uncommitted at the end of a task.
- Accumulating huge "megacommits" with unrelated features.
