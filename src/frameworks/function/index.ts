/* eslint-disable @typescript-eslint/no-unused-vars */
interface Company {
  ipo_code: string;
  ipo_name: string;
}

export function compareNameWithIpo(companyName: string, companyList) {
  const foundIpo = companyList.find(
    (ipo) => compareNameByPercentage(companyName, ipo) >= 80,
  );
  console.log('🚀 ~ compareName ~ foundIpo:', foundIpo);

  return foundIpo;
}

function compareNameByPercentage(databaseCompanyName, ipo: Company): number {
  const databaseNameWords = databaseCompanyName
    .toLowerCase()
    .split(/\b(ltd|limited)\b/g)[0];

  const ipoName = ipo.ipo_name
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
  console.log('🚀 ~ compare :', databaseNameWords, ipoName, matchingPercentage);

  return matchingPercentage;
}
