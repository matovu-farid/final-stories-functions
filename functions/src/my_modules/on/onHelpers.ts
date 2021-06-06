import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {Context, DocumentSnapshot, DocumentReference, QueryDocumentSnapshot, Changer} from '../../myutils/mytypes';
import {algoliaClient} from '../algolia';

export const setClaim=async (snapshot:functions.firestore.QueryDocumentSnapshot
    , context:functions.EventContext)=>{
  const adminUid = snapshot.data().groupAdmin.uid;
  const user = await admin.auth().getUser(adminUid);
  const groupUid = context.params.uid;

  const currentGroupIds = user.customClaims?.groupIds as Array<String>;


  if (currentGroupIds) {
    currentGroupIds.push(`${groupUid}`);
    return admin.auth().setCustomUserClaims(adminUid, {groupIds: currentGroupIds});
  } else return admin.auth().setCustomUserClaims(adminUid, {groupIds: [`${groupUid}`]});
};
export const onCreateArtricle = (
    context: functions.EventContext, type: string, collection: string,
) => {
  const timeStamp = admin.firestore.Timestamp.now();
  const {uid} = context.params;
  const {articleId} = context.params;
  const articlesRef = admin.firestore().doc(`${type}/${uid}/${collection}/${articleId}`);
  return articlesRef.update({createdAt: timeStamp});
};
/**
 *
 * @param {DocumentSnapshot} writersSummaryDoc The summary document of the writer
 * @param {DocumentReference} writerSummary the actual summary of the writer whch
 * contains the data
 * @param {DocumentSnapshot} readersSummaryDoc the summary document of the reader
 * @param {DocumentReference} readerSummary the actual summary of the reader whch
 * contains the data
 * @return {Promise<void>} void-promise is returned afterr it complets
 */
export function increaseFolowersAdFollowing(
    writersSummaryDoc: DocumentSnapshot,
    writerSummary: DocumentReference,
    readersSummaryDoc: DocumentSnapshot,
    readerSummary: DocumentReference) {
  if (!writersSummaryDoc.exists) {
    return writerSummary.set({followers: 0});
  }

  if (!readersSummaryDoc.exists) {
    return readerSummary.set({following: 0});
  }

  return Promise.all([writerSummary
      .update({followers: admin.firestore.FieldValue.increment(1)}),

  readerSummary
      .update({following: admin.firestore.FieldValue.increment(1)}),
  ]);
}
export function sendArticlesToAlgolia(context: Context, snapshot: QueryDocumentSnapshot) {
  const {uid} = context.params;
  const index = algoliaClient().initIndex(`${uid}-articles`);
  const data = snapshot.data();
  data.objectID = context.params.articleId;
  return index.saveObject(data);
}
/**
 *
 * @param {Changer} change the shange object returned from
 * firestore after a write
 * @param {Context} context the context of the function call
 * that gives its parameters
 * @return {Promise<void>} complete with nada
 */
export function sendGroupToAlgolia(change: Changer, context: Context) {
  const data = change.after.data()!;
  const groupsIndex = algoliaClient().initIndex('groups');
  const {uid} = context.params;
  data.objectID = uid;
  return groupsIndex.saveObject(data);
}


