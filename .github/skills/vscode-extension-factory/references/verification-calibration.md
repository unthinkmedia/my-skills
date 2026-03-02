# Verification Calibration

Use this guide to measure performance and reliability consistently across runs and machines.

## Purpose

This calibration protocol ensures that thresholds in `verification-matrix.md` are applied reproducibly.

## Baseline Setup

1. Use the same workspace state for baseline and comparison runs.
2. Close unrelated extensions/processes when possible.
3. Record machine context:
   - OS/version
   - CPU and memory summary
   - VS Code version
4. Use identical extension settings between runs.

## Run Protocol

1. Collect one baseline run before code changes.
2. Collect at least 5 post-change runs.
3. For activation and UI timings:
   - discard first warm-up run
   - compute p95 from remaining samples
4. For memory:
   - run 10 open/close cycles for target surface
   - trigger GC if available
   - compare stabilized heap to baseline

## Reporting Requirements

Include in verification output:

1. machine context summary
2. sample count and discarded runs
3. raw sample values (or compact table)
4. computed metrics (median, p95, delta)
5. pass/fail against thresholds

## Variance Handling

If variance is high:

1. repeat sample collection with reduced background load
2. increase sample count to 10
3. report confidence notes in residual risk section

## Command Suggestions

Use project-appropriate commands; examples:

1. typecheck command
2. lint command
3. extension test command
4. profiling/diagnostic command for activation where available

Always report the exact command executed in verification evidence.
