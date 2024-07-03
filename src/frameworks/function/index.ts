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

export function compareNameByPercentage(databaseCompanyName, companyName) {
  const databaseWords = cleanAndSplitCompanyName(databaseCompanyName);
  const ipoWords = cleanAndSplitCompanyName(companyName);

  let totalPercentage = 0;
  const wordPairs = Math.max(databaseWords.length, ipoWords.length);

  for (let i = 0; i < wordPairs; i++) {
    const dbWord = databaseWords[i] || '';
    const ipoWord = ipoWords[i] || '';
    totalPercentage += calculateWordSimilarity(dbWord, ipoWord);
  }

  const matchingPercentage = totalPercentage / wordPairs;

  return matchingPercentage;
}

function cleanAndSplitCompanyName(name) {
  return name
    .toLowerCase()
    .replace(/\b(ltd|limited|pvt|ipo|' - ')\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');
}

function calculateWordSimilarity(word1, word2) {
  const len1 = word1.length;
  const len2 = word2.length;
  const maxLen = Math.max(len1, len2);
  let matchCount = 0;

  for (let i = 0; i < maxLen; i++) {
    if (word1[i] === word2[i]) {
      matchCount++;
    }
  }

  return (matchCount / maxLen) * 100;
}
