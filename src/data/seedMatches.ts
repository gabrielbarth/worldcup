export type SeedMatch = {
  id: string
  stage: string
  groupName?: string
  homeTeamId: string | null
  awayTeamId: string | null
  homeTeamSource?: string
  awayTeamSource?: string
  matchDate: Date
}

function groupMatches(
  group: string,
  teams: [string, string, string, string],
  dates: [Date, Date, Date, Date, Date, Date]
): SeedMatch[] {
  const [t1, t2, t3, t4] = teams
  const pairs: [string, string][] = [[t1, t2], [t3, t4], [t1, t3], [t2, t4], [t1, t4], [t2, t3]]
  return pairs.map(([home, away], i) => ({
    id: `g${group}${i + 1}`,
    stage: 'group',
    groupName: group,
    homeTeamId: home,
    awayTeamId: away,
    matchDate: dates[i],
  }))
}

const d = (iso: string) => new Date(iso)

export const SEED_MATCHES: SeedMatch[] = [
  // GROUP A (USA, PAN, URU, MAR)
  ...groupMatches('A', ['USA', 'PAN', 'URU', 'MAR'], [
    d('2026-06-11T19:00:00-05:00'), d('2026-06-12T16:00:00-05:00'),
    d('2026-06-15T16:00:00-05:00'), d('2026-06-15T19:00:00-05:00'),
    d('2026-06-19T15:00:00-05:00'), d('2026-06-19T15:00:00-05:00'),
  ]),
  // GROUP B (MEX, POL, ARG, NGA)
  ...groupMatches('B', ['MEX', 'POL', 'ARG', 'NGA'], [
    d('2026-06-11T22:00:00-05:00'), d('2026-06-12T19:00:00-05:00'),
    d('2026-06-16T16:00:00-05:00'), d('2026-06-16T19:00:00-05:00'),
    d('2026-06-20T15:00:00-05:00'), d('2026-06-20T15:00:00-05:00'),
  ]),
  // GROUP C (CAN, BEL, SUI, CMR)
  ...groupMatches('C', ['CAN', 'BEL', 'SUI', 'CMR'], [
    d('2026-06-12T13:00:00-05:00'), d('2026-06-13T16:00:00-05:00'),
    d('2026-06-16T13:00:00-05:00'), d('2026-06-17T16:00:00-05:00'),
    d('2026-06-20T19:00:00-05:00'), d('2026-06-20T19:00:00-05:00'),
  ]),
  // GROUP D (GER, JAM, COL, KOR)
  ...groupMatches('D', ['GER', 'JAM', 'COL', 'KOR'], [
    d('2026-06-13T13:00:00-05:00'), d('2026-06-13T19:00:00-05:00'),
    d('2026-06-17T13:00:00-05:00'), d('2026-06-17T19:00:00-05:00'),
    d('2026-06-21T15:00:00-05:00'), d('2026-06-21T15:00:00-05:00'),
  ]),
  // GROUP E (FRA, EGY, AUS, SRB)
  ...groupMatches('E', ['FRA', 'EGY', 'AUS', 'SRB'], [
    d('2026-06-14T13:00:00-05:00'), d('2026-06-14T19:00:00-05:00'),
    d('2026-06-18T16:00:00-05:00'), d('2026-06-18T19:00:00-05:00'),
    d('2026-06-22T15:00:00-05:00'), d('2026-06-22T15:00:00-05:00'),
  ]),
  // GROUP F (ENG, IRN, ECU, NZL)
  ...groupMatches('F', ['ENG', 'IRN', 'ECU', 'NZL'], [
    d('2026-06-14T16:00:00-05:00'), d('2026-06-15T13:00:00-05:00'),
    d('2026-06-18T13:00:00-05:00'), d('2026-06-19T13:00:00-05:00'),
    d('2026-06-22T19:00:00-05:00'), d('2026-06-22T19:00:00-05:00'),
  ]),
  // GROUP G (ESP, HON, CIV, JPN)
  ...groupMatches('G', ['ESP', 'HON', 'CIV', 'JPN'], [
    d('2026-06-15T22:00:00-05:00'), d('2026-06-16T22:00:00-05:00'),
    d('2026-06-19T22:00:00-05:00'), d('2026-06-20T13:00:00-05:00'),
    d('2026-06-23T15:00:00-05:00'), d('2026-06-23T15:00:00-05:00'),
  ]),
  // GROUP H (ITA, QAT, SEN, DNK)
  ...groupMatches('H', ['ITA', 'QAT', 'SEN', 'DNK'], [
    d('2026-06-16T16:00:00-05:00'), d('2026-06-17T13:00:00-05:00'),
    d('2026-06-20T16:00:00-05:00'), d('2026-06-21T13:00:00-05:00'),
    d('2026-06-24T15:00:00-05:00'), d('2026-06-24T15:00:00-05:00'),
  ]),
  // GROUP I (POR, VEN, TUN, AUT)
  ...groupMatches('I', ['POR', 'VEN', 'TUN', 'AUT'], [
    d('2026-06-17T22:00:00-05:00'), d('2026-06-18T22:00:00-05:00'),
    d('2026-06-21T22:00:00-05:00'), d('2026-06-22T13:00:00-05:00'),
    d('2026-06-25T15:00:00-05:00'), d('2026-06-25T15:00:00-05:00'),
  ]),
  // GROUP J (NED, BRA, JOR, SCO)
  ...groupMatches('J', ['NED', 'BRA', 'JOR', 'SCO'], [
    d('2026-06-18T16:00:00-05:00'), d('2026-06-19T16:00:00-05:00'),
    d('2026-06-22T16:00:00-05:00'), d('2026-06-22T22:00:00-05:00'),
    d('2026-06-26T15:00:00-05:00'), d('2026-06-26T15:00:00-05:00'),
  ]),
  // GROUP K (TUR, MLI, CRO, IRQ)
  ...groupMatches('K', ['TUR', 'MLI', 'CRO', 'IRQ'], [
    d('2026-06-19T19:00:00-05:00'), d('2026-06-20T22:00:00-05:00'),
    d('2026-06-23T19:00:00-05:00'), d('2026-06-23T22:00:00-05:00'),
    d('2026-06-27T15:00:00-05:00'), d('2026-06-27T15:00:00-05:00'),
  ]),
  // GROUP L (SAU, ZIM, CHL, SWE)
  ...groupMatches('L', ['SAU', 'ZIM', 'CHL', 'SWE'], [
    d('2026-06-20T19:00:00-05:00'), d('2026-06-21T16:00:00-05:00'),
    d('2026-06-24T19:00:00-05:00'), d('2026-06-24T22:00:00-05:00'),
    d('2026-06-28T15:00:00-05:00'), d('2026-06-28T15:00:00-05:00'),
  ]),

  // ROUND OF 32 (16 matches)
  { id: 'r32_1',  stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1A', awayTeamSource: '2C', matchDate: d('2026-07-04T12:00:00-05:00') },
  { id: 'r32_2',  stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1B', awayTeamSource: '2D', matchDate: d('2026-07-04T16:00:00-05:00') },
  { id: 'r32_3',  stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1C', awayTeamSource: '2A', matchDate: d('2026-07-05T12:00:00-05:00') },
  { id: 'r32_4',  stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1D', awayTeamSource: '2B', matchDate: d('2026-07-05T16:00:00-05:00') },
  { id: 'r32_5',  stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1E', awayTeamSource: '2G', matchDate: d('2026-07-06T12:00:00-05:00') },
  { id: 'r32_6',  stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1F', awayTeamSource: '2H', matchDate: d('2026-07-06T16:00:00-05:00') },
  { id: 'r32_7',  stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1G', awayTeamSource: '2E', matchDate: d('2026-07-07T12:00:00-05:00') },
  { id: 'r32_8',  stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1H', awayTeamSource: '2F', matchDate: d('2026-07-07T16:00:00-05:00') },
  { id: 'r32_9',  stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1I', awayTeamSource: '2K', matchDate: d('2026-07-08T12:00:00-05:00') },
  { id: 'r32_10', stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1J', awayTeamSource: '2L', matchDate: d('2026-07-08T16:00:00-05:00') },
  { id: 'r32_11', stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1K', awayTeamSource: '2I', matchDate: d('2026-07-09T12:00:00-05:00') },
  { id: 'r32_12', stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '1L', awayTeamSource: '2J', matchDate: d('2026-07-09T16:00:00-05:00') },
  { id: 'r32_13', stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '3best1', awayTeamSource: '3best2', matchDate: d('2026-07-10T12:00:00-05:00') },
  { id: 'r32_14', stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '3best3', awayTeamSource: '3best4', matchDate: d('2026-07-10T16:00:00-05:00') },
  { id: 'r32_15', stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '3best5', awayTeamSource: '3best6', matchDate: d('2026-07-11T12:00:00-05:00') },
  { id: 'r32_16', stage: 'round32', homeTeamId: null, awayTeamId: null, homeTeamSource: '3best7', awayTeamSource: '3best8', matchDate: d('2026-07-11T16:00:00-05:00') },

  // ROUND OF 16 (8 matches)
  { id: 'r16_1', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_1',  awayTeamSource: 'Wr32_2',  matchDate: d('2026-07-14T12:00:00-05:00') },
  { id: 'r16_2', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_3',  awayTeamSource: 'Wr32_4',  matchDate: d('2026-07-14T16:00:00-05:00') },
  { id: 'r16_3', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_5',  awayTeamSource: 'Wr32_6',  matchDate: d('2026-07-15T12:00:00-05:00') },
  { id: 'r16_4', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_7',  awayTeamSource: 'Wr32_8',  matchDate: d('2026-07-15T16:00:00-05:00') },
  { id: 'r16_5', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_9',  awayTeamSource: 'Wr32_10', matchDate: d('2026-07-16T12:00:00-05:00') },
  { id: 'r16_6', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_11', awayTeamSource: 'Wr32_12', matchDate: d('2026-07-16T16:00:00-05:00') },
  { id: 'r16_7', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_13', awayTeamSource: 'Wr32_14', matchDate: d('2026-07-17T12:00:00-05:00') },
  { id: 'r16_8', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_15', awayTeamSource: 'Wr32_16', matchDate: d('2026-07-17T16:00:00-05:00') },

  // QUARTERFINALS (4 matches)
  { id: 'qf_1', stage: 'quarter', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr16_1', awayTeamSource: 'Wr16_2', matchDate: d('2026-07-20T12:00:00-05:00') },
  { id: 'qf_2', stage: 'quarter', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr16_3', awayTeamSource: 'Wr16_4', matchDate: d('2026-07-20T16:00:00-05:00') },
  { id: 'qf_3', stage: 'quarter', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr16_5', awayTeamSource: 'Wr16_6', matchDate: d('2026-07-21T12:00:00-05:00') },
  { id: 'qf_4', stage: 'quarter', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr16_7', awayTeamSource: 'Wr16_8', matchDate: d('2026-07-21T16:00:00-05:00') },

  // SEMIFINALS (2 matches)
  { id: 'sf_1', stage: 'semi', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wqf_1', awayTeamSource: 'Wqf_2', matchDate: d('2026-07-24T19:00:00-05:00') },
  { id: 'sf_2', stage: 'semi', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wqf_3', awayTeamSource: 'Wqf_4', matchDate: d('2026-07-25T19:00:00-05:00') },

  // THIRD PLACE
  { id: 'tp_1', stage: 'third_place', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Lsf_1', awayTeamSource: 'Lsf_2', matchDate: d('2026-07-28T10:00:00-05:00') },

  // FINAL
  { id: 'final_1', stage: 'final', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wsf_1', awayTeamSource: 'Wsf_2', matchDate: d('2026-07-29T11:00:00-05:00') },
]
