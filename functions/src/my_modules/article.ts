import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import { deleteDoc, saveToFirebase, fetchFromFirestore } from '../myutils/helpers';
import { DocumentData } from '../myutils/mytypes';

export const saveArticle = functions.https
    .onCall(async (data, context) => {
      const {auth} = context;
      if (auth) {
        const {uid} = auth;
        const {articleId} = data;
        const articlesRef = admin.firestore()
            .doc(`writers/${uid}/articles/${articleId}`);

        return saveToFirebase(articlesRef, data);
      }

      return Promise
          .reject(new Error('You are not authorized to access save your work'));
    });
export const deleteArticle = functions.https
    .onCall(async (articleId, context) => {
      const {auth} = context;
      if (auth) {
        const {uid} = auth;
        const articlesRef = admin.firestore()
            .doc(`writers/${uid}/articles/${articleId}`);

        return deleteDoc(articlesRef);
      }

      return Promise
          .reject(new Error('You are not authorized to access save your work'));
    });
    
export const doesLikeArticle = functions.https.onCall(
      async (data, context) => {
        const {article,person} = data;
        
        const likerRef = admin.firestore()
            .doc(`writers/${article.writerUid}/articles/${article.articleId}/likers/${person.uid}`);
            const likerDoc =  await likerRef.get()
            if(likerDoc.exists) return true;
            return false;
      },
    );
export const likeArticle = functions.https.onCall(
    (data, context) => {
      const {article,liker} = data;
      
      const articleRef = admin.firestore()
          .doc(`writers/${article.writerUid}/articles/${article.articleId}/likers/${liker.uid}`);

      return saveToFirebase(articleRef,liker);
    },
);



export const unlikeArticle = functions.https.onCall(
    (data, context) => {
      const {article,liker} = data;
     
      const articleRef = admin.firestore()
      .doc(`writers/${article.writerUid}/articles/${article.articleId}/likers/${liker.uid}`);
   return deleteDoc(articleRef);
    },
);
export const fetchComments = functions.https.onCall(
    async (article, context) => {
   
     
      const {articleId,writerUid} = article;
      
      const path = `writers/${writerUid}/articles/${articleId}/comments}}`;
      const commentRef = admin.firestore().collection(path);
      const list = await commentRef.listDocuments();
    
      const commentList : DocumentData= []
      for (const docRef of list) {
        const doc = await docRef.get()
        commentList.push(doc.data())
      }
      
      return commentList;
    },
);
export const fetchLikers = functions.https.onCall(
  async (article, context) => {
 
   
    const {articleId,writerUid} = article;
    
    const path = `writers/${writerUid}/articles/${articleId}/likers}}`;
    const likersRef = admin.firestore().collection(path);
    const list = await likersRef.listDocuments();
  
    const likerList : DocumentData= []
    for (const docRef of list) {
      const doc = await docRef.get()
      likerList.push(doc.data())
    }
    
    return likerList;
  },
);
export const noOfLikes = functions.https.onCall(
  async (data,context)=>{
    const {writerUid,articleId} = data
    const ref = admin.firestore().doc(`writers/${writerUid}/articles/${articleId}`)
    const likersRef = 
    admin.firestore().collection(`writers/${writerUid}/articles/${articleId}/likers`)
    if((await likersRef.get()).empty) return 0;
    
    const article = await fetchFromFirestore(ref)
    return article?.likes
  }
);

export const noOfComments = functions.https.onCall(
  async (data,context)=>{
    const {writerUid,articleId} = data
    const ref = admin.firestore().doc(`writers/${writerUid}/articles/${articleId}`)
    const commentsRef = 
    admin.firestore().collection(`writers/${writerUid}/articles/${articleId}/comments`)
    if((await commentsRef.get()).empty) return 0;
    
    const article = await fetchFromFirestore(ref)
    return article?.likes
  }
);


export const commentOnArticle = functions.https.onCall(
  (data, context) => {
    const {article,comment} = data;
   
    const {articleId,writerUid} = article;
    
    const path = `writers/${writerUid}/articles/${articleId}/comments/${comment.id}}`;
    const commentRef = admin.firestore()
        .doc(path);
    return saveToFirebase(commentRef, comment);
  },
);
export const removeCommentOnArticle = functions.https.onCall(
    (data, context) => {
      const {article,comment} = data;
      const {articleId,writerUid} = article;
      
      const path = `writers/${writerUid}/articles/${articleId}/comments/${comment.id}}`;
      const commentRef = admin.firestore().doc(path);
      return deleteDoc(commentRef);
    },
);

export const viewArticles = functions.https.onCall(
    async (data, context) => {
      const articlesGot :FirebaseFirestore.DocumentData[] = [];
      const uid = context.auth?.uid;
      const articles = await admin.firestore()
          .collection(`writers/${uid}/articles`).get();
      articles.docs.forEach((doc) => {
        articlesGot.push(doc.data());
      });
      // it will be a list of document snapshots
      return articlesGot;
    },

);
