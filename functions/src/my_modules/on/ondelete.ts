import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {algoliaClient} from '../algolia';

export const onDeleteGroup = functions.firestore
    .document('/groups/{uid}/profile-data/profile').onDelete(
        (snapshot, context) => {
          const groupsIndex = algoliaClient().initIndex('groups');
          const {uid} = context.params;
          return groupsIndex.deleteObject(uid);
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

