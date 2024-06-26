import { createUserWithEmailAndPassword, getAuth, signInWithCustomToken, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { getFirestore, setDoc, getDoc, doc, addDoc, collection, collectionData, query, updateDoc, deleteDoc, getDocs, Firestore, DocumentReference } from "@angular/fire/firestore";
import { UtilsService } from './utils.service';
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
  utilsSvc = inject(UtilsService);
  private db: Firestore = getFirestore();

  constructor() { }

  getAuth() {
    return getAuth();
  }

  // =================== VALIDA SI CURRENT USER ES ADMIN ====================
  async isAdmin() {
    const user = getAuth().currentUser; // OBTIENE UN OBJETO CON LA INFORMACION DEL USUARIO AUTENTICADO ACTUAL
    const path = `/users/${user.uid}` // CREAMOS EL PATH CON EL OBTENDREMOS EL DOCUMENTO CON LA INFORMACION DEL USUARIO ACTUAL
    try {
      const userDoc = await this.getDocument(path);
      return userDoc?.['role'] === 'admin'; //DEVUELVE TRUE SI EL USUARIO ES ADMIN O FALSE SI NO LO ES
    } catch (error) {
      console.error('Error obteniendo el documento del usuario:', error);
      return false;
    }
  }

  // =========== Acceder ===============
  async signIn(user: User) {
    const result = await signInWithEmailAndPassword(
      this.getAuth(),
      user.email,
      user.password
    );
    return result;
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  async signOut() {
    await this.auth.signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth', true);
  }

  //Funcion para proteger rutas, y crearemos un guard, opcion canActivate
  getAuthState() {
    return this.auth.authState;
  }

  // ====================================== BASE DE DATOS =======================================

  // =================== OBTENER COLECCION ====================
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, ...collectionQuery), { idField: 'id' });
  }

  // =================== SET UN DOCUMENTO ====================
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  // =================== ACTUALIZAR UN DOCUMENTO ====================
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  // =================== ELIMINAR UN DOCUMENTO ====================
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  // =================== AGREGAR UN DOCUMENTO ====================
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data)
  }

  // =================== OBTENER UN DOCUMENTO ====================
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  // ====================================== ALMACENAMIENTO =======================================
  // =================== SUBIR PDF A FIREBASE STORAGE ====================
  async uploadPdfToStorage(pdfBlob: Blob, filename: string): Promise<string> {
    const user: User = this.utilsSvc.getFromLocalStorage('user')
    const storageRef = this.storage.ref(`${user.uid}/${filename}.pdf`);
    await storageRef.put(pdfBlob);
    return storageRef.getDownloadURL().toPromise();
  }

  // =================== GUARDAR URL DEL PDF EN FIRESTORE ====================
  async savePdfUrlToFirestore(downloadURL: string, path: string) {
    await this.setDocument(path, { url: downloadURL });
  }
}
