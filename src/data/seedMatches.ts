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
  // GROUP A (MEX, RSA, KOR, CZE)
  // MD1: Jun 11 (confirmed) | MD2: ~Jun 16 | MD3: ~Jun 21 simultaneous
  ...groupMatches('A', ['MEX', 'RSA', 'KOR', 'CZE'], [
    d('2026-06-11T13:00:00-05:00'), d('2026-06-11T20:00:00-06:00'),
    d('2026-06-16T16:00:00-05:00'), d('2026-06-16T19:00:00-05:00'),
    d('2026-06-21T15:00:00-05:00'), d('2026-06-21T15:00:00-05:00'),
  ]),

  // GROUP B (CAN, BIH, QAT, SUI)
  // MD1: Jun 12 CAN-BIH (confirmed), Jun 13 QAT-SUI (confirmed)
  // MD2: ~Jun 17-18 | MD3: Jun 24 simultaneous (confirmed)
  ...groupMatches('B', ['CAN', 'BIH', 'QAT', 'SUI'], [
    d('2026-06-12T14:00:00-04:00'), d('2026-06-13T16:00:00-07:00'),
    d('2026-06-17T16:00:00-05:00'), d('2026-06-18T13:00:00-05:00'),
    d('2026-06-24T15:00:00-05:00'), d('2026-06-24T15:00:00-05:00'),
  ]),

  // GROUP C (BRA, MAR, HAI, SCO)
  // MD1: Jun 13 BRA-MAR (confirmed), Jun 14 HAI-SCO (confirmed)
  // MD2: ~Jun 18 | MD3: Jun 24 simultaneous (confirmed)
  ...groupMatches('C', ['BRA', 'MAR', 'HAI', 'SCO'], [
    d('2026-06-13T20:00:00-04:00'), d('2026-06-14T15:00:00-04:00'),
    d('2026-06-18T16:00:00-05:00'), d('2026-06-18T19:00:00-05:00'),
    d('2026-06-24T18:00:00-05:00'), d('2026-06-24T18:00:00-05:00'),
  ]),

  // GROUP D (USA, PAR, AUS, TUR)
  // MD1: Jun 12 USA-PAR (confirmed), Jun 14 AUS-TUR (confirmed)
  // MD2: ~Jun 18-19 | MD3: ~Jun 22-23 simultaneous
  ...groupMatches('D', ['USA', 'PAR', 'AUS', 'TUR'], [
    d('2026-06-12T18:00:00-07:00'), d('2026-06-14T13:00:00-07:00'),
    d('2026-06-18T19:00:00-05:00'), d('2026-06-19T13:00:00-05:00'),
    d('2026-06-22T15:00:00-05:00'), d('2026-06-22T15:00:00-05:00'),
  ]),

  // GROUP E (GER, CUW, CIV, ECU)
  // MD1: Jun 14 GER-CUW + CIV-ECU (confirmed, same day)
  // MD2: ~Jun 19-20 | MD3: ~Jun 23 simultaneous
  ...groupMatches('E', ['GER', 'CUW', 'CIV', 'ECU'], [
    d('2026-06-14T14:00:00-05:00'), d('2026-06-14T19:00:00-04:00'),
    d('2026-06-19T16:00:00-05:00'), d('2026-06-20T13:00:00-05:00'),
    d('2026-06-23T15:00:00-05:00'), d('2026-06-23T15:00:00-05:00'),
  ]),

  // GROUP F (NED, JPN, SWE, TUN)
  // MD1: Jun 14 NED-JPN (confirmed), Jun 15 SWE-TUN (estimated)
  // MD2: ~Jun 19-20 | MD3: ~Jun 23-24 simultaneous
  ...groupMatches('F', ['NED', 'JPN', 'SWE', 'TUN'], [
    d('2026-06-14T19:00:00-05:00'), d('2026-06-15T13:00:00-05:00'),
    d('2026-06-19T19:00:00-05:00'), d('2026-06-20T16:00:00-05:00'),
    d('2026-06-23T18:00:00-05:00'), d('2026-06-23T18:00:00-05:00'),
  ]),

  // GROUP G (BEL, EGY, IRN, NZL)
  // MD1: Jun 15 BEL-EGY + IRN-NZL (confirmed, same day)
  // MD2: ~Jun 20 | MD3: ~Jun 24 simultaneous
  ...groupMatches('G', ['BEL', 'EGY', 'IRN', 'NZL'], [
    d('2026-06-15T15:00:00-04:00'), d('2026-06-15T21:00:00-04:00'),
    d('2026-06-20T16:00:00-05:00'), d('2026-06-20T19:00:00-05:00'),
    d('2026-06-24T21:00:00-05:00'), d('2026-06-24T21:00:00-05:00'),
  ]),

  // GROUP H (ESP, CPV, KSA, URU)
  // MD1: Jun 15 ESP-CPV (confirmed 12:00 ET Atlanta) + KSA-URU (confirmed 18:00 ET Miami)
  // MD2: ~Jun 20 | MD3: ~Jun 24-25 simultaneous
  ...groupMatches('H', ['ESP', 'CPV', 'KSA', 'URU'], [
    d('2026-06-15T12:00:00-04:00'), d('2026-06-15T18:00:00-04:00'),
    d('2026-06-20T13:00:00-05:00'), d('2026-06-21T13:00:00-05:00'),
    d('2026-06-25T15:00:00-05:00'), d('2026-06-25T15:00:00-05:00'),
  ]),

  // GROUP I (FRA, SEN, IRQ, NOR)
  // MD1: Jun 16 FRA-SEN (confirmed 15:00 ET) + IRQ-NOR (confirmed 18:00 ET)
  // MD2: ~Jun 21 | MD3: ~Jun 25 simultaneous
  ...groupMatches('I', ['FRA', 'SEN', 'IRQ', 'NOR'], [
    d('2026-06-16T15:00:00-04:00'), d('2026-06-16T18:00:00-04:00'),
    d('2026-06-21T16:00:00-05:00'), d('2026-06-21T19:00:00-05:00'),
    d('2026-06-25T18:00:00-05:00'), d('2026-06-25T18:00:00-05:00'),
  ]),

  // GROUP J (ARG, ALG, AUT, JOR)
  // MD1: Jun 16 ARG-ALG (confirmed 21:00 ET), Jun 17 AUT-JOR (confirmed)
  // MD2: ~Jun 21-22 | MD3: ~Jun 25-26 simultaneous
  ...groupMatches('J', ['ARG', 'ALG', 'AUT', 'JOR'], [
    d('2026-06-16T21:00:00-04:00'), d('2026-06-17T13:00:00-05:00'),
    d('2026-06-22T16:00:00-05:00'), d('2026-06-22T19:00:00-05:00'),
    d('2026-06-26T15:00:00-05:00'), d('2026-06-26T15:00:00-05:00'),
  ]),

  // GROUP K (POR, COD, UZB, COL)
  // MD1: Jun 17 POR-COD + UZB-COL (confirmed, same day)
  // MD2: Jun 23 POR-UZB + COD-COL (confirmed) | MD3: ~Jun 26-27 simultaneous
  ...groupMatches('K', ['POR', 'COD', 'UZB', 'COL'], [
    d('2026-06-17T13:00:00-05:00'), d('2026-06-17T19:00:00-05:00'),
    d('2026-06-23T12:00:00-05:00'), d('2026-06-23T12:00:00-05:00'),
    d('2026-06-26T18:00:00-05:00'), d('2026-06-26T18:00:00-05:00'),
  ]),

  // GROUP L (ENG, CRO, GHA, PAN)
  // MD1: Jun 17 ENG-CRO (confirmed), Jun 17 GHA-PAN (estimated)
  // MD2: Jun 23 ENG-GHA + CRO-PAN (confirmed) | MD3: Jun 27 ENG-PAN + CRO-GHA (confirmed)
  ...groupMatches('L', ['ENG', 'CRO', 'GHA', 'PAN'], [
    d('2026-06-17T16:00:00-05:00'), d('2026-06-17T19:00:00-05:00'),
    d('2026-06-23T16:00:00-04:00'), d('2026-06-23T16:00:00-07:00'),
    d('2026-06-27T17:00:00-04:00'), d('2026-06-27T17:00:00-04:00'),
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
