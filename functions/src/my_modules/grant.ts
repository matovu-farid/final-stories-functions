import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const addGroupId = (groupId:any, requesterUid:any)=>{
  const auth = admin.auth();
  return auth.setCustomUserClaims(requesterUid, {
    groupIds: groupId,
  });
};

export const grandAminRight = functions.https.onCall(
    async (data, context)=>{
      const groupId = data.groupId;
      const requesterUid = data.requesterUid;
      // the group id is in this token if you are an admin
      const isAdminGroupIds= context.auth?.token.groupIds;


      if (isAdminGroupIds && isAdminGroupIds[`${groupId}`]) {
        const auth = admin.auth();
        let claims= (await auth.getUser(requesterUid)).customClaims;
        if (!claims) return addGroupId(groupId, requesterUid);

        else {
          claims = claims!;
          let currentGroupIds : any | undefined = claims.groupIds;
          if (!currentGroupIds) return addGroupId(groupId, requesterUid);
          else {
            currentGroupIds = currentGroupIds!;
            if (!currentGroupIds[`${groupId}`]) return addGroupId(groupId, requesterUid);
            else return;
          }
        }
      }
    },
);

