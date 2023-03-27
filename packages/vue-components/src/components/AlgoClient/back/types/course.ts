
import { Student } from './student';

export type ShowcaseStatus = 0 | 1 | 2 | 3; // 0表示未开始，1表示进行中，2表示已完成，3表示未完成已删除
// 当前所选课程信息
export interface CurrentCourse {
  classId: string;
  className: string;
  gradeId: string;
  gradeName: string;
  courseName: string;
  courseId: string;
  lessonId: string; // 开班id
  signId: string; // 签到id
  currentPat: number | null; // 上到第几拍
  localId: string; // 课堂展示id
  showcaseStatus: ShowcaseStatus;
  range: [number, number]; // 课堂展示选段区间
  cultureInfoList: string[];
  [key: string]: any;
}

// 八拍
export interface Paragraphs {
  startTime: number;
  endTime: number;
}

// 队形
export interface Formation extends Paragraphs {
  formation: string;
}

// 关键动作
export interface KeyActions extends Paragraphs {
  actionName: string;
}
export interface CourseMeta {
  formation: Array<Formation>;
  paragraphs: Array<Paragraphs>;
  keyActions: Array<KeyActions>;
}

export interface CourseInfo {
  courseMeta: CourseMeta;
  imgUrl: string;
  videoUrl: string;
  [key: string]: any;
}

export interface CourseState {
  currentCourse: CurrentCourse;
  courseInfo: CourseInfo;
  students: Array<Student>;
  currentScore: string;
  showCaseDataMap: any; // 舞蹈展示数据
  aiScore: string;
  uploadTemp: Array<any>; // 上传视频地址临时容器
}
