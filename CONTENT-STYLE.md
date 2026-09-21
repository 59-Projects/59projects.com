# Content Style Guide

How 59projects.com talks. Read this before drafting or editing any copy in
this repo, including new project case studies. It's built from what's
already shipped (Home, About, Services, Contracting) plus decisions Jeremy
made explicitly while drafting them. When in doubt, match the shipped pages
over this document, and update this document.

For general writing rules that apply across all of Jeremy's projects, not
just this site, see the workspace `CLAUDE.md` (`writing-style.mdc`). This
file is the site-specific layer on top of that.

## Voice and point of view

Two voices, used deliberately, not inconsistently:

- **"We"** on Home, About, Services, Contracting, and all project pages.
  This is the practice describing its work and capabilities.
- **"I"** on Contact only. That's the moment Jeremy is personally inviting
  someone to reach out, and it should read that way.

Don't smooth this into one voice everywhere. The split is intentional: the
practice talks about the work, Jeremy talks to the person reading it.

## Tone

- Direct and honest, not agency-speak. If a sentence sounds like it belongs
  in a pitch deck, rewrite it.
- Concrete and specific beats promotional, always. Say what actually
  happened, not what it demonstrates about the brand.
- Every sentence should pass this test: could Jeremy say this out loud to a
  client and have them lean forward? If it sounds like something you'd only
  ever write down, cut it.
- No self-congratulation. Good work is described plainly, not celebrated.
  ("The work won a Webby Award," not "We're proud to have won...")
- Acknowledge open questions instead of pretending certainty. See the ACA
  Ukraine case study: *"Whether that instinct proves out elsewhere is still
  open."* Confidence about what happened, honesty about what's still
  unproven.
- Credit collaborators by name. Every project's `credits` frontmatter exists
  for this reason. Don't let "we" erase who else did the work.

## Never

- Em dashes, or double hyphens standing in for one. This includes `--`,
  `---`, `&mdash;`, and the `—` character itself. Use commas, colons,
  parentheses, or restructure the sentence.
- Empty descriptors: *dynamic, passionate, results-driven, innovative,*
  and their relatives (*cutting-edge, world-class, best-in-class,
  game-changing, transformative*).
- Corporate-speak verbs and nouns: *leverage, empower, enable, unlock,
  elevate, synergy, solutions* (as a noun standing in for "the thing we
  built"), *seamless, robust, scalable* used as filler rather than a
  specific claim.
- Numbers or proof points 59 Projects hasn't itself earned. The Brooklyn
  Rail's tripled readership and Webby, and Digital.gov's 22 communities of
  practice, are real and can be cited, but always attributed to that era
  of Jeremy's career, not folded in as if they're 59 Projects LLC metrics.
  No fabricated or placeholder stats to fill a gap.
- Testimonials or a proof-point numbers section. Deliberately absent
  because the practice doesn't yet have verified 59 Projects-specific
  client outcomes to point to. Don't add a placeholder version of either
  while that's true; add the real thing once it exists.
- Borrowed framing. If a client used specific language to describe the
  value of the work (see the Creative Santa Fe feedback that shaped
  Services' "What This Adds Up To" section), translate it into Jeremy's
  own words rather than reusing theirs.

## Sentence-level patterns already in use

These aren't rules to force onto every paragraph, they're the rhythms
already present in shipped copy. New copy should sound like it came from
the same person.

**Rule of three, negated then resolved.** State who it's *not* for, then
land on what it actually is:
> "Not whoever has the budget. Not whoever wants to run an innovative
> program. We start by listening for that idea..."

**Short declarative, then the complication.**
> "59 Projects does not hand off a report and leave. The measure of success
> is whether the people in the room can keep moving on their own."

**Colon to set up a concrete list or persona**, rather than a bullet list:
> "This is built for people with a mandate and a moment: a director who has
> the budget and the authority to make a change, but needs help finding the
> actual path..."

**Plain verbs for real actions**, not abstractions: *talk to, watch, write
down, build, ship, hand off.* Avoid describing an action so generically it
could apply to any consultancy.

## Project case study structure

Used by ACA Ukraine and NM Water Data; the template for Many Paths,
Brooklyn Rail, and any future project page:

1. **Intro** (optional, one paragraph) — what was built and for whom, in
   plain terms.
2. **The Problem** — what was actually broken, in the words of the people
   living it. Specific numbers and details (headcount, timelines, what
   people had already tried) over generic problem statements.
3. **How We Worked** — the actual process: who was talked to, what tools
   or decisions came out of it, and why, including the tradeoffs
   considered. This is where the research-to-strategy-to-build arc from
   Services should show up in the specifics of one engagement.
4. Optional named sections for anything that doesn't fit the flow above
   (NM Water Data's "In-Person Workshops" and "Collaborative AI Practice").
   Use a named section when something is distinctive enough to deserve its
   own beat, not to pad length.
5. **What Shipped** — the concrete result. What exists now that didn't
   before.
6. **What We Learned** — one honest reflection, not a highlight reel. Good
   ones surface something that would help the next engagement, not just
   flatter this one.

Placeholder copy (currently on Many Paths and Brooklyn Rail) should say so
plainly rather than pretend to be finished: *"Placeholder copy, replace
with the real write-up."*

## Process for new copy

Draft a version, then ask what feels off, rather than presenting finished
copy as final. That's how Services and About were actually written (see
git history and `SERVICES-DRAFT.md`'s "Notes for Iteration" section for a
real example of this in practice, including where Jeremy's brief and this
guide's own rules were in tension and how that got resolved).
