/* eslint-disable @typescript-eslint/no-unused-vars */
interface Company {
  ipo_code?: string;
  ipo_name: string;
}

export function compareNameWithIpo(companyName: string, companyList) {
  const foundIpo = companyList.find(
    (ipo) =>
      compareNameByPercentage(
        companyName,
        (ipo['ipo_name'] = ipo['ipo_name'] ? ipo['ipo_name'] : ipo.companyName),
      ) >= 80,
  );

  return foundIpo;
}

function compareNameByPercentage(databaseCompanyName, ipoName: string): number {
  if (databaseCompanyName && ipoName) {
    const databaseNameWords = databaseCompanyName
      .toLowerCase()
      .split(/\b(ltd|limited)\b/g)[0];

    ipoName = ipoName
      .toLowerCase()
      .split(/\b(ltd|limited)\b/g)[0]
      .toLowerCase();

    const companyNameWords = ipoName.toLowerCase().split(/\s+/);
    let matchingWords = 0;
    for (const word of companyNameWords) {
      if (databaseNameWords.includes(word)) {
        matchingWords++;
      }
    }
    const matchingPercentage = (matchingWords / companyNameWords.length) * 100;
    return matchingPercentage;
  }
  return 0;
}
