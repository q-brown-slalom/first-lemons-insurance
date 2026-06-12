Here's a technical specification for the rules engine component of the judgment layer. This is scoped to the deterministic, fast-path evaluation — the part that doesn't require the LLM judge.

---

# Technical Specification: Rules Engine — Judgment Layer at Merge Gate

**Version:** 0.1 (Draft)
**Scope:** Deterministic policy evaluation for AI-generated code at the merge gate
**Relationship to LLM Judge:** The rules engine runs first. It handles bright-line cases (allow, deny, escalate) with sub-500ms latency. The LLM judge is invoked only when the rules engine flags ambiguity or when the action class requires contextual evaluation (Class C, D, E).

---

## 1. System Overview

### 1.1 Purpose

The rules engine evaluates every AI-generated pull request against a configurable set of deterministic policies. It produces one of five outcomes per policy:

| Outcome | Meaning |
|---------|---------|
| `pass` | Policy evaluated, no issue found |
| `allow` | Terminal — PR is cleared by this policy (no further evaluation needed for this policy) |
| `deny` | Terminal — PR is blocked with reason |
| `escalate` | Route to specified human/team |
| `defer_to_llm` | Ambiguity detected — hand off to LLM judge with context |

### 1.2 Design Principles

- **Deterministic.** Same inputs always produce same outputs. No probabilistic evaluation.
- **Fast.** Target: <200ms for full policy bundle evaluation. Ceiling: 500ms.
- **Auditable.** Every evaluation produces a structured decision record.
- **Configurable.** Policies are data, not code. Client-specific configuration without redeployment.
- **Composable.** Consumes signals from existing tooling; does not replace them.

---

## 2. Technology Selection

### 2.1 Policy Engine: Open Policy Agent (OPA)

| Attribute | Detail |
|-----------|--------|
| **Engine** | OPA (Open Policy Agent) with Rego policy language |
| **Deployment** | Sidecar or embedded library within the judge service |
| **Policy format** | Rego bundles, versioned in Git, deployed via CI |
| **Data format** | JSON input documents assembled by the signal aggregator |
| **Why OPA** | Industry standard for policy-as-code; native JSON evaluation; sub-ms per-rule evaluation; extensive tooling for testing and debugging; already adopted in many FS platform teams |

### 2.2 Alternatives Considered

| Option | Reason not selected |
|--------|-------------------|
| Custom code (if/else) | Not auditable, not configurable without redeployment, doesn't scale |
| AWS Cedar | Newer, less ecosystem support, tighter AWS coupling |
| Casbin | Simpler RBAC/ABAC focus, less expressive for complex signal evaluation |
| Drools | JVM-only, heavier weight, overkill for this pattern |

---

## 3. Input Schema

The rules engine receives a single JSON document assembled by the **signal aggregator** service. This document is the union of all signal sources, normalized into a consistent schema.

### 3.1 Input Document Structure

```json
{
  "metadata": {
    "evaluation_id": "uuid",
    "timestamp": "ISO-8601",
    "repository": "string",
    "pr_number": "integer",
    "pr_url": "string",
    "target_branch": "string",
    "source_branch": "string",
    "is_ai_generated": "boolean",
    "agent_identifier": "string",
    "agent_version": "string",
    "developer_identifier": "string",
    "session_id": "string"
  },

  "action_proposal": {
    "task_statement": "string",
    "agent_interpretation": "string",
    "stated_scope": ["string"],
    "files_modified": ["string"],
    "confidence_level": "float (0-1)",
    "unresolved_concerns": ["string"],
    "evidence_cited": ["string"],
    "prompt_context_hash": "string"
  },

  "diff": {
    "files_changed": [
      {
        "path": "string",
        "change_type": "add | modify | delete | rename",
        "lines_added": "integer",
        "lines_removed": "integer",
        "is_binary": "boolean"
      }
    ],
    "total_files_changed": "integer",
    "total_lines_added": "integer",
    "total_lines_removed": "integer"
  },

  "branch_protection": {
    "target_is_protected": "boolean",
    "required_reviewers": "integer",
    "current_approvals": "integer",
    "required_checks_passing": "boolean"
  },

  "ci_status": {
    "tests_passed": "boolean",
    "build_passed": "boolean",
    "coverage_delta": "float",
    "custom_checks": [
      {
        "name": "string",
        "status": "pass | fail | pending"
      }
    ]
  },

  "snyk": {
    "new_vulnerabilities": [
      {
        "id": "string",
        "severity": "low | medium | high | critical",
        "package": "string",
        "introduced_by_diff": "boolean"
      }
    ],
    "license_issues": [
      {
        "package": "string",
        "license": "string",
        "policy_violation": "boolean"
      }
    ]
  },

  "sast": {
    "new_findings": [
      {
        "id": "string",
        "severity": "low | medium | high | critical",
        "category": "string",
        "file_path": "string",
        "line_number": "integer"
      }
    ]
  },

  "secrets_scanning": {
    "detected_secrets": [
      {
        "type": "string",
        "file_path": "string",
        "line_number": "integer"
      }
    ]
  },

  "codeowners": {
    "coverage": [
      {
        "path": "string",
        "owners": ["string"],
        "has_owner": "boolean"
      }
    ]
  },

  "compliance_scope": {
    "pci_paths_touched": ["string"],
    "sox_paths_touched": ["string"],
    "gdpr_paths_touched": ["string"],
    "mrm_tier": "string | null"
  },

  "approved_dependencies": {
    "new_dependencies": [
      {
        "package": "string",
        "version": "string",
        "in_approved_list": "boolean"
      }
    ]
  }
}
```

---

## 4. Signal Aggregator Service

The signal aggregator sits between the GitHub webhook trigger and the rules engine. It assembles the input document by querying signal sources in parallel.

### 4.1 Architecture

```
GitHub PR webhook (AI-generated PR detected)
        │
        ▼
┌─────────────────────────────┐
│   SIGNAL AGGREGATOR SERVICE  │
│                              │
│  ┌─────────┐  ┌──────────┐  │
│  │ GitHub  │  │  Snyk    │  │
│  │  API    │  │  API     │  │
│  └────┬────┘  └────┬─────┘  │
│       │             │        │
│  ┌────┴────┐  ┌────┴─────┐  │
│  │Checkmarx│  │ Secrets  │  │
│  │  API    │  │ Scanning │  │
│  └────┬────┘  └────┬─────┘  │
│       │             │        │
│  ┌────┴────┐  ┌────┴─────┐  │
│  │ scope   │  │CODEOWNERS│  │
│  │  .yml   │  │  parser  │  │
│  └────┬────┘  └────┬─────┘  │
│       │             │        │
│       ▼             ▼        │
│  ┌──────────────────────┐   │
│  │  Normalized Input    │   │
│  │  Document (JSON)     │   │
│  └──────────┬───────────┘   │
└─────────────┼───────────────┘
              │
              ▼
┌─────────────────────────────┐
│      OPA RULES ENGINE        │
└─────────────────────────────┘
```

### 4.2 Signal Source Credentials

**Critical design decision:** The signal aggregator uses its **own credentials** for every external service. These are never shared with the AI agent's execution context. This ensures the judge cannot be influenced by the agent manipulating its own signal sources.

| Signal Source | Auth Method | Credential Owner |
|---------------|-------------|-----------------|
| GitHub API | GitHub App installation token | Judge service |
| Snyk API | Service account API token | Judge service |
| Checkmarx API | Read-only service account | Judge service |
| Secrets scanning | GitHub App (same as above) | Judge service |
| `.governance/scope.yml` | Read from repo via GitHub API | Judge service |
| CODEOWNERS | Read from repo via GitHub API | Judge service |

### 4.3 Timeout and Fallback Behavior

| Signal Source | Timeout | Fallback if unavailable |
|---------------|---------|------------------------|
| GitHub API | 5s | Fail open with `defer_to_llm` (cannot evaluate without diff) |
| Snyk | 10s | Log warning, mark Snyk policies as `unable_to_evaluate`, defer to LLM |
| Checkmarx | 15s | Log warning, mark SAST policies as `unable_to_evaluate`, defer to LLM |
| Secrets scanning | 5s | Fail closed — if secrets scanning is unavailable, escalate |
| scope.yml | 3s | If missing, treat all paths as unclassified → defer to LLM for compliance routing |
| CODEOWNERS | 3s | If missing, escalate (cannot determine routing) |

---

## 5. Policy Bundle Structure

### 5.1 File Organization

```
policies/
├── bundle.manifest.json          # Version, client, last-updated
├── classification/
│   ├── action_class.rego         # Classify PR into A/B/C/D
│   └── action_class_test.rego
├── reversible_writes/
│   ├── B1_in_scope.rego
│   ├── B2_out_of_scope.rego
│   ├── B3_test_only.rego
│   ├── B4_large_changes.rego
│   └── *_test.rego
├── external_actions/
│   ├── C1_merge_protected.rego
│   ├── C2_unresolved_concerns.rego
│   ├── C3_low_confidence.rego
│   └── *_test.rego
├── high_risk/
│   ├── D1_auth_modifications.rego
│   ├── D2_payment_processing.rego
│   ├── D3_iac_modifications.rego
│   ├── D4_ci_workflow.rego
│   ├── D5_dependency_vuln.rego
│   ├── D6_unapproved_dependency.rego
│   ├── D7_sast_findings.rego
│   ├── D8_hardcoded_credentials.rego
│   └── *_test.rego
├── critical/
│   ├── E1_pci_scope.rego
│   ├── E2_sox_scope.rego
│   ├── E3_gdpr_scope.rego
│   ├── E5_evidence_integrity.rego
│   └── *_test.rego
├── data/
│   ├── path_patterns.json        # Client-specific path → classification mapping
│   ├── approved_dependencies.json
│   ├── thresholds.json           # Confidence, line counts, file counts
│   └── escalation_routing.json   # Team → channel/email/ServiceNow mapping
└── lib/
    ├── helpers.rego               # Shared utility functions
    └── constants.rego             # Shared constants
```

### 5.2 Example Policy: B-1 (In-Scope Feature Branch Modifications)

```rego
package judgment_layer.reversible_writes.B1

import data.judgment_layer.lib.helpers
import data.judgment_layer.classification

# Policy B-1: In-scope feature branch modifications
# Trigger: Non-protected branch, all files within stated scope, no high-risk paths
# Action: Allow

default decision = "not_applicable"

decision = "allow" {
    # Not targeting a protected branch
    not input.branch_protection.target_is_protected

    # All modified files are within the agent's stated scope
    all_files_in_scope

    # No high-risk paths touched
    not helpers.touches_high_risk_paths(input.diff.files_changed)
}

all_files_in_scope {
    stated := {s | s := input.action_proposal.stated_scope[_]}
    modified := {f | f := input.diff.files_changed[_].path}

    # Every modified file must match at least one stated scope pattern
    every file in modified {
        helpers.matches_any_pattern(file, stated)
    }
}

# Metadata for audit trail
policy_id = "B-1"
policy_name = "In-scope feature branch modifications"
evidence_sources = ["action_proposal.stated_scope", "diff.files_changed", "branch_protection"]
```

### 5.3 Example Policy: D-8 (Hardcoded Credentials)

```rego
package judgment_layer.high_risk.D8

# Policy D-8: Hardcoded credentials detected
# Trigger: Secrets scanning reports detected credentials
# Action: Deny (no override path)

default decision = "not_applicable"

decision = "deny" {
    count(input.secrets_scanning.detected_secrets) > 0
}

denial_reason = sprintf("Hardcoded credentials detected in %d location(s): %s", [
    count(input.secrets_scanning.detected_secrets),
    concat(", ", [s.file_path | s := input.secrets_scanning.detected_secrets[_]])
])

policy_id = "D-8"
policy_name = "Hardcoded credentials detected"
severity = "critical"
override_allowed = false
evidence_sources = ["secrets_scanning.detected_secrets"]
compliance_references = []
```

### 5.4 Example Policy: E-2 (SOX Scope Changes)

```rego
package judgment_layer.critical.E2

# Policy E-2: SOX scope changes
# Trigger: Diff touches SOX-relevant paths
# Action: Escalate to MRM with SR 11-7 reference

default decision = "not_applicable"

decision = "escalate" {
    count(input.compliance_scope.sox_paths_touched) > 0
}

escalation_target = {
    "team": "model-risk-management",
    "channel": "servicenow",
    "sla_business_days": 10,
    "context": {
        "sox_paths": input.compliance_scope.sox_paths_touched,
        "compliance_reference": "SR 11-7",
        "mrm_tier": input.compliance_scope.mrm_tier,
        "action_proposal_summary": input.action_proposal.task_statement
    }
}

policy_id = "E-2"
policy_name = "SOX scope changes"
severity = "critical"
override_allowed = false
evidence_sources = ["compliance_scope", "action_proposal"]
compliance_references = ["SR 11-7", "SOX"]
```

---

## 6. Evaluation Pipeline

### 6.1 Execution Order

```
Input Document
      │
      ▼
┌─────────────────────────┐
│ 1. ACTION CLASSIFICATION │  Determine Class A/B/C/D
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 2. HARD DENIALS          │  D-8 (secrets), D-5 (vulns),
│    (short-circuit)       │  D-7 (SAST), E-5 (evidence integrity)
└────────────┬────────────┘
             │ if no denial ↓
             ▼
┌─────────────────────────┐
│ 3. COMPLIANCE ROUTING    │  E-1 (PCI), E-2 (SOX), E-3 (GDPR)
│    (escalation check)    │  These fire regardless of other results
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 4. CLASS-SPECIFIC RULES  │  B-series for Class B
│                          │  C-series for Class C
│                          │  D-series for Class D
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│ 5. DECISION AGGREGATION  │  Combine all policy results
│                          │  into final rule engine output
└─────────────────────────┘
```

### 6.2 Decision Aggregation Logic

```
IF any policy returns "deny"           → final_decision = "deny" (with reasons)
ELSE IF any policy returns "escalate"  → final_decision = "escalate" (with targets)
ELSE IF action_class in [C, D]         → final_decision = "defer_to_llm"
ELSE IF all applicable policies pass   → final_decision = "allow"
ELSE                                   → final_decision = "defer_to_llm"
```

**Key rule:** Denials are terminal and immediate. Escalations accumulate (multiple can fire). LLM deferral happens when the action class requires contextual judgment OR when the rules engine cannot determine a clear outcome.

### 6.3 Multiple Escalation Handling

If a single PR triggers multiple escalation policies (e.g., E-1 PCI + E-2 SOX), all escalations fire independently. The escalation targets are collected into an array in the output.

---

## 7. Output Schema

The rules engine produces a structured output for every evaluation:

```json
{
  "evaluation_id": "uuid",
  "timestamp": "ISO-8601",
  "engine_version": "string",
  "policy_bundle_version": "string",
  "latency_ms": "integer",

  "action_class": "A | B | C | D",

  "final_decision": "allow | deny | escalate | defer_to_llm",

  "policies_evaluated": [
    {
      "policy_id": "B-1",
      "policy_name": "In-scope feature branch modifications",
      "result": "allow | deny | escalate | pass | not_applicable | defer_to_llm",
      "evidence_consumed": ["action_proposal.stated_scope", "diff.files_changed"],
      "reasoning": "string (deterministic explanation)"
    }
  ],

  "denials": [
    {
      "policy_id": "D-8",
      "reason": "Hardcoded credentials detected in 2 location(s)",
      "override_allowed": false,
      "evidence": {}
    }
  ],

  "escalations": [
    {
      "policy_id": "E-2",
      "target_team": "model-risk-management",
      "channel": "servicenow",
      "sla_business_days": 10,
      "context": {},
      "compliance_references": ["SR 11-7", "SOX"]
    }
  ],

  "llm_deferral": {
    "reason": "Action class C requires contextual evaluation",
    "context_for_llm": {},
    "policies_requiring_llm": ["C-1"]
  },

  "audit_entry": {
    "decision_id": "uuid",
    "pr_url": "string",
    "agent_identifier": "string",
    "developer_identifier": "string",
    "compliance_references": ["string"],
    "retention_years": 3
  }
}
```

---

## 8. Configuration Management

### 8.1 Client-Specific Configuration (Data, Not Code)

These files are the output of the risk taxonomy workshop and are what make the engine client-specific:

**`path_patterns.json`** — Maps file paths to risk classifications:
```json
{
  "high_risk_paths": [
    "services/auth/**",
    "middleware/session/**",
    "lib/security/**",
    "internal/iam/**",
    "services/payments/**",
    "infrastructure/**",
    ".github/workflows/**"
  ],
  "pci_scope_paths": ["services/payments/**"],
  "sox_scope_paths": ["services/ledger/**", "services/reporting/**"],
  "gdpr_scope_paths": ["services/consent/**", "services/data-subjects/**"],
  "test_paths": ["**/*_test.go", "**/*.test.ts", "**/test/**", "**/__tests__/**"]
}
```

**`thresholds.json`** — Tunable values (adjusted during shadow mode):
```json
{
  "confidence_threshold": 0.7,
  "large_change_lines": 500,
  "large_change_files": 10,
  "snyk_severity_deny_threshold": "high",
  "sast_severity_deny_threshold": "high"
}
```

**`escalation_routing.json`** — Maps policy escalations to actual teams/channels:
```json
{
  "security-engineering": {
    "github_team": "@meridian/security-engineering",
    "slack_channel": "#sec-eng-reviews",
    "sla_business_days": 2
  },
  "model-risk-management": {
    "servicenow_queue": "MRM-AI-REVIEW",
    "sla_business_days": 10,
    "compliance_tag": "SR-11-7"
  },
  "platform-engineering": {
    "github_team": "@meridian/platform-engineering",
    "sla_business_days": 1
  }
}
```

### 8.2 Policy Bundle Lifecycle

```
Workshop output (risk taxonomy doc)
        │
        ▼
Policy bundle authored (Rego + data files)
        │
        ▼
Unit tests pass (opa test)
        │
        ▼
Integration tests against historical PR data
        │
        ▼
Shadow mode deployment (evaluate, don't enforce)
        │
        ▼
Tuning based on shadow mode report
        │
        ▼
Advisory mode deployment
        │
        ▼
Production enforcement
```

---

## 9. Integration Points

### 9.1 Trigger: GitHub Webhook

| Event | Action |
|-------|--------|
| `pull_request.opened` | If AI-generated (detected via commit metadata / PR labels), trigger signal aggregation + evaluation |
| `pull_request.synchronize` | Re-evaluate on new commits pushed to the PR |
| `check_suite.completed` | Re-evaluate when CI results arrive (may change CI-dependent policy outcomes) |

### 9.2 Output: GitHub Check Run

The rules engine posts its result as a **GitHub Check Run** on the PR:

- **Status:** `success` (allow), `failure` (deny), `neutral` (escalate/defer to LLM)
- **Summary:** Human-readable explanation of policies evaluated and outcome
- **Annotations:** File-level annotations for specific policy triggers (e.g., "This file is in PCI scope — escalated to security")

### 9.3 Output: Audit Log (Splunk)

Every evaluation is shipped to the audit infrastructure regardless of outcome. Schema matches Section 7 output.

### 9.4 Output: Escalation Dispatch

When escalations fire, the rules engine dispatches to:
- **GitHub:** PR review requests to specified teams
- **Slack:** Notifications to specified channels
- **ServiceNow:** Structured tickets for MRM/compliance workflows
- **Email:** Digest notifications for compliance officers

---

## 10. Deployment Architecture

### 10.1 Infrastructure

```
┌──────────────────────────────────────────────────┐
│  Judge Service (Kubernetes)                       │
│                                                   │
│  ┌─────────────────┐    ┌─────────────────────┐  │
│  │ Signal          │    │ OPA Engine          │  │
│  │ Aggregator      │───▶│ (sidecar or library)│  │
│  │ (Go/Python)     │    │                     │  │
│  └────────┬────────┘    └──────────┬──────────┘  │
│           │                        │              │
│  ┌────────▼────────┐    ┌─────────▼──────────┐  │
│  │ Webhook         │    │ Decision           │  │
│  │ Receiver        │    │ Dispatcher         │  │
│  │ (GitHub events) │    │ (GitHub, Slack,    │  │
│  └─────────────────┘    │  ServiceNow, Splunk)│  │
│                          └────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### 10.2 Scaling Considerations

| Dimension | Approach |
|-----------|----------|
| Throughput | Stateless service; horizontal scaling via replicas. At ~240 PRs/month (client baseline), a single replica is sufficient. |
| Latency | OPA evaluates in <10ms per policy. Signal aggregation (parallel API calls) is the bottleneck — target <5s total. |
| Availability | Non-blocking in advisory mode (PR proceeds if judge is unavailable). In enforcement mode, circuit breaker fails open with alert. |
| Multi-repo | Same service, different policy bundles per repo. Bundle selection via repo metadata. |

---

## 11. Testing Strategy

### 11.1 Unit Tests (Per Policy)

Every `.rego` file has a corresponding `_test.rego`:

```rego
package judgment_layer.high_risk.D8_test

import data.judgment_layer.high_risk.D8

test_deny_when_secrets_detected {
    D8.decision == "deny" with input as {
        "secrets_scanning": {
            "detected_secrets": [
                {"type": "aws_key", "file_path": "config/app.go", "line_number": 42}
            ]
        }
    }
}

test_not_applicable_when_no_secrets {
    D8.decision == "not_applicable" with input as {
        "secrets_scanning": {
            "detected_secrets": []
        }
    }
}
```

### 11.2 Integration Tests (Historical PR Replay)

- Replay the last 30 days of AI-generated PRs through the rules engine
- Compare rules engine decisions against actual outcomes
- Identify false positives (would have blocked something that was fine) and false negatives (would have allowed something that caused an issue)
- This IS the shadow mode report

### 11.3 Regression Tests (Policy Change Safety)

- Before any policy bundle update, run the full historical PR corpus
- Diff the results against the previous bundle version
- Require explicit approval for any change that would flip a historical decision

---

## 12. Observability

| Metric | Purpose |
|--------|---------|
| `rule_engine_evaluation_latency_ms` | Performance monitoring, SLA compliance |
| `rule_engine_decisions_total{decision=allow\|deny\|escalate\|defer}` | Decision distribution tracking |
| `rule_engine_policy_triggers_total{policy_id}` | Which policies fire most often (tuning signal) |
| `signal_aggregator_latency_ms{source}` | Per-source latency tracking |
| `signal_aggregator_failures_total{source}` | Signal source reliability |
| `escalation_dispatch_latency_ms{target}` | Escalation delivery performance |

---

## 13. Open Questions for Workshop

These are decisions that should be resolved during the 3-day risk taxonomy workshop with the client:

1. **Path pattern specificity** — How granular are the client's path-to-scope mappings? Do they already have something like `scope.yml` or does it need to be created from scratch?
2. **Approved dependency list** — Does one exist today? What format? Who maintains it?
3. **CODEOWNERS completeness** — What's the current coverage? Are there orphaned paths?
4. **CI check naming conventions** — What are the exact check names the rules engine should evaluate?
5. **Secrets scanning configuration** — Is GitHub Advanced Security enabled? Are there custom patterns?
6. **Fail-open vs. fail-closed** — Client risk appetite for signal source unavailability
7. **Shadow mode duration** — Is 30 days of historical data sufficient for tuning confidence?

---

This spec covers the deterministic layer only. The LLM judge spec would be a separate document covering prompt templates, confidence scoring, context assembly, and the handoff protocol from the rules engine.

Want me to draft the LLM judge spec as a companion, or go deeper on any section of this (e.g., the signal aggregator implementation, the GitHub App configuration, or the OPA deployment pattern)?

**References:** Engagement summary.docx, example_risk_taxonomy_meridian.md, judgment_layer_architecture_horizontal_v2.docx