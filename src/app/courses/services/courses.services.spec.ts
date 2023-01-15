import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe("Courses Service", () => {
  let coursesService: CoursesService,
    httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CoursesService],
    });

    coursesService = TestBed.get(CoursesService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it("should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((course) => {
      // tells returned the all courses
      expect(course).toBeTruthy("No courses found");

      expect(course.length).toBe(12, "incorrect number of courses");

      const courses = course.find((course) => course.id === 12);

      expect(courses.titles.description).toBe("Angular Testing Course");
    });

    const req = httpTestingController.expectOne("/api/courses");

    expect(req.request.method).toEqual("GET");

    req.flush({ payload: Object.values(COURSES) });
  });

  it("should return courses by Id", () => {
    coursesService.findCourseById(12).subscribe((courses) => {
      expect(courses).toBeTruthy();

      expect(courses.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("GET");

    req.flush(COURSES[12]);
  });

  it("should save courses", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing course" },
    };

    coursesService.saveCourse(12, changes).subscribe((courses) => {
      expect(courses.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("PUT");

    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );

    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  // Test case when save course method fails
  it("should give an error when save course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing course" },
    };

    coursesService.saveCourse(12, changes).subscribe(
      () => fail("the save course operation would have failed"),

      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpTestingController.expectOne("/api/courses/12");

    expect(req.request.method).toEqual("PUT");

    req.flush("save course failed", {
      status: 500,
      statusText: "Internal Server Error",
    });
  });

  it('should find all lessons', ()=> {

    coursesService.findLessons(12).subscribe(lessons => {

        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3)

    });

    const req = httpTestingController.expectOne(req=> req.url == "/api/lessons");

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toBe('12');
    expect(req.request.params.get('filter')).toBe('');
    expect(req.request.params.get('sortOrder')).toBe('asc');
    expect(req.request.params.get('pageNumber')).toBe('0');
    expect(req.request.params.get('pageSize')).toBe('3');

    req.flush({
        payload: findLessonsForCourse(12).slice(0, 3)
    })
  })


  afterEach(() => {
    httpTestingController.verify();
  });
});
