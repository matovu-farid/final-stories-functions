import * as functions from 'firebase-functions';

/**
 * This is the documentsnapshot from firetore
 */
export type DocumentSnapshot = FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
/**
 * This is the document reference from firestore
 */
export type DocumentReference = FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>;
/**
 * This is a Change object returned after a write is made to a document
 */
export type Changer = functions.Change<functions.firestore.DocumentSnapshot>;
/**
 * This is the context that is recieved from the function call usually of an
 * http request
 */
export type Context = functions.EventContext;
/**
 * This is a snapshot recieved from firestore after a query
 * requesting for data
 */
export type QueryDocumentSnapshot = functions.firestore.QueryDocumentSnapshot;
