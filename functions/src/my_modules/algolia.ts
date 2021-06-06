import * as algolia from 'algoliasearch';

const algoliaAppId = 'VVPLQALK5E';
const algoliaAdminApiKey = 'db0704cf12bc02d58c2dc1f017feec35';

export const algoliaClient = () => {
  const searchClient = algolia.default;
  return searchClient(algoliaAppId, algoliaAdminApiKey);
};
