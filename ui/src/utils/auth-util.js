export const querySelector = (authUser, readerQuery, userQuery, adminQuery) => {
  let queryName = readerQuery;
  let user_id = null;
  if (authUser) {
    if (authUser.is_admin) {
      queryName = adminQuery;
    } else {
      queryName = userQuery;
      user_id = authUser.uid;

      // TODO: ------------------------------
      if (user_id === "qV183nzQ79MPRBidNFTCbUxCv1H2") {
        user_id = 2;
      }
      // ------------------------------------
    }
  }
  return [queryName, user_id];
};
