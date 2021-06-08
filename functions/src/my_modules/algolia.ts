import * as algolia from 'algoliasearch';
import {Context, QueryDocumentSnapshot} from '../myutils/mytypes';

const algoliaAppId = 'VVPLQALK5E';
const algoliaAdminApiKey = 'db0704cf12bc02d58c2dc1f017feec35';

export const algoliaClient = () => {
  const searchClient = algolia.default;
  return searchClient(algoliaAppId, algoliaAdminApiKey);
};

export function sendArticlesToAlgolia(context: Context, snapshot: QueryDocumentSnapshot) {
  const {uid} = context.params;
  const index = algoliaClient().initIndex(`${uid}-articles`);
  const data = snapshot.data();
  data.objectID = context.params.articleId;
  return index.saveObject(data);
}
export function deleteFromAlgolia(context: Context) {
  const {uid} = context.params;
  const index = algoliaClient().initIndex(`${uid}-articles`);

  return index.deleteObject(context.params.articleId);
}
