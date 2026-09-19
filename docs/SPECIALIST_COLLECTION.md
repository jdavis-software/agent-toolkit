# Code intelligence, roles, media and engineering methods

This wave adds eight original procedures and eight role presets. It uses existing utility entry points instead of adding an indexer, renderer, scheduler or numerical framework. Roles are separate from catalog entries. Optional upstream projects remain external candidates; no Graft, Codebase Memory, OpenMontage, Agency Agents or K-Dense software is installed or vendored here.

## Skill scope

Codebase Orientation creates a task-sized source-backed map. Code Index Qualification tests an actual backend and its coverage; its local companion only checks supplied receipts. Reference Video Analysis requires timecoded visual/audio evidence. Media Timeline Assembly hands current assets to a separately qualified renderer. Shot Continuity Review inspects the actual rendered sequence. Specialist Role Composition binds relevant existing skills to a responsibility. Dataset Readiness Review establishes usable local observations. Engineering Experiment Analysis distinguishes descriptive results from design-appropriate inference.

Each skill has three not-run host scenarios. Executed helper fixtures do not change that status. Six existing procedures receive targeted guidance about stale maps, units/replication, revised narration, fallback approval, lineage and budget enforcement.

## Read-only examples

```bash
python3 examples/specialist-collection/demo.py
python3 tools/publicationcheck.py index examples/specialist-collection/index.json --root examples/specialist-collection
python3 tools/publicationcheck.py timeline examples/specialist-collection/timeline.json --root examples/specialist-collection
python3 tools/publicationcheck.py dataset examples/specialist-collection/dataset.json --root examples/specialist-collection
python3 tools/publicationcheck.py experiment examples/specialist-collection/dataset.json --root examples/specialist-collection
node tools/bundle.mjs roles
node tools/bundle.mjs role video-producer
```

Python 3.10+ standard library and the full toolkit checkout are sufficient. Commands read selected files and print JSON. Exit 0 means documented structural checks passed, 3 means findings need review, and 2 means malformed/unavailable input. A passing result is not authenticated evidence, approval or permission to render. The example uses local synthetic code, SVG cards, narration and task measurements; no model, graph engine, browser, media decoder or provider is invoked.

## Index receipt

`schemaVersion: 1`; engine ID/version; expected and observed opaque root IDs; freshness (`fresh`, `stale`, `unavailable`, `unknown`); coverage (`complete-for-probes`, `partial`, `unknown`); selected source `{id,path,sha256}` records; probes `{id,sourceIds,expected,actual,status}`. Status is `completed`, `failed` or `not-run`. Expected and actual answer arrays are compared as sets with duplicates rejected. Empty answers are allowed for an independently specified negative fixture; they are not proof that arbitrary dependencies do not exist.

A supplied root, freshness flag or known answer can be dishonest. The command checks actual selected bytes twice but cannot establish the engine's provenance, index completeness or semantic validity. Run the actual backend separately against the intended checkout and retain its indexing/query receipts. Busy or failed refresh must remain visible. Omitted generated files, unsaved buffers, mutable remote services and hostile concurrent changes are outside the byte-check guarantee.

## Timeline contract

The version-1 checker accepts a bounded cut-only timeline in a single normalized constant-rate frame space: revision, rational `fps`, `totalFrames`, assets, dependencies and clips. Asset `{id,path,sha256,kind,frames}` records have kind `image`, `video` or `audio`; images have null frames, others have a positive declared frame count. Dependencies use `{id,path,sha256}` and include approved script/storyboard/caption records as appropriate.

Clip fields are `{id,assetId,track,start,end,sourceStart}`. Intervals are half-open. Track is `visual`, `audio` or `overlay`. Primary visual clips must exactly cover `[0,totalFrames)` without gaps/overlap; audio cannot be put on a visual track. Source bounds are checked against declared normalized frame counts. Still images use sourceStart 0. This checker deliberately does not implement implicit rate conversion, speed ramps, nested compositions or crossfade overlaps. Choose/qualify a compositor for those operations instead of falsifying the cut contract.

Actual asset/dependency hashes are checked twice. Declared duration is not probed from media and rights/consent are not inferred. No files are rendered or decoded. Replacing narration invalidates its dependency identity even when a previously completed render exists. Use Media Transform Verification and inspect actual cut boundaries afterward. The example SVGs are original test assets, not generated footage or product claims.

## Dataset and experiment contracts

The manifest provides `schemaVersion`, relative `path`, SHA-256, an explicit task list, exactly two condition IDs (baseline then candidate) and `durationUnit: ms`. Supported CSV columns in exact order:

```text
task,condition,attempt,outcome,duration_ms,input_tokens,output_tokens
```

All expected task/condition combinations must appear. Attempts start at 1 and are contiguous and unique within that pair. Outcomes are `accepted`, `failed`, `timeout` or `incomplete`; no later attempt may follow acceptance or an unresolved incomplete attempt. Unknown metrics use an empty cell, never zero. Duration may be a nonnegative decimal; token counts and attempt IDs are nonnegative integers with documented positive attempt bounds. Inputs with unsupported shape, units, formulas/nonfinite numerics, out-of-scope identities or mismatched file hashes fail.

The dataset command retains grouping, missing-cell counts and every declared task. The experiment command refuses comparison when structural findings exist. Otherwise it counts acceptance over the entire fixed workload and describes candidate-minus-baseline **sum of recorded attempt execution time** for pairs where both tasks were accepted and all durations are known. It exposes excluded timing-task IDs and reports mean/median differences, not a success-only whole-workload speedup. Failed attempts before acceptance remain part of the sum. Unknown usage remains null. Summed attempt time is not end-to-end latency or aggregate all-agent cost.

No hypothesis test, confidence interval, causal claim, outlier deletion, imputation or adoption decision is made. Whole-system conclusions need complete runtime observations, design-appropriate grouping and qualified numerical methods. This fixture has three tasks, seven rows, three baseline acceptances and two candidate acceptances. Two accepted complete pairs have differences of -4 and -12 ms, mean/median -8 ms. Those are artificial values, not a benchmark of any upstream product.

## Input limits and output privacy

Common local I/O restrictions reject traversal, symlinks, nonregular files and more than 2 MiB per file. The index/timeline checks cap selected totals at 10 MiB, 100 source records and 200 clips/answers. Dataset review caps inputs at 100 tasks, two conditions, 1,000 rows, 50 attempts per task/condition and 200 characters per cell. No archive, executable expression, file URL, plugin or network source is accepted. Byte identities and repeated reads are consistency checks, not an operating-system sandbox or atomic snapshot.

Reports omit source bodies, asset bytes and absolute paths, but declared task/condition IDs and hashes may still be sensitive. Redact private identifiers before sharing. Never publish production observations as fixture data.

## Private adoption

A consuming environment supplies real repository roots, source manifests, graph receipts, media approvals, provider identities, budgets and statistical protocols. FAL generation, HyperFrames/Remotion/FFmpeg composition and code-intelligence backend selection remain independent decisions. None is installed by resolving a role or bundle. Reviewer mode requires actual host enforcement. The human knowledge base remains human authored; maps and query indexes remain regenerable views of source.
