import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IonicModule, IonList, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonToast } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-role-management',
    templateUrl: './role-management.page.html',
    styleUrls: ['./role-management.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class RoleManagementPage implements OnInit {
    private firestore = inject(Firestore);

    users$: Observable<any[]>;
    sortedUsers$: Observable<any[]>;
    roles = ['admin', 'mecanico', 'bombero', 'jefeFlota'];
    showToast = false;
    toastMessage = '';
    toastColor = 'success';

    sortField: string = 'name';
    sortDirection: 'asc' | 'desc' = 'asc';

    constructor() {
        const usersCollection = collection(this.firestore, 'users');
        this.users$ = collectionData(usersCollection, { idField: 'id' });

        this.sortedUsers$ = new Observable(subscriber => {
            this.users$.subscribe(users => {
                const sorted = [...users].sort((a, b) => {
                    const aField = a[this.sortField] ? a[this.sortField].toString().toLowerCase() : '';
                    const bField = b[this.sortField] ? b[this.sortField].toString().toLowerCase() : '';
                    if (aField < bField) return this.sortDirection === 'asc' ? -1 : 1;
                    if (aField > bField) return this.sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
                subscriber.next(sorted);
            });
        });
    }

    ngOnInit() { }

    sortBy(field: string) {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        // Re-emit sortedUsers$ with new sorting
        this.sortedUsers$ = new Observable(subscriber => {
            this.users$.subscribe(users => {
                const sorted = [...users].sort((a, b) => {
                    const aField = a[this.sortField] ? a[this.sortField].toString().toLowerCase() : '';
                    const bField = b[this.sortField] ? b[this.sortField].toString().toLowerCase() : '';
                    if (aField < bField) return this.sortDirection === 'asc' ? -1 : 1;
                    if (aField > bField) return this.sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
                subscriber.next(sorted);
            });
        });
    }

    async updateUserRole(user: any, newRole: string) {
        try {
            const userDocRef = doc(this.firestore, `users/${user.id}`);
            await updateDoc(userDocRef, { role: newRole });
            this.toastMessage = `Rol actualizado para ${user.email} a ${newRole}`;
            this.toastColor = 'success';
            this.showToast = true;
        } catch (error) {
            this.toastMessage = 'Error al actualizar el rol';
            this.toastColor = 'danger';
            this.showToast = true;
            console.error('Error updating user role:', error);
        }
    }
}
