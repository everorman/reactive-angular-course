import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
  providedIn: "root"
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]); // It can remembering the last value emitted 
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(private http: HttpClient, private messages: MessagesService, private loading: LoadingService) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map(response => response["payload"]),
        catchError((err) => {
          const message = "Could not load courses";
          this.messages.showErrors(message);
          console.log(err);
          return throwError(err)
        }),
        tap(courses => this.subject.next(courses))

      );

    this.loading.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue(); // This return the course[] in memory 
    const index = courses.findIndex(course => course.id === courseId);
    const newCourse = {
      ...courses[index],
      ...changes
    };
    const newCourses: Course[] = courses.slice(0);
    newCourses[index] = newCourse;
    this.subject.next(newCourses);
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      shareReplay(),
      catchError((err) => {
        const message = "Could not save course";
        this.messages.showErrors(message);
        console.log(err);
        return throwError(err)
      })
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses =>
        courses.filter(course => course.category === category).sort(sortCoursesBySeqNo)
      )
    )
  }
}