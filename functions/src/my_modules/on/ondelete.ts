import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {algoliaClient, deleteFromAlgolia} from '../algolia';
import { decreaseSummaryArticles } from './onHelpers';
import { deleteDoc, fetchFromFirestore } from '../../myutils/helpers';
import { Context } from '../../myutils/mytypes';

export const onDeleteFollower = functions.firestore
    .document('/writers/{uid}/followers/{follower}').onDelete(
        async (snapshot, context) => {
            const {uid} = context.params
            const summaryRef = admin.firestore().doc(`writers/${uid}/profile-data/summary`);
             const summary = await fetchFromFirestore(summaryRef);
             if(summary){
                return summary.update({followerCount : admin.firestore.FieldValue.increment(-1)})
             }else Promise.reject('The summary was not created');
            
        },
    );

export const onDeleteGroupFollower = functions.firestore
.document('/groups/{groupId}/followers/{follower}').onDelete(
    async (snapshot, context) => {
        const {groupId} = context.params
        const summaryRef = admin.firestore().doc(`groups/${groupId}/profile-data/summary`);
         const summary = await fetchFromFirestore(summaryRef);
         if(summary){
            return summary.update({followerCount : admin.firestore.FieldValue.increment(-1)})
         }else Promise.reject('The summary was not created');
        
    },
);
export const onUnLikeArticle = functions.firestore
.document('writers/{uid}/articles/{articleId}/likers/{likerUid}').onDelete(
    async (snapshot, context) => {
        
        const {uid,articleId} = context.params
        
     const ref = admin.firestore().doc(`writers/${uid}/articles/${articleId}`)
     
     return ref.update({likes:admin.firestore.FieldValue.increment(-1)})
     

    },
);


export const onDeleteCommentArticle = functions.firestore
.document('writers/{uid}/articles/{articleId}/comments/{comentId}').onDelete(
    async (snapshot, context) => {
        
        const {uid,articleId} = context.params
        
     const ref = admin.firestore().doc(`writers/${uid}/articles/${articleId}`)
     
     return ref.update({comments:admin.firestore.FieldValue.increment(-1)})
     

    },
);


export const onDeleteReader = functions.firestore
    .document('reader/{uid}').onDelete(
        (snapshot, context) => {
          const oldId = snapshot.id;
          const readersIndex = algoliaClient().initIndex('reader');
          return readersIndex.deleteObject(oldId);
        },
    );


export const onDeleteGroup = functions.firestore
    .document('/groups/{uid}').onDelete(
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
          
          return Promise.all([
            decreaseSummaryArticles(context),
            deleteFromAlgolia(context)

          ])
        },
    );

export const onDeleteWriter = functions.firestore
    .document('writers/{uid}').onDelete(
        (snapshot, context) => {
          return Promise.all(
              [
                deleteFromGroups(snapshot,context),
                deleteWriterFromAlgoria(snapshot)

              ]
          ) 
           
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


    const deleteFromGroups = async (
        snapshot:functions.firestore.QueryDocumentSnapshot,context: Context)=>{
         
         const uid = context.params.uid;
         const ref = admin.firestore().collection(`writers/${uid}/groupsInEditorRole`)
         const querySnapshot = await ref.get()
         if(querySnapshot.empty)return;
         return querySnapshot.docs.forEach(
             (doc)=>{
                const groupId =  doc.data().groupId;
               const editorRef =  admin.firestore().doc(`groups/${groupId}/editors/${uid}`)
               
               return deleteDoc(editorRef)
     
             }
         );
         
     
     }

function deleteWriterFromAlgoria(snapshot: functions.firestore.QueryDocumentSnapshot) {
    const oldId = snapshot.id;
    const writersIndex = algoliaClient().initIndex('writers');

    return writersIndex.deleteObject(oldId);
}
