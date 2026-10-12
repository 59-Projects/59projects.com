import type { Scenario } from "./model";

/**
 * Three illustrative scenarios. They are composites written to show how the
 * framework behaves in different settings. The numbers are not measurements.
 * Each action's "why" line is checked against Stern and Baird (2015). It either
 * restates the paper or is worded as a plain reading of it, and avoids claims
 * the paper does not make.
 */

const park: Scenario = {
  id: "park",
  name: "A park and its neighbors",
  tagline:
    "A long-running tension between a protected area and the people who live beside it.",
  setting:
    "A regional park borders a river town. When it expanded, some families lost the grazing and firewood access they had counted on, and the town still talks about it. For years the park manager stopped by the diner most mornings and asked the locally hired crew before making big calls. Goodwill held. Then the park manager was transferred.",
  atStake:
    "Whether the park can keep working with its neighbors when the people it depends on change.",
  scales: {
    person: {
      label: "Person to person",
      who: "Rangers, staff and individual residents",
    },
    org: {
      label: "Organization",
      who: "The park unit and the local community",
    },
    system: {
      label: "System",
      who: "The agency's rules and how decisions get made",
    },
  },
  dispositional: { person: -0.2, org: -0.5, system: -0.7 },
  start: {
    person: { rational: 10, affinitive: 55, systems: 0 },
    org: { rational: 10, affinitive: 45, systems: 5 },
    system: { rational: 5, affinitive: 0, systems: 5 },
  },
  anchors: {
    person: { affinitive: "The park manager and the locally hired crew" },
    org: { affinitive: "Goodwill that depends on a few well-liked people" },
  },
  actions: [
    {
      id: "walk-town",
      kind: "build",
      label: "Staff spend time in town, unscheduled",
      summary:
        "Rangers and managers show up at the market, the school and local events with no agenda.",
      why: "Affinitive trust grows through social contact, shared values and being listened to.",
      effects: { person: { affinitive: 14 }, org: { affinitive: 8 } },
    },
    {
      id: "local-staff",
      kind: "build",
      label: "Keep the same staff in the community for years",
      summary:
        "The people residents know stay in the same roles instead of rotating out.",
      why: "Consistency lets both personal relationships and a record of performance build up.",
      effects: {
        person: { affinitive: 10, rational: 8 },
        org: { rational: 8 },
      },
    },
    {
      id: "commitments",
      kind: "build",
      label: "Publish a list of commitments and report on each one",
      summary:
        "The park posts what it promised for the year and what it actually did.",
      why: "Rational trust comes from consistent, visible performance over time.",
      effects: { org: { rational: 20 }, system: { rational: 8 } },
    },
    {
      id: "write-rules",
      kind: "build",
      label: "Residents help write the access rules",
      summary:
        "Neighbors and park staff draft the rules for trail access and grazing permits together.",
      why: "Systems-based trust grows when procedures are developed jointly and seen as fair.",
      effects: { system: { systems: 25 }, org: { systems: 15 } },
    },
    {
      id: "show-reasons",
      kind: "build",
      label: "Post how each major decision was made, and why",
      summary:
        "Decisions come with the reasons and the input that shaped them.",
      why: "Transparency in decision making is one of the sources of procedural legitimacy.",
      effects: { org: { systems: 15 }, system: { systems: 10 } },
    },
    {
      id: "own-it",
      kind: "build",
      label: "The agency names a past broken promise and offers to repair it",
      summary:
        "A senior official acknowledges the harm and agrees to controls residents can check.",
      why: "Repair tends to work better when an honest admission comes with controls the agency takes on voluntarily.",
      effects: {
        org: { affinitive: 10, systems: 8 },
        system: { systems: 12 },
      },
    },
    {
      id: "short-grants",
      kind: "damage",
      label: "Outreach programs run one season, then the staff move on",
      summary:
        "A summer of events and meetings, then nothing until next year's grant.",
      why: "Intermittent presence builds distrust and leaves residents wondering where the money went.",
      effects: {
        person: { affinitive: -8 },
        org: { rational: -15, affinitive: -10 },
      },
    },
    {
      id: "no-notice",
      kind: "damage",
      label: "A major decision is made without telling locals",
      summary:
        "Residents learn about a change from a sign posted at the trailhead.",
      why: "When people see the process as unfair, trust in the system erodes, and that can spread to how they see the people running it.",
      effects: {
        org: { systems: -25, affinitive: -10 },
        system: { systems: -15 },
      },
    },
    {
      id: "cut-access",
      kind: "damage",
      label:
        "A trail the town has used for generations is closed without discussion",
      summary: "The regional office changes access to a long-used route.",
      why: "Losing trust in the system spills over into how people trust each other and the people running it.",
      effects: {
        system: { systems: -30 },
        org: { systems: -25 },
        person: { affinitive: -10 },
      },
    },
    {
      id: "uneven",
      kind: "damage",
      label: "Rules are enforced differently for different people",
      summary:
        "Residents notice that some people get warnings and others get citations.",
      why: "Inconsistent enforcement damages both performance trust and the sense that the rules are fair.",
      effects: { person: { rational: -10 }, system: { systems: -15 } },
    },
  ],
  shocks: [
    {
      id: "manager-leaves",
      kind: "shock",
      label: "The park manager is transferred",
      summary:
        "The person most residents trusted moves on, and someone new arrives.",
      why: "Turnover hits affinitive trust. Rational and systems trust can carry the relationship while it rebuilds.",
      effects: { person: { affinitive: -40 }, org: { affinitive: -35 } },
    },
    {
      id: "budget-cut",
      kind: "shock",
      label: "A budget cut halts programs for a year",
      summary: "Planned work stops and commitments go unmet.",
      why: "Unmet commitments hit rational trust, and funding changes also shake trust in the system. Personal relationships and fair procedures can soften the blow.",
      effects: { org: { rational: -30 }, system: { rational: -20 } },
    },
    {
      id: "policy-change",
      kind: "shock",
      label: "A new national policy changes how the park operates",
      summary: "Rules change from above, with little local say.",
      why: "Policy and leadership changes hit systems-based trust. Rational and affinitive trust help groups work through it together.",
      effects: { system: { systems: -35 }, org: { systems: -30 } },
    },
  ],
};

const city: Scenario = {
  id: "city",
  name: "A city coordinating its providers",
  tagline:
    "Organizations that already know each other, trying to work as one system.",
  setting:
    "A mid-sized city has two dozen organizations serving people experiencing homelessness. The directors have worked together for years and respect each other. They have no shared process: referrals go by phone, each group keeps its own records, and past city plans came and went.",
  atStake:
    "Whether a coordinated approach can hold up when funding, staff or political priorities shift.",
  scales: {
    person: {
      label: "Person to person",
      who: "Case managers and outreach workers",
    },
    org: { label: "Organization", who: "The provider organizations" },
    system: { label: "System", who: "The citywide coordination approach" },
  },
  dispositional: { person: 0.2, org: -0.2, system: -0.4 },
  start: {
    person: { rational: 25, affinitive: 60, systems: 5 },
    org: { rational: 20, affinitive: 40, systems: 5 },
    system: { rational: 10, affinitive: 5, systems: 0 },
  },
  anchors: {
    person: { affinitive: "Years of working side by side" },
    org: { affinitive: "Directors who know and like each other" },
    system: { systems: "Rules the providers agreed to and can read" },
  },
  actions: [
    {
      id: "map",
      kind: "build",
      label: "Map every provider and what each one actually does",
      summary:
        "A short, honest picture of who serves whom, built from interviews.",
      why: "Visible, accurate information about each other supports predictions about who will do what.",
      effects: {
        org: { rational: 10 },
        person: { affinitive: 5 },
        system: { systems: 5 },
      },
    },
    {
      id: "case-conf",
      kind: "build",
      label: "Weekly case conference with a standing agenda",
      summary: "Case managers meet every week, same time, same format.",
      why: "Regular contact with a clear process builds relationships and shows who follows through.",
      effects: {
        person: { rational: 12, affinitive: 8 },
        org: { systems: 10 },
      },
    },
    {
      id: "by-name",
      kind: "build",
      label: "A shared by-name list with two tiers of access",
      summary:
        "One list of people being served, with limited views for most staff and full views for a few.",
      why: "A shared procedure that limits exposure lets people take a risk without relying on personal trust.",
      effects: {
        org: { rational: 15, systems: 15 },
        system: { systems: 15 },
      },
    },
    {
      id: "governance",
      kind: "build",
      label: "Write consent and data rules together",
      summary:
        "Providers draft who can see what, how consent works and how disputes get settled.",
      why: "Jointly developed procedures are one of the main sources of systems-based trust.",
      effects: { system: { systems: 25 }, org: { systems: 20 } },
    },
    {
      id: "publish-priority",
      kind: "build",
      label: "Publish how referrals are prioritized",
      summary: "Everyone can see the rule for who gets the next opening.",
      why: "Transparent decision making makes a process legible and easier to accept.",
      effects: { system: { systems: 15 }, org: { rational: 8 } },
    },
    {
      id: "cover",
      kind: "build",
      label: "Providers cover for each other during a crisis",
      summary:
        "One group takes another's clients for a week when a shelter closes unexpectedly.",
      why: "Shared experiences and dependable help build affinity and a record of performance.",
      effects: {
        person: { affinitive: 10 },
        org: { affinitive: 10, rational: 5 },
      },
    },
    {
      id: "missed-handoff",
      kind: "damage",
      label: "A handoff is missed and a client falls through",
      summary:
        "A referral never arrives and the person disappears from services for a month.",
      why: "A performance failure erodes rational trust. Close relationships and agreed procedures can speed the recovery.",
      effects: {
        person: { rational: -20 },
        org: { rational: -15, systems: -8 },
      },
    },
    {
      id: "data-breach",
      kind: "damage",
      label: "Client information is shared outside the agreed rules",
      summary:
        "Someone forwards a list to a partner who was never granted access.",
      why: "Breaking an agreed rule damages trust in the system, and in the people who did it.",
      effects: {
        system: { systems: -30 },
        org: { systems: -25, affinitive: -10 },
      },
    },
    {
      id: "short-pilot",
      kind: "damage",
      label: "A pilot is funded for six months with no plan after",
      summary:
        "The coordination effort starts well and then stalls when money runs out.",
      why: "Short cycles repeat the pattern of promises that end before results do.",
      effects: { org: { rational: -12 }, system: { rational: -15 } },
    },
    {
      id: "top-down",
      kind: "damage",
      label: "The city announces a new priority without asking providers",
      summary:
        "A press release lands before anyone at the table has heard about it.",
      why: "Decisions made without those affected undercut the sense that the process is fair.",
      effects: { system: { systems: -20 }, org: { affinitive: -10 } },
    },
  ],
  shocks: [
    {
      id: "coord-leaves",
      kind: "shock",
      label: "The coordinator everyone relied on leaves",
      summary: "The person who held the network together takes another job.",
      why: "Personnel turnover hits affinitive trust. Shared rules and a performance record keep the work moving while relationships rebuild.",
      effects: {
        person: { affinitive: -30, rational: -10 },
        org: { affinitive: -25 },
      },
    },
    {
      id: "lead-funding",
      kind: "shock",
      label: "Funding for the lead agency ends",
      summary: "The organization that ran the shared list loses its grant.",
      why: "Funding changes shake trust in the system and in the lead agency's ability to deliver. Strong relationships and agreed rules give groups room to adapt together.",
      effects: {
        org: { rational: -25, systems: -10 },
        system: { rational: -20 },
      },
    },
    {
      id: "new-mayor",
      kind: "shock",
      label: "A new administration changes the plan",
      summary:
        "The next mayor sets different priorities and a different structure.",
      why: "Leadership changes hit systems-based trust. People who already trust each other can rebuild the process together.",
      effects: { system: { systems: -30, rational: -15 } },
    },
  ],
};

const school: Scenario = {
  id: "school",
  name: "A school of the arts, restructuring",
  tagline:
    "Several programs folded into one school, some eager and some worn out by change.",
  setting:
    "A university is combining several arts programs into one school under a new head. Some of the programs are excited. They see a chance to share studios, teach across disciplines and get a louder voice in the university. Others have lived through several reorganizations, heard big promises that faded, and are tired. Faculty know and trust their own program well. They know much less about the program next door.",
  atStake:
    "Whether the new school becomes a place people choose to work together, or a name on a chart that each program quietly works around.",
  scales: {
    person: {
      label: "Person to person",
      who: "Faculty, chairs and staff, within and across programs",
    },
    org: {
      label: "Organization",
      who: "Each program, treated as its own community",
    },
    system: {
      label: "System",
      who: "The new school's structure, budget rules and decision process",
    },
  },
  dispositional: { person: 0, org: -0.3, system: -0.6 },
  start: {
    person: { rational: 15, affinitive: 40, systems: 0 },
    org: { rational: -15, affinitive: 30, systems: 5 },
    system: { rational: -30, affinitive: 0, systems: 5 },
  },
  anchors: {
    person: { affinitive: "Long friendships inside each program" },
    org: { affinitive: "Loyalty to the program, not to the new school" },
    system: {
      systems: "Budget and decision rules everyone can read and question",
    },
  },
  actions: [
    {
      id: "listen-tour",
      kind: "build",
      label:
        "The head of the school spends a semester listening in every program",
      summary:
        "Visits to classes, studios and department meetings, with the first hour spent asking what has gone wrong before.",
      why: "Listening and responsiveness build affinitive trust, and acknowledging past failures is part of repairing it.",
      effects: {
        person: { affinitive: 14 },
        org: { affinitive: 12, rational: 5 },
      },
    },
    {
      id: "small-promise",
      kind: "build",
      label: "Make one small promise and keep it visibly",
      summary:
        "The school commits to fixing a shared booking system by a date, and then does.",
      why: "Setting small, achievable milestones is a way to build rational trust, and a kept promise gives people a record to judge.",
      effects: {
        org: { rational: 18 },
        system: { rational: 15 },
        person: { rational: 8 },
      },
    },
    {
      id: "budget-open",
      kind: "build",
      label: "Open the budget model to everyone",
      summary:
        "Every chair can see how money moves between programs, and can ask about it.",
      why: "Transparency in decision making is a source of systems-based trust. So is a fair spread of benefits and risks.",
      effects: {
        system: { systems: 22 },
        org: { systems: 15 },
      },
    },
    {
      id: "co-design-rules",
      kind: "build",
      label: "Chairs help write the governance rules",
      summary:
        "A working group from every program drafts how decisions get made, who is consulted and how disputes get settled.",
      why: "Procedures developed jointly with the people they affect are one of the main sources of systems-based trust.",
      effects: {
        system: { systems: 25 },
        org: { systems: 15, affinitive: 5 },
      },
    },
    {
      id: "cross-studio",
      kind: "build",
      label: "A shared studio project across two programs",
      summary:
        "Students from two different programs build a public project together over a term.",
      why: "Shared experiences build affinity, and a finished product shows what each side can do.",
      effects: {
        person: { affinitive: 16, rational: 8 },
        org: { affinitive: 8, rational: 8 },
      },
    },
    {
      id: "early-adopters",
      kind: "build",
      label: "Let the excited programs go first, and share what they learn",
      summary:
        "Two programs that want to try the new structure do it early and report back honestly, including what broke.",
      why: "Honest reporting of results, including what went wrong, builds a record others can judge for themselves.",
      effects: {
        org: { rational: 14 },
        system: { rational: 8 },
      },
    },
    {
      id: "rollout-announce",
      kind: "damage",
      label: "A new structure is announced in a university-wide email",
      summary:
        "Faculty learn the details from the same message as everyone else, with a launch date.",
      why: "When people see a process as unfair, they withdraw their trust from the system and from the people running it.",
      effects: {
        system: { systems: -22 },
        org: { systems: -15, affinitive: -8 },
      },
    },
    {
      id: "kickoff-promise",
      kind: "damage",
      label: "A big kickoff promises new studios and shared funding",
      summary:
        "The launch event describes what the school will have in two years, with no plan attached.",
      why: "Promises with no record behind them draw down rational trust. After earlier broken promises, people pay more attention to evidence that confirms their doubts.",
      effects: {
        org: { rational: -18 },
        system: { rational: -15 },
        person: { rational: -8 },
      },
    },
    {
      id: "uneven-cuts",
      kind: "damage",
      label: "Cuts land harder on the programs with the least say",
      summary:
        "A budget round trims smaller programs more than larger ones, and the reasons are unclear.",
      why: "An unequal spread of benefits and risks damages the sense that the system is fair.",
      effects: {
        system: { systems: -25 },
        org: { systems: -20, affinitive: -10 },
      },
    },
    {
      id: "survey-no-reply",
      kind: "damage",
      label: "A survey goes out and nobody hears what came of it",
      summary:
        "Faculty give detailed feedback and then hear nothing for a year.",
      why: "Being asked without being answered teaches people that their input does not change anything.",
      effects: {
        person: { affinitive: -8, rational: -8 },
        system: { systems: -12 },
      },
    },
    {
      id: "retreat-inward",
      kind: "damage",
      label: "Programs retreat into their own communities",
      summary:
        "Under stress, each program leans on its own people and stops talking to the others.",
      why: "When trust rests only on close relationships inside each program, nothing links the groups, and the school is exposed if those relationships are disturbed.",
      effects: {
        person: { affinitive: 6 },
        org: { affinitive: 6, systems: -12 },
        system: { systems: -10 },
      },
    },
  ],
  shocks: [
    {
      id: "head-leaves",
      kind: "shock",
      label: "The head of the school is recruited away",
      summary:
        "The person who built the relationships across programs moves to another institution.",
      why: "Leadership turnover hits affinitive trust. Rules people helped write and a record of kept promises can carry the school while relationships rebuild.",
      effects: {
        person: { affinitive: -30 },
        org: { affinitive: -25, rational: -10 },
      },
    },
    {
      id: "enrollment-drop",
      kind: "shock",
      label: "Enrollment drops and the university asks for cuts",
      summary:
        "Central administration requires a reduction in spending within the year.",
      why: "Funding changes shake trust in the system, and cuts can look like a failure to deliver. Fair procedures and good relationships help groups work through it together.",
      effects: {
        org: { rational: -25, systems: -15 },
        system: { rational: -20, systems: -20 },
      },
    },
    {
      id: "new-provost",
      kind: "shock",
      label: "A new provost rethinks the whole plan",
      summary: "University leadership changes and the structure is reopened.",
      why: "Policy and leadership changes hit systems-based trust. Programs that already trust each other can respond together.",
      effects: {
        system: { systems: -35, rational: -10 },
        org: { systems: -25 },
      },
    },
  ],
};

export const SCENARIOS: Scenario[] = [park, city, school];
