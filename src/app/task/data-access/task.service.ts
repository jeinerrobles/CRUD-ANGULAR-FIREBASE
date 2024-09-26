import { inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { set } from '@angular/fire/database';
import { addDoc, collection, collectionData, doc, Firestore, getDoc, updateDoc, query, where } from '@angular/fire/firestore';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { AuthStateService } from '../../shared/data-access/auth-state.service';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export type TaskCreate = Omit<Task, 'id'>;

const PATH = 'tasks';

@Injectable()
export class TaskService {

  private _firestore = inject(Firestore);

  private _authState = inject(AuthStateService);

  private _collection = collection(this._firestore, PATH);

  private _query = query(this._collection, where('userId', '==', this._authState.currentUser?.uid));

  loading = signal<boolean>(true);

  constructor() {
    console.log(this._authState.currentUser);
  }

  getTasks = toSignal(
    (collectionData(this._query, { idField: 'id' }) as Observable<Task[]>).pipe(
      tap(() => {
        this.loading.set(false)
      }),
      catchError(error => {
        this.loading.set(false)
        return throwError(() => error)
      })
    ),
    {
      initialValue: []
    }
  );

  create(task: TaskCreate) {
    return addDoc(this._collection, { ...task, userId: this._authState.currentUser?.uid })
  }

  async update(id: string, task: TaskCreate): Promise<void> {
    const taskDoc = doc(this._firestore, `${PATH}/${id}`);
    await updateDoc(taskDoc, {...task, userId: this._authState.currentUser?.uid});
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    const taskDoc = doc(this._firestore, `${PATH}/${id}`);
    const taskSnapshot = await getDoc(taskDoc);
    return taskSnapshot.exists() ? { id: taskSnapshot.id, ...taskSnapshot.data() } as Task : undefined;
  }


}
