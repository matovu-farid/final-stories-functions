
import * as functions from 'firebase-functions'; 
import * as admin from 'firebase-admin';

export const updateWriters = 
functions.firestore.document('writers/{uid}/profile-data/profile')
.onUpdate(async (change,context)=>{
    const data = change.after.data();
    const uid = context.params.uid;
    const ref = admin.firestore().collection(`writers/${uid}/groupsInEditorRole`)
    const querySnapshot = await ref.get()
    if(querySnapshot.empty)return;
    return querySnapshot.docs.forEach(
        (doc)=>{
           const groupId =  doc.data().groupId;
          const editorRef =  admin.firestore().doc(`groups/${groupId}/editors/${uid}`)
          return editorRef.update(data)

        }
    );
    

})

