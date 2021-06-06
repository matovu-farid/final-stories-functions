import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import {saveToFirebase} from '../myutils/helpers';

export const uploadToTimelines = functions.https.onCall(
    async (data, context) => {
      const uid = context.auth?.uid;
      const promises : Promise<any>[] = [];
      const followersSnapshot = await admin.firestore()
          .collection(`writers/${uid}/followers`).get();
          
      if (!followersSnapshot.empty) {
        followersSnapshot.forEach((doc) => {
          const uid = doc.id;
          const timelineRef = admin.firestore()
              .doc(`readers/${uid}/timeline/${data.articleId}`);
          promises.push(saveToFirebase(timelineRef, data));
        });
      }
      return await Promise.all(promises);
    },
);
