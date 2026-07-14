import {
  useEffect,
} from "react";

import {
  Link,
  Navigate,
  useParams,
} from "react-router-dom";

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  ExternalLink,
} from "lucide-react";

import {
  Logo,
  PublicNav,
} from "../components/UI";

import "../styles/public.css";

const SITE_URL =
  "https://www.getshipyard.in";

const articles = [
  {
    slug:
      "google-play-closed-testing-guide",

    category:
      "Google Play",

    title:
      "Google Play Closed Testing: Complete 14-Day Guide",

    seoTitle:
      "Google Play Closed Testing: Complete 14-Day Guide | Shipyard",

    description:
      "A practical guide to Google Play closed testing, the 12-tester and 14-day requirement, tester participation, feedback and production access.",

    readTime:
      "10 min read",

    intro:
      "For many new personal Google Play developer accounts, closed testing is the final operational step before applying for production access. Completing it properly requires more than collecting twelve names.",

    sections: [
      {
        title:
          "What is Google Play closed testing?",

        paragraphs: [
          "Closed testing allows an Android developer to distribute a pre-release app to a controlled group. Testers are normally managed using email lists or Google Groups, and the release is not broadly available to the public.",

          "For eligible new personal developer accounts, Google currently requires at least 12 testers to be continuously opted in to the closed test for the previous 14 days when the developer applies for production access.",
        ],
      },

      {
        title:
          "Recruit more than the minimum",

        paragraphs: [
          "Do not build the entire test around exactly 12 people. A tester may join using the wrong Google account, leave the group, opt out accidentally or become unavailable.",

          "Recruiting several backup participants gives the project more protection and makes it easier to maintain reliable participation.",
        ],
      },

      {
        title:
          "Prepare the app before starting",

        paragraphs: [
          "Use internal testing first to verify installation, login, registration, permissions, navigation, payments, uploads, account deletion and every other critical workflow.",

          "Give testers one clear instruction sheet containing the Google Group URL, Android opt-in URL, web opt-in URL, package name, testing tasks and support contact.",
        ],
      },

      {
        title:
          "Track meaningful participation",

        paragraphs: [
          "An opt-in confirms that someone joined the test, but it does not explain which features were used or whether any useful feedback was produced.",

          "Ask testers to perform realistic tasks, record the device used, explain what happened and report crashes, confusing screens or incorrect results.",
        ],
      },

      {
        title:
          "Apply for production access",

        paragraphs: [
          "When the testing requirement is satisfied, Play Console allows the developer to apply for production access.",

          "Answer the application questions specifically. Describe how testers were recruited, which workflows they tested, what feedback was received and what changed because of the test.",

          "Meeting the minimum testing threshold makes the app eligible to apply. It does not guarantee production approval.",
        ],
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/14151465?hl=en",
  },

  {
    slug:
      "find-12-testers-google-play",

    category:
      "Tester recruitment",

    title:
      "How to Find 12 Testers for Google Play Closed Testing",

    seoTitle:
      "How to Find 12 Testers for Google Play Closed Testing | Shipyard",

    description:
      "Practical methods for recruiting reliable Android testers and reducing drop-offs during Google Play closed testing.",

    readTime:
      "8 min read",

    intro:
      "Finding twelve people is easy. Finding twelve people who join correctly, remain opted in and provide useful feedback for two weeks is the real challenge.",

    sections: [
      {
        title:
          "Recruit above the minimum",

        paragraphs: [
          "Aim for more than twelve available participants. Backup capacity protects the project if someone joins incorrectly or stops participating.",

          "A person is not fully enrolled merely because they joined a chat or Google Group. Confirm that they also completed the Google Play testing opt-in.",
        ],
      },

      {
        title:
          "Where to find testers",

        paragraphs: [
          "Start with existing users, colleagues, friends who genuinely use Android, university technology communities, startup groups and developer communities that explicitly permit tester recruitment.",

          "Avoid purchasing fake installs, automated activity or duplicate accounts. These do not create meaningful testing and can expose the developer account to unnecessary risk.",
        ],
      },

      {
        title:
          "Write a clear invitation",

        paragraphs: [
          "Explain the app’s purpose, package name, testing duration, expected daily activity, privacy considerations, available reward and support contact.",

          "Make it clear that testers should remain opted in and use the app during the test rather than installing it once and disappearing.",
        ],
      },

      {
        title:
          "Reduce joining problems",

        paragraphs: [
          "Provide the Google Group URL first, followed by the Android and web opt-in links. Explain that the same Google account must be used throughout the process.",

          "Ask every participant to confirm that the Play Store shows them as a tester before counting them as recruited.",
        ],
      },

      {
        title:
          "Keep testers active",

        paragraphs: [
          "Create small daily missions covering onboarding, login, navigation, permissions, core features, settings and error handling.",

          "Check missed participation early. Waiting until the final day makes it much harder to understand or correct a problem.",
        ],
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/14151465?hl=en",
  },

  {
    slug:
      "track-android-testers",

    category:
      "Testing operations",

    title:
      "How to Track Whether Android Testers Actually Use Your App",

    seoTitle:
      "How to Track Android Tester Participation | Shipyard",

    description:
      "Learn ethical ways to track Android tester participation using evidence, analytics, feedback, issue reports and structured daily tasks.",

    readTime:
      "9 min read",

    intro:
      "Google Play opt-in information confirms access to a test. It does not provide a complete daily record of which features were used or what testers learned.",

    sections: [
      {
        title:
          "Use structured testing missions",

        paragraphs: [
          "Create short tasks that cover a different area of the app each day. Ask testers what they did, which device they used and what result they observed.",

          "A useful mission might cover account creation, file upload, notifications, offline behaviour, settings or account deletion.",
        ],
      },

      {
        title:
          "Collect evidence responsibly",

        paragraphs: [
          "Screenshots can confirm that a tester reached a particular workflow, but evidence must not reveal passwords, OTPs, banking details, private messages or unrelated personal information.",

          "Tell testers what evidence is expected and restrict access to the relevant developer and authorised platform administrators.",
        ],
      },

      {
        title:
          "Use privacy-conscious analytics",

        paragraphs: [
          "Analytics can help identify sessions, crashes and feature usage. Any collection should be disclosed through the app privacy policy and Play data-safety declarations.",

          "Analytics should support human feedback rather than replace it. A session count cannot explain why a workflow was confusing.",
        ],
      },

      {
        title:
          "Track results instead of empty activity",

        paragraphs: [
          "Record which features were completed, which devices were used, what errors occurred, which submissions were rejected and which improvements were released.",

          "A connected audit trail is much more useful than a folder filled with unrelated screenshots.",
        ],
      },

      {
        title:
          "How Shipyard approaches participation",

        paragraphs: [
          "Shipyard connects tester recruitment, assignments, daily evidence, reviews, issues, replacements, completion and rewards to the same project.",

          "This gives developers and testers a clearer record of what was requested, completed and approved.",
        ],
      },
    ],
  },

  {
    slug:
      "google-play-production-access-rejected",

    category:
      "Production access",

    title:
      "Google Play Production Access Rejected: What to Check Next",

    seoTitle:
      "Google Play Production Access Rejected: What to Do | Shipyard",

    description:
      "A practical checklist for developers asked to continue testing before receiving Google Play production access.",

    readTime:
      "9 min read",

    intro:
      "Completing fourteen days does not automatically guarantee production access. Google may ask a developer to continue testing when the submitted record does not demonstrate enough engagement or learning.",

    sections: [
      {
        title:
          "Confirm the basic eligibility",

        paragraphs: [
          "Check that at least 12 testers were continuously opted in for the full required period and remained eligible when the application was submitted.",

          "Confirm that testers did not switch Google accounts, leave the test or join only near the end of the testing period.",
        ],
      },

      {
        title:
          "Review tester engagement",

        paragraphs: [
          "If the test produced only installs and generic comments, continue with clearer missions and more specific feedback.",

          "Collect information about tested workflows, devices, crashes, usability problems and changes made because of tester reports.",
        ],
      },

      {
        title:
          "Check release quality",

        paragraphs: [
          "Resolve crashes, application-not-responding errors, broken authentication, permission problems and critical navigation issues.",

          "Review the privacy policy, account-deletion process, data-safety form and store listing before applying again.",
        ],
      },

      {
        title:
          "Improve the production-access answers",

        paragraphs: [
          "Use specific examples rather than statements such as “the testers liked the app.” Explain what they tested, what failed and what was improved.",

          "Do not exaggerate activity. A truthful extended testing cycle is safer than an application based on weak or fabricated information.",
        ],
      },

      {
        title:
          "Run another focused cycle when necessary",

        paragraphs: [
          "Continue testing when critical workflows were missed, most testers were inactive, important defects remain or the app changed significantly after the original test.",

          "Give the additional cycle a clear objective, such as validating an upload fix across multiple Android versions.",
        ],
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/14151465?hl=en",
  },

  {
    slug:
      "internal-vs-closed-vs-open-testing",

    category:
      "Google Play tracks",

    title:
      "Internal vs Closed vs Open Testing on Google Play",

    seoTitle:
      "Internal vs Closed vs Open Testing on Google Play | Shipyard",

    description:
      "Compare Google Play internal, closed and open testing tracks, who can join and when each testing track should be used.",

    readTime:
      "8 min read",

    intro:
      "Google Play provides internal, closed and open testing tracks. Each track is designed for a different release stage and audience.",

    sections: [
      {
        title:
          "Internal testing",

        paragraphs: [
          "Internal testing is designed for fast distribution to a small trusted group. Google currently documents support for up to 100 internal testers.",

          "Use it for team checks, installation validation, urgent fixes and verifying that a release candidate works before involving external testers.",
        ],
      },

      {
        title:
          "Closed testing",

        paragraphs: [
          "Closed testing is limited to users selected by the developer, normally through email lists or Google Groups.",

          "It is suitable for controlled external testing and is also part of the production-access requirement for eligible new personal developer accounts.",
        ],
      },

      {
        title:
          "Open testing",

        paragraphs: [
          "Open testing makes the beta available to a much broader audience through Google Play.",

          "Use it when the app is stable enough for public beta users and broader feedback would improve the release.",
        ],
      },

      {
        title:
          "A sensible release sequence",

        paragraphs: [
          "Begin with internal testing, move to controlled closed testing, fix important issues and then consider an open test when larger-scale feedback is useful.",

          "Testing tracks are distribution tools. They do not replace security, privacy, policy compliance or a proper quality review.",
        ],
      },

      {
        title:
          "Which track should you choose?",

        paragraphs: [
          "Choose based on application risk, release maturity and the audience needed. A storage, finance or authentication app may need more controlled testing than a simple informational application.",

          "Many projects use more than one testing track before production.",
        ],
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/9845334?hl=en",
  },

  {
    slug:
      "best-google-play-closed-testing-service",

    category:
      "Closed testing services",

    title:
      "Best Google Play Closed Testing Service: What Developers Should Look For",

    seoTitle:
      "Best Google Play Closed Testing Service: Buyer’s Guide | Shipyard",

    description:
      "Compare Google Play closed testing services by tester quality, 14-day participation, evidence, replacements, feedback and production-readiness support.",

    readTime:
      "12 min read",

    intro:
      "The best Google Play closed testing service is not the one that promises the largest number of installs. It is the one that helps developers recruit suitable testers, maintain reliable participation, collect useful evidence and understand what happened during the test.",

    sections: [
      {
        title:
          "What a Google Play closed testing service should actually provide",

        paragraphs: [
          "A closed testing service should solve an operational problem, not merely send people to an opt-in link. Developers need a dependable process for recruitment, onboarding, daily participation, issue reporting and completion.",

          "The service should clearly explain what it does and does not guarantee. No external platform can guarantee Google Play production approval because Google controls the final review. A responsible service helps the developer run a stronger test and prepare truthful, specific production-access answers.",
        ],
      },

      {
        title:
          "Look for real tester participation, not empty installs",

        paragraphs: [
          "An install count does not show whether onboarding worked, whether the main feature was used or whether a crash blocked the tester. Strong testing services connect participation to clear tasks, notes, screenshots or other appropriate evidence.",

          "This creates a more useful record for the developer and discourages low-quality activity. It also helps identify a tester who joined correctly but stopped participating before the assignment was complete.",
        ],
      },

      {
        title:
          "Daily tracking and replacement handling matter",

        paragraphs: [
          "A fourteen-day closed test can fail operationally when developers discover too late that several testers are inactive. A useful service surfaces missed participation early and provides a defined replacement process.",

          "The developer should be able to see recruitment progress, active assignments, daily submissions, rejected evidence, tester risk and completion status without coordinating through multiple spreadsheets and chat groups.",
        ],
      },

      {
        title:
          "Useful feedback is more valuable than generic comments",

        paragraphs: [
          "The testing service should encourage reports that identify the device, Android version, affected feature, steps to reproduce and expected result. Comments such as “nice app” may be encouraging, but they do not help a developer improve production readiness.",

          "Structured feedback is especially important for login, payments, uploads, notifications, permissions, offline behaviour and account deletion because these workflows often fail differently across devices.",
        ],
      },

      {
        title:
          "How Shipyard supports managed Android closed testing",

        paragraphs: [
          "Shipyard combines tester recruitment, assignments, daily evidence, human review, risk detection, replacements, issue reports and final completion in one release workspace.",

          "It is designed for independent Android developers who want a clearer process around the Google Play closed testing requirement. Shipyard does not claim to be Google-approved and does not guarantee production access. It helps developers run an organised, evidence-based test before they apply.",
        ],
      },

      {
        title:
          "Questions to ask before choosing a testing platform",

        paragraphs: [
          "Ask how testers are recruited, how participation is verified, what happens when someone becomes inactive, how evidence is reviewed, whether the developer can see progress and how tester data is protected.",

          "Also review pricing carefully. A very low price may cover only opt-ins, while a managed service may include recruitment, daily operations, reviews, replacement handling and final feedback.",
        ],
      },
    ],

    faq: [
      {
        question:
          "Can a closed testing service guarantee Google Play production access?",
        answer:
          "No. Google decides whether an app receives production access. A service can help organise testing, evidence and feedback, but it cannot guarantee approval.",
      },
      {
        question:
          "Is paying for real testing allowed?",
        answer:
          "Developers may use legitimate testing services, but they remain responsible for truthful activity, app quality, user privacy and Google Play policy compliance.",
      },
      {
        question:
          "What makes Shipyard different from a tester group?",
        answer:
          "Shipyard connects recruitment, assignments, daily evidence, reviews, issues, replacements and completion inside one managed project workflow.",
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/14151465?hl=en",
  },

  {
    slug:
      "google-play-production-access-answers",

    category:
      "Production access",

    title:
      "How to Answer Google Play Production Access Questions After Closed Testing",

    seoTitle:
      "Google Play Production Access Answers After Closed Testing | Shipyard",

    description:
      "Learn how to answer Google Play production access questions about tester recruitment, engagement, feedback, app changes and release readiness.",

    readTime:
      "13 min read",

    intro:
      "The production-access form is not only a confirmation that time has passed. It asks the developer to explain how the test was conducted, what testers did, what feedback was received and why the app is ready for a broader audience.",

    sections: [
      {
        title:
          "Describe how testers were recruited",

        paragraphs: [
          "Explain the real recruitment channels used, such as existing users, professional contacts, developer communities, customer lists or a managed testing platform. Mention how testers were selected and how instructions were delivered.",

          "Avoid vague statements such as “I found them online.” A stronger answer explains that participants were Android users, received the group and opt-in links, were given testing missions and had a support channel for access problems.",
        ],
      },

      {
        title:
          "Explain how testers engaged with the app",

        paragraphs: [
          "Describe the important workflows covered during the test. Examples include registration, authentication, uploads, payments, notifications, permissions, search, account settings and deletion.",

          "Mention how participation was tracked. This might include analytics, crash reports, daily check-ins, evidence submissions, feedback forms or structured issue reports, provided that collection was disclosed appropriately.",
        ],
      },

      {
        title:
          "Summarise the feedback received",

        paragraphs: [
          "Group feedback into themes rather than copying a list of comments. Useful themes include onboarding clarity, performance, device compatibility, confusing labels, missing validation and unexpected errors.",

          "Include specific examples while protecting tester privacy. Explain the problem, the affected workflow and how frequently it appeared.",
        ],
      },

      {
        title:
          "Show what changed because of testing",

        paragraphs: [
          "The strongest answers connect feedback to action. State which bugs were fixed, which screens were redesigned, which instructions were clarified and which performance issues were investigated.",

          "If no major defects were found, describe smaller improvements and the checks used to confirm stability. Do not invent changes merely to make the application sound stronger.",
        ],
      },

      {
        title:
          "Explain why the app is ready for production",

        paragraphs: [
          "Production readiness should be based on evidence: critical workflows completed successfully, severe crashes addressed, policies reviewed, privacy disclosures checked and support processes prepared.",

          "A useful answer also acknowledges remaining non-critical limitations and explains how they will be monitored after launch.",
        ],
      },

      {
        title:
          "How Shipyard helps developers prepare stronger answers",

        paragraphs: [
          "Shipyard keeps tester recruitment, participation evidence, issue reports, reviews and completion connected to the release. This makes it easier to recall what actually happened when the production-access application becomes available.",

          "The platform does not write fictional answers or promise approval. It gives developers an operational record they can use to prepare specific and truthful responses.",
        ],
      },
    ],

    faq: [
      {
        question:
          "Should production-access answers be long?",
        answer:
          "They should be specific rather than unnecessarily long. Explain the recruitment method, tested workflows, feedback themes, changes and readiness evidence clearly.",
      },
      {
        question:
          "Can I apply immediately after day 14?",
        answer:
          "Apply only when Play Console shows that the eligibility requirement is met and your testing record is strong enough to answer the form honestly.",
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/14151465?hl=en",
  },

  {
    slug:
      "google-play-closed-testing-checklist",

    category:
      "Closed testing",

    title:
      "Google Play Closed Testing Checklist: Before, During and After 14 Days",

    seoTitle:
      "Google Play Closed Testing Checklist for 14 Days | Shipyard",

    description:
      "Use this complete Google Play closed testing checklist to prepare your app, recruit testers, track participation and apply for production access.",

    readTime:
      "11 min read",

    intro:
      "A closed test becomes much easier when the release, tester group, instructions and tracking process are prepared before the first participant joins.",

    sections: [
      {
        title:
          "Before the closed test",

        paragraphs: [
          "Complete internal testing, verify the release bundle, review the package name and test every critical workflow on at least one real device. Confirm that the privacy policy, data-safety disclosures and account-deletion process match the app.",

          "Create the tester list or Google Group, generate the opt-in links and prepare a single onboarding message. Decide what testers should do each day and how they will report problems.",
        ],
      },

      {
        title:
          "Tester recruitment checklist",

        paragraphs: [
          "Recruit above the minimum so the test is not dependent on exactly twelve people. Confirm that every participant uses the intended Google account and sees the correct testing status in Google Play.",

          "Record when each tester joined and whether they completed installation. Do not count someone as ready merely because they replied to a recruitment message.",
        ],
      },

      {
        title:
          "During the fourteen-day test",

        paragraphs: [
          "Track participation consistently. Ask testers to cover different workflows, submit short notes and report defects with enough detail to reproduce them.",

          "Review missed participation early, answer access questions and release fixes carefully. Significant release changes may require additional validation.",
        ],
      },

      {
        title:
          "Quality and policy checks",

        paragraphs: [
          "Monitor crashes, application-not-responding events, login failures, broken links and permission problems. Confirm that store-listing screenshots and claims continue to match the build.",

          "Recheck privacy-sensitive workflows including personal data collection, uploads, payment information, location, camera access and account deletion.",
        ],
      },

      {
        title:
          "Before applying for production access",

        paragraphs: [
          "Confirm that Play Console shows the testing requirement as satisfied. Summarise tester recruitment, tested features, feedback themes, defects fixed and remaining limitations.",

          "Prepare truthful answers based on the testing record. Do not rely on memory after two busy weeks if the information can be documented throughout the cycle.",
        ],
      },

      {
        title:
          "Run the checklist through Shipyard",

        paragraphs: [
          "Shipyard gives each Android release a managed workspace for tester capacity, assignments, daily evidence, review decisions, issues, replacements and completion.",

          "This helps independent developers replace scattered screenshots and informal messages with a clearer closed-testing operation.",
        ],
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/14151465?hl=en",
  },

  {
    slug:
      "google-play-testing-link-not-working",

    category:
      "Troubleshooting",

    title:
      "Google Play Testing Link Not Working? Fix Closed Test Access Problems",

    seoTitle:
      "Google Play Testing Link Not Working: Closed Test Fixes | Shipyard",

    description:
      "Fix common Google Play closed testing link problems, including wrong accounts, group access, unavailable releases and Play Store caching.",

    readTime:
      "10 min read",

    intro:
      "A tester can join the correct group and still see an unavailable page, an account error or a production listing instead of the closed-test release. Most access problems come from account, eligibility or release-availability mismatches.",

    sections: [
      {
        title:
          "Confirm the Google account",

        paragraphs: [
          "The tester must open the opt-in link using a Google account that is eligible for the closed test. On devices with several accounts, the browser and Play Store may use different identities.",

          "Ask the tester to verify the active account in both the browser and Google Play. Opening the link in a private browser window can help expose an unexpected sign-in.",
        ],
      },

      {
        title:
          "Check Google Group membership",

        paragraphs: [
          "When eligibility is based on a Google Group, the tester must join the group using the same account used for the Play opt-in. Group membership alone does not automatically complete the opt-in.",

          "Verify that the group allows the tester to join and that there is no pending invitation or restricted membership setting.",
        ],
      },

      {
        title:
          "Verify that the closed release is available",

        paragraphs: [
          "Check the closed testing track in Play Console. The release should be active for the intended countries and tester list. Processing delays can occur after a new build or testing configuration is published.",

          "Confirm that the package name in the link matches the intended app and that the developer did not accidentally send an internal, open or production URL.",
        ],
      },

      {
        title:
          "Resolve Play Store caching and device issues",

        paragraphs: [
          "Ask the tester to close and reopen Google Play, wait for release processing and try the web opt-in page before opening the store listing again.",

          "Also confirm that the device is compatible with the app’s Android version, architecture, country availability and device-catalog rules.",
        ],
      },

      {
        title:
          "Create a repeatable onboarding process",

        paragraphs: [
          "Send links in the correct order: tester group, web opt-in, Android store link and confirmation request. Include screenshots showing what a successful opt-in looks like.",

          "Record access failures and their resolution. Repeated problems often reveal an unclear instruction or testing configuration that should be fixed for every tester.",
        ],
      },

      {
        title:
          "How Shipyard reduces tester onboarding confusion",

        paragraphs: [
          "Shipyard keeps project links and tester assignments together, giving each participant a clearer path into the test. Developers can see recruitment status and follow up when onboarding is incomplete.",

          "A structured workflow cannot remove every Google Play delay, but it makes access problems easier to identify and resolve.",
        ],
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/9845334?hl=en",
  },

  {
    slug:
      "android-beta-testing-best-practices",

    category:
      "Android QA",

    title:
      "Android Beta Testing Best Practices for Independent Developers",

    seoTitle:
      "Android Beta Testing Best Practices: Complete Guide | Shipyard",

    description:
      "Improve Android beta testing with better test planning, device coverage, evidence, bug reports, privacy controls and release decisions.",

    readTime:
      "14 min read",

    intro:
      "A useful Android beta test is designed around risk. It puts the most important workflows in front of real users, captures enough context to reproduce problems and turns findings into release decisions.",

    sections: [
      {
        title:
          "Define the purpose of the beta",

        paragraphs: [
          "Decide what the test must prove. The objective might be authentication stability, upload reliability, payment completion, notification delivery or usability across smaller screens.",

          "A test without a clear objective tends to produce random activity and generic feedback. Write measurable questions before recruiting participants.",
        ],
      },

      {
        title:
          "Build meaningful device coverage",

        paragraphs: [
          "Android behaviour varies across manufacturers, operating-system versions, screen sizes, memory conditions and network quality. Recruit testers who add useful variation rather than twelve people with identical devices.",

          "Prioritise devices used by the app’s intended audience. Device diversity should support the product strategy, not become a collection exercise.",
        ],
      },

      {
        title:
          "Test realistic user journeys",

        paragraphs: [
          "Cover complete journeys rather than isolated buttons. A storage app test might include account creation, permission approval, upload, preview, download, sharing, deletion and logout.",

          "Include negative scenarios such as an expired session, interrupted network, invalid input, denied permission and insufficient storage.",
        ],
      },

      {
        title:
          "Make bug reports reproducible",

        paragraphs: [
          "A strong report contains the affected feature, device, Android version, build version, steps taken, expected behaviour, actual behaviour and supporting evidence.",

          "Use severity consistently. A cosmetic alignment issue should not be classified the same way as data loss, a payment failure or an authentication bypass.",
        ],
      },

      {
        title:
          "Protect tester privacy",

        paragraphs: [
          "Collect only the evidence needed for the assignment. Warn testers not to expose passwords, OTP codes, financial data or unrelated personal content in screenshots.",

          "Keep testing evidence access limited and define how long it will be retained. Ensure analytics and crash tools are reflected in the privacy policy and Play declarations.",
        ],
      },

      {
        title:
          "Operate the beta through Shipyard",

        paragraphs: [
          "Shipyard helps developers convert a beta plan into assignments, daily missions, evidence reviews, issue reports and completion records.",

          "The result is a clearer release history and a more accountable experience for both developers and testers.",
        ],
      },
    ],
  },

  {
    slug:
      "google-play-closed-testing-cost-india",

    category:
      "Pricing",

    title:
      "Google Play Closed Testing Cost in India: What Developers Pay For",

    seoTitle:
      "Google Play Closed Testing Cost in India | Shipyard",

    description:
      "Understand Google Play closed testing costs in India, including tester rewards, recruitment, evidence review, replacements and managed testing plans.",

    readTime:
      "11 min read",

    intro:
      "The cost of Google Play closed testing depends on whether the developer recruits volunteers, coordinates testers manually or uses a managed platform. The cheapest option on paper is not always the lowest-cost option in time and failed participation.",

    sections: [
      {
        title:
          "Google does not charge a separate closed-testing fee",

        paragraphs: [
          "Closed testing is a Play Console distribution track. The developer’s costs usually come from the developer account, tester recruitment, rewards, support, operations and the time spent reviewing feedback.",

          "A developer managing everything personally may spend little cash but several hours coordinating groups, confirming opt-ins and following up with inactive participants.",
        ],
      },

      {
        title:
          "What managed testing pricing may include",

        paragraphs: [
          "A managed plan may include tester recruitment, assignment capacity, onboarding support, daily participation tracking, evidence review, issue collection, replacement handling and a final completion record.",

          "Compare included work rather than only the headline number of testers. Two services with the same tester count may provide very different levels of operational support.",
        ],
      },

      {
        title:
          "Tester rewards and service fees",

        paragraphs: [
          "Rewards compensate testers for time and attention. The amount may vary with duration, complexity, device requirements and the depth of feedback expected.",

          "A service fee supports recruitment, platform infrastructure, review work, support, payment processing and replacement risk. Developers should receive a clear explanation of the plan before payment.",
        ],
      },

      {
        title:
          "The hidden cost of failed coordination",

        paragraphs: [
          "When a developer discovers late that testers did not join correctly or stopped participating, the release can be delayed. That delay may cost more than the original testing plan.",

          "Clear onboarding and daily visibility reduce the chance that the entire test depends on assumptions.",
        ],
      },

      {
        title:
          "How to compare value",

        paragraphs: [
          "Compare tester quality, evidence requirements, dashboard visibility, support response, replacement rules, refund terms and the honesty of production-access claims.",

          "Avoid any service that promises guaranteed approval, fake activity or Google affiliation it cannot prove.",
        ],
      },

      {
        title:
          "Shipyard pricing for independent Android developers",

        paragraphs: [
          "Shipyard’s Launch plan is designed around a managed fourteen-day testing workflow for independent developers. Current plan details should always be checked on the pricing page because capacity and pricing may change.",

          "The platform focuses on accountable participation rather than selling an unexplained bundle of installs.",
        ],
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/14151465?hl=en",
  },

  {
    slug:
      "google-play-tester-dropped-out",

    category:
      "Tester management",

    title:
      "What Happens If a Google Play Closed Tester Drops Out During 14 Days?",

    seoTitle:
      "Google Play Tester Dropped Out During 14 Days: What Now? | Shipyard",

    description:
      "Understand how tester drop-outs can affect Google Play closed testing and how to use backup capacity, replacements and daily monitoring.",

    readTime:
      "9 min read",

    intro:
      "A tester who opts out, leaves the eligibility group or changes accounts can put a minimum-capacity closed test at risk. The safest response is prevention: recruit above the threshold and monitor participation throughout the cycle.",

    sections: [
      {
        title:
          "Why continuous opt-in matters",

        paragraphs: [
          "Google’s current requirement states that at least 12 testers must be opted in when the developer applies and must have remained opted in continuously for the previous 14 days.",

          "Because eligibility is continuous, a last-minute replacement should not be assumed to repair an earlier shortage for the same application date.",
        ],
      },

      {
        title:
          "Do not rely on exactly twelve testers",

        paragraphs: [
          "Recruit backup capacity from the beginning. This reduces the chance that one accidental opt-out or account problem causes the active count to fall below the threshold.",

          "Backups should complete the full onboarding process rather than waiting outside the test until a problem occurs.",
        ],
      },

      {
        title:
          "Distinguish opt-in status from daily activity",

        paragraphs: [
          "A tester can remain opted in but stop actively testing. These are different risks. Google’s eligibility counter relates to opt-in status, while meaningful engagement affects the quality of the testing record.",

          "Track both: whether the tester remains eligible and whether assignments are being completed.",
        ],
      },

      {
        title:
          "How to respond to inactivity",

        paragraphs: [
          "Contact the tester promptly, confirm there is no access or device problem and restate the assignment. Do not wait until the end of the test.",

          "When the project includes rewards, connect eligibility to clearly defined and approved completion rather than only joining the test.",
        ],
      },

      {
        title:
          "When to extend the test",

        paragraphs: [
          "Extend or restart the relevant period when Play Console does not show the requirement as satisfied or when participation was too weak to support honest production-access answers.",

          "The dashboard in Play Console is the authoritative indicator for account eligibility. Avoid calculating the application date only from a spreadsheet.",
        ],
      },

      {
        title:
          "How Shipyard handles tester risk",

        paragraphs: [
          "Shipyard surfaces recruitment capacity, missed participation and replacement needs inside the release workspace. This gives developers an earlier opportunity to address operational risk.",

          "The platform helps manage the test, but the developer should still confirm official eligibility in Play Console before applying.",
        ],
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/14151465?hl=en",
  },

  {
    slug:
      "android-app-testing-feedback-questions",

    category:
      "Tester feedback",

    title:
      "50 Android App Testing Questions That Produce Useful Feedback",

    seoTitle:
      "50 Android App Testing Questions for Better Beta Feedback | Shipyard",

    description:
      "Use practical Android app testing questions to collect better feedback about onboarding, usability, performance, permissions and core features.",

    readTime:
      "15 min read",

    intro:
      "Asking “Did you like the app?” produces opinions. Asking what the tester attempted, expected and observed produces information a developer can use.",

    sections: [
      {
        title:
          "Onboarding and first-use questions",

        paragraphs: [
          "Ask whether the purpose of the app was clear, which screen caused hesitation, whether registration instructions made sense and whether permission requests appeared at an understandable moment.",

          "Useful prompts include: What did you expect after tapping Continue? Which field was hardest to understand? Did any screen feel unnecessary? Could you complete onboarding without assistance?",
        ],
      },

      {
        title:
          "Navigation and usability questions",

        paragraphs: [
          "Ask testers to find a specific feature without instructions, return to the previous screen, change a setting and recover from a mistake.",

          "Prompts can include: Where did you expect this feature to be? Which label would you rename? Was the back-button behaviour predictable? Did any action feel irreversible?",
        ],
      },

      {
        title:
          "Performance and reliability questions",

        paragraphs: [
          "Ask when the app felt slow, whether loading states were visible, what happened after changing networks and whether the app recovered after being sent to the background.",

          "Record device model, Android version, available storage and network condition when performance problems appear.",
        ],
      },

      {
        title:
          "Core-feature questions",

        paragraphs: [
          "Write questions around the actual value of the app. For an upload product: Was the selected file obvious? Did progress make sense? Could the tester find the uploaded file? What happened when the connection failed?",

          "Ask testers to describe the complete workflow in their own words. A mismatch between their explanation and the intended design often reveals a usability problem.",
        ],
      },

      {
        title:
          "Trust, privacy and error questions",

        paragraphs: [
          "Ask whether permission requests felt justified, whether destructive actions had enough warning, whether privacy explanations were understandable and whether error messages suggested a useful next step.",

          "Do not ask testers to expose passwords or sensitive content. Test privacy-sensitive behaviour with controlled sample data.",
        ],
      },

      {
        title:
          "Turn feedback into action with Shipyard",

        paragraphs: [
          "Shipyard allows testers to submit notes and structured issues connected to a specific release and assignment. Developers can review findings alongside participation evidence.",

          "This keeps feedback from disappearing inside personal chats and makes it easier to identify repeated themes before production.",
        ],
      },
    ],
  },

  {
    slug:
      "google-play-release-readiness-checklist",

    category:
      "Release readiness",

    title:
      "Google Play Release Readiness Checklist Before Production",

    seoTitle:
      "Google Play Production Release Readiness Checklist | Shipyard",

    description:
      "Review Android app quality, privacy, store listing, testing evidence and support processes before moving from closed testing to production.",

    readTime:
      "13 min read",

    intro:
      "Production readiness is broader than passing a testing counter. The app, store listing, privacy disclosures, support process and release operations should all be ready for users who were not personally guided by the developer.",

    sections: [
      {
        title:
          "Critical product workflows",

        paragraphs: [
          "Verify registration, login, password recovery, logout, core features, payments, subscriptions, uploads, downloads, notifications, settings and account deletion where applicable.",

          "Test both successful and unsuccessful paths. Users should understand what happened when a network request fails, input is invalid or a permission is denied.",
        ],
      },

      {
        title:
          "Stability and device coverage",

        paragraphs: [
          "Review crash and application-not-responding reports, startup performance, memory behaviour and background recovery. Confirm the app works across the Android versions and screen sizes important to the target audience.",

          "Fix release-blocking defects before production. Document accepted lower-severity limitations and how they will be monitored.",
        ],
      },

      {
        title:
          "Privacy and policy readiness",

        paragraphs: [
          "Ensure the privacy policy accurately reflects collected data, SDKs, retention and user controls. Check that the Play data-safety form matches real app behaviour.",

          "Verify account deletion, permission explanations, advertising disclosures, content declarations and any category-specific policy requirements.",
        ],
      },

      {
        title:
          "Store listing readiness",

        paragraphs: [
          "Confirm that the title, short description, full description, screenshots, icon and feature graphic accurately represent the current build.",

          "Remove unsupported claims and outdated screenshots. Test contact, privacy and deletion URLs on mobile and desktop.",
        ],
      },

      {
        title:
          "Testing and support readiness",

        paragraphs: [
          "Summarise who tested the app, which workflows were covered, what issues were found and what changed. Prepare a support email and a process for responding to launch problems.",

          "Keep release notes clear and monitor production metrics after rollout rather than treating publication as the end of testing.",
        ],
      },

      {
        title:
          "Use Shipyard as a release operations record",

        paragraphs: [
          "Shipyard keeps tester assignments, evidence, issues, reviews and completion connected to the Android release. This gives developers a clearer record before making the production decision.",

          "The final decision remains with the developer and Google Play, but better visibility reduces avoidable uncertainty.",
        ],
      },
    ],
  },

  {
    slug:
      "managed-android-testing-vs-tester-groups",

    category:
      "Testing strategy",

    title:
      "Managed Android Testing vs Free Tester Groups: Which Is Better?",

    seoTitle:
      "Managed Android Testing vs Free Tester Groups | Shipyard",

    description:
      "Compare managed Android testing platforms with free tester exchange groups by reliability, evidence, support, replacements and total effort.",

    readTime:
      "12 min read",

    intro:
      "Free tester groups can be useful for developers with enough time to coordinate participation. Managed testing is designed for developers who need more visibility, accountability and operational support.",

    sections: [
      {
        title:
          "How free tester groups work",

        paragraphs: [
          "Developers share group and opt-in links, agree to exchange tests and coordinate activity through posts or direct messages. The cash cost may be low, but the developer performs recruitment, verification, reminders and troubleshooting.",

          "Results depend heavily on community rules and individual reliability. Some groups prohibit commercial promotion or require reciprocal testing.",
        ],
      },

      {
        title:
          "Where informal coordination becomes difficult",

        paragraphs: [
          "Messages become fragmented, screenshots lose context and it can be hard to know which tester joined, which account was used and whether daily activity occurred.",

          "When someone disappears, the developer must find a replacement and reconstruct the status manually.",
        ],
      },

      {
        title:
          "What managed testing adds",

        paragraphs: [
          "A managed platform can centralise project details, tester capacity, assignments, evidence, reviews, issues, reminders, replacements and completion.",

          "The value is operational clarity. The developer pays to reduce coordination effort and create a more usable testing record.",
        ],
      },

      {
        title:
          "Which option fits your project?",

        paragraphs: [
          "A free group may suit a developer with an active community, flexible timeline and willingness to coordinate every participant personally.",

          "Managed testing may suit a time-sensitive release, a developer without a tester network or an app that needs stronger evidence and feedback.",
        ],
      },

      {
        title:
          "Avoid false shortcuts in both models",

        paragraphs: [
          "Neither a group nor a paid platform should rely on fake identities, automated activity or guaranteed-approval claims. The goal is meaningful testing and a truthful production-readiness record.",

          "Developers remain responsible for app quality, privacy and compliance regardless of how testers are recruited.",
        ],
      },

      {
        title:
          "Where Shipyard fits",

        paragraphs: [
          "Shipyard is a managed Android testing workspace for developers who want recruitment, daily evidence, review, risk handling and completion in one place.",

          "It does not replace Play Console or Google’s review. It organises the human testing operation around the release.",
        ],
      },
    ],
  },

  {
    slug:
      "how-to-test-android-app-before-launch",

    category:
      "Pre-launch testing",

    title:
      "How to Test an Android App Before Launch: A Practical Release Plan",

    seoTitle:
      "How to Test an Android App Before Launch | Shipyard",

    description:
      "Follow a practical Android pre-launch testing plan covering internal testing, closed testing, device coverage, feedback and production rollout.",

    readTime:
      "14 min read",

    intro:
      "Testing before launch should progress from fast developer checks to controlled real-user validation. Each stage should answer a different question about quality and readiness.",

    sections: [
      {
        title:
          "Stage one: developer and automated checks",

        paragraphs: [
          "Test core logic, API failures, validation, navigation and data handling before distributing the app. Use automated tests where they provide reliable coverage and manual checks for user-facing workflows.",

          "Create a release checklist so critical behaviour is not tested from memory.",
        ],
      },

      {
        title:
          "Stage two: internal testing",

        paragraphs: [
          "Use Google Play internal testing to distribute the app quickly to a small trusted team. Confirm installation from Play, signing, updates and the most important end-to-end flows.",

          "Google currently documents support for up to 100 internal testers and recommends internal testing before wider tracks.",
        ],
      },

      {
        title:
          "Stage three: controlled closed testing",

        paragraphs: [
          "Recruit real users who represent the target audience and device mix. Give them realistic missions rather than asking them to explore without direction.",

          "Track access, participation, issues and feedback throughout the test. Fix serious defects and validate the revised build.",
        ],
      },

      {
        title:
          "Stage four: release-readiness review",

        paragraphs: [
          "Review crashes, usability findings, privacy disclosures, store assets, support processes and production-access answers. Decide which remaining issues block launch.",

          "A readiness review should include both technical quality and operational preparedness.",
        ],
      },

      {
        title:
          "Stage five: controlled production rollout",

        paragraphs: [
          "After approval, consider a staged rollout where appropriate. Monitor crashes, reviews, support messages and key product metrics after release.",

          "Be prepared to halt or update the rollout when a serious issue appears.",
        ],
      },

      {
        title:
          "Manage the human testing stage with Shipyard",

        paragraphs: [
          "Shipyard focuses on the operational gap between uploading a closed-test build and understanding whether the testing cycle was completed properly.",

          "Developers can manage recruitment, daily evidence, reviews, issues and tester completion from one release command centre.",
        ],
      },
    ],

    source:
      "https://support.google.com/googleplay/android-developer/answer/9845334?hl=en",
  },
];

function updateMeta(
  selector,
  attributes,
  content
) {
  let element =
    document.head.querySelector(
      selector
    );

  if (!element) {
    element =
      document.createElement(
        "meta"
      );

    Object.entries(
      attributes
    ).forEach(
      ([key, value]) => {
        element.setAttribute(
          key,
          value
        );
      }
    );

    document.head.appendChild(
      element
    );
  }

  element.setAttribute(
    "content",
    content
  );
}

function useBlogSeo(
  article = null
) {
  useEffect(() => {
    const title =
      article?.seoTitle ||
      "Android Testing Guides | Shipyard";

    const description =
      article?.description ||
      "Practical guides for Google Play closed testing, Android tester recruitment and production access.";

    const url =
      article
        ? `${SITE_URL}/blog/${article.slug}`
        : `${SITE_URL}/blog`;

    document.title = title;

    updateMeta(
      'meta[name="description"]',
      {
        name: "description",
      },
      description
    );

    updateMeta(
      'meta[property="og:title"]',
      {
        property: "og:title",
      },
      title
    );

    updateMeta(
      'meta[property="og:description"]',
      {
        property:
          "og:description",
      },
      description
    );

    updateMeta(
      'meta[property="og:url"]',
      {
        property: "og:url",
      },
      url
    );

    let canonical =
      document.head.querySelector(
        'link[rel="canonical"]'
      );

    if (!canonical) {
      canonical =
        document.createElement(
          "link"
        );

      canonical.setAttribute(
        "rel",
        "canonical"
      );

      document.head.appendChild(
        canonical
      );
    }

    canonical.setAttribute(
      "href",
      url
    );

    document
      .getElementById(
        "shipyard-article-schema"
      )
      ?.remove();

    if (article) {
      const schema =
        document.createElement(
          "script"
        );

      schema.id =
        "shipyard-article-schema";

      schema.type =
        "application/ld+json";

      const blogPosting = {
        "@type":
          "BlogPosting",

        headline:
          article.title,

        description:
          article.description,

        datePublished:
          "2026-07-14",

        dateModified:
          "2026-07-14",

        mainEntityOfPage:
          url,

        author: {
          "@type":
            "Organization",

          name:
            "Shipyard",
        },

        publisher: {
          "@type":
            "Organization",

          name:
            "Shipyard",

          logo: {
            "@type":
              "ImageObject",

            url:
              `${SITE_URL}/shipyard-icon-512.png`,
          },
        },
      };

      const graph = [
        blogPosting,
      ];

      if (article.faq?.length) {
        graph.push({
          "@type":
            "FAQPage",

          mainEntity:
            article.faq.map(
              (item) => ({
                "@type":
                  "Question",

                name:
                  item.question,

                acceptedAnswer: {
                  "@type":
                    "Answer",

                  text:
                    item.answer,
                },
              })
            ),
        });
      }

      schema.textContent =
        JSON.stringify({
          "@context":
            "https://schema.org",

          "@graph":
            graph,
        });

      document.head.appendChild(
        schema
      );
    }

    return () => {
      document
        .getElementById(
          "shipyard-article-schema"
        )
        ?.remove();
    };
  }, [article]);
}

function BlogFooter() {
  return (
    <footer className="blog-footer">
      <div className="blog-container blog-footer-inner">
        <div>
          <Logo />

          <p>
            Managed Android testing for
            clearer release operations.
          </p>
        </div>

        <nav>
          <Link to="/blog">
            Guides
          </Link>

          <Link to="/how-it-works">
            How it works
          </Link>

          <Link to="/pricing">
            Pricing
          </Link>

          <Link to="/contact">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export function BlogIndex() {
  useBlogSeo();

  return (
    <div className="sy-public-shell blog-shell">
      <PublicNav />

      <main>
        <section className="blog-index-hero">
          <div className="blog-container">
            <span className="blog-kicker">
              Android release guides
            </span>

            <h1>
              Practical Google Play
              testing guidance for
              developers.
            </h1>

            <p>
              Learn how to recruit
              testers, manage closed
              testing, collect feedback
              and prepare for production.
            </p>
          </div>
        </section>

        <section className="blog-index-section">
          <div className="blog-container blog-card-grid">
            {articles.map(
              (article) => (
                <article
                  className="blog-card"
                  key={article.slug}
                >
                  <span className="blog-category">
                    {article.category}
                  </span>

                  <h2>
                    <Link
                      to={`/blog/${article.slug}`}
                    >
                      {article.title}
                    </Link>
                  </h2>

                  <p>
                    {article.description}
                  </p>

                  <div className="blog-card-meta">
                    <span>
                      <CalendarDays
                        size={15}
                      />

                      14 July 2026
                    </span>

                    <span>
                      <Clock3
                        size={15}
                      />

                      {article.readTime}
                    </span>
                  </div>

                  <Link
                    className="blog-read-link"
                    to={`/blog/${article.slug}`}
                  >
                    Read guide

                    <ArrowRight
                      size={16}
                    />
                  </Link>
                </article>
              )
            )}
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
}

export function BlogArticle() {
  const { slug } =
    useParams();

  const article =
    articles.find(
      (item) =>
        item.slug === slug
    );

  useBlogSeo(article);

  if (!article) {
    return (
      <Navigate
        to="/blog"
        replace
      />
    );
  }

  const related =
    articles
      .filter(
        (item) =>
          item.slug !==
          article.slug
      )
      .slice(0, 3);

  return (
    <div className="sy-public-shell blog-shell">
      <PublicNav />

      <main>
        <article>
          <header className="blog-article-hero">
            <div className="blog-content-width">
              <Link
                className="blog-back"
                to="/blog"
              >
                ← All guides
              </Link>

              <span className="blog-category">
                {article.category}
              </span>

              <h1>
                {article.title}
              </h1>

              <p className="blog-lead">
                {article.description}
              </p>

              <div className="blog-article-meta">
                <span>
                  <CalendarDays
                    size={16}
                  />

                  Updated 14 July 2026
                </span>

                <span>
                  <Clock3
                    size={16}
                  />

                  {article.readTime}
                </span>
              </div>
            </div>
          </header>

          <div className="blog-container blog-layout">
            <div className="blog-article-content">
              <p className="blog-intro">
                {article.intro}
              </p>

              {article.sections.map(
                (section, index) => (
                  <div
                    key={section.title}
                  >
                    <section>
                      <h2>
                        {section.title}
                      </h2>

                      {section.paragraphs.map(
                        (paragraph) => (
                          <p
                            key={paragraph}
                          >
                            {paragraph}
                          </p>
                        )
                      )}
                    </section>

                    {index === 1 && (
                      <aside className="blog-inline-promo">
                        <span>
                          Managed Android closed testing
                        </span>

                        <h3>
                          Run your testing cycle with more
                          evidence and less manual coordination.
                        </h3>

                        <p>
                          Shipyard brings tester recruitment,
                          daily participation, evidence review,
                          issues and completion into one release
                          workspace.
                        </p>

                        <div className="blog-inline-promo-actions">
                          <Link
                            className="sy-primary-button"
                            to="/signup"
                          >
                            Start a closed test

                            <ArrowRight
                              size={17}
                            />
                          </Link>

                          <Link
                            className="blog-inline-link"
                            to="/pricing"
                          >
                            View testing plans
                          </Link>
                        </div>
                      </aside>
                    )}
                  </div>
                )
              )}

              {article.faq?.length > 0 && (
                <section className="blog-faq">
                  <span className="blog-category">
                    Frequently asked questions
                  </span>

                  <h2>
                    Questions developers ask
                  </h2>

                  <div className="blog-faq-list">
                    {article.faq.map(
                      (item) => (
                        <details
                          key={item.question}
                        >
                          <summary>
                            {item.question}
                          </summary>

                          <p>
                            {item.answer}
                          </p>
                        </details>
                      )
                    )}
                  </div>
                </section>
              )}

              {article.source && (
                <aside className="blog-source-note">
                  <strong>
                    Check the official
                    requirements
                  </strong>

                  <p>
                    Google Play requirements
                    may change. Confirm the
                    latest documentation
                    before making release
                    decisions.
                  </p>

                  <a
                    href={article.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Google Play Help

                    <ExternalLink
                      size={15}
                    />
                  </a>
                </aside>
              )}

              <aside className="blog-cta">
                <div>
                  <span>
                    Managed closed testing
                  </span>

                  <h2>
                    Prepare your Android app
                    for Google Play production.
                  </h2>

                  <p>
                    Recruit real testers, verify
                    participation, collect feedback
                    and manage the complete testing
                    cycle from one workspace.
                  </p>
                </div>

                <Link
                  className="sy-light-button"
                  to="/signup"
                >
                  Start Google Play testing

                  <ArrowRight
                    size={17}
                  />
                </Link>
              </aside>
            </div>

            <aside className="blog-sidebar">
              <div>
                <strong>
                  More testing guides
                </strong>

                {related.map(
                  (item) => (
                    <Link
                      key={item.slug}
                      to={`/blog/${item.slug}`}
                    >
                      {item.title}
                    </Link>
                  )
                )}
              </div>

              <div>
                <strong>
                  Shipyard
                </strong>

                <Link to="/pricing">
                  View pricing
                </Link>

                <Link to="/how-it-works">
                  How it works
                </Link>

                <Link to="/signup">
                  Create account
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </main>

      <BlogFooter />
    </div>
  );
}