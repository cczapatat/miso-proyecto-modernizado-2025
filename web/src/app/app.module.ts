import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';

import { HeaderModule } from './header/header.module';
import { StoreModule } from './exercise/exercise.module';
import { UserModule } from './user/user.module';

import { AppRoutingModule } from './app-routing.module';
import { HomeRoutingModule } from './home/home-routing-module';
import { ExerciseRoutingModule } from './exercise/exercise-routing-module';

import { HttpErrorInterceptorService } from './interceptors/http-error-interceptor.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    HeaderModule,
    StoreModule,
    UserModule,

    AppRoutingModule,
    HomeRoutingModule,
    ExerciseRoutingModule,

    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'es-CO',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptorService,
      multi: true,
    },
    HttpClientModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
