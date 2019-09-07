import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { AssessmentsPage } from '../pages/assessments/assessments';
import { IntroPage } from '../pages/intro/intro';
import { TakeAssessmentPage } from '../pages/takeassessment/takeassessment';
import { AttemptsPage } from '../pages/attempts/attempts';


import { AuthService } from '../service/auth.service';
import { JsonService } from '../service/json.service';
import { ChildsService } from '../service/childs.service';
import { CoursesService } from '../service/courses.service';
import { QuizesService } from '../service/quizes.service';
import { QuestionsService } from '../service/questions.service';
import { QuestionAnswersService } from '../service/questionanswers.service';
import { QuizResultsService } from '../service/quizresults.service';
import { QuizResultDetailsService } from '../service/quizresultdetails.service';
import { SyncQuizService } from '../service/syncquiz.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage,
    AssessmentsPage,
    IntroPage,
    TakeAssessmentPage,
    AttemptsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ProfilePage,
    AssessmentsPage,
    IntroPage,
    TakeAssessmentPage,
    AttemptsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthService,
    JsonService,
    ChildsService,
    CoursesService,
    QuizesService,
    QuestionsService,
    QuestionAnswersService,
    QuizResultsService,
    QuizResultDetailsService,
    SyncQuizService,
    Network,
    Geolocation,
  ]
})
export class AppModule { }
