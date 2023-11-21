import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {AppComponent} from './app.component';
import {NavbarComponent} from './components/';
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

import {routes} from './app.routes';

import {
	UserService,
	AuthGuard,
	ElectionService
} from './services';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		NavbarComponent,
		LoginComponent,
		DashboardComponent,
		NoContentComponent,
		ElectionCreateEditComponent,
		ElectionDetailsComponent,
		ProfileComponent,
		RegisterUserComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpClientModule,
		routes
	],
	providers: [
		UserService,
		AuthGuard,
		ElectionService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
