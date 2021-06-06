export const saveToFirebase = async (ref: FirebaseFirestore.DocumentReference, data: any) => {
  const snapshot = await ref.get();
  if (snapshot.data()) return ref.update(data);
  return ref.set(data);
};

export const deleteDoc = async (ref: FirebaseFirestore.DocumentReference) => {
  const snapshot = await ref.get();
  if (snapshot.data()) return ref.delete();
  return Promise.reject(Error('Xorry The reference does not exists'));
};
export const fetchFromFirestore = async (ref:FirebaseFirestore.DocumentReference) => {
  const doc = await ref.get();
  if (doc.exists) {
    return doc.data();
  } return Promise.reject(Error('Yo the document does not exist'));
};
