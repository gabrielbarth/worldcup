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

// All times in ET (EDT = UTC-4)
const d = (iso: string) => new Date(iso)

export const SEED_MATCHES: SeedMatch[] = [
  // GROUP A (MEX, RSA, KOR, CZE)
  // MD1: Jun 11 (confirmed) | MD2: Jun 18 (confirmed) | MD3: Jun 24 21h ET (confirmed)
  ...groupMatches('A', ['MEX', 'RSA', 'KOR', 'CZE'], [
    d('2026-06-11T15:00:00-04:00'), // MEX vs RSA  — confirmed 3PM ET
    d('2026-06-11T18:00:00-04:00'), // KOR vs CZE  — confirmed 6PM ET
    d('2026-06-18T15:00:00-04:00'), // MEX vs KOR  — confirmed Jun 18
    d('2026-06-18T18:00:00-04:00'), // RSA vs CZE  — confirmed Jun 18
    d('2026-06-24T21:00:00-04:00'), // MEX vs CZE  — simultaneous MD3
    d('2026-06-24T21:00:00-04:00'), // KOR vs RSA  — simultaneous MD3
  ]),

  // GROUP B (CAN, BIH, QAT, SUI)
  // MD1: Jun 12 + 13 (confirmed) | MD2: ~Jun 18 | MD3: Jun 24 15h ET (confirmed)
  ...groupMatches('B', ['CAN', 'BIH', 'QAT', 'SUI'], [
    d('2026-06-12T15:00:00-04:00'), // CAN vs BIH  — confirmed 3PM ET
    d('2026-06-13T15:00:00-04:00'), // QAT vs SUI  — confirmed 3PM ET
    d('2026-06-18T15:00:00-04:00'), // CAN vs QAT  — estimated
    d('2026-06-18T18:00:00-04:00'), // BIH vs SUI  — estimated
    d('2026-06-24T15:00:00-04:00'), // CAN vs SUI  — simultaneous MD3 (confirmed)
    d('2026-06-24T15:00:00-04:00'), // BIH vs QAT  — simultaneous MD3 (confirmed)
  ]),

  // GROUP C (BRA, MAR, HAI, SCO)
  // MD1: Jun 13 + 14 (confirmed) | MD2: Jun 19 (confirmed) | MD3: Jun 24 18h ET (confirmed)
  ...groupMatches('C', ['BRA', 'MAR', 'HAI', 'SCO'], [
    d('2026-06-13T18:00:00-04:00'), // BRA vs MAR  — confirmed 6PM ET
    d('2026-06-14T15:00:00-04:00'), // HAI vs SCO  — confirmed 3PM ET
    d('2026-06-19T20:30:00-04:00'), // BRA vs HAI  — confirmed 8:30PM ET
    d('2026-06-19T18:00:00-04:00'), // MAR vs SCO  — confirmed 6PM ET
    d('2026-06-24T18:00:00-04:00'), // BRA vs SCO  — simultaneous MD3 (confirmed)
    d('2026-06-24T18:00:00-04:00'), // MAR vs HAI  — simultaneous MD3 (confirmed)
  ]),

  // GROUP D (USA, PAR, AUS, TUR)
  // MD1: Jun 12 + 14 (confirmed) | MD2: Jun 19 (confirmed) | MD3: Jun 25 22h ET (confirmed)
  ...groupMatches('D', ['USA', 'PAR', 'AUS', 'TUR'], [
    d('2026-06-12T18:00:00-04:00'), // USA vs PAR  — confirmed 6PM ET
    d('2026-06-14T18:00:00-04:00'), // AUS vs TUR  — confirmed 6PM ET
    d('2026-06-19T15:00:00-04:00'), // USA vs AUS  — confirmed 3PM ET
    d('2026-06-19T23:00:00-04:00'), // PAR vs TUR  — confirmed 11PM ET
    d('2026-06-25T22:00:00-04:00'), // USA vs TUR  — simultaneous MD3 (confirmed)
    d('2026-06-25T22:00:00-04:00'), // PAR vs AUS  — simultaneous MD3 (confirmed)
  ]),

  // GROUP E (GER, CUW, CIV, ECU)
  // MD1: Jun 14 (confirmed, both 9PM ET) | MD2: Jun 20 (confirmed) | MD3: Jun 25 16h ET (confirmed)
  ...groupMatches('E', ['GER', 'CUW', 'CIV', 'ECU'], [
    d('2026-06-14T21:00:00-04:00'), // GER vs CUW  — confirmed 9PM ET
    d('2026-06-14T21:00:00-04:00'), // CIV vs ECU  — confirmed 9PM ET
    d('2026-06-20T15:00:00-04:00'), // GER vs CIV  — confirmed Jun 20
    d('2026-06-20T18:00:00-04:00'), // CUW vs ECU  — confirmed Jun 20
    d('2026-06-25T16:00:00-04:00'), // GER vs ECU  — simultaneous MD3 (confirmed)
    d('2026-06-25T16:00:00-04:00'), // CUW vs CIV  — simultaneous MD3 (confirmed)
  ]),

  // GROUP F (NED, JPN, SWE, TUN)
  // MD1: Jun 14 + 15 (confirmed) | MD2: Jun 20 (confirmed) | MD3: Jun 25 19h ET (confirmed)
  ...groupMatches('F', ['NED', 'JPN', 'SWE', 'TUN'], [
    d('2026-06-14T21:00:00-04:00'), // NED vs JPN  — confirmed 9PM ET
    d('2026-06-15T15:00:00-04:00'), // SWE vs TUN  — confirmed 3PM ET
    d('2026-06-20T15:00:00-04:00'), // NED vs SWE  — confirmed Jun 20
    d('2026-06-20T18:00:00-04:00'), // JPN vs TUN  — confirmed Jun 20
    d('2026-06-25T19:00:00-04:00'), // NED vs TUN  — simultaneous MD3 (confirmed)
    d('2026-06-25T19:00:00-04:00'), // JPN vs SWE  — simultaneous MD3 (confirmed)
  ]),

  // GROUP G (BEL, EGY, IRN, NZL)
  // MD1: Jun 15 (confirmed, both 6PM ET) | MD2: Jun 21 (confirmed) | MD3: Jun 26 23h ET (confirmed)
  ...groupMatches('G', ['BEL', 'EGY', 'IRN', 'NZL'], [
    d('2026-06-15T18:00:00-04:00'), // BEL vs EGY  — confirmed 6PM ET
    d('2026-06-15T18:00:00-04:00'), // IRN vs NZL  — confirmed 6PM ET
    d('2026-06-21T18:00:00-04:00'), // BEL vs IRN  — confirmed 6PM ET
    d('2026-06-21T18:00:00-04:00'), // EGY vs NZL  — confirmed 6PM ET
    d('2026-06-26T23:00:00-04:00'), // BEL vs NZL  — simultaneous MD3 (confirmed)
    d('2026-06-26T23:00:00-04:00'), // EGY vs IRN  — simultaneous MD3 (confirmed)
  ]),

  // GROUP H (ESP, CPV, KSA, URU)
  // MD1: Jun 15 (confirmed, both 9PM ET) | MD2: Jun 21 (confirmed) | MD3: Jun 26 20h ET (confirmed)
  ...groupMatches('H', ['ESP', 'CPV', 'KSA', 'URU'], [
    d('2026-06-15T21:00:00-04:00'), // ESP vs CPV  — confirmed 9PM ET
    d('2026-06-15T21:00:00-04:00'), // KSA vs URU  — confirmed 9PM ET
    d('2026-06-21T12:00:00-04:00'), // ESP vs KSA  — confirmed 12PM ET
    d('2026-06-21T20:00:00-04:00'), // CPV vs URU  — confirmed 8PM ET
    d('2026-06-26T20:00:00-04:00'), // ESP vs URU  — simultaneous MD3 (confirmed)
    d('2026-06-26T20:00:00-04:00'), // CPV vs KSA  — simultaneous MD3 (confirmed)
  ]),

  // GROUP I (FRA, SEN, IRQ, NOR)
  // MD1: Jun 16 (FRA vs SEN + NOR vs IRQ) | MD2: Jun 22 (FRA vs IRQ confirmado!) | MD3: Jun 26 15h ET (confirmed)
  ...groupMatches('I', ['FRA', 'SEN', 'IRQ', 'NOR'], [
    d('2026-06-16T15:00:00-04:00'), // FRA vs SEN  — MD1 Jun 16
    d('2026-06-16T20:00:00-04:00'), // IRQ vs NOR  — MD1 Jun 16
    d('2026-06-22T17:00:00-04:00'), // FRA vs IRQ  — MD2 Jun 22 5PM ET (confirmado pelo usuário!)
    d('2026-06-22T20:00:00-04:00'), // SEN vs NOR  — MD2 Jun 22 8PM ET
    d('2026-06-26T15:00:00-04:00'), // FRA vs NOR  — simultaneous MD3 (confirmed)
    d('2026-06-26T15:00:00-04:00'), // SEN vs IRQ  — simultaneous MD3 (confirmed)
  ]),

  // GROUP J (ARG, ALG, AUT, JOR)
  // MD1: Jun 16 (confirmed, 3PM + 6PM ET) | MD2: ~Jun 22 | MD3: Jun 27 22h ET (confirmed)
  ...groupMatches('J', ['ARG', 'ALG', 'AUT', 'JOR'], [
    d('2026-06-16T15:00:00-04:00'), // ARG vs ALG  — confirmed 3PM ET
    d('2026-06-16T18:00:00-04:00'), // AUT vs JOR  — confirmed 6PM ET
    d('2026-06-22T12:00:00-04:00'), // ARG vs AUT  — estimated Jun 22
    d('2026-06-22T15:00:00-04:00'), // ALG vs JOR  — estimated Jun 22
    d('2026-06-27T22:00:00-04:00'), // ARG vs JOR  — simultaneous MD3 (confirmed)
    d('2026-06-27T22:00:00-04:00'), // ALG vs AUT  — simultaneous MD3 (confirmed)
  ]),

  // GROUP K (POR, COD, UZB, COL)
  // MD1: Jun 17 (confirmed) | MD2: Jun 23 (confirmed) | MD3: Jun 27 19:30h ET (confirmed)
  ...groupMatches('K', ['POR', 'COD', 'UZB', 'COL'], [
    d('2026-06-17T13:00:00-04:00'), // POR vs COD  — confirmed 1PM ET
    d('2026-06-17T22:00:00-04:00'), // UZB vs COL  — confirmed 10PM ET
    d('2026-06-23T13:00:00-04:00'), // POR vs UZB  — confirmed 1PM ET
    d('2026-06-23T22:00:00-04:00'), // COD vs COL  — confirmed 10PM ET
    d('2026-06-27T19:30:00-04:00'), // POR vs COL  — simultaneous MD3 (confirmed)
    d('2026-06-27T19:30:00-04:00'), // UZB vs COD  — simultaneous MD3 (confirmed)
  ]),

  // GROUP L (ENG, CRO, GHA, PAN)
  // MD1: Jun 17 (confirmed) | MD2: Jun 23 (confirmed) | MD3: Jun 27 17h ET (confirmed)
  ...groupMatches('L', ['ENG', 'CRO', 'GHA', 'PAN'], [
    d('2026-06-17T21:00:00-04:00'), // ENG vs CRO  — confirmed 9PM ET
    d('2026-06-17T19:00:00-04:00'), // GHA vs PAN  — confirmed 7PM ET
    d('2026-06-23T16:00:00-04:00'), // ENG vs GHA  — confirmed 4PM ET
    d('2026-06-23T19:00:00-04:00'), // CRO vs PAN  — confirmed 7PM ET
    d('2026-06-27T17:00:00-04:00'), // ENG vs PAN  — simultaneous MD3 (confirmed)
    d('2026-06-27T17:00:00-04:00'), // CRO vs GHA  — simultaneous MD3 (confirmed)
  ]),

  // ROUND OF 32 (16 matches) — real confirmed bracket, group stage finished Jun 27
  { id: 'r32_1',  stage: 'round32', homeTeamId: 'RSA', awayTeamId: 'CAN', matchDate: d('2026-06-28T15:00:00-04:00') }, // South Africa vs Canada
  { id: 'r32_2',  stage: 'round32', homeTeamId: 'BRA', awayTeamId: 'JPN', matchDate: d('2026-06-29T13:00:00-04:00') }, // Brazil vs Japan
  { id: 'r32_3',  stage: 'round32', homeTeamId: 'GER', awayTeamId: 'PAR', matchDate: d('2026-06-29T16:30:00-04:00') }, // Germany vs Paraguay
  { id: 'r32_4',  stage: 'round32', homeTeamId: 'NED', awayTeamId: 'MAR', matchDate: d('2026-06-29T21:00:00-04:00') }, // Netherlands vs Morocco
  { id: 'r32_5',  stage: 'round32', homeTeamId: 'CIV', awayTeamId: 'NOR', matchDate: d('2026-06-30T13:00:00-04:00') }, // Ivory Coast vs Norway
  { id: 'r32_6',  stage: 'round32', homeTeamId: 'MEX', awayTeamId: 'ECU', matchDate: d('2026-06-30T21:00:00-04:00') }, // Mexico vs Ecuador
  { id: 'r32_7',  stage: 'round32', homeTeamId: 'FRA', awayTeamId: 'SWE', matchDate: d('2026-07-01T15:00:00-04:00') }, // France vs Sweden
  { id: 'r32_8',  stage: 'round32', homeTeamId: 'ENG', awayTeamId: 'COD', matchDate: d('2026-07-01T12:00:00-04:00') }, // England vs DR Congo
  { id: 'r32_9',  stage: 'round32', homeTeamId: 'BEL', awayTeamId: 'SEN', matchDate: d('2026-07-01T16:00:00-04:00') }, // Belgium vs Senegal
  { id: 'r32_10', stage: 'round32', homeTeamId: 'USA', awayTeamId: 'BIH', matchDate: d('2026-07-01T20:00:00-04:00') }, // USA vs Bosnia & Herzegovina
  { id: 'r32_11', stage: 'round32', homeTeamId: 'ESP', awayTeamId: 'AUT', matchDate: d('2026-07-02T15:00:00-04:00') }, // Spain vs Austria
  { id: 'r32_12', stage: 'round32', homeTeamId: 'POR', awayTeamId: 'CRO', matchDate: d('2026-07-02T19:00:00-04:00') }, // Portugal vs Croatia
  { id: 'r32_13', stage: 'round32', homeTeamId: 'SUI', awayTeamId: 'ALG', matchDate: d('2026-07-02T23:00:00-04:00') }, // Switzerland vs Algeria
  { id: 'r32_14', stage: 'round32', homeTeamId: 'AUS', awayTeamId: 'EGY', matchDate: d('2026-07-03T14:00:00-04:00') }, // Australia vs Egypt
  { id: 'r32_15', stage: 'round32', homeTeamId: 'ARG', awayTeamId: 'CPV', matchDate: d('2026-07-03T18:00:00-04:00') }, // Argentina vs Cape Verde
  { id: 'r32_16', stage: 'round32', homeTeamId: 'COL', awayTeamId: 'GHA', matchDate: d('2026-07-03T21:30:00-04:00') }, // Colombia vs Ghana

  // ROUND OF 16 (8 matches)
  { id: 'r16_1', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_1',  awayTeamSource: 'Wr32_2',  matchDate: d('2026-07-14T12:00:00-04:00') },
  { id: 'r16_2', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_3',  awayTeamSource: 'Wr32_4',  matchDate: d('2026-07-14T16:00:00-04:00') },
  { id: 'r16_3', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_5',  awayTeamSource: 'Wr32_6',  matchDate: d('2026-07-15T12:00:00-04:00') },
  { id: 'r16_4', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_7',  awayTeamSource: 'Wr32_8',  matchDate: d('2026-07-15T16:00:00-04:00') },
  { id: 'r16_5', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_9',  awayTeamSource: 'Wr32_10', matchDate: d('2026-07-16T12:00:00-04:00') },
  { id: 'r16_6', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_11', awayTeamSource: 'Wr32_12', matchDate: d('2026-07-16T16:00:00-04:00') },
  { id: 'r16_7', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_13', awayTeamSource: 'Wr32_14', matchDate: d('2026-07-17T12:00:00-04:00') },
  { id: 'r16_8', stage: 'round16', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr32_15', awayTeamSource: 'Wr32_16', matchDate: d('2026-07-17T16:00:00-04:00') },

  // QUARTERFINALS (4 matches)
  { id: 'qf_1', stage: 'quarter', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr16_1', awayTeamSource: 'Wr16_2', matchDate: d('2026-07-20T12:00:00-04:00') },
  { id: 'qf_2', stage: 'quarter', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr16_3', awayTeamSource: 'Wr16_4', matchDate: d('2026-07-20T16:00:00-04:00') },
  { id: 'qf_3', stage: 'quarter', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr16_5', awayTeamSource: 'Wr16_6', matchDate: d('2026-07-21T12:00:00-04:00') },
  { id: 'qf_4', stage: 'quarter', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wr16_7', awayTeamSource: 'Wr16_8', matchDate: d('2026-07-21T16:00:00-04:00') },

  // SEMIFINALS (2 matches)
  { id: 'sf_1', stage: 'semi', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wqf_1', awayTeamSource: 'Wqf_2', matchDate: d('2026-07-24T19:00:00-04:00') },
  { id: 'sf_2', stage: 'semi', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wqf_3', awayTeamSource: 'Wqf_4', matchDate: d('2026-07-25T19:00:00-04:00') },

  // THIRD PLACE
  { id: 'tp_1', stage: 'third_place', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Lsf_1', awayTeamSource: 'Lsf_2', matchDate: d('2026-07-28T10:00:00-04:00') },

  // FINAL
  { id: 'final_1', stage: 'final', homeTeamId: null, awayTeamId: null, homeTeamSource: 'Wsf_1', awayTeamSource: 'Wsf_2', matchDate: d('2026-07-29T11:00:00-04:00') },
]
