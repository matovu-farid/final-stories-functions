import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {increaseFolowersAdFollowing, onCreateArtricle,
  sendArticlesToAlgolia, setClaim} from './onHelpers';


export const onSaveArticle = functions.firestore
    .document('writers/{uid}/articles/{articleId}')
    .onCreate(
        (snapshot, context) => {
          return sendArticlesToAlgolia(context, snapshot);
        },
    );

export const onCreateGroup = functions.firestore
    .document('/groups/{uid}/profile-data/profile').onCreate(
        (snapshot, context) => {
          return Promise.all([
            setClaim(snapshot, context),
          ]);
        },
    );


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
      return increaseFolowersAdFollowing(
          writersSummaryDoc, writerSummary, readersSummaryDoc, readerSummary);
    });


