import {fetchQuery} from './../myutils/helpers';
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {deleteDoc, saveToFirebase} from '../myutils/helpers';
import { removeAdminFromGroup, removeEditorFromGroup, 
  removeGroupFromAdmin, removeGroupFromEditor, saveAdminToGroup, 
  saveEditorToGroup, saveGroupToAdmin, saveGroupToEditor } from '../myutils/groupHelpers';


  export const noOfGroupArticles = functions.https.onCall(
    async (groupId, context)=>{
      const ref = admin.firestore().doc(`groups/${groupId}/profile-data/summary`);
      const summaryData = (await ref.get()).data();
      if (summaryData) return summaryData.noOfArticles;
      else return 0;
    },
);

// creation and deletion of group ---
export const saveGroup = functions.https.onCall(
   async (group, context) => {

      const creatorUid = context.auth?.uid; 
      const groupProfileRef = admin.firestore().doc(`groups/${group.uid}/profile-data/profile`);
      const adminRef = admin.firestore().doc(`groups/${group.uid}/admins/${creatorUid}`);
      const creatorProfilePath = `writers/${creatorUid}/profile-data/profile`
      const creatorData = (await admin.firestore().doc(creatorProfilePath).get()).data();

      var promises:Promise<any>[]=[]
      if(creatorData) promises.push(adminRef.set(creatorData))
      promises.push( saveToFirebase(groupProfileRef, group));
      return Promise.all(promises);
    },
);
export const deleteGroup = functions.https.onCall(
    (data, context) => {
      const {uid} = data;
      const ref = admin.firestore().doc(`groups/${uid}`);
      return deleteDoc(ref);
    },
);

// editor --->group---
export const saveEditor =  functions.https.onCall(
  async (data,context)=>{
    const { groupId, member } = data;
return Promise.all([
  saveGroupToEditor(groupId, member),
  saveEditorToGroup(groupId, member )
]); 
    
  }
)

export const removeEditor =  functions.https.onCall(
  async (data,context)=>{
    const {groupId,member} = data;
    return Promise.all([
      removeGroupFromEditor(groupId,member),
      removeEditorFromGroup(groupId, member)
    ])
    
  }
)

// editor --->group---
export const saveAdmin =  functions.https.onCall(
  async (data,context)=>{
    const {groupId,member} = data;

    return Promise.all([
      saveGroupToAdmin(groupId, member),
      saveAdminToGroup(groupId, member )
    ]); 
    
  }
)

export const removeAdmin =  functions.https.onCall(
  async (data,context)=>{
    const {groupId,member} = data;
    return Promise.all([
      removeGroupFromAdmin(groupId,member),
      removeAdminFromGroup(groupId, member)
    ])
    
  }
)
// fetching articles published to group time line---
export const getfirstGroupArticles = functions.https.onCall(
    async (groupId, context)=>{
      const ref = admin.firestore().collection(`groups/${groupId}/timeline`);
      if ((await ref.get()).empty) return;

      const query = ref.orderBy('createdAt', 'desc').limit(5);


      return fetchQuery(query);
    },
);
/**
 * data should contain a groupId and the article
 */
export const getNextGroupArticles = functions.https.onCall(
    async (data, context)=>{
      const {groupId, article} = data;
      const ref = admin.firestore().collection(`groups/${groupId}/timeline`);
      if ((await ref.get()).empty) return;
      const query = ref
          .orderBy('createdAt', 'desc').startAfter(article.createdAt).limit(5);

      return fetchQuery(query);
    },
);
// fetching articles sent to group by members---
export const getLastGroupArticles = functions.https.onCall(
  async (groupId, context)=>{
    const ref = admin.firestore().collection(`groups/${groupId}/articles`);
    if ((await ref.get()).empty) return;

    const query = ref.orderBy('createdAt', 'desc').limit(5);


    return fetchQuery(query);
  },
);


export const getPreviousGroupArticles = functions.https.onCall(
  async (data, context)=>{
    const {groupId, article} = data;
    const ref = admin.firestore().collection(`groups/${groupId}/articles`);
    if ((await ref.get()).empty) return;
    const query = ref
        .orderBy('createdAt', 'desc').startAfter(article.createdAt).limit(5);

    return fetchQuery(query);
  },
);

// article to group
export const saveArticleToGroup = functions.https.onCall(
  (data, context) => {
    const {article, groupId} = data;
    const ref = admin.firestore().doc(`groups/${groupId}/article/${article.articleId}`);
    return saveToFirebase(ref, article);
  },
);
export const deleteArticleFromGroup = functions.https.onCall(
  (data, context) => {
    const {article, groupId} = data;
    const ref = admin.firestore().doc(`groups/${groupId}/article/${article.articleId}`);
    return deleteDoc(ref);
  },
);





//posting to timilines---
export const postToGroupTimeline = functions.https.onCall(
    (data, context) => {
      const {article, groupId} = data;
      const ref = admin.firestore().doc(`groups/${groupId}/timeline/${article.articleId}`);
      return saveToFirebase(ref, article);
    },
);
export const deleteFromGroupTimeline = functions.https.onCall(
    (data, context) => {
      const {article, groupId} = data;
      const ref = admin.firestore().doc(`groups/${groupId}/timeline/${article.articleId}`);
      return deleteDoc(ref);
    },
);
// group join
export const addToGroup= functions.https.onCall(
    (data, context) => {
      const {person, groupId} = data;
      const ref = admin.firestore().doc(`groups/${groupId}/profile-data/profile`);

      return ref.update({members: admin.firestore.FieldValue.arrayUnion([person])});
    },
);

export const removeFromGroup= functions.https.onCall(
    (data, context) => {
      const {person, groupId} = data;
      const ref = admin.firestore().doc(`groups/${groupId}/profile-data/profile`);

      return ref.update({members: admin.firestore.FieldValue.arrayRemove([person])});
    },
);



