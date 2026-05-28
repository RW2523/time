/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BibleVerse {
  reference: string;
  text: string;
  theme: string;
  outputs: {
    explanation: string;
    map: {
      locationName: string;
      coordinates: string;
      story: string;
      visualHint: string;
    };
    timeline: {
      era: string;
      event: string;
      significance: string;
    }[];
    quiz: {
      question: string;
      options: string[];
      answer: string;
      explanation: string;
    }[];
    sermon: {
      title: string;
      intro: string;
      points: string[];
      illustration: string;
      conclusion: string;
    };
    audio: {
      duration: string;
      title: string;
      narrator: string;
    };
    video: {
      duration: string;
      scenePrompt: string;
      style: string;
    };
    studySession: {
      title: string;
      reading: string;
      discussionQuestions: string[];
      actionStep: string;
    };
  };
}

export interface StudyPlanConfig {
  title: string;
  ageGroup: string;
  version: string;
  theme: string;
  durationDays: number;
}

export interface SermonThemeOption {
  id: string;
  title: string;
  roughNotes: string;
  suggestedVerses: string[];
  reference: string;
}

export interface JourneyStop {
  id: number;
  name: string;
  region: string;
  description: string;
  keyVerse: string;
  coordinates: { x: number; y: number }; // Simulated coordinate on custom graphic SVG map
}

export interface BibleJourney {
  id: string;
  title: string;
  stops: JourneyStop[];
}
