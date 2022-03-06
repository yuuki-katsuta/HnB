export const roomIdValidate = (roomId: string) => {
  const isEmpty = roomId.trim() === '';
  return isEmpty;
};
