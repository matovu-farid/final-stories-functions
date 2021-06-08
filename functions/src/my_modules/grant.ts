import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';



export const grantEditorRole =
(context:functions.https.CallableContext)=>{
  const auth = context.auth;
  if(auth){
    return admin.auth().setCustomUserClaims(auth.uid,{'editor':true})
    
  }else return Promise.reject(Error('You have not logged in'))
  
}

export const grantAdminRole = (context:functions.https.CallableContext)=>{
  const auth = context.auth;
  if(auth){
    return admin.auth().setCustomUserClaims(auth.uid,{'admin':true})
  }else return Promise.reject(Error('You have not logged in'))
  
}
export const revokeEditorRole =
(context:functions.https.CallableContext)=>{
  const auth = context.auth;
  if(auth){
    return admin.auth().setCustomUserClaims(auth.uid,{'editor':false})
    
  }else return Promise.reject(Error('You have not logged in'))
  
}

export const revokeAdminRole = (context:functions.https.CallableContext)=>{
  const auth = context.auth;
  if(auth){
    return admin.auth().setCustomUserClaims(auth.uid,{'admin':false})
  }else return Promise.reject(Error('You have not logged in'))
  
}