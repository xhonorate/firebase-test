export interface User {
  id: string,
  email: string,
  token: string,
  name: string,
  profilePic: string,
  isAnonymous: boolean
}

export const mapUserData = (user) => {
  const { uid, email, xa, displayName, photoUrl, isAnonymous } = user
  
  const mappedUser: User = {
      id: uid,
      email,
      token: xa,
      name: displayName,
      profilePic: photoUrl,
      isAnonymous
  }

  return mappedUser;
}