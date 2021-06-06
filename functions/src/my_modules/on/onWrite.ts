import * as functions from 'firebase-functions';
import {sendGroupToAlgolia} from './onHelpers';

export const onSaveGroup = functions.firestore
    .document('/groups/{uid}/profile-data/profile').onWrite(
        (change, context) => {
          return sendGroupToAlgolia(change, context);
        },
    );
