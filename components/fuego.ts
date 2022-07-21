// fuego.ts
// TODO: This file probably will not be required as soon as swr-firestore updates for support with firebase v9
import firebase from 'firebase/app'
import 'firebase/database'

type Config = Parameters<typeof firebase.initializeApp>[0]

export class Fuego {
  public db: ReturnType<firebase.app.App['firestore']>
  public rtdb: ReturnType<firebase.app.App['database']>
  public auth: typeof firebase.auth
  public functions: typeof firebase.functions
  public storage: typeof firebase.storage
  constructor(config: Config) {
    this.db = !firebase.apps.length
      ? firebase.initializeApp(config).firestore()
      : firebase.app().firestore()
    this.rtdb = firebase.database()
    this.auth = firebase.auth
    this.functions = firebase.functions
    this.storage = firebase.storage
  }
}