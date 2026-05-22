/**
 * Extract slug after evt_XXXX_ prefix.
 * @param {string} timelineId
 */
export function timelineIdToSlug(timelineId) {
  const m = String(timelineId).match(/evt_\d+_(.+)$/i);
  return m ? m[1].toLowerCase() : String(timelineId).toLowerCase();
}

/** Direct timeline slug → Journey Map bibleEvents.json id */
export const TIMELINE_SLUG_TO_MAP_EVENT_ID = {
  the_creation: 'creation',
  the_fall_of_man: 'fall_of_man',
  cain_murders_abel: 'cain_and_abel',
  the_great_flood: 'noahs_ark',
  the_tower_of_babel: 'tower_of_babel',
  god_calls_abram: 'call_of_abraham',
  god_s_covenant_with_abram: 'abrahamic_covenant',
  the_birth_of_isaac: 'birth_of_isaac',
  abraham_tested_with_isaac: 'abraham_tested_with_isaac',
  jacob_receives_isaac_s_blessing: 'jacob_receives_blessing',
  jacob_wrestles_with_god: 'jacob_becomes_israel',
  joseph_sold_by_his_brothers: 'joseph_sold_into_egypt',
  joseph_in_potiphar_s_house: 'joseph_rises_to_power',
  israelites_enslaved_in_egypt: 'israelites_enslaved',
  moses_and_the_burning_bush: 'burning_bush',
  the_ten_plagues: 'ten_plagues_passover',
  the_exodus_begins: 'red_sea_crossing',
  moses_receives_the_commandments: 'ten_commandments',
  the_golden_calf: 'golden_calf_tabernacle',
  twelve_spies_sent_into_canaan: 'spies_enter_canaan',
  israel_crosses_the_jordan: 'joshua_crosses_jordan',
  the_fall_of_jericho: 'fall_of_jericho',
  the_period_of_the_judges: 'judges_period_begins',
  ruth_and_boaz: 'ruth_and_boaz',
  samuel_s_call: 'samuel_called',
  saul_anointed_king: 'saul_first_king',
  david_and_goliath: 'david_and_goliath',
  david_becomes_king: 'david_king_jerusalem',
  god_s_covenant_with_david: 'davidic_covenant',
  solomon_builds_the_temple: 'solomon_builds_temple',
  the_kingdom_divides: 'kingdom_divides',
  elijah_on_mount_carmel: 'elijah_mount_carmel',
  assyria_conquers_israel: 'assyria_conquers_israel',
  babylon_destroys_jerusalem: 'babylon_destroys_jerusalem',
  daniel_in_babylon: 'daniel_in_babylon',
  esther_saves_the_jews: 'esther_saves_jews',
  the_return_from_exile: 'return_from_exile',
  nehemiah_rebuilds_the_wall: 'nehemiah_rebuilds_walls',
  john_the_baptist_prepares_the_way: 'john_baptist_prepares_way',
  the_birth_of_jesus: 'birth_of_jesus',
  jesus_baptism_and_temptation: 'baptism_temptation_jesus',
  the_sermon_on_the_mount: 'sermon_on_mount',
  jesus_feeds_the_five_thousand: 'sermon_on_mount',
  the_transfiguration: 'sermon_on_mount',
  jesus_triumphal_entry: 'crucifixion_resurrection',
  jesus_betrayal_trial_crucifixion: 'crucifixion_resurrection',
  jesus_resurrection: 'crucifixion_resurrection',
  the_ascension: 'crucifixion_resurrection',
  pentecost: 'crucifixion_resurrection',
  stephen_s_martyrdom: 'crucifixion_resurrection',
  paul_s_conversion: 'crucifixion_resurrection',
  paul_s_missionary_journeys: 'crucifixion_resurrection',
  the_book_of_revelation: 'crucifixion_resurrection'
};

const KEYWORD_RULES = [
  [/the creation|genesis 1/i, 'creation'],
  [/fall of man|adam and eve fall/i, 'fall_of_man'],
  [/cain.*abel/i, 'cain_and_abel'],
  [/flood|noah.*ark/i, 'noahs_ark'],
  [/tower of babel/i, 'tower_of_babel'],
  [/call.*abram|abraham called/i, 'call_of_abraham'],
  [/abrahamic covenant|covenant.*abraham/i, 'abrahamic_covenant'],
  [/birth of isaac/i, 'birth_of_isaac'],
  [/binding of isaac|abraham.*isaac/i, 'abraham_tested_with_isaac'],
  [/jacob.*israel|wrestl/i, 'jacob_becomes_israel'],
  [/joseph sold/i, 'joseph_sold_into_egypt'],
  [/burning bush/i, 'burning_bush'],
  [/plague|passover/i, 'ten_plagues_passover'],
  [/red sea/i, 'red_sea_crossing'],
  [/ten commandments|sinai/i, 'ten_commandments'],
  [/golden calf/i, 'golden_calf_tabernacle'],
  [/jericho/i, 'fall_of_jericho'],
  [/ruth/i, 'ruth_and_boaz'],
  [/david.*goliath/i, 'david_and_goliath'],
  [/david.*king|david becomes/i, 'david_king_jerusalem'],
  [/davidic covenant/i, 'davidic_covenant'],
  [/solomon.*temple/i, 'solomon_builds_temple'],
  [/kingdom divide/i, 'kingdom_divides'],
  [/elijah.*carmel/i, 'elijah_mount_carmel'],
  [/birth of jesus|nativity/i, 'birth_of_jesus'],
  [/baptism.*jesus|temptation/i, 'baptism_temptation_jesus'],
  [/sermon on the mount/i, 'sermon_on_mount'],
  [/crucifixion|resurrection/i, 'crucifixion_resurrection']
];

/**
 * @param {string} timelineId
 * @param {string} [title]
 * @returns {string|null}
 */
export function getMapEventIdForTimelineEvent(timelineId, title = '') {
  const slug = timelineIdToSlug(timelineId);
  if (TIMELINE_SLUG_TO_MAP_EVENT_ID[slug]) return TIMELINE_SLUG_TO_MAP_EVENT_ID[slug];
  const t = `${slug} ${title}`.toLowerCase();
  for (const [re, id] of KEYWORD_RULES) {
    if (re.test(t)) return id;
  }
  return null;
}
