import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {deleteDoc, saveToFirebase} from '../myutils/helpers';

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
