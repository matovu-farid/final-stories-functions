import * as functions from 'firebase-functions'; 
import * as admin from 'firebase-admin';
import { deleteDoc, saveToFirebase } from './helpers';

export function removeEditorFromGroup(groupId: any, member: any) {
  const ref = admin.firestore().doc(`groups/${groupId}/editors/${member.uid}`);
  return deleteDoc(ref);
}
export function removeAdminFromGroup(groupId: any, member: any) {
  const ref = admin.firestore().doc(`groups/${groupId}/admins/${member.uid}`);
  return deleteDoc(ref);
}

export function saveEditorToGroup(groupId:any, member:any) {
  

  const ref = admin.firestore().doc(`groups/${groupId}/editors/${member.uid}`);
  return saveToFirebase(ref, member);
}
export function saveAdminToGroup(groupId:any, member:any) {
  

  const ref = admin.firestore().doc(`groups/${groupId}/admins/${member.uid}`);
  return saveToFirebase(ref, member);
}
export async function saveGroupToEditor(groupId:any, member:any){
  const ref = admin.firestore().doc(`writers/${member.uid}/groupsInEditorRole/${groupId}`)
  const groupSummary = admin.firestore().doc(`groups/${groupId}/profile-data/summary`)
  const groupSummaryDoc = (await groupSummary.get()).data()
  if(groupSummaryDoc)return ref.set(groupSummaryDoc)
  else return Promise.reject(Error('The summary of the group doest not exist'))
}
export async function removeGroupFromEditor(groupId:any, member:any){
  const ref = admin.firestore().doc(`writers/${member.uid}/groupsInEditorRole/${groupId}`)
 return deleteDoc(ref)
}
export async function saveGroupToAdmin(groupId:any, member:any){
  const ref = admin.firestore().doc(`writers/${member.uid}/groupsInAdminRole/${groupId}`)
  const groupSummary = admin.firestore().doc(`groups/${groupId}/profile-data/summary`)
  const groupSummaryDoc = (await groupSummary.get()).data()
  if(groupSummaryDoc)return ref.set(groupSummaryDoc)
  else return Promise.reject(Error('The summary of the group doest not exist'))
}
export async function removeGroupFromAdmin(groupId:any, member:any){
  const ref = admin.firestore().doc(`writers/${member.uid}/groupsInAdminRole/${groupId}`)
 return deleteDoc(ref)
}
