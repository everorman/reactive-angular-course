import { AfterViewInit, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from 'moment';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { Course } from "../model/course";
import { CoursesStore } from '../services/course.store';
import { CoursesService } from '../services/courses.service';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [
        LoadingService,
        MessagesService
    ]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course: Course;

    constructor(
        private courseStore: CoursesStore,
        private messagesService: MessagesService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    save() {
        const changes = this.form.value;
        const saveCourse$ = this.courseStore.saveCourse(this.course.id, changes)
            .pipe(
                catchError((err) => {
                    const message = "Could not save course";
                    this.messagesService.showErrors(message);
                    console.log(err);
                    return throwError(err)
                })
            );
    }

    close() {
        this.dialogRef.close();
    }

}
