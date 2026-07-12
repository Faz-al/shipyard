import { Link } from "react-router-dom";

import {
  ArrowRight,
  BarChart3,
  BadgeCheck,
  Bug,
  Check,
  CheckCircle2,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Fingerprint,
  Gauge,
  Layers3,
  LockKeyhole,
  MessageSquareText,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Star,
  UploadCloud,
  Users,
  WalletCards,
Zap,
Mail,
MapPin,
Clock,
} from "lucide-react";

import {
  Logo,
  PublicNav,
} from "../components/UI";

import "../styles/public.css";

const SHIPYARD_BUSINESS = {
  brandName: "Shipyard",
  legalName: "Acid House",
  operatorName: "Mohammed Fazal",
  supportEmail: "Acidhouseonline@gmail.com",
  website:
    "https://shipyard-gilt.vercel.app",
  location: "India",
  supportHours:
    "Monday to Saturday, 10:00 AM to 6:00 PM IST",
  lastUpdated: "12 July 2026",
};


const developerFeatures = [
  {
    icon: Users,
    title: "Reliable tester network",
    description:
      "Recruit real Android users for managed testing assignments without coordinating through scattered groups.",
  },
  {
    icon: UploadCloud,
    title: "Daily evidence",
    description:
      "Require screenshots, tester notes and daily participation before progress is counted.",
  },
  {
    icon: BarChart3,
    title: "Live release command centre",
    description:
      "Track tester coverage, check-ins, risk, replacements, issues and completion from one workspace.",
  },
  {
    icon: Bug,
    title: "Actionable bug reports",
    description:
      "Collect structured issues with severity, reproduction steps, device details and supporting evidence.",
  },
  {
    icon: ShieldCheck,
    title: "Human-reviewed participation",
    description:
      "Approve or reject evidence so low-quality submissions do not silently count toward completion.",
  },
  {
    icon: MessageSquareText,
    title: "Final release feedback",
    description:
      "Receive saved tester feedback and a clearer picture of readiness before moving to production.",
  },
];


const processSteps = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "Create your release",
    description:
      "Add your app, package name, testing links and release requirements.",
  },
  {
    number: "02",
    icon: Users,
    title: "Build the testing crew",
    description:
      "Shipyard recruits and organises suitable testers for your release.",
  },
  {
    number: "03",
    icon: UploadCloud,
    title: "Verify progress daily",
    description:
      "Testers submit evidence, notes and issues throughout the testing period.",
  },
  {
    number: "04",
    icon: Gauge,
    title: "Review and ship",
    description:
      "See participation, findings, risk and completion before your final release decision.",
  },
];


const platformSignals = [
  {
    value: "14 days",
    label: "Managed testing cycle",
  },
  {
    value: "Daily",
    label: "Evidence verification",
  },
  {
    value: "Human",
    label: "Tester participation",
  },
  {
    value: "One place",
    label: "Release operations",
  },
];


const plans = [
  {
    name: "Launch",
    price: "₹699",
    description:
      "For independent developers preparing an Android release.",
    items: [
      "12 real testers",
      "14-day managed test",
      "Daily progress tracking",
      "Evidence review workflow",
      "Final readiness summary",
    ],
    featured: true,
  },
  {
    name: "Scale",
    price: "₹1,299",
    description:
      "For larger launches that need deeper testing coverage.",
    items: [
      "20 real testers",
      "Priority tester assignment",
      "Screenshots and feedback",
      "Structured bug reports",
      "Enhanced release coverage",
    ],
    featured: false,
  },
  {
    name: "Studio",
    price: "₹4,999/mo",
    description:
      "For teams and agencies shipping multiple Android releases.",
    items: [
      "Multiple active releases",
      "Team workspace",
      "Advanced reporting",
      "Priority operations support",
      "Continuous testing workflow",
    ],
    featured: false,
  },
];


const testerBenefits = [
  {
    icon: MonitorSmartphone,
    title: "Test real Android apps",
    description:
      "Work on upcoming releases from independent developers and growing teams.",
  },
  {
    icon: ClipboardCheck,
    title: "Clear daily missions",
    description:
      "Follow structured instructions instead of guessing what developers expect.",
  },
  {
    icon: BadgeCheck,
    title: "Build a trusted record",
    description:
      "Reliable submissions and useful feedback help unlock better assignments.",
  },
  {
    icon: WalletCards,
    title: "Earn verified rewards",
    description:
      "Receive rewards for approved participation and successfully completed assignments.",
  },
];


export function Home() {
  return (
    <>
      <div className="sy-public-shell">
        <PublicNav />

        <main>
          <section className="sy-hero">
            <div className="sy-hero-glow sy-hero-glow-one" />
            <div className="sy-hero-glow sy-hero-glow-two" />

            <div className="sy-container sy-hero-grid">
              <div className="sy-hero-copy">
                <div className="sy-eyebrow-pill">
                  <span className="sy-eyebrow-pulse" />

                  Human testing infrastructure for Android releases
                </div>

                <h1>
                  Move from closed testing to production with
                  <span> real release confidence.</span>
                </h1>

                <p className="sy-hero-description">
                  Shipyard brings tester recruitment, daily evidence,
                  participation tracking, bug reports and release readiness
                  into one managed workflow.
                </p>

                <div className="sy-hero-actions">
                  <Link
                    className="sy-primary-button"
                    to="/signup"
                  >
                    Start a test

                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    className="sy-secondary-button"
                    to="/how-it-works"
                  >
                    See how it works
                  </Link>
                </div>

                <div className="sy-hero-trust">
                  <span>
                    <CheckCircle2 size={17} />

                    Verified humans
                  </span>

                  <span>
                    <CheckCircle2 size={17} />

                    Daily evidence
                  </span>

                  <span>
                    <CheckCircle2 size={17} />

                    Managed workflow
                  </span>
                </div>
              </div>

              <div className="sy-product-visual">
                <div className="sy-product-orbit sy-product-orbit-one" />
                <div className="sy-product-orbit sy-product-orbit-two" />

                <div className="sy-dashboard-preview">
                  <div className="sy-preview-header">
                    <div className="sy-preview-dots">
                      <span />
                      <span />
                      <span />
                    </div>

                    <div className="sy-preview-status">
                      <span />

                      Testing active
                    </div>
                  </div>

                  <div className="sy-preview-release">
                    <div>
                      <span className="sy-preview-label">
                        Release command centre
                      </span>

                      <h3>SafeVault Android</h3>

                      <p>com.example.safevault</p>
                    </div>

                    <span className="sy-preview-day">
                      Day 9 of 14
                    </span>
                  </div>

                  <div className="sy-readiness-row">
                    <div>
                      <span className="sy-preview-label">
                        Release readiness
                      </span>

                      <strong>86%</strong>
                    </div>

                    <span className="sy-readiness-change">
                      +12%
                    </span>
                  </div>

                  <div className="sy-preview-progress">
                    <span />
                  </div>

                  <div className="sy-preview-stats">
                    <div>
                      <span className="sy-preview-icon">
                        <Users size={18} />
                      </span>

                      <strong>12</strong>

                      <small>Active testers</small>
                    </div>

                    <div>
                      <span className="sy-preview-icon">
                        <UploadCloud size={18} />
                      </span>

                      <strong>108</strong>

                      <small>Verified check-ins</small>
                    </div>

                    <div>
                      <span className="sy-preview-icon">
                        <Bug size={18} />
                      </span>

                      <strong>4</strong>

                      <small>Issues reported</small>
                    </div>
                  </div>

                  <div className="sy-preview-activity">
                    <div className="sy-activity-icon">
                      <Check size={18} />
                    </div>

                    <div>
                      <strong>Today’s evidence reviewed</strong>

                      <span>
                        11 approved · 1 awaiting review
                      </span>
                    </div>

                    <BadgeCheck size={20} />
                  </div>
                </div>

                <div className="sy-floating-card sy-floating-card-one">
                  <ShieldCheck size={18} />

                  <div>
                    <strong>Evidence verified</strong>

                    <span>Human-reviewed progress</span>
                  </div>
                </div>

                <div className="sy-floating-card sy-floating-card-two">
                  <Sparkles size={18} />

                  <div>
                    <strong>Release on track</strong>

                    <span>No tester risk detected</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="sy-trust-strip">
            <div className="sy-container sy-trust-strip-inner">
              <span className="sy-trust-strip-label">
                Built for teams shipping Android software
              </span>

              <div className="sy-audience-list">
                <span>INDIE DEVELOPERS</span>
                <span>STARTUPS</span>
                <span>ANDROID STUDIOS</span>
                <span>AGENCIES</span>
              </div>
            </div>
          </section>

          <section className="sy-stats-section">
            <div className="sy-container sy-stats-grid">
              {platformSignals.map((signal) => (
                <article key={signal.label}>
                  <strong>{signal.value}</strong>

                  <span>{signal.label}</span>
                </article>
              ))}
            </div>
          </section>

          <section className="sy-section">
            <div className="sy-container">
              <div className="sy-section-heading">
                <span className="sy-section-kicker">
                  A serious testing operation
                </span>

                <h2>
                  Everything around your release,
                  organised in one place.
                </h2>

                <p>
                  Replace spreadsheets, informal tester groups and
                  fragmented screenshots with a structured workflow built
                  around evidence and accountability.
                </p>
              </div>

              <div className="sy-feature-grid">
                {developerFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <article
                      className="sy-feature-card"
                      key={feature.title}
                    >
                      <div className="sy-feature-icon">
                        <Icon size={22} />
                      </div>

                      <h3>{feature.title}</h3>

                      <p>{feature.description}</p>

                      <div className="sy-feature-line" />
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="sy-workflow-section">
            <div className="sy-container sy-workflow-layout">
              <div className="sy-workflow-copy">
                <span className="sy-section-kicker">
                  Managed from start to finish
                </span>

                <h2>
                  A clearer path from test build to production.
                </h2>

                <p>
                  Shipyard gives each release a repeatable operating
                  process, so developers know what is happening and testers
                  know exactly what is expected.
                </p>

                <div className="sy-workflow-benefits">
                  <span>
                    <CheckCircle2 size={18} />

                    Tester recruitment and assignment
                  </span>

                  <span>
                    <CheckCircle2 size={18} />

                    Daily participation verification
                  </span>

                  <span>
                    <CheckCircle2 size={18} />

                    Risk detection and replacement handling
                  </span>

                  <span>
                    <CheckCircle2 size={18} />

                    Final feedback and reward eligibility
                  </span>
                </div>

                <Link
                  className="sy-text-link"
                  to="/how-it-works"
                >
                  Explore the complete workflow

                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="sy-workflow-panel">
                <div className="sy-workflow-panel-head">
                  <div>
                    <span>Testing timeline</span>

                    <strong>Release operations</strong>
                  </div>

                  <span className="sy-secure-label">
                    <LockKeyhole size={14} />

                    Managed
                  </span>
                </div>

                <div className="sy-timeline">
                  <div className="sy-timeline-item complete">
                    <span className="sy-timeline-marker">
                      <Check size={15} />
                    </span>

                    <div>
                      <strong>Tester recruitment completed</strong>

                      <p>12 of 12 testers assigned</p>
                    </div>

                    <small>Completed</small>
                  </div>

                  <div className="sy-timeline-item complete">
                    <span className="sy-timeline-marker">
                      <Check size={15} />
                    </span>

                    <div>
                      <strong>Testing cycle started</strong>

                      <p>Daily missions are now active</p>
                    </div>

                    <small>Completed</small>
                  </div>

                  <div className="sy-timeline-item active">
                    <span className="sy-timeline-marker">
                      <Clock3 size={15} />
                    </span>

                    <div>
                      <strong>Evidence collection</strong>

                      <p>Day 9 participation in progress</p>
                    </div>

                    <small>Active</small>
                  </div>

                  <div className="sy-timeline-item">
                    <span className="sy-timeline-marker">
                      <Gauge size={15} />
                    </span>

                    <div>
                      <strong>Release review</strong>

                      <p>Readiness summary after completion</p>
                    </div>

                    <small>Upcoming</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="sy-section sy-process-section">
            <div className="sy-container">
              <div className="sy-section-heading">
                <span className="sy-section-kicker">
                  How Shipyard works
                </span>

                <h2>
                  Four stages. One accountable workflow.
                </h2>

                <p>
                  Launch testing without creating another operations
                  problem for your team.
                </p>
              </div>

              <div className="sy-process-grid">
                {processSteps.map((step) => {
                  const Icon = step.icon;

                  return (
                    <article
                      className="sy-process-card"
                      key={step.number}
                    >
                      <div className="sy-process-top">
                        <span className="sy-process-number">
                          {step.number}
                        </span>

                        <span className="sy-process-icon">
                          <Icon size={20} />
                        </span>
                      </div>

                      <h3>{step.title}</h3>

                      <p>{step.description}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="sy-security-section">
            <div className="sy-container sy-security-grid">
              <div className="sy-security-visual">
                <div className="sy-security-rings">
                  <div className="sy-security-core">
                    <Fingerprint size={46} />
                  </div>

                  <span className="sy-security-node node-one">
                    <BadgeCheck size={18} />
                  </span>

                  <span className="sy-security-node node-two">
                    <UploadCloud size={18} />
                  </span>

                  <span className="sy-security-node node-three">
                    <Users size={18} />
                  </span>
                </div>
              </div>

              <div className="sy-security-copy">
                <span className="sy-section-kicker">
                  Trust through verification
                </span>

                <h2>
                  Participation should be proven, not assumed.
                </h2>

                <p>
                  Shipyard connects progress to submitted evidence,
                  reviews and completion rules. That creates a stronger
                  record than relying on opt-in counts alone.
                </p>

                <div className="sy-security-points">
                  <article>
                    <ShieldCheck size={21} />

                    <div>
                      <strong>Evidence-based participation</strong>

                      <span>
                        Daily submissions support a clearer record of
                        testing activity.
                      </span>
                    </div>
                  </article>

                  <article>
                    <Zap size={21} />

                    <div>
                      <strong>Operational risk signals</strong>

                      <span>
                        Identify missed participation and replacement
                        needs earlier.
                      </span>
                    </div>
                  </article>

                  <article>
                    <Layers3 size={21} />

                    <div>
                      <strong>Complete release history</strong>

                      <span>
                        Keep assignments, evidence, feedback and outcomes
                        together.
                      </span>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </section>

          <section className="sy-pricing-preview-section">
            <div className="sy-container sy-pricing-preview">
              <div className="sy-pricing-preview-copy">
                <span className="sy-section-kicker">
                  Simple launch pricing
                </span>

                <h2>
                  Start with one managed Android test.
                </h2>

                <p>
                  Designed for developers who need reliable testing
                  participation without building an internal testing
                  operation.
                </p>

                <Link
                  className="sy-text-link"
                  to="/pricing"
                >
                  View all plans

                  <ArrowRight size={17} />
                </Link>
              </div>

              <article className="sy-launch-price-card">
                <div className="sy-launch-price-head">
                  <div>
                    <span>Launch plan</span>

                    <strong>₹699</strong>
                  </div>

                  <span className="sy-launch-badge">
                    Most popular
                  </span>
                </div>

                <div className="sy-price-divider" />

                <ul>
                  <li>
                    <CheckCircle2 size={18} />

                    12 real testers
                  </li>

                  <li>
                    <CheckCircle2 size={18} />

                    14-day managed test
                  </li>

                  <li>
                    <CheckCircle2 size={18} />

                    Daily evidence workflow
                  </li>

                  <li>
                    <CheckCircle2 size={18} />

                    Progress and readiness tracking
                  </li>
                </ul>

                <Link
                  className="sy-primary-button sy-full-button"
                  to="/signup"
                >
                  Start your release

                  <ArrowRight size={18} />
                </Link>
              </article>
            </div>
          </section>

          <section className="sy-tester-banner-section">
            <div className="sy-container">
              <div className="sy-tester-banner">
                <div className="sy-tester-banner-icon">
                  <MonitorSmartphone size={30} />
                </div>

                <div className="sy-tester-banner-copy">
                  <span>For Android testers</span>

                  <h2>
                    Turn your device and attention to detail into
                    verified testing work.
                  </h2>

                  <p>
                    Complete clear daily missions, submit useful evidence
                    and build a trusted tester reputation.
                  </p>
                </div>

                <Link
                  className="sy-light-button"
                  to="/become-a-tester"
                >
                  Join the tester network

                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>

          <section className="sy-final-cta-section">
            <div className="sy-container">
              <div className="sy-final-cta">
                <div className="sy-final-cta-content">
                  <span className="sy-final-cta-kicker">
                    Your next release deserves a proper staging ground
                  </span>

                  <h2>
                    Run Android testing with more evidence,
                    visibility and confidence.
                  </h2>

                  <p>
                    Create your Shipyard workspace and prepare your next
                    release for managed human testing.
                  </p>
                </div>

                <div className="sy-final-cta-actions">
                  <Link
                    className="sy-light-button"
                    to="/signup"
                  >
                    Create your account

                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    className="sy-dark-ghost-button"
                    to="/how-it-works"
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}


export function Pricing() {
  return (
    <div className="sy-public-shell">
      <PublicNav />

      <main>
        <section className="sy-page-hero">
          <div className="sy-container">
            <span className="sy-section-kicker">
              Simple launch pricing
            </span>

            <h1>
              Pay for managed testing,
              not empty installs.
            </h1>

            <p>
              Start with a structured Android testing cycle and scale
              into deeper release operations as your team grows.
            </p>
          </div>
        </section>

        <section className="sy-pricing-page-section">
          <div className="sy-container">
            <div className="sy-pricing-grid">
              {plans.map((plan) => (
                <article
                  className={`sy-price-card ${
                    plan.featured
                      ? "sy-price-card-featured"
                      : ""
                  }`}
                  key={plan.name}
                >
                  {plan.featured && (
                    <span className="sy-popular-label">
                      Most popular
                    </span>
                  )}

                  <span className="sy-plan-name">
                    {plan.name}
                  </span>

                  <strong className="sy-plan-price">
                    {plan.price}
                  </strong>

                  <p className="sy-plan-description">
                    {plan.description}
                  </p>

                  <div className="sy-price-divider" />

                  <ul>
                    {plan.items.map((item) => (
                      <li key={item}>
                        <CheckCircle2 size={18} />

                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    className={
                      plan.featured
                        ? "sy-primary-button sy-full-button"
                        : "sy-secondary-button sy-full-button"
                    }
                    to="/signup"
                  >
                    Choose {plan.name}

                    <ArrowRight size={17} />
                  </Link>
                </article>
              ))}
            </div>

            <div className="sy-pricing-note">
              <ShieldCheck size={22} />

              <div>
                <strong>
                  Built around verified participation
                </strong>

                <span>
                  Tester rewards and operational handling are tied to
                  approved completion workflows.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="sy-final-cta-section">
          <div className="sy-container">
            <div className="sy-final-cta">
              <div className="sy-final-cta-content">
                <span className="sy-final-cta-kicker">
                  Prepare your next release
                </span>

                <h2>
                  Put your Android build through a clearer,
                  managed testing process.
                </h2>
              </div>

              <Link
                className="sy-light-button"
                to="/signup"
              >
                Create your account

                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


export function How() {
  return (
    <div className="sy-public-shell">
      <PublicNav />

      <main>
        <section className="sy-page-hero">
          <div className="sy-container">
            <span className="sy-section-kicker">
              A managed release workflow
            </span>

            <h1>
              From test build to release confidence.
            </h1>

            <p>
              Shipyard organises recruitment, participation,
              evidence and final testing outcomes into one structured
              process.
            </p>
          </div>
        </section>

        <section className="sy-how-section">
          <div className="sy-container">
            <div className="sy-how-list">
              {processSteps.map((step) => {
                const Icon = step.icon;

                return (
                  <article
                    className="sy-how-card"
                    key={step.number}
                  >
                    <div className="sy-how-number">
                      {step.number}
                    </div>

                    <div className="sy-how-icon">
                      <Icon size={25} />
                    </div>

                    <div className="sy-how-content">
                      <h2>{step.title}</h2>

                      <p>{step.description}</p>

                      {step.number === "01" && (
                        <span>
                          App details · Package name · Testing links · Plan
                        </span>
                      )}

                      {step.number === "02" && (
                        <span>
                          Recruitment · Assignment · Tester capacity
                        </span>
                      )}

                      {step.number === "03" && (
                        <span>
                          Screenshots · Notes · Reviews · Issues
                        </span>
                      )}

                      {step.number === "04" && (
                        <span>
                          Completion · Feedback · Release summary
                        </span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="sy-how-value-section">
          <div className="sy-container sy-how-value-grid">
            <div>
              <span className="sy-section-kicker">
                Designed for accountability
              </span>

              <h2>
                Know what happened during your testing cycle.
              </h2>

              <p>
                Instead of collecting disconnected messages and
                screenshots, each release keeps its participation and
                findings inside one operational record.
              </p>
            </div>

            <div className="sy-how-value-cards">
              <article>
                <BadgeCheck size={22} />

                <strong>Reviewed evidence</strong>

                <span>
                  Submissions can be approved, rejected and resubmitted.
                </span>
              </article>

              <article>
                <Clock3 size={22} />

                <strong>Daily progress</strong>

                <span>
                  Follow tester participation throughout the assignment.
                </span>
              </article>

              <article>
                <Zap size={22} />

                <strong>Risk handling</strong>

                <span>
                  Surface missed participation and replacement needs.
                </span>
              </article>

              <article>
                <Gauge size={22} />

                <strong>Final outcome</strong>

                <span>
                  Review completion, issues and tester feedback.
                </span>
              </article>
            </div>
          </div>
        </section>

        <section className="sy-final-cta-section">
          <div className="sy-container">
            <div className="sy-final-cta">
              <div className="sy-final-cta-content">
                <span className="sy-final-cta-kicker">
                  Ready to begin?
                </span>

                <h2>
                  Create your release and assemble your testing crew.
                </h2>
              </div>

              <Link
                className="sy-light-button"
                to="/signup"
              >
                Start a test

                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


export function TesterPage() {
  return (
    <div className="sy-public-shell">
      <PublicNav />

      <main>
        <section className="sy-tester-page-hero">
          <div className="sy-container sy-tester-page-grid">
            <div className="sy-tester-page-copy">
              <div className="sy-eyebrow-pill">
                <Star size={14} />

                Earn by improving real software
              </div>

              <h1>
                Your Android phone can become part of a
                <span> trusted QA network.</span>
              </h1>

              <p>
                Join managed testing assignments, complete clear daily
                missions, submit evidence and build a strong tester
                reputation.
              </p>

              <div className="sy-hero-actions">
                <Link
                  className="sy-primary-button"
                  to="/signup?role=tester"
                >
                  Join the tester network

                  <ArrowRight size={18} />
                </Link>

                <Link
                  className="sy-secondary-button"
                  to="/how-it-works"
                >
                  See the workflow
                </Link>
              </div>

              <div className="sy-hero-trust">
                <span>
                  <CheckCircle2 size={17} />

                  Clear missions
                </span>

                <span>
                  <CheckCircle2 size={17} />

                  Verified rewards
                </span>

                <span>
                  <CheckCircle2 size={17} />

                  Reputation-based work
                </span>
              </div>
            </div>

            <div className="sy-tester-reward-card">
              <div className="sy-reward-card-head">
                <span className="sy-reward-icon">
                  <WalletCards size={25} />
                </span>

                <span className="sy-reward-status">
                  Reward eligible
                </span>
              </div>

              <span className="sy-reward-label">
                Assignment reward
              </span>

              <strong>₹20–₹150</strong>

              <p>
                Per verified assignment, depending on duration,
                requirements and testing depth.
              </p>

              <div className="sy-reward-divider" />

              <div className="sy-reward-details">
                <span>
                  <CheckCircle2 size={17} />

                  Complete daily missions
                </span>

                <span>
                  <CheckCircle2 size={17} />

                  Submit valid evidence
                </span>

                <span>
                  <CheckCircle2 size={17} />

                  Provide final feedback
                </span>
              </div>

              <div className="sy-reward-footer">
                <BadgeCheck size={19} />

                Reliable testers unlock higher-value work.
              </div>
            </div>
          </div>
        </section>

        <section className="sy-section">
          <div className="sy-container">
            <div className="sy-section-heading">
              <span className="sy-section-kicker">
                Built for reliable testers
              </span>

              <h2>
                Clear work, useful feedback and verified rewards.
              </h2>

              <p>
                Shipyard gives testers a structured way to contribute
                to Android releases without unclear expectations.
              </p>
            </div>

            <div className="sy-feature-grid sy-tester-benefit-grid">
              {testerBenefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <article
                    className="sy-feature-card"
                    key={benefit.title}
                  >
                    <div className="sy-feature-icon">
                      <Icon size={22} />
                    </div>

                    <h3>{benefit.title}</h3>

                    <p>{benefit.description}</p>

                    <div className="sy-feature-line" />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="sy-tester-steps-section">
          <div className="sy-container sy-tester-steps-layout">
            <div>
              <span className="sy-section-kicker">
                Your assignment flow
              </span>

              <h2>
                Know exactly what you need to do each day.
              </h2>

              <p>
                Every assignment includes progress tracking and clear
                requirements from acceptance through final completion.
              </p>
            </div>

            <div className="sy-tester-step-list">
              <article>
                <span>1</span>

                <div>
                  <strong>Accept a suitable release</strong>

                  <p>
                    Review the app, schedule and assignment reward.
                  </p>
                </div>
              </article>

              <article>
                <span>2</span>

                <div>
                  <strong>Complete the daily mission</strong>

                  <p>
                    Use the app and follow the testing instructions.
                  </p>
                </div>
              </article>

              <article>
                <span>3</span>

                <div>
                  <strong>Upload evidence and notes</strong>

                  <p>
                    Submit a clear screenshot and useful observations.
                  </p>
                </div>
              </article>

              <article>
                <span>4</span>

                <div>
                  <strong>Finish and become reward eligible</strong>

                  <p>
                    Complete the cycle and provide final feedback.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="sy-final-cta-section">
          <div className="sy-container">
            <div className="sy-final-cta">
              <div className="sy-final-cta-content">
                <span className="sy-final-cta-kicker">
                  Join the testing crew
                </span>

                <h2>
                  Help developers ship better Android releases.
                </h2>
              </div>

              <Link
                className="sy-light-button"
                to="/signup?role=tester"
              >
                Create tester account

                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


export function Legal({ type }) {
  const legalPages = {
    privacy: {
      title: "Privacy Policy",
      description:
        "How Shipyard collects, uses, stores and protects information required to provide managed Android testing services.",
      sections: [
        {
          title: "1. Introduction",
          paragraphs: [
            `${SHIPYARD_BUSINESS.brandName} is operated by ${SHIPYARD_BUSINESS.legalName}. This Privacy Policy explains how we collect, use, store and disclose information when developers, testers and other users access Shipyard.`,
            "By using Shipyard, you acknowledge the practices described in this Privacy Policy.",
          ],
        },
        {
          title: "2. Information we collect",
          paragraphs: [
            "We may collect account information such as your name, email address, phone number, workspace role and authentication details.",
            "For developer projects, we may collect application names, package names, testing links, project descriptions, testing requirements and related release information.",
            "For tester assignments, we may collect device information, assignment activity, screenshots, notes, check-ins, bug reports, feedback and completion records.",
            "When a payment is made, our authorised payment gateway processes the payment details. Shipyard may receive transaction identifiers, payment status, amount, payment method category and related reconciliation information. We do not directly store complete card numbers, CVV values or banking credentials.",
            "We may also collect technical information including browser type, device information, IP address, session activity, security logs and platform usage information.",
          ],
        },
        {
          title: "3. How we use information",
          paragraphs: [
            "We use collected information to create and operate accounts, manage testing projects, recruit and assign testers, verify evidence, review submissions, process payments, determine reward eligibility and provide customer support.",
            "Information may also be used to prevent fraud, investigate misuse, enforce platform rules, maintain security, improve Shipyard and comply with applicable legal or regulatory obligations.",
          ],
        },
        {
          title: "4. Testing evidence and project information",
          paragraphs: [
            "Developers should only submit applications, links and materials they are authorised to share for testing.",
            "Testers must not upload unrelated personal information or confidential third-party content as testing evidence.",
            "Submitted screenshots, notes, reports and feedback may be visible to the relevant developer and authorised Shipyard administrators for project review and support.",
          ],
        },
        {
          title: "5. Payments and service providers",
          paragraphs: [
            "Shipyard may use third-party payment gateways, hosting providers, database providers, email services and operational tools to deliver the platform.",
            "These providers may process limited information according to their own terms and privacy policies. Payment information is handled by the selected payment gateway and its banking partners.",
          ],
        },
        {
          title: "6. Information sharing",
          paragraphs: [
            "We do not sell users' personal information.",
            "We may share information with service providers where necessary to operate Shipyard, process transactions, detect fraud, provide support or comply with law.",
            "We may disclose information where required by a lawful request, court order, regulatory obligation or to protect the safety and rights of Shipyard, its users or others.",
          ],
        },
        {
          title: "7. Data retention",
          paragraphs: [
            "We retain information for as long as reasonably required to provide services, maintain project and transaction records, resolve disputes, prevent abuse and meet legal or accounting obligations.",
            "Certain records may remain after account closure where retention is required for fraud prevention, payment reconciliation, legal compliance or legitimate business records.",
          ],
        },
        {
          title: "8. Security",
          paragraphs: [
            "We use reasonable technical and organisational safeguards intended to protect user information.",
            "No online system can guarantee absolute security. Users are responsible for protecting their passwords, devices and account access.",
          ],
        },
        {
          title: "9. Your choices and requests",
          paragraphs: [
            "You may contact us to request correction of inaccurate account information, ask questions about retained information or request account deletion, subject to legal, fraud-prevention and transaction-record requirements.",
          ],
        },
        {
          title: "10. Children's privacy",
          paragraphs: [
            "Shipyard is intended for users who are legally able to enter into contracts and is not intended for children under 18 years of age.",
          ],
        },
        {
          title: "11. Policy updates",
          paragraphs: [
            "We may update this Privacy Policy when our services, legal requirements or business practices change. The updated date shown on this page indicates the latest version.",
          ],
        },
        {
          title: "12. Contact",
          paragraphs: [
            `For privacy questions, contact ${SHIPYARD_BUSINESS.supportEmail}.`,
          ],
        },
      ],
    },

    terms: {
      title: "Terms and Conditions",
      description:
        "The conditions governing developer projects, tester assignments, payments, rewards and use of the Shipyard platform.",
      sections: [
        {
          title: "1. Acceptance of terms",
          paragraphs: [
            `These Terms and Conditions govern access to ${SHIPYARD_BUSINESS.brandName}, operated by ${SHIPYARD_BUSINESS.legalName}.`,
            "By creating an account, purchasing a service, accepting a testing assignment or otherwise using Shipyard, you agree to these Terms.",
            "Do not use Shipyard if you do not agree to these Terms.",
          ],
        },
        {
          title: "2. Shipyard service",
          paragraphs: [
            "Shipyard provides managed Android application testing operations, which may include tester recruitment, assignment management, daily participation tracking, evidence review, feedback collection, issue reporting, replacement handling and release completion records.",
            "Shipyard does not guarantee Google Play production approval, a specific ranking, download count, commercial result, absence of software defects or acceptance by any third-party platform.",
          ],
        },
        {
          title: "3. Account eligibility",
          paragraphs: [
            "Users must be at least 18 years old and legally capable of entering into an agreement.",
            "You must provide accurate information and keep your account credentials secure.",
            "You are responsible for all activity performed through your account unless you promptly report unauthorised access.",
          ],
        },
        {
          title: "4. Developer responsibilities",
          paragraphs: [
            "Developers must provide accurate application information, valid testing links, clear instructions and lawful software suitable for testing.",
            "Developers must have the necessary rights and permissions to distribute their application and testing materials.",
            "Developers must not submit malware, deceptive software, prohibited content, unlawful services or applications designed to harm users, devices or third parties.",
            "Developers remain responsible for their application, data handling, Play Console compliance, policies, releases and production decisions.",
          ],
        },
        {
          title: "5. Tester responsibilities",
          paragraphs: [
            "Testers must personally complete accepted assignments using genuine devices and accounts.",
            "Testers must submit truthful evidence, meaningful observations and accurate feedback.",
            "Testers may not submit copied, altered, fabricated or misleading screenshots, automate participation, create duplicate accounts or manipulate assignment outcomes.",
            "Testers must keep unreleased application information confidential when required.",
          ],
        },
        {
          title: "6. Evidence review",
          paragraphs: [
            "Evidence may be approved, rejected or returned for resubmission based on clarity, relevance, authenticity and compliance with assignment instructions.",
            "A submission does not count as approved participation merely because it was uploaded.",
            "Shipyard may investigate suspicious activity and request additional information.",
          ],
        },
        {
          title: "7. Payments",
          paragraphs: [
            "Developers must pay the displayed service price before tester recruitment begins unless Shipyard expressly provides another arrangement.",
            "Payments are processed using an authorised third-party payment gateway.",
            "A project is treated as paid only after Shipyard receives successful server-side payment confirmation.",
            "Applicable taxes, gateway charges or other charges will be displayed or handled according to the applicable payment arrangement.",
          ],
        },
        {
          title: "8. Tester rewards",
          paragraphs: [
            "Tester rewards are subject to successful assignment completion, valid evidence, final feedback, review outcomes and the reward rules displayed for the assignment.",
            "Accepting an assignment does not by itself guarantee a reward.",
            "Shipyard may withhold or cancel reward eligibility where there is incomplete work, manipulated evidence, duplicate participation, prohibited conduct or breach of these Terms.",
          ],
        },
        {
          title: "9. Cancellations and refunds",
          paragraphs: [
            "Cancellation and refund requests are governed by the separate Refund and Cancellation Policy published on Shipyard.",
            "Users should review that policy before purchasing a testing plan.",
          ],
        },
        {
          title: "10. Prohibited conduct",
          paragraphs: [
            "Users must not attempt to bypass security, access another user's account, scrape restricted information, interfere with platform operations, manipulate reviews or evidence, misuse payment systems or use Shipyard for unlawful activity.",
          ],
        },
        {
          title: "11. Suspension and termination",
          paragraphs: [
            "Shipyard may restrict, suspend or terminate access where a user violates these Terms, creates security or payment risk, submits prohibited content, manipulates platform activity or harms other users.",
            "Where reasonably possible, we may provide notice or an opportunity to resolve the issue, but immediate action may be taken for serious abuse, fraud or security threats.",
          ],
        },
        {
          title: "12. Service availability",
          paragraphs: [
            "We aim to provide reliable service but do not guarantee uninterrupted or error-free availability.",
            "Testing schedules may be affected by tester availability, application access problems, third-party services, holidays, technical issues or events outside our reasonable control.",
          ],
        },
        {
          title: "13. Limitation of liability",
          paragraphs: [
            "To the maximum extent permitted by applicable law, Shipyard is not liable for indirect, incidental, special or consequential losses, lost profits, lost business opportunities, third-party platform decisions or defects in a developer's application.",
            "Nothing in these Terms excludes liability that cannot lawfully be excluded.",
          ],
        },
        {
          title: "14. Changes to these terms",
          paragraphs: [
            "We may update these Terms to reflect service, operational or legal changes. Continued use after an updated version becomes effective constitutes acceptance of the revised Terms.",
          ],
        },
        {
          title: "15. Governing law",
          paragraphs: [
            "These Terms are governed by the laws of India. Courts having lawful jurisdiction over the business location of the operator will have jurisdiction, subject to applicable consumer-protection laws.",
          ],
        },
        {
          title: "16. Contact",
          paragraphs: [
            `Questions about these Terms may be sent to ${SHIPYARD_BUSINESS.supportEmail}.`,
          ],
        },
      ],
    },

    refund: {
      title:
        "Refund and Cancellation Policy",
      description:
        "When a Shipyard testing project may be cancelled and how refund requests are reviewed and processed.",
      sections: [
        {
          title: "1. Overview",
          paragraphs: [
            "Shipyard provides managed testing services that involve operational work, tester recruitment, assignment allocation, evidence review and platform resources.",
            "Refund eligibility therefore depends on the stage reached by the project when the cancellation request is received.",
          ],
        },
        {
          title: "2. Duplicate or incorrect payments",
          paragraphs: [
            "A verified duplicate payment or an amount charged because of a technical payment error is eligible for review and refund.",
            "Please contact support with the registered email address, project name, payment amount, transaction ID and a description of the issue.",
          ],
        },
        {
          title:
            "3. Cancellation before recruitment begins",
          paragraphs: [
            "A developer may request cancellation before Shipyard begins tester recruitment or assigns any tester to the project.",
            "Where no recruitment or operational work has started, the payment may be eligible for a full refund after verification.",
          ],
        },
        {
          title:
            "4. Cancellation after recruitment begins",
          paragraphs: [
            "Once tester recruitment, tester allocation, project scheduling or operational preparation has started, costs and work may already have been incurred.",
            "Requests made at this stage will be individually reviewed. Any approved refund may be partial after deduction of reasonable work already completed, payment-gateway costs where legally permissible and committed tester or operational costs.",
          ],
        },
        {
          title:
            "5. Cancellation after testing begins",
          paragraphs: [
            "Once the testing cycle has begun or testers have started completing assignments, the service is considered substantially underway.",
            "Payments are normally non-refundable at this stage, except where Shipyard is unable to provide the purchased service because of a failure directly attributable to Shipyard.",
          ],
        },
        {
          title: "6. Non-refundable situations",
          paragraphs: [
            "A refund will generally not be provided where delays or failure result from invalid testing links, inaccessible builds, incorrect package details, developer inactivity, application rejection by Google Play, policy violations, unlawful application content or failure to provide required information.",
            "Refunds are not provided merely because a developer changes their mind after recruitment or testing work has begun.",
            "Shipyard does not guarantee Google Play production approval, and denial or delay of production access by Google does not automatically create refund eligibility.",
          ],
        },
        {
          title:
            "7. Shipyard cancellation",
          paragraphs: [
            "Shipyard may cancel a project involving prohibited, unlawful, unsafe, deceptive or harmful software.",
            "Refund eligibility in such cases will depend on the reason for cancellation, work already performed, costs incurred and applicable law.",
          ],
        },
        {
          title: "8. How to request a refund",
          paragraphs: [
            `Email ${SHIPYARD_BUSINESS.supportEmail} using the email address registered with Shipyard.`,
            "Include the project name, payment date, payment amount, transaction or payment ID, reason for cancellation and any supporting information.",
            "Requests should be submitted as soon as possible and preferably within 7 calendar days of payment.",
          ],
        },
        {
          title: "9. Review period",
          paragraphs: [
            "We generally acknowledge refund or cancellation requests within 2 business days.",
            "Eligibility is normally reviewed within 5 to 7 business days after receiving all required information.",
          ],
        },
        {
          title: "10. Refund processing time",
          paragraphs: [
            "Approved refunds are sent to the original payment method.",
            "After Shipyard initiates an approved refund, the payment provider or bank may take approximately 5 to 10 working days to credit the amount, depending on the payment method and banking network.",
            "Shipyard cannot control additional delays caused by banks, card networks or payment providers.",
          ],
        },
        {
          title:
            "11. Failed transactions",
          paragraphs: [
            "Where a payment fails but money is debited, the amount may be automatically reversed by the bank or payment provider.",
            "If the amount is not automatically returned within the timeframe communicated by the payment provider, contact us with the transaction details.",
          ],
        },
        {
          title: "12. Contact",
          paragraphs: [
            `Refund and cancellation requests must be sent to ${SHIPYARD_BUSINESS.supportEmail}.`,
          ],
        },
      ],
    },
  };

  const page =
    legalPages[type] ||
    legalPages.privacy;

  return (
    <div className="sy-public-shell">
      <PublicNav />

      <main>
        <section className="sy-legal-hero">
          <div className="sy-container sy-legal-container">
            <span className="sy-section-kicker">
              Shipyard legal
            </span>

            <h1>{page.title}</h1>

            <p>{page.description}</p>

            <small>
              Last updated:{" "}
              {SHIPYARD_BUSINESS.lastUpdated}
            </small>
          </div>
        </section>

        <section className="sy-legal-section">
          <div className="sy-container sy-legal-container">
            <div className="sy-legal-notice">
              <ShieldCheck size={22} />

              <div>
                <strong>
                  Shipyard business information
                </strong>

                <p>
                  {SHIPYARD_BUSINESS.brandName} is
                  operated by{" "}
                  {SHIPYARD_BUSINESS.legalName},
                  India. Support:{" "}
                  <a
                    href={`mailto:${SHIPYARD_BUSINESS.supportEmail}`}
                  >
                    {
                      SHIPYARD_BUSINESS.supportEmail
                    }
                  </a>
                </p>
              </div>
            </div>

            <article className="sy-legal-content">
              {page.sections.map(
                (section) => (
                  <section
                    key={section.title}
                  >
                    <h2>
                      {section.title}
                    </h2>

                    {section.paragraphs.map(
                      (paragraph) => (
                        <p key={paragraph}>
                          {paragraph}
                        </p>
                      )
                    )}
                  </section>
                )
              )}
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


export function Contact() {
  return (
    <div className="sy-public-shell">
      <PublicNav />

      <main>
        <section className="sy-legal-hero">
          <div className="sy-container sy-legal-container">
            <span className="sy-section-kicker">
              Shipyard support
            </span>

            <h1>Contact Us</h1>

            <p>
              Contact Shipyard for project,
              payment, account, tester or
              platform-support questions.
            </p>
          </div>
        </section>

        <section className="sy-legal-section">
          <div className="sy-container sy-legal-container">
            <article className="sy-legal-content">
              <h2>Business information</h2>

              <p>
                <strong>Platform:</strong>{" "}
                {SHIPYARD_BUSINESS.brandName}
              </p>

              <p>
                <strong>
                  Operated by:
                </strong>{" "}
                {SHIPYARD_BUSINESS.legalName}
              </p>

              <p>
                <strong>
                  Business operator:
                </strong>{" "}
                {
                  SHIPYARD_BUSINESS.operatorName
                }
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {SHIPYARD_BUSINESS.location}
              </p>

              <h2>Email support</h2>

              <p>
                The quickest way to contact us
                is by email:
              </p>

              <p>
                <a
                  href={`mailto:${SHIPYARD_BUSINESS.supportEmail}`}
                >
                  <Mail
                    size={18}
                    style={{
                      verticalAlign:
                        "middle",
                      marginRight: "8px",
                    }}
                  />

                  {
                    SHIPYARD_BUSINESS.supportEmail
                  }
                </a>
              </p>

              <h2>Support hours</h2>

              <p>
                <Clock
                  size={18}
                  style={{
                    verticalAlign:
                      "middle",
                    marginRight: "8px",
                  }}
                />

                {
                  SHIPYARD_BUSINESS.supportHours
                }
              </p>

              <p>
                We generally acknowledge
                support requests within 1 to 2
                business days.
              </p>

              <h2>
                Information to include
              </h2>

              <p>
                For faster support, include
                your registered email address,
                project name and a clear
                description of the issue.
              </p>

              <p>
                For payment or refund
                questions, also include the
                payment date, amount and
                transaction or payment ID.
                Never email complete card
                numbers, CVV values, OTPs,
                passwords or banking
                credentials.
              </p>

              <h2>Website</h2>

              <p>
                <a
                  href={
                    SHIPYARD_BUSINESS.website
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {
                    SHIPYARD_BUSINESS.website
                  }
                </a>
              </p>

              <h2>
                Grievance and escalation
              </h2>

              <p>
                If your issue remains
                unresolved, reply to the same
                email conversation with the
                word “Escalation” and include
                your previous support details.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="sy-footer">
      <div className="sy-container sy-footer-grid">
        <div className="sy-footer-brand">
          <Logo />

          <p>
            Human testing infrastructure for better Android releases.
          </p>

          <span>
            Recruit. Verify. Learn. Ship.
          </span>
        </div>

        <div className="sy-footer-column">
          <strong>Platform</strong>

          <Link to="/how-it-works">
            How it works
          </Link>

          <Link to="/pricing">
            Pricing
          </Link>

          <Link to="/signup">
            Start a test
          </Link>
        </div>

        <div className="sy-footer-column">
          <strong>Testers</strong>

          <Link to="/become-a-tester">
            Become a tester
          </Link>

          <Link to="/signup?role=tester">
            Create tester account
          </Link>

          <Link to="/login">
            Log in
          </Link>
        </div>

        <div className="sy-footer-column">
          <strong>Legal</strong>

          <Link to="/privacy">
            Privacy
          </Link>

          <Link to="/terms">
            Terms
          </Link>

          <Link to="/refund-policy">
  Refunds and cancellations
</Link>

<Link to="/contact">
  Contact us
</Link>
        </div>
      </div>

      <div className="sy-container sy-footer-bottom">
        <span>
          © {new Date().getFullYear()} Shipyard. All rights reserved.
        </span>

        <span>
          Built for serious Android release operations.
        </span>
      </div>
    </footer>
  );
}