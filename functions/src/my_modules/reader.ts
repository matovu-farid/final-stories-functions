import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import {deleteDoc, fetchFromFirestore, fetchQuery, saveToFirebase} from '../myutils/helpers';


export const saveReaderName = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      const ref = admin.firestore().doc(`readers/${uid}/profile-data/profile`);
      const doc = await ref.get();
      if (!doc.exists) ref.set({name: data});
      else ref.update({name: data});
    },
);

export const getFirstReaderArticles = functions.https.onCall(
    async (uid, context)=>{
      const ref = admin.firestore().collection(`readers/${uid}/timeline`);

      if ((await ref.get()).empty) return;
      const query = ref.orderBy('createdAt', 'desc').limit(5);


      return fetchQuery(query);
    },
);
/**
 * data should contain a uid and the article
 */
export const getNextReaderArticles = functions.https.onCall(
    async (data, context)=>{
      const {uid, article} = data;
      const ref = admin.firestore().collection(`readers/${uid}/timeline`);
      if ((await ref.get()).empty) return;
      const query = ref
          .orderBy('createdAt', 'desc').startAfter(article.createdAt).limit(5);

      return fetchQuery(query);
    },
);


export const thisReaderProfile = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;
      const profileRef = admin.firestore().doc(`readers/${uid}/profile-data/profile`);
      return fetchFromFirestore(profileRef);
    },
);

export const saveReader = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;

      const profileRef = admin.firestore().doc(`readers/${uid}/profile-data/profile`);
      return saveToFirebase(profileRef, data);
    },
);
export const deleteReader = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;

      const profileRef = admin.firestore().doc(`readers/${uid}`);
      return deleteDoc(profileRef);
    },
);
