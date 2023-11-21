import {RouterModule, Routes} from '@angular/router';

import {
	HomeComponent,
	NoContentComponent,
	LoginComponent,
	DashboardComponent,
	ElectionCreateEditComponent,
	ElectionDetailsComponent,
	ProfileComponent,
	RegisterUserComponent
} from './pages/';

const appRoutes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegisterUserComponent},
	{path: 'profile', component: ProfileComponent},
	{path: 'dashboard', component: DashboardComponent},
	{path: 'election/create', component: ElectionCreateEditComponent},
	{path: 'election/:electionId/edit', component: ElectionCreateEditComponent},
	{path: 'election/:electionId/details', component: ElectionDetailsComponent},
	{path: '**', component: NoContentComponent}
];

export const routes = RouterModule.forRoot(appRoutes, {useHash: true});
