# Manual Testing

This document contains a full manual QA checklist for the **AI Career Guidance Platform**.

> Use a clean browser profile / fresh install (or Incognito) when validating authentication flows.

---

## Legend
- ✅ **Pass/Fail checkbox**: Use `[ ]` for not tested, `[x]` for passed.
- If a step fails, record: **Browser/OS**, **user state (logged-in/out)**, **timestamp**, **expected vs actual**, and any **network/API error**.

---

# 1) Authentication

### AUTH-01 — Sign Up
- **Feature:** Authentication → Sign Up
- **Steps:**
  1. Open the app.
  2. Navigate to **Sign Up**.
  3. Enter a valid **name**, **email**, and **password**.
  4. Submit the form.
  5. Observe whether the user is redirected and session is established.
- **Expected Result:**
  - Account is created successfully.
  - User is signed in (or redirected per product behavior).
- **Pass/Fail:** `[ ]`

### AUTH-02 — Login
- **Feature:** Authentication → Login
- **Steps:**
  1. Navigate to **Login**.
  2. Enter valid **email** and **password**.
  3. Submit.
- **Expected Result:**
  - User is authenticated and redirected to a protected area (e.g., Dashboard).
- **Pass/Fail:** `[ ]`

### AUTH-03 — Logout
- **Feature:** Authentication → Logout
- **Steps:**
  1. Log in.
  2. Click **Logout**.
  3. Attempt to refresh the page.
  4. Navigate to a protected route.
- **Expected Result:**
  - Session is cleared.
  - Protected routes require re-authentication.
- **Pass/Fail:** `[ ]`

### AUTH-04 — Protected Routes
- **Feature:** Protected Routes enforcement
- **Steps:**
  1. Log out (or use Incognito).
  2. Manually open a protected URL (e.g., Dashboard, Assessment).
  3. Observe route behavior.
- **Expected Result:**
  - User is redirected to Login/Signup as appropriate.
- **Pass/Fail:** `[ ]`

### AUTH-05 — Invalid Credentials
- **Feature:** Authentication → Invalid login
- **Steps:**
  1. Navigate to Login.
  2. Enter a valid email but incorrect password.
  3. Submit.
- **Expected Result:**
  - Clear error message is shown.
  - No authenticated session is created.
- **Pass/Fail:** `[ ]`

---

# 2) Assessment

### ASSESS-01 — Complete assessment
- **Feature:** Assessment flow end-to-end
- **Steps:**
  1. Log in.
  2. Go to **Assessment**.
  3. Fill out all assessment questions/fields.
  4. Submit/finish assessment.
  5. Navigate to dashboard/recommendations (if shown).
- **Expected Result:**
  - Submission succeeds.
  - Progress/completion state updates.
  - Recommendations/insights reflect assessment results.
- **Pass/Fail:** `[ ]`

### ASSESS-02 — Validation
- **Feature:** Assessment validation (required fields)
- **Steps:**
  1. Go to Assessment.
  2. Leave one required answer blank.
  3. Try to submit.
- **Expected Result:**
  - Inline validation errors are displayed.
  - Submission is blocked until valid.
- **Pass/Fail:** `[ ]`

### ASSESS-03 — Progress
- **Feature:** Assessment progress indicator
- **Steps:**
  1. Start assessment.
  2. Answer first few questions.
  3. Observe progress UI.
  4. Refresh page mid-flow.
- **Expected Result:**
  - Progress updates as answers are completed.
  - Refresh does not break or resets unexpectedly (according to intended behavior).
- **Pass/Fail:** `[ ]`

### ASSESS-04 — Review
- **Feature:** Assessment review step
- **Steps:**
  1. Near completion, open **Review** step (if present).
  2. Verify entered answers are displayed correctly.
  3. Go back and modify answers.
- **Expected Result:**
  - Review reflects current answers.
  - Editing returns changes correctly.
- **Pass/Fail:** `[ ]`

### ASSESS-05 — Submission
- **Feature:** Assessment submission
- **Steps:**
  1. Submit a completed assessment.
  2. Watch loading state.
  3. Verify resulting page state (recommendations/insights).
- **Expected Result:**
  - No duplicate submissions.
  - Result is generated and displayed.
- **Pass/Fail:** `[ ]`

---

# 3) Recommendations

### REC-01 — Recommendation list
- **Feature:** Recommendation list display
- **Steps:**
  1. Complete assessment.
  2. Open dashboard/recommendations area.
  3. Scroll through recommendation cards.
- **Expected Result:**
  - Recommendations render with correct ordering.
  - Cards are clickable and lead to corresponding career details.
- **Pass/Fail:** `[ ]`

### REC-02 — Recommendation reason
- **Feature:** Explanation/reasoning text
- **Steps:**
  1. Open a recommendation card or details view.
  2. Locate the **reason** / **why recommended** section.
- **Expected Result:**
  - Reason is shown and matches expected data.
  - No empty placeholders or broken formatting.
- **Pass/Fail:** `[ ]`

### REC-03 — Empty recommendation state
- **Feature:** Empty recommendations handling
- **Steps:**
  1. Log in with a new account or clear assessment data (if possible).
  2. Go to recommendations.
- **Expected Result:**
  - Empty state UI appears.
  - Clear call-to-action guides user to complete assessment.
- **Pass/Fail:** `[ ]`

---

# 4) Career Details

### CAREER-01 — Career information
- **Feature:** Career details overview
- **Steps:**
  1. Open a career from recommendations.
  2. Verify key fields render (title, summary/overview).
- **Expected Result:**
  - Career page loads correctly.
  - All text blocks are readable and correctly formatted.
- **Pass/Fail:** `[ ]`

### CAREER-02 — Roadmap
- **Feature:** Roadmap section
- **Steps:**
  1. On career details page, scroll to **Roadmap**.
  2. Verify steps/stages list.
- **Expected Result:**
  - Roadmap items render fully.
  - No truncation glitches.
- **Pass/Fail:** `[ ]`

### CAREER-03 — Skills
- **Feature:** Skills section
- **Steps:**
  1. Navigate to career details.
  2. Verify displayed skills.
- **Expected Result:**
  - Skills list is present.
  - UI aligns with expected data model.
- **Pass/Fail:** `[ ]`

### CAREER-04 — Salary
- **Feature:** Salary section
- **Steps:**
  1. Navigate to career details.
  2. View salary range.
- **Expected Result:**
  - Salary values display with correct formatting.
  - No NaN/undefined placeholders.
- **Pass/Fail:** `[ ]`

### CAREER-05 — Save/Unsave
- **Feature:** Save/un-save career
- **Steps:**
  1. On career details, click **Save**.
  2. Confirm saved indicator changes.
  3. Navigate to **Saved Careers**.
  4. Unsave the same career.
- **Expected Result:**
  - Saved state persists across page refresh.
  - Unsave removes it from saved list.
- **Pass/Fail:** `[ ]`

---

# 5) AI Career Mentor (Chat)

### CHAT-01 — Chat
- **Feature:** AI mentor chat
- **Steps:**
  1. Open **AI Mentor** page.
  2. Enter a meaningful prompt.
  3. Send message.
  4. Wait for response.
- **Expected Result:**
  - User message appears.
  - Mentor response is displayed.
  - Chat stays usable after response.
- **Pass/Fail:** `[ ]`

### CHAT-02 — Follow-up questions
- **Feature:** Multi-turn context
- **Steps:**
  1. After receiving a response, ask a follow-up.
  2. Send multiple follow-ups.
- **Expected Result:**
  - Follow-up messages are accepted.
  - Responses appear sequentially.
  - No duplicated or missing chat bubbles.
- **Pass/Fail:** `[ ]`

### CHAT-03 — Empty prompt
- **Feature:** Input validation
- **Steps:**
  1. Open chat.
  2. Leave prompt empty.
  3. Press Send.
- **Expected Result:**
  - Send is blocked or an inline validation/error is shown.
  - No server error is triggered.
- **Pass/Fail:** `[ ]`

### CHAT-04 — Error handling
- **Feature:** AI/chat error handling
- **Steps:**
  1. Simulate network offline or block the API URL (or provide invalid server state).
  2. Send a prompt.
  3. Observe UI behavior.
- **Expected Result:**
  - Friendly error message is shown.
  - Loading state stops.
  - User can retry.
- **Pass/Fail:** `[ ]`

---

# 6) Skill Gap

### GAP-01 — Skill gap analysis render
- **Feature:** Skill gap views
- **Steps:**
  1. Open **Skill Gap** page.
  2. Verify progress bars / charts.
  3. Verify learning suggestions list.
- **Expected Result:**
  - All sections render without layout break.
  - Suggestions are visible and not malformed.
- **Pass/Fail:** `[ ]`

---

# 7) Career Comparison

### COMP-01 — Career comparison
- **Feature:** Compare careers table/charts
- **Steps:**
  1. Open **Compare Careers**.
  2. Select two careers.
  3. Verify comparison charts and table.
- **Expected Result:**
  - Correct careers appear.
  - Charts/table update reliably.
- **Pass/Fail:** `[ ]`

---

# 8) Saved Careers

### SAVED-01 — Saved careers list
- **Feature:** Saved careers management
- **Steps:**
  1. Save a career.
  2. Open **Saved Careers**.
  3. Verify saved card(s).
  4. Click a saved career.
- **Expected Result:**
  - Saved list shows recently saved careers.
  - Clicking navigates to correct career details.
- **Pass/Fail:** `[ ]`

### SAVED-02 — Empty saved state
- **Feature:** Empty state UI
- **Steps:**
  1. Log in with a user that has no saved careers.
  2. Open Saved Careers page.
- **Expected Result:**
  - Empty state component is displayed.
  - Clear instruction to save a career.
- **Pass/Fail:** `[ ]`

---

# 9) Profile

### PROFILE-01 — Profile page
- **Feature:** Profile rendering
- **Steps:**
  1. Navigate to **Profile**.
  2. Verify displayed user info.
- **Expected Result:**
  - User data loads.
  - Page is secure (no data leakage across users).
- **Pass/Fail:** `[ ]`

---

# 10) PDF Export

### PDF-01 — PDF Export works
- **Feature:** PDF generation for career report
- **Steps:**
  1. Open a career details page.
  2. Find **Export/Generate PDF** action.
  3. Generate the PDF.
  4. Verify downloaded file opens.
- **Expected Result:**
  - PDF downloads successfully.
  - Contents (title/sections) are readable.
- **Pass/Fail:** `[ ]`

---

# 11) Responsive layout

### RESP-01 — Mobile / small screen layout
- **Feature:** Responsive UI
- **Steps:**
  1. Use browser devtools responsive mode (e.g., 375x667).
  2. Navigate across: Dashboard, Assessment, Career Details, Chat.
- **Expected Result:**
  - No overlapping/hidden critical UI.
  - Fonts and cards remain readable.
- **Pass/Fail:** `[ ]`

---

# 12) Error handling

### ERR-01 — Server/API failure handling
- **Feature:** Global error handling
- **Steps:**
  1. Temporarily break API connectivity (or use wrong backend URL).
  2. Load Dashboard.
  3. Trigger an API action (e.g., load recommendations).
- **Expected Result:**
  - App shows an error/empty state.
  - UI does not crash.
- **Pass/Fail:** `[ ]`

### ERR-02 — Unexpected data / missing fields
- **Feature:** Defensive rendering
- **Steps:**
  1. Navigate to pages that rely on backend data.
  2. Verify UI behavior when certain optional fields are absent (if seeded/possible).
- **Expected Result:**
  - UI shows placeholders/omits sections gracefully.
  - No runtime exceptions.
- **Pass/Fail:** `[ ]`

