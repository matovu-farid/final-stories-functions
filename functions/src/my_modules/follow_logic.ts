import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { deleteDoc, saveToFirebase, fetchFromFirestore } from '../myutils/helpers';

export const follow = functions.https.onCall((data, context) => {
  const follower = data.follower.uid;
  const followed = data.followed.uid;
  const followerData = data.follower.data;
  const followedData = data.followed.data;
  const followersRef = admin.firestore()
      .doc(`writers/${followed}/followers/${follower}`);
  const followedRef = admin.firestore()
      .doc(`readers/${follower}/following/${followed}`);
  return Promise.all([
    saveToFirebase(followersRef, followerData),
    saveToFirebase(followedRef, followedData),

  ]);
});

export const unfollow = functions.https.onCall((data, context) => {
  const follower = data.follower.uid;
  const followed = data.followed.uid;
  const followersRef = admin.firestore()
      .doc(`writers/${followed}/followers/${follower}`);
  const followedRef = admin.firestore()
      .doc(`readers/${follower}/following/${followed}`);
  return Promise.all(
      [
        deleteDoc(followersRef),
        deleteDoc(followedRef),
      ],
  );
});

export const fetchFollowers = functions.https.onCall(async (followedUid, context) => {

  const ref = admin.firestore()
      .collection(`writers/${followedUid}/followers}`);
   var docs =  await ref.listDocuments()
      
   const promises :Promise<any>[]= []
      for (const docRef of docs) {
        promises.push( docRef.get())
        
      }
      return await Promise.all(promises);

  
});

export const fetchGroupFollowers = functions.https.onCall(async (groupId, context) => {

  const ref = admin.firestore()
      .collection(`groups/${groupId}/followers}`);
   var docs =  await ref.listDocuments()
      
   const promises :Promise<any>[]= []
      for (const docRef of docs) {
        promises.push( docRef.get())
        
      }
      return await Promise.all(promises);

  
});

export const isFollowing = functions.https.onCall(async (followedUid, context) => {

  const person = context.auth?.uid;
  const followed = followedUid;

  const followedRef = admin.firestore()
      .doc(`readers/${person}/following/${followed}`);
  if((await followedRef.get()).exists) return true;
      else return false;

  
});
export const noOfFollowers = functions.https.onCall(async (data, context) => {
  const person = context.auth?.uid;

  const summaryRef = admin.firestore()
      .doc(`writers/${person}/profile-data/summary`);
   const summary = await fetchFromFirestore(summaryRef);
   if(summary){
    return summary.followerCount;
   }else return 0;
    
});

export const noOfGroupFollowers = functions.https.onCall(async (groupId, context) => {
  const summaryRef = admin.firestore()
      .doc(`groups/${groupId}/profile-data/summary`);
   const summary = await fetchFromFirestore(summaryRef);
   if(summary){
    return summary.followerCount;
   }else return 0;
    
});

export const isFollowingGroup = functions.https.onCall(async (groupId, context) => {

  const person = context.auth?.uid;
  

  const followedRef = admin.firestore()
      .doc(`readers/${person}/groupsFollowing/${groupId}`);
  if((await followedRef.get()).exists) return true;
      else return false;

  
});


export const followGroup = functions.https.onCall(
    (data, context) => {
      const {group, follower} = data;
      const groupUid = group.uid;
      const followerUid = follower.uid;
      const groupFollower = admin.firestore().doc(`groups/${groupUid}/followers/${followerUid}`);
      const groupFollowed = admin.firestore()
          .doc(`readers/${followerUid}/groupsFollowing/${groupUid}`);
      return Promise.all([
        saveToFirebase(groupFollower, follower),
        saveToFirebase(groupFollowed, group),
      ],

      );
    },
);

export const unfollowGroup = functions.https.onCall(
    (data, context) => {
      const {group, follower} = data;
      const groupUid = group.uid;
      const followerUid = follower.uid;
      const groupFollower = admin.firestore().doc(`groups/${groupUid}/followers/${followerUid}`);
      const groupFollowed = admin.firestore()
          .doc(`readers/${followerUid}/groupsFollowing/${groupUid}`);

      return Promise.all(
          [
            deleteDoc(groupFollower),
            deleteDoc(groupFollowed),

          ],
      );
    },
);

