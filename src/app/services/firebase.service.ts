import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from "firebase/auth";
import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { getFirestore, setDoc, getDoc, doc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from "@angular/fire/firestore";
import { UtilsService } from './utils.service';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth)
  firestore = inject(AngularFirestore)
  storage = inject(AngularFireStorage)

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

  // =================== OBTENER UN DOCUMENTO ====================
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data()
  }
}
