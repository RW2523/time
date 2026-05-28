/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BibleJourney, BibleVerse } from '../types';
import { journeyOptions, versesData } from '../mockData';

interface SupabaseDataState {
  journeys: BibleJourney[];
  verses: BibleVerse[];
  loading: boolean;
  source: 'supabase' | 'mock';
}

export function useSupabaseData(): SupabaseDataState {
  const [state, setState] = useState<SupabaseDataState>({
    journeys: journeyOptions,
    verses: versesData,
    loading: isSupabaseConfigured,
    source: 'mock',
  });

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    let cancelled = false;

    async function fetchData() {
      const [journeysRes, versesRes] = await Promise.all([
        supabase!.from('journeys').select('*').order('created_at'),
        supabase!.from('verses').select('*').order('id'),
      ]);

      if (cancelled) return;

      const fetchedJourneys: BibleJourney[] =
        journeysRes.data && journeysRes.data.length > 0
          ? (journeysRes.data as BibleJourney[])
          : journeyOptions;

      const fetchedVerses: BibleVerse[] =
        versesRes.data && versesRes.data.length > 0
          ? (versesRes.data as BibleVerse[])
          : versesData;

      setState({
        journeys: fetchedJourneys,
        verses: fetchedVerses,
        loading: false,
        source:
          journeysRes.data && journeysRes.data.length > 0 ? 'supabase' : 'mock',
      });
    }

    fetchData().catch(() => {
      if (!cancelled) {
        setState({ journeys: journeyOptions, verses: versesData, loading: false, source: 'mock' });
      }
    });

    return () => { cancelled = true; };
  }, []);

  return state;
}
