import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

/**
 * This is the data from the document snapshot recieves
 */
export type DocumentData =FirebaseFirestore.DocumentData
/**
 * This is the documentsnapshot from firetore
 */
export type DocumentSnapshot = FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>;
/**
 * This is the querysnapshot from firetore
 */
//
export type Query = FirebaseFirestore.Query<FirebaseFirestore.DocumentData>
export type QuerySnapshot =FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>;
/**
 * This is the collection reference from firestore
 */
export type CollectionReference = FirebaseFirestore.CollectionReference;
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

export type FieldValue = admin.firestore.FieldValue;