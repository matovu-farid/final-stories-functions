import { firestore } from "firebase-admin";
import { https } from "firebase-functions";
import { grantEditorRole, grantAdminRole, revokeEditorRole, revokeAdminRole } from './grant';

export const signInToGroup = https.onCall(
    async (groupId,context)=>{
        const uid = context.auth?.uid as string;
        const promises: Promise<any>[] = [];
        if(await checkEditor(groupId as string,uid)){
            promises.push(grantEditorRole(context));
        }
        if(await checkAdmin(groupId as string,uid)){
            promises.push(grantAdminRole(context));
        }
        return Promise.all(promises)

    }
)
export const signOutOfGroup = https.onCall(
    async (groupId,context)=>{
        const uid = context.auth?.uid as string;
        const promises: Promise<any>[] = [];
        if(await checkEditor(groupId as string,uid)){
            promises.push(revokeEditorRole(context));
        }
        if(await checkAdmin(groupId as string,uid)){
            promises.push(revokeAdminRole(context));
        }
        return Promise.all(promises)

    }
)


export async function checkEditor  (uid:string,groupId:string): Promise<boolean>{
    const doc = await firestore().doc(`groups/${groupId}/editors/${uid}`).get()
    if(doc.exists)return true;
    else return false; 
}
export async function checkAdmin  (uid:string,groupId:string): Promise<boolean>{
    const doc = await firestore().doc(`groups/${groupId}/admins/${uid}`).get()
    if(doc.exists)return true;
    else return false; 
}
