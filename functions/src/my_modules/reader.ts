import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {algoliaClient} from './algolia';
import {deleteDoc, fetchFromFirestore, saveToFirebase} from '../myutils/helpers';

export const onSaveReader = functions.firestore
    .document('readers/{uid}/profile-data/profile').onWrite(
        (change, context) => {
          const reader = change.after.data()!;
          reader.objectID = context.params.uid;
          const readersIndex = algoliaClient().initIndex('readers');

          return readersIndex.saveObject(reader);
        },
    );

export const onDeleteReader = functions.firestore
    .document('reader/{uid}/profile-data/profile').onDelete(
        (snapshot, context) => {
          const oldId = snapshot.id;
          const readersIndex = algoliaClient().initIndex('reader');
          return readersIndex.deleteObject(oldId);
        },
    );

export const saveReaderName = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      const ref = admin.firestore().doc(`readers/${uid}/profile-data/profile`);
      const doc = await ref.get();
      if (!doc.exists) ref.set({name: data});
      else ref.update({name: data});
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

      const profileRef = admin.firestore().doc(`readers/${uid}/profile-data/profile`);
      return deleteDoc(profileRef);
    },
);
