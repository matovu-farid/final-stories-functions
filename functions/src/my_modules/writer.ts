import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {deleteDoc, fetchFromFirestore, saveToFirebase} from './helpers';
import {algoliaClient} from './algolia';

export const saveWriterName = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      const ref = admin.firestore().doc(`writers/${uid}/profile-data/profile`);
      const doc = await ref.get();
      if (!doc.exists) ref.set({name: data});
      else ref.update({name: data});
    },
);

export const onSaveWriter = functions.firestore
    .document('writers/{uid}/profile-data/profile').onWrite(
        (change, context) => {
          const writer = change.after.data()!;
          writer.objectID = context.params.uid;
          const writersIndex = algoliaClient().initIndex('writers');

          return writersIndex.saveObject(writer);
        },
    );

export const thisWriterProfile = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;
      const profileRef = admin.firestore().doc(`writers/${uid}/profile-data/profile`);
      return fetchFromFirestore(profileRef);
    },
);
export const saveWriter = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;

      const profileRef = admin.firestore().doc(`writers/${uid}/profile-data/profile`);

      return saveToFirebase(profileRef, data);
    },
);
export const deleteWriter = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;

      const profileRef = admin.firestore().doc(`writers/${uid}/profile-data/profile`);
      return deleteDoc(profileRef);
    },
);

export const fetchSummary = functions.https.onCall(
    (data, context) => {
      const uid = context.auth?.uid;
      const summary = admin.firestore().doc(`writers/${uid}/profile-data/summary`);
      return fetchFromFirestore(summary);
    },
);
