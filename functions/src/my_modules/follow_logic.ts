import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {deleteDoc, saveToFirebase} from '../myutils/helpers';

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
