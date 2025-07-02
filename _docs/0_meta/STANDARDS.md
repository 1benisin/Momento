# Documentation Standards

**Purpose:** This document defines the standards for creating and maintaining design and planning documents in this repository. Following these standards ensures that our documentation is clear, consistent, and easy to navigate for both humans and AI.

**Last Updated:** 2024-07-26

---

### Table of Contents

- [Standard File Header](#standard-file-header)
- [Standardized Callouts](#standardized-callouts)
  - [The Rationale](#the-rationale)
  - [Future Ideas](#future-ideas)
  - [Decision Log](#decision-log)
  - [Risk Assessment](#risk-assessment)
  - [Open Question](#open-question)
- [Index Files (`index.md`)](#index-files-indexmd)

---

## Standard File Header

Every markdown file in the `_docs` directory (except for `index.md` files and this `STANDARDS.md` file) must begin with the following header format. This provides context and aids navigation.

```markdown
# [Document Title]

**Purpose:** A one-sentence explanation of what this document covers and who should read it.

**Last Updated:** YYYY-MM-DD

---

### Table of Contents

- [Section 1](#section-1)
- [Section 2](#section-2)
```

## Standardized Callouts

To add special emphasis to certain ideas, we use standardized blockquote callouts.

### 🧠 The Rationale

Use this callout to explain the _reasoning_ or _spirit_ behind a decision. It's for capturing the "why" that isn't always obvious from the technical details alone.

**Format:**

```markdown
> **🧠 The Rationale: [Topic]**
> This is where we explain the _feeling_ or reasoning behind a decision.
```

### 💡 Future Ideas

Use this callout for experimental ideas, "what-if" scenarios, or features that are on the back-burner. This separates speculative thoughts from concrete plans.

**Format:**

```markdown
> **💡 Future Ideas: [Topic]**
> Use this for experimental ideas or features that are not yet on the roadmap.
```

### ✅ Decision Log

Use this to formally record a key decision that has been made. This creates a clear historical record and prevents re-opening settled discussions.

**Format:**

```markdown
> **✅ Decision Log: [Topic]**
> A concise summary of the decision that was made and why.
```

### ⚠️ Risk Assessment

This callout highlights potential risks, technical debt, or areas of the plan that are fragile. It serves as a warning to future developers or product managers.

**Format:**

```markdown
> **⚠️ Risk Assessment: [Topic]**
> A description of a potential risk and its possible impact.
```

### 🤔 Open Question

Use this to flag an area where a decision has _not_ yet been made and further discussion is needed.

**Format:**

```markdown
> **🤔 Open Question: [Topic]**
> A clear question that needs to be answered.
```

## Index Files (`index.md`)

Every subdirectory inside `_docs` (e.g., `1_product`, `2_design`) must contain an `index.md` file.

The purpose of this file is to:

1.  Explain the category of documents contained within the directory.
2.  List each document with a short description of its contents.
3.  Provide clear guidance on when a document in this directory should be updated.
