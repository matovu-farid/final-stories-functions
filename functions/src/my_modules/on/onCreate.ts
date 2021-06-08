import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { increaseFolowersAdFollowing, incrementSummaryArticles, onCreateArtricle, sendGroupToAlgolia } from './onHelpers';
import {algoliaClient, sendArticlesToAlgolia} from '../algolia';
import { createSummary, fetchFromFirestore } from '../../myutils/helpers';


export const onSaveArticle = functions.firestore
    .document('writers/{uid}/articles/{articleId}')
    .onCreate(
        (snapshot, context) => {
          return Promise.all(
              [
                incrementSummaryArticles(context),
                sendArticlesToAlgolia(context, snapshot),
              ],
          );
        },
    );


export const onCreateReaderTimeStamp = 
functions.firestore.document('readers/{uid}/timeline/{articleId}')
    .onCreate((change, context) => onCreateArtricle(context, 'readers', 'timeline'));

export const onCreateWriterTimeStamp = 
functions.firestore.document('writers/{uid}/articles/{articleId}')
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

    export const onSaveGroup = functions.firestore
    .document('/groups/{uid}/profile-data/profile').onCreate(
        (snapshot, context) => {
            return Promise.all(
                [
                    createSummary(context, snapshot),
                    sendGroupToAlgolia(snapshot, context)

                ]
            )
        },
    );
    export const onSaveGroupFollower = functions.firestore
    .document('/groups/{groupId}/followers/{follower}').onCreate(
        async (snapshot, context) => {
            const {groupId} = context.params
            const summaryRef = admin.firestore().doc(`groups/${groupId}/profile-data/summary`);
             const summary = await fetchFromFirestore(summaryRef);
             if(summary){
                return summary.update({followerCount : admin.firestore.FieldValue.increment(1)})
             }else Promise.reject('The summary was not created');
            
        },
    );
    export const onSaveFollower = functions.firestore
    .document('/writers/{uid}/followers/{follower}').onCreate(
        async (snapshot, context) => {
            const {uid} = context.params
            const summaryRef = admin.firestore().doc(`writers/${uid}/profile-data/summary`);
             const summary = await fetchFromFirestore(summaryRef);
             if(summary){
                return summary.update({followerCount : admin.firestore.FieldValue.increment(1)})
             }else Promise.reject('The summary was not created');
            
        },
    );
    
    export const onSaveReader = functions.firestore
    .document('readers/{uid}/profile-data/profile').onCreate(
        (snapshot, context) => {
          const reader = snapshot.data()!;
          reader.objectID = context.params.uid;
          const readersIndex = algoliaClient().initIndex('readers');

          return readersIndex.saveObject(reader);
        },
    );
export const onLikeArticle = functions.firestore
.document('writers/{uid}/articles/{articleId}/likers/{likerUid}').onCreate(
    async (snapshot, context) => {
        
        const {uid,articleId} = context.params
        
     const ref = admin.firestore().doc(`writers/${uid}/articles/${articleId}`)
     const doc = await ref.get()
     if(doc.exists) return ref.update({likes:admin.firestore.FieldValue.increment(1)})
     else return ref.set({likes: 1})

    },
);
export const onCommentArticle = functions.firestore
.document('writers/{uid}/articles/{articleId}/comments/{comentId}').onCreate(
    async (snapshot, context) => {
        
        const {uid,articleId} = context.params
        
     const ref = admin.firestore().doc(`writers/${uid}/articles/${articleId}`)
     const doc = await ref.get()
     if(doc.exists) return ref.update({comments:admin.firestore.FieldValue.increment(1)})
     else return ref.set({comments: 1})

    },
);


