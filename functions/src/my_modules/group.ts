import { fetchQuery } from './../myutils/helpers';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { deleteDoc, saveToFirebase } from '../myutils/helpers';

export const saveGroup = functions.https.onCall(
    (data, context) => {
      const {uid} = data;
      const ref = admin.firestore().doc(`groups/${uid}/profile-data/profile`);
      saveToFirebase(ref, data);
    },
);
export const deleteGroup = functions.https.onCall(
    (data, context) => {
      const {uid} = data;
      const ref = admin.firestore().doc(`groups/${uid}/profile-data/profile`);
      deleteDoc(ref);
    },
);



export const getFirstGroupArticles = functions.https.onCall(
  async (groupId,context)=>{
   const ref = admin.firestore().collection(`groups/${groupId}/timeline`)
   if((await ref.get()).empty)return;

    const query = ref.orderBy('createdAt','desc').limit(5)
    
     
     return fetchQuery(query)

  }
)
/**
 * data should contain a groupId and the article
 */
export const getNextGroupArticles = functions.https.onCall(
  async (data,context)=>{
    const {groupId,article} = data;
    const ref  = admin.firestore().collection(`groups/${groupId}/timeline`)
    if((await ref.get()).empty)return;
    const query = ref
    .orderBy('createdAt','desc').startAfter(article.createdAt).limit(5);

    return fetchQuery(query)

  }
)


export const postToGroupTimeline = functions.https.onCall(
  (data, context) => {
    const {article,groupId} = data;
    const ref = admin.firestore().doc(`groups/${groupId}/timeline/${article.articleId}`);
    return saveToFirebase(ref,article);
  },
);
export const deleteFromGroupTimeline = functions.https.onCall(
  (data, context) => {
    const {article,groupId} = data;
    const ref = admin.firestore().doc(`groups/${groupId}/timeline/${article.articleId}`);
    return deleteDoc(ref);
  },
);
export const addToGroup= functions.https.onCall(
  (data, context) => {
    const {person,groupId} = data;
    const ref = admin.firestore().doc(`groups/${groupId}/profile-data/profile`);
    
    return ref.update({members:admin.firestore.FieldValue.arrayUnion([person])});
  },
);

export const removeFromGroup= functions.https.onCall(
  (data, context) => {
    const {person,groupId} = data;
    const ref = admin.firestore().doc(`groups/${groupId}/profile-data/profile`);
    
    return ref.update({members:admin.firestore.FieldValue.arrayRemove([person])});
  },
);


export const followGroup = functions.https.onCall(
    (data, context) => {
      const {group} = data;
      const groupUid = group.uid;
      const {follower} = data;
      const followerUid = follower.uid;
      const groupFollower = admin.firestore().doc(`groups/${groupUid}/followers/${followerUid}`);
      saveToFirebase(groupFollower, follower);
      const groupFollowed = admin.firestore()
          .doc(`readers/${followerUid}/groupsFollowing/${groupUid}`);
      saveToFirebase(groupFollowed, group);
    },
);
export const unfollowGroup = functions.https.onCall(
    (data, context) => {
      const {group} = data;
      const groupUid = group.uid;
      const {follower} = data;
      const followerUid = follower.uid;
      const groupFollower = admin.firestore().doc(`groups/${groupUid}/followers/${followerUid}`);
      deleteDoc(groupFollower);
      const groupFollowed = admin.firestore()
          .doc(`readers/${followerUid}/groupsFollowing/${groupUid}`);
      deleteDoc(groupFollowed);
    },
);
