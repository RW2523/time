/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BibleVerse, SermonThemeOption, BibleJourney } from './types';

export const versesData: BibleVerse[] = [
  {
    reference: "John 3:16",
    text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
    theme: "Sacrificial Love & Salvation",
    outputs: {
      explanation: "This verse is often called 'the Bible in miniature.' It outlines the foundational themes of Christian theology: God's universal love for humanity (the world), the supreme sacrifice (giving His only Son), the condition for receiving eternal life (personal belief), and the alternative (not perishing).",
      map: {
        locationName: "Jerusalem (Southern Steps / Temple Mount)",
        coordinates: "31.7767° N, 35.2345° E",
        story: "Jesus spoke these words privately to Nicodemus, a prominent Pharisee and member of the Sanhedrin, at night in Jerusalem. The discussion represents the transition from traditional law-study to faith-based regeneration.",
        visualHint: "Spiritual nighttime discussion overlooking the shimmering olive groves and stone towers of 1st-century Jerusalem."
      },
      timeline: [
        { era: "c. 30 AD", event: "Nicodemus Visits Jesus at Night", significance: "Privately questions Jesus about eternal life, giving birth to this core teaching." },
        { era: "c. 33 AD", event: "The Crucifixion of Christ", significance: "The physical execution of the sacrificial plan described in the verse." },
        { era: "c. 90 AD", event: "Gospel of John Published", significance: "Apostle John preserves and records this conversation for the early Church." }
      ],
      quiz: [
        {
          question: "To whom was Jesus speaking when He said the words in John 3:16?",
          options: ["Simon Peter", "Nicodemus the Pharisee", "The woman at the well", "Pontius Pilate"],
          answer: "Nicodemus the Pharisee",
          explanation: "In John chapter 3, Nicodemus comes to Jesus by night to inquire about His teachings on being born again."
        }
      ],
      sermon: {
        title: "The Heart of the Gospel",
        intro: "In a world of transactional relationships, God introduces a gift that asks for nothing but belief, yet transforms everything. Let us examine the four movements of John 3:16.",
        points: [
          "The Motive: 'For God so loved the world' — An unconditional, vast, and active love.",
          "The Measurement: 'He gave His only Son' — Love is proven by sacrificial action, not words.",
          "The Morning Star: 'Whoever believes' — Complete democracy of grace, defying societal classes.",
          "The Promise: 'Shall have eternal life' — Transition from temporal fear to permanent divine security."
        ],
        illustration: "Think of a defense attorney who unexpectedly steps up to pay the full legal penalty for their client, transforming their client from a convict into an adopted family member.",
        conclusion: "Do not remain in the shadows of the night like Nicodemus. Step into the daylight of this grand promise of salvation today."
      },
      audio: {
        duration: "3m 45s",
        title: "A Midnight Dialogue: Devotional",
        narrator: "AI Voice: Abraham (Deep, Warm, Resonant)"
      },
      video: {
        duration: "0m 45s",
        scenePrompt: "A soft golden oil lamp burning inside a stone room in ancient Jerusalem, casting shadows of two men debating over a parchment, transitioning to a cosmic sunrise.",
        style: "Cinematic, photorealistic historic style with volumetric lighting."
      },
      studySession: {
        title: "Understanding Divine Love",
        reading: "John 3:1-21 (The Nicodemus Encounter)",
        discussionQuestions: [
          "Why did Nicodemus come to Jesus at night? What does this reveal about his political and personal fears?",
          "How does God's definition of 'giving' compare to our modern consumerist perspective of giving?",
          "What does it mean practically to live with 'eternal life' starting today, rather than just waiting until post-mortality?"
        ],
        actionStep: "Write down one area of your life where you act out of fear of judgment, and consciously surrender it to God's unconditional love this week."
      }
    }
  },
  {
    reference: "Psalm 23:1",
    text: "The Lord is my shepherd; I shall not want.",
    theme: "Comfort, Provision & Trust",
    outputs: {
      explanation: "Written by King David, a former shepherd himself, this psalm characterizes God as a vigilant, loving guide who proactively ensures that all spiritual, emotional, and physical needs of His sheep are filled, eliminating anxiety over future lacks.",
      map: {
        locationName: "Judean Wilderness & Bethlehem Hills",
        coordinates: "31.7054° N, 35.2024° E",
        story: "David watched sheep across these semi-arid highlands, containing narrow green valleys ('green pastures') alongside steep rocky ravines ('valley of the shadow of death') where wild animals hid in the cracks.",
        visualHint: "Terraced limestone hillsides overlooking mist-shrouded gorges and pockets of dry flora, where water gathers in quiet stony pools."
      },
      timeline: [
        { era: "c. 1000 BC", event: "David Pens the Pastoral Psalms", significance: "Reflecting on his early experiences as a shepherd in preparation for the throne." },
        { era: "c. 30 AD", event: "Jesus declares: 'I am the Good Shepherd'", significance: "Jesus adopts David's metaphor, applying Psalm 23's fulfillment directly to His ministry." }
      ],
      quiz: [
        {
          question: "What livelihood did King David practice before being anointed as king, which directly inspired Psalm 23?",
          options: ["Fisherman", "Stone Mason", "Shepherd", "Scribe"],
          answer: "Shepherd",
          explanation: "David was the youngest son of Jesse and spent his youth tending sheep in the Bethlehem hillsides, defending them from lions and bears."
        }
      ],
      sermon: {
        title: "Living in the Sufficiency of the Shepherd",
        intro: "In an culture driven by fear of scarcity and continuous 'more', David begins his song of trust with a shocking declaration: 'I shall not want'. Let us study why sheep can rest in complete contentment.",
        points: [
          "The Ownership: 'The Lord is MY shepherd' — We do not belong to a cold landlord, but a passionate guardian.",
          "The Rest: 'He makes me lie down' — Sheep only lie down when they are entirely free from fear, friction, and hunger.",
          "The Elevation: 'Paths of righteousness' — The shepherd knows the tracks; our task is direction-trust, not path-building.",
          "The Comfort: 'Your rod and staff comfort me' — Discipline coordinates us; defense protects us from predators."
        ],
        illustration: "An experienced shepherd knows that a sheep gets overturned easily and cannot get back up on its own. The shepherd monitors continuously to 'restore' the cast sheep's circulation, just as God restores our souls.",
        conclusion: "Trade your weary burden of continuous self-provision for the rest that comes from admitting you are sheep in Jesus' pasture."
      },
      audio: {
        duration: "5m 20s",
        title: "Quiet Waters Meditative Audio Guide",
        narrator: "AI Voice: Sarah (Soft, Gentle, Calming)"
      },
      video: {
        duration: "1m 15s",
        scenePrompt: "Aerial panning over golden rolling hills of Judea, focusing on a crystal clear brook flowing smoothly through green reeds as a shepherd counts sheep in the shade.",
        style: "Ethereal, high-definition naturalistic presentation with warm lens flares."
      },
      studySession: {
        title: "Restoring the Restless Soul",
        reading: "Psalm 23, John 10:1-18",
        discussionQuestions: [
          "What are the specific modern 'shadows' that make you feel like you are in the 'valley of death'?",
          "How does a rod (for discipline/defense) actually comfort us? Why do we often resist divine boundaries?",
          "In what ways have you experienced God 'preparing a table in the presence of your enemies'?"
        ],
        actionStep: "Identify your main source of stress today. Pray Psalm 23 out loud, emphasizing 'I shall not want' three separate times during your lunch hour."
      }
    }
  },
  {
    reference: "Genesis 1:1",
    text: "In the beginning, God created the heavens and the earth.",
    theme: "Creation, Order & Sovereignty",
    outputs: {
      explanation: "The opening sentence of the Hebrew Bible establishes God as the sovereign, uncreated initiator of all physical matter, space, and time, declaring that the cosmos is a deliberate act of divine intellect rather than chaotic emergence.",
      map: {
        locationName: "Ancient Near East / Mesopotamia",
        coordinates: "33.3152° N, 44.3661° E",
        story: "While the setting of Genesis 1 is universal space/time, this text was delivered to ancient Israel in contrast to Babylonian/Mesopotamian creation epics (like Enuma Elish) which taught that the world was built from the bodies of slain water-monsters.",
        visualHint: "A magnificent dark galactic swirling void dividing to align brilliant rays of pure solar light and planetary atmospheres."
      },
      timeline: [
        { era: "Beginning", event: "Cosmic Fiat Lux (Let There Be Light)", significance: "Energy, physical space-time, and gravity are instituted by divine speech." },
        { era: "c. 1440 BC", event: "Moses Compiles Genesis", significance: "Written during the Exodus to teach Israel that Israel's God owns the entire cosmic order, not Pharaoh." }
      ],
      quiz: [
        {
          question: "What is the Hebrew word used for 'God' in Genesis 1:1, representing majestic plural authority?",
          options: ["Elohim", "Yahweh", "El Shaddai", "Adonai"],
          answer: "Elohim",
          explanation: "The text starts: 'Bereshit bara Elohim...' Elohim is the majestic plural used for the Creator God in Genesis 1."
        }
      ],
      sermon: {
        title: "From Chaos to Cosmos",
        intro: "Before there was an ear to hear, a song to sing, or a star to shine, there was God. The very first statement of the Bible sets up an unwavering anchor: everything is owned, ordered, and intentional.",
        points: [
          "The Time: 'In the beginning' — God precedes history. Your problems are inside time; your Savior is above it.",
          "The Creator: 'God' — Elohim. He claims absolute ownership over every molecule of your physical body.",
          "The Action: 'Created' (Bara) — Out of nothing. God does not need raw materials to construct miracles.",
          "The Structure: 'Heavens and Earth' — Establishes dual realities: the visible and the invisible, both under His rule."
        ],
        illustration: "A master clockmaker who does not just build the gears but invents the very nature of copper, quartz, kinetic force, and the concept of a tick itself.",
        conclusion: "If the Creator could organize a sprawling cosmos out of a dark, formless void, He can easily bring order and beauty out of your life's current chaos."
      },
      audio: {
        duration: "4m 10s",
        title: "Genesis Symphony: Audio Narrative",
        narrator: "AI Voice: Michael (Strong, Majestic, Proclaimer)"
      },
      video: {
        duration: "1m 30s",
        scenePrompt: "Macro cosmic explosion of dark interstellar nebulae organizing into spinning blue rings of stellar dust, oceans cooling, and sunlight piercing rich atmospheres.",
        style: "Sci-fi documentary style, highly immersive, cinematic masterclass."
      },
      studySession: {
        title: "The Sovereign Beginning",
        reading: "Genesis 1:1-2:3",
        discussionQuestions: [
          "How does viewing God as the ultimate source of life impact your own sense of personal purpose?",
          "Genesis shows God bringing order ('cosmos') out of disorder ('chaos'). Where in your home or mental life do you need His order today?",
          "Why is the uncreated nature of God comforting when modern security changes daily?"
        ],
        actionStep: "Consciously look at a natural element today (a plant, a cloud, the sky) and spend three minutes thanksgiving the Creator for He is good."
      }
    }
  }
];

export const sermonOptions: SermonThemeOption[] = [
  {
    id: "grace-truth",
    title: "Bridging Grace & Truth",
    roughNotes: "Focus on balancing cold judgment versus compromising grace. Use John 1:14. Talk about tension pastors feel when speaking on modern issues. Give an illustration of a strong structural arch where grace is one pillar, truth is the other, and Christ is the capstone keeping equal pressure on both elements.",
    suggestedVerses: ["John 1:14", "Ephesians 4:15", "Romans 5:20"],
    reference: "Ephesians & John"
  },
  {
    id: "overcoming-fear",
    title: "Shattering Anxiety in a Restless Digital Era",
    roughNotes: "Look at David before Goliath (1 Samuel 17). Talk about the psychological giants we face: social media comparisons, inflation, loneliness. Point out that David's armor was discarded because it was Saul's, representing fake solutions. Recommend a smooth stone and a staff, symbolizing prayer and God's sovereignty over giants.",
    suggestedVerses: ["1 Samuel 17:37", "Philippians 4:6-7", "2 Timothy 1:7"],
    reference: "1 Samuel 17"
  },
  {
    id: "abraham-unknown",
    title: "Stepping Naked into the Unknown: Abraham's Call",
    roughNotes: "Hebrews 11:8. Abraham left Ur without knowing the destination. Speak on faith as an active muscle, not a stationary feeling. Address young adults or people changing careers. Create an illustration of sailing a ship in the fog, relying strictly on compass bearings rather than physical optical views.",
    suggestedVerses: ["Hebrews 11:8", "Genesis 12:1-4", "Proverbs 3:5-6"],
    reference: "Hebrews 11 & Genesis 12"
  }
];

export const journeyOptions: BibleJourney[] = [
  {
    id: "paul-mission",
    title: "Paul’s 2nd Missionary Journey",
    stops: [
      { id: 1, name: "Antioch", region: "Syria", description: "The starting point where Paul and Silas are commended by believers for their journey.", keyVerse: "Acts 15:40", coordinates: { x: 15, y: 75 } },
      { id: 2, name: "Tarsus", region: "Cilicia", description: "Passing through Paul's birthplace to strengthen the early regional congregations.", keyVerse: "Acts 15:41", coordinates: { x: 30, y: 65 } },
      { id: 3, name: "Lystra", region: "Galatia", description: "Here, Paul meets young Timothy and invites him to join the missionary team.", keyVerse: "Acts 16:1", coordinates: { x: 45, y: 55 } },
      { id: 4, name: "Troas", region: "Aegean Coast", description: "The famous 'Macedonian Call' vision where a man begs Paul to: 'Come over and help us.'", keyVerse: "Acts 16:9", coordinates: { x: 60, y: 35 } },
      { id: 5, name: "Athens", region: "Greece", description: "Paul debates epicureans and stoics at the Areopagus, introducing 'The Unknown God'.", keyVerse: "Acts 17:22", coordinates: { x: 75, y: 25 } },
      { id: 6, name: "Corinth", region: "Achaia", description: "Spends 18 months tentmaking with Aquila and Priscilla, founding the Corinthian church.", keyVerse: "Acts 18:1", coordinates: { x: 90, y: 40 } }
    ]
  },
  {
    id: "moses-exodus",
    title: "The Exodus and Sinai Wilderness",
    stops: [
      { id: 1, name: "Raamses", region: "Egypt", description: "Pharaoh lets Israel leave Egypt after the terrifying final plague.", keyVerse: "Exodus 12:37", coordinates: { x: 10, y: 25 } },
      { id: 2, name: "Red Sea Crossing", region: "Suez", description: "The waters part as Moses lifts his rod, delivering Israel and swallowing Egypt's army.", keyVerse: "Exodus 14:21", coordinates: { x: 25, y: 45 } },
      { id: 3, name: "Marah", region: "Shur Desert", description: "Bitter waters are turned sweet after Moses throws a designated piece of wood in the stream.", keyVerse: "Exodus 15:23", coordinates: { x: 45, y: 55 } },
      { id: 4, name: "Mount Sinai", region: "Sinai", description: "Thunders and lightning surround the mountain as God delivers the Ten Commandments on stone tablets.", keyVerse: "Exodus 19:18", coordinates: { x: 65, y: 70 } },
      { id: 5, name: "Kadesh Barnea", region: "Paran Desert", description: "Israel retreats in fear after 12 spies return with reports of giants in Canaan.", keyVerse: "Numbers 13:26", coordinates: { x: 80, y: 50 } },
      { id: 6, name: "Mount Nebo", region: "Moab", description: "God shows Moses the Promised Land from afar before Moses passes into eternity.", keyVerse: "Deuteronomy 34:1", coordinates: { x: 92, y: 30 } }
    ]
  }
];
