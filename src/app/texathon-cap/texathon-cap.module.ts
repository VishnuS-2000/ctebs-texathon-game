import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TexathonCapComponent } from './texathon-cap.component';
import { CapArenaComponent } from './components/arena/arena.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { CapDocumentationComponent } from './components/documentation/documentation.component';
import { MatIconModule } from '@angular/material/icon';
import { CapStartComponent } from './components/start/start.component';
import { TexathonCapRoutingModule } from './texathon-cap.routing.module';
import { CardModule } from 'primeng/card';


@NgModule({
  declarations: [
    TexathonCapComponent,
    CapArenaComponent,
    CapDocumentationComponent,

  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ToastModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    HttpClientModule,
    InputTextModule,
    DialogModule,
    ButtonModule,
    MatProgressSpinnerModule,
    MonacoEditorModule,
    MatIconModule,
    TexathonCapRoutingModule,
    CardModule,
    CapStartComponent
  
  ],
})
export class TexathonCapModule {}
