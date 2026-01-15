# Quality Checklist: [Feature Name]

**Feature ID**: [###-feature-name]
**Review Date**: [Date]
**Reviewer**: [Name]

## Purpose

This checklist serves as "unit tests for specifications" - ensuring requirements are complete, clear, consistent, and implementable before development begins.

## Specification Completeness

### Required Sections
- [ ] Overview section exists and is clear
- [ ] At least one P1 user scenario defined
- [ ] All scenarios have Given/When/Then acceptance criteria
- [ ] Functional requirements list with FR-### identifiers
- [ ] Non-functional requirements defined
- [ ] Success criteria are measurable
- [ ] Dependencies section complete
- [ ] Out of scope section exists

### Scenario Quality
- [ ] Each scenario describes a complete user journey
- [ ] Acceptance criteria are testable
- [ ] Edge cases are identified
- [ ] Scenarios are independent (no hidden dependencies)
- [ ] Priority levels (P1/P2/P3) are appropriate

### Requirements Quality
- [ ] Each requirement has unique identifier
- [ ] Requirements are unambiguous
- [ ] Context provided for each requirement
- [ ] Constraints are documented
- [ ] No conflicting requirements

## Clarity & Consistency

### Language & Terminology
- [ ] Technical terms are defined or well-understood
- [ ] Terminology is consistent throughout
- [ ] No undefined acronyms or abbreviations
- [ ] Active voice used (not passive)
- [ ] Concise language (no unnecessary words)

### Ambiguity Detection
- [ ] No vague words: "should", "might", "probably", "usually"
- [ ] No undefined pronouns: "it", "they", "this" (without clear antecedent)
- [ ] No weasel words: "fast", "good", "better", "efficient" (without metrics)
- [ ] Quantified requirements: specific numbers, percentages, timeframes
- [ ] All `[NEEDS CLARIFICATION]` markers have owners

### Consistency Checks
- [ ] Spec.md aligns with plan.md
- [ ] Plan.md implementation matches spec.md requirements
- [ ] Tasks.md covers all plan.md phases
- [ ] No contradictions between documents
- [ ] Success criteria match requirements

## Constitutional Compliance

### Article I: Specification-First
- [ ] Specification complete before implementation planning
- [ ] Focus on WHAT, not HOW
- [ ] No implementation details in spec.md

### Article II: Agent Isolation
- [ ] Agent boundaries respected (if applicable)
- [ ] No cross-agent dependencies (if applicable)

### Article III: Custom Tool Integration
- [ ] Tools use standardized interfaces (if applicable)
- [ ] Tool registration follows conventions (if applicable)

### Article IV: Test-First
- [ ] Test scenarios defined in spec.md
- [ ] Acceptance criteria are testable
- [ ] Test coverage plan exists in plan.md

### Article V: Copilot-Native Integration
- [ ] Follows VS Code Chat API (if applicable)
- [ ] Native integration approach documented

### Article VI: Privacy-First
- [ ] No PII collection (if applicable)
- [ ] Telemetry is opt-in (if applicable)
- [ ] Privacy considerations documented

### Article VII: Simplicity
- [ ] Solution is as simple as possible
- [ ] No unnecessary complexity
- [ ] Clear and maintainable approach

### Article VIII: Versioned Evolution
- [ ] Semantic versioning plan exists
- [ ] Breaking changes documented
- [ ] Migration path defined (if applicable)

## Implementation Readiness

### Technical Feasibility
- [ ] All dependencies are available/installable
- [ ] Technology choices are validated
- [ ] Performance targets are achievable
- [ ] Security requirements are implementable

### Resource Availability
- [ ] Required skills are available on team
- [ ] Timeline is realistic
- [ ] Dependencies on other teams/features identified

### Risk Assessment
- [ ] Technical risks identified and mitigated
- [ ] Unknowns are marked with `[NEEDS CLARIFICATION]`
- [ ] Fallback plans exist for high-risk items

## Documentation Quality

### User-Facing Documentation
- [ ] Feature is documented for end users
- [ ] Examples provided where helpful
- [ ] Common use cases covered

### Developer Documentation
- [ ] Architecture is documented in plan.md
- [ ] API contracts defined
- [ ] Error handling strategy documented
- [ ] Testing strategy clear

## Validation Results

### Issues Found
List any issues discovered during review:
1. [Issue description] - Severity: High | Medium | Low
2. [Issue description] - Severity: High | Medium | Low

### Recommendations
List recommendations for improvement:
1. [Recommendation]
2. [Recommendation]

### Approval Status

- [ ] **APPROVED**: Specification is complete and ready for implementation
- [ ] **APPROVED WITH CHANGES**: Minor changes required (list above)
- [ ] **REJECTED**: Major issues must be addressed before implementation

**Reviewer Signature**: [Name]
**Date**: [Date]
**Next Review**: [Date, if needed]

## Notes

[Additional notes or context from the review]
