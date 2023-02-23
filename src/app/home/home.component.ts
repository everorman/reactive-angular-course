import { Component, OnInit } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, finalize, catchError } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { CoursesStore } from '../services/course.store';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;

  advancedCourses$: Observable<Course[]>;

  constructor(private courseStore: CoursesStore) {

  }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {

    this.advancedCourses$ = this.courseStore.filterByCategory("ADVANCED");
    this.beginnerCourses$ = this.courseStore.filterByCategory("BEGINNER");
  }

}




