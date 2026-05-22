# PowerShell Script to collect materials and zip them up for external LLM analysis

$WorkspaceDir = "c:\Users\loubr\.gemini\antigravity\scratch\snap-count"
$BrainDir = "C:\Users\loubr\.gemini\antigravity\brain\a47d10da-590a-48ac-957c-75d0e7def1f8"
$PackageDir = "$WorkspaceDir\analysis_package"
$ZipPath = "$WorkspaceDir\mockmaxxing_analysis_materials.zip"

Write-Host "🚀 Creating temporary folders..."
New-Item -ItemType Directory -Force -Path $PackageDir
New-Item -ItemType Directory -Force -Path "$PackageDir\docs"
New-Item -ItemType Directory -Force -Path "$PackageDir\artifacts"
New-Item -ItemType Directory -Force -Path "$PackageDir\src"
New-Item -ItemType Directory -Force -Path "$PackageDir\scripts"
New-Item -ItemType Directory -Force -Path "$PackageDir\qa_metrics"

Write-Host "📦 Copying workspace Markdown files..."
Copy-Item "$WorkspaceDir\*.md" "$PackageDir\docs\"

Write-Host "📦 Copying session artifacts..."
Copy-Item "$BrainDir\*.md" "$PackageDir\artifacts\"

Write-Host "📦 Copying QA metrics, reports, and coverage files..."
Copy-Item "$WorkspaceDir\scratch_*.json" "$PackageDir\qa_metrics\"
Copy-Item "$WorkspaceDir\audit_miss_report.html" "$PackageDir\qa_metrics\"
Copy-Item "$WorkspaceDir\audit_miss_report.pdf" "$PackageDir\qa_metrics\"

Write-Host "📦 Copying application source code..."
Copy-Item -Recurse -Force "$WorkspaceDir\src\*" "$PackageDir\src\"

Write-Host "📦 Copying automation and QA scripts..."
Copy-Item -Recurse -Force "$WorkspaceDir\scripts\*" "$PackageDir\scripts\"

Write-Host "📦 Copying configuration metadata..."
Copy-Item "$WorkspaceDir\package.json" "$PackageDir\"
Copy-Item "$WorkspaceDir\app.json" "$PackageDir\"
Copy-Item "$WorkspaceDir\tsconfig.json" "$PackageDir\"
Copy-Item "$WorkspaceDir\.env" "$PackageDir\"
Copy-Item "$WorkspaceDir\eslint.config.js" "$PackageDir\"

# Generate dynamic ARCHITECTURE_OVERVIEW.md for the external LLM
$OverviewContent = @"
# MockMaxxing Architecture & QA Suite Overview
*Prepared dynamically on $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')*

This package contains the complete source code, structural markdown books, session artifacts, automation scripts, and telemetry data for **MockMaxxing** to enable an external LLM model to perform a comprehensive code, design, and QA analysis.

---

## 📂 Package Folder Taxonomy

1. **`/src`**: Full application source code.
   * `/app/wizard`: active draft room layouts (`active.tsx`), setup flows (`setup.tsx`), summaries (`summary.tsx`).
   * `/store`: Zustand state containers (`useMockMaxxingStore.ts`, `useAuthStore.ts`, `useThemeStore.ts`).
   * `/components`: Reusable elements, including background textures and the brand-new layout `ErrorBoundary.tsx`.
   * `/constants/theme.ts`: Unified design system tokens, typography scales, and HSL palettes.
2. **`/scripts`**: High-fidelity automation, draft simulation engines, and developer-level QA tools.
   * `run_50k_bot_stress.js` / `run_draft_simulations.js`: Large-scale draft simulators to benchmark CPU archetype drafting strategies.
   * `robotic_ui_explorer.js` / `background_simulator.js`: Web automation, clickpath explorers, and headless simulation loops.
   * `optimize_strategies.js`: Dynamic strategy optimization script.
3. **`/docs`**: Corporate strategy, rules, and branding guides.
   * `MOCKMAXXING_BIBLE.md`: Official CEO corporate mandate detailing visual aesthetics, Google M3 containment, WCAG 2.2 AAA rules, and the Starbucks UX inspiration directive.
   * `AGENTS.md`: Coding mandate for agents and sub-agents detailing Triple-Core compliance.
   * `PROJECT_CONTEXT.md`: System capabilities, file trees, and environment metadata.
4. **`/artifacts`**: Session design documentation, checklist logs, and progression updates.
   * `implementation_plan.md`: Structural designs for gesture clamps and safe navigations.
   * `task.md`: Living checklist showing exactly what was implemented and verified.
   * `walkthrough.md`: Detailed engineering changes, validation results, and simulation transcript logs.
5. **`/qa_metrics`**: High-density simulator runs, audit reports, and live concurrent run metrics.
   * `scratch_live_metrics.json`: Telemetry metrics, total concurrency records, and strategy win/loss ratios.
   * `scratch_explorer_coverage_matrix.json`: Headless explorer routes and UI interactive states.
   * `audit_miss_report.html` / `audit_miss_report.pdf`: Layout validation reports.

---

## ⚡ Active QA Processes & Telemetry Mechanics

1. **Genetic Bot-Draft Simulators**:
   * The store (`useMockMaxxingStore.ts`) features an automated simulation module running multi-threaded Monte Carlo draft sequences (up to 100,000 runs) to benchmark strategy win rates across draft slots and archetype parameters.
2. **Proactive Error Boundary & Trace Telemetry**:
   * Layout-level style exceptions are intercepted in `src/components/ErrorBoundary.tsx` to prevent blank reloads.
   * Console telemetry tracers in `useMockMaxxingStore.ts`'s `resetDraft()` log strict call-stack frames to identify reset sources.
3. **TypeScript Type Safety**:
   * All changes are validated under a strict non-emitting compiler pass to guarantee absolute structural integrity.
"@

Set-Content -Path "$PackageDir\ARCHITECTURE_OVERVIEW.md" -Value $OverviewContent

Write-Host "🤐 Compressing archive into $ZipPath..."
if (Test-Path $ZipPath) {
    Remove-Item $ZipPath -Force
}
Compress-Archive -Path "$PackageDir\*" -DestinationPath $ZipPath -Force

Write-Host "🧹 Cleaning up temporary files..."
Remove-Item -Recurse -Force $PackageDir

Write-Host "🎉 Package created successfully!"
