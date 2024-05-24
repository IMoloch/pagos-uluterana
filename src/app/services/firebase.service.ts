import { getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { getFirestore, setDoc, getDoc, doc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from "@angular/fire/firestore";
import { UtilsService } from './utils.service';
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth)
  firestore = inject(AngularFirestore)
  storage = inject(AngularFireStorage)
  utilsSvc = inject(UtilsService)

  constructor() { }

  // ====================================== BASE DE DATOS =======================================

  // =================== OBTENER COLECCION ====================
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path)
    return collectionData(query(ref, ...collectionQuery), { idField: 'id' })
  }

  // =================== SET UN DOCUMENTO ====================
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

  // =================== ACTUALIZAR UN DOCUMENTO ====================
  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data)
  }

  // =================== ELIMINAR UN DOCUMENTO ====================
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path))
  }

  // =================== AGREGAR UN DOCUMENTO ====================
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data)
  }

  // =================== OBTENER UN DOCUMENTO ====================
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data()
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
