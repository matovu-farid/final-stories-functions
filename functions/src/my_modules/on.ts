import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {algoliaClient} from './algolia';

export const onSaveGroup = functions.firestore
    .document('/groups/{uid}/profile-data/profile').onWrite(
        (change, context) => {
          const data = change.after.data()!;
          const groupsIndex = algoliaClient().initIndex('groups');
          const {uid} = context.params;
          data.objectID = uid;
          return groupsIndex.saveObject(data);
        },
    );
export const onDeleteGroup = functions.firestore
    .document('/groups/{uid}/profile-data/profile').onDelete(
        (snapshot, context) => {
          const groupsIndex = algoliaClient().initIndex('groups');
          const {uid} = context.params;
          return groupsIndex.deleteObject(uid);
        },
    );
export const onSaveArticle = functions.firestore
    .document('writers/{uid}/articles/{articleId}')
    .onCreate(
        (snapshot, context) => {
          const {uid} = context.params;
          const index = algoliaClient().initIndex(`${uid}-articles`);
          const data = snapshot.data();
          data.objectID = context.params.articleId;
          return index.saveObject(data);
        },
    );
export const onDeleteArticle = functions.firestore
    .document('writers/{uid}/articles/{articleId}')
    .onDelete(
        (snapshot, context) => {
          const {uid} = context.params;
          const index = algoliaClient().initIndex(`${uid}-articles`);

          return index.deleteObject(context.params.articleId);
        },
    );

const onCreateArtricle = (
    context: functions.EventContext, type: string, collection: string,
) => {
  const timeStamp = admin.firestore.Timestamp.now();
  const {uid} = context.params;
  const {articleId} = context.params;
  const articlesRef = admin.firestore().doc(`${type}/${uid}/${collection}/${articleId}`);
  return articlesRef.update({createdAt: timeStamp});
};
export const onCreateReaderTimeStamp = functions.firestore.document('readers/{uid}/timeline/{articleId}')
    .onCreate((change, context) => onCreateArtricle(context, 'readers', 'timeline'));

export const onCreateWriterTimeStamp = functions.firestore.document('writers/{uid}/articles/{articleId}')
    .onCreate((change, context) => onCreateArtricle(context, 'writers', 'articles'));

export const onFollow = functions.firestore
    .document('writers/{followed}/followers/{follower}')
    .onCreate(async (change, context) => {
      const {followed} = context.params;
      const {follower} = context.params;
      const writerSummary = admin.firestore()
          .doc(`writers/${followed}/profile-data/summary`);
      const readerSummary = admin.firestore()
          .doc(`readers/${follower}/profile-data/summary`);

      const writersSummaryDoc = await writerSummary.get();
      const readersSummaryDoc = await readerSummary.get();
      if (!writersSummaryDoc.exists) writerSummary.set({followers: 0});

      if (!readersSummaryDoc.exists) readerSummary.set({following: 0});

      return Promise.all([writerSummary
          .update({followers: admin.firestore.FieldValue.increment(1)}),

      readerSummary
          .update({following: admin.firestore.FieldValue.increment(1)}),
      ]);
    });

export const onDeleteWriter = functions.firestore
    .document('writers/{uid}/profile-data/profile').onDelete(
        (snapshot, context) => {
          const oldId = snapshot.id;
          const writersIndex = algoliaClient().initIndex('writers');
          return writersIndex.deleteObject(oldId);
        },
    );

export const onUnFollow = functions.firestore
    .document('writers/{followed}/followers/{follower}')
    .onDelete((change, context) => {
      const {followed} = context.params;
      const {follower} = context.params;

      const writerSummary = admin.firestore()
          .doc(`writers/${followed}/profile-data/summary`);
      const readerSummary = admin.firestore()
          .doc(`readers/${follower}/profile-data/summary`);
      return Promise.all([
        writerSummary
            .update({followers: admin.firestore.FieldValue.increment(-1)}),

        readerSummary
            .update({following: admin.firestore.FieldValue.increment(-1)}),
      ]);
    });
