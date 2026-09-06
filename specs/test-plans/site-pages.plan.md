# Site Pages Test Plan

## Application Overview

End-to-end test plan for the public site at https://bishal-thapaliya.netlify.app. Covers functional, navigation, content, accessibility, and negative tests for each discovered page and global elements. Assumes a fresh browser state for each test.

## Test Scenarios

### 1. Site Pages

**Seed:** `tests/seed.spec.ts`

#### 1.1. About Page — Content & Links

**File:** `tests/about.spec.ts`

**Steps:**
  1. Navigate to https://bishal-thapaliya.netlify.app/about
    - expect: Page loads with status 200
    - expect: Page title contains "Portfolio | Bishal Thapaliya"
    - expect: Heading "About Me" is visible
  2. Verify left column (profile) content
    - expect: Avatar image is visible with alt text containing "Bishal Avatar"
    - expect: Contact list shows items: Email, Phone, Birthday, Location
    - expect: Displayed email equals "vishal.thapaliya@gmail.com"
    - expect: Displayed phone equals "+33 07 68 31 94 27"
    - expect: Location equals "Grenoble, France"
  3. Verify social links in profile
    - expect: GitHub, LinkedIn, Twitter/X, and Xing links are present
    - expect: Each social link navigates to the correct external URL
    - expect: External links open in a new tab or have rel="noopener"
  4. Verify main content sections
    - expect: Section "What I'm doing" contains items with headings: Web design, Web development, Mobile apps, Photography
    - expect: Testimonials list contains multiple entries with author headings (e.g., "Anthony Birembaut")
    - expect: All images in testimonials have non-empty alt text
  5. Accessibility & responsiveness checks
    - expect: Main landmarks (navigation, main, complementary, contentinfo) are present
    - expect: Page is readable and layout adapts when viewport is reduced to 375x812 (mobile)

#### 1.2. Resume Page — Load & Download CV

**File:** `tests/resume.spec.ts`

**Steps:**
  1. Click the "Resume" link in the site navigation
    - expect: Browser navigates to /resume
    - expect: Page contains a heading indicative of resume or CV content (e.g. "Resume", "Experience", or "Education")
  2. Click the "Download CV" link in navigation or on page
    - expect: A PDF download starts or the PDF resource is reachable at /assets/Resume_Thapaliya_Bishal-DuDUG5sz.pdf
    - expect: Response status for the PDF is 200
    - expect: Downloaded file has PDF mime-type (application/pdf)
  3. Negative: broken PDF link
    - expect: If the PDF returns non-200, the test reports a failed download and logs the response status

#### 1.3. Portfolio Page — Projects & Interactions

**File:** `tests/portfolio.spec.ts`

**Steps:**
  1. Navigate via the "Portfolio" link
    - expect: URL becomes /portfolio
    - expect: Page shows a list or grid of project cards (at least one card)
  2. Open the first project card
    - expect: Project details page or modal opens
    - expect: Project contains a title, description, and at least one image or link to the code/demo
  3. If filters/categories exist, apply a filter
    - expect: Project list updates to reflect the selected filter
    - expect: At least one matching project remains visible or an empty state explains no matches
  4. Verify external project/demo links
    - expect: External demo/code links open in a new tab and return 200 when requested

#### 1.4. Blog Page — Posts & Reading Flow

**File:** `tests/blog.spec.ts`

**Steps:**
  1. Open the "Blog" page from navigation
    - expect: URL becomes /blog
    - expect: Page shows a list of posts or a clear empty state
  2. Open the first blog post
    - expect: Post page opens with a readable title, publish date, and content body
    - expect: Images inside the post have alt text and load successfully
  3. Share / social interactions (if present)
    - expect: Share buttons are visible and open the correct share endpoints

#### 1.5. Contact Page — Form Validation & Submission

**File:** `tests/contact.spec.ts`

**Steps:**
  1. Click the "Contact" link in navigation
    - expect: URL becomes /contact
    - expect: Contact form or contact details are visible
  2. Submit the contact form with valid data (Name, valid Email, Message)
    - expect: Submission returns a success message or confirmation UI
    - expect: Form fields clear or show a success state
    - expect: Server / API returns 200 or appropriate success response when applicable
  3. Submit the contact form with invalid email
    - expect: Client validation prevents submission and displays an email-format error message
    - expect: No network request is made to the contact endpoint for invalid inputs
  4. Negative: required fields empty
    - expect: Form shows required-field validation messages for missing fields
    - expect: Submission is blocked until required fields are provided

#### 1.6. Global Navigation & Footer — Integrity and Accessibility

**File:** `tests/navigation-footer.spec.ts`

**Steps:**
  1. Verify main navigation links are present: About, Resume, Portfolio, Blog, Contact, Download CV
    - expect: Each navigation link points to the correct internal path or external asset
    - expect: The currently active page's nav item is visually or programmatically marked (aria-current or class)
  2. Keyboard navigation test
    - expect: Tab order focuses on navigation then main content then footer
    - expect: Pressing Enter on focused nav links navigates to the expected pages
  3. Footer & copyright
    - expect: Footer displays © 2026 | Bishal Thapaliya
    - expect: Social links in footer point to the same external profiles as the profile column and open safely (rel and target)
  4. 404 / unknown route behavior
    - expect: Navigating to a non-existent route returns a user-friendly 404 page or redirects to home
    - expect: No uncaught errors or stack traces are shown to the user
