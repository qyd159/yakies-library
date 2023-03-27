const getFromLocal = (key, initialValue) => {
    const localRawData = localStorage.getItem(key);
    let localData;
    try {
        if (localRawData) {
            localData = JSON.parse(localRawData);
        } else {
            localData = initialValue;
        }
    } catch (error) {
        localData = initialValue;
    }
    return localData;
};

export const TEACHER_STORAGE_KEY = 'AEA-teacher-info';
export const PROD_RESOURCE_PATH = 'resources/app';
export const STUDENT_LIST_STORAGE_KEY = 'AEA-student-list';
export const CURRENT_COURSE_STORAGE_KEY = 'AEA-current-course';
export const COURSE_INFO_STORAGE_KEY = 'AEA-course-info';
export const RECESS_STORAGE_KEY = 'AEA-recess';
export const SHOWCASE_DATA = 'AEA-showcase-data';
/**
 * 从本地获取教师信息
 */
export function getTeacherInfoFromLocal() {
    const localData = localStorage.getItem(TEACHER_STORAGE_KEY);
    if (localData) {
        try {
            return JSON.parse(localData);
        } catch (e) {
            return false;
        }
    } else {
        return false;
    }
}
/**
 * 设置本地教师信息
 */
export function setTeacherInfoToLocal(info) {
    return localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(info));
}

/**
 * 设置学生信息
 */
export function setStudentsListToLocal(studentList) {
    return localStorage.setItem(STUDENT_LIST_STORAGE_KEY, JSON.stringify(studentList));
}

/**
 * 获取学生信息
 */
export function getStudentsListFromLocal() {
    return getFromLocal(STUDENT_LIST_STORAGE_KEY, []);
}

/**
 * 设置课堂信息
 */
export function setCurrentCourseToLocal(currentCourse) {
    return localStorage.setItem(CURRENT_COURSE_STORAGE_KEY, JSON.stringify(currentCourse));
}

/**
 * 获取课堂信息
 */
export function getCurrentCourseFromLocal(initialValue) {
    return getFromLocal(CURRENT_COURSE_STORAGE_KEY, initialValue);
}

/**
 * 设置课程信息
 */
export function setCourseInfoToLocal(courseInfo) {
    return localStorage.setItem(COURSE_INFO_STORAGE_KEY, JSON.stringify(courseInfo));
}

/**
 * 获取课程信息
 */
export function getCourseInfoFromLocal(initialValue) {
    return getFromLocal(COURSE_INFO_STORAGE_KEY, initialValue);
}

/**
 * 获取学生跳舞信息
 */
export function getShowCaseDataFromLocal(initialValue) {
    return getFromLocal(SHOWCASE_DATA, initialValue);
}

/**
 * 设置学生跳舞信息
 */
export function setShowCaseDataToLocal(showcaseData) {
    return localStorage.setItem(SHOWCASE_DATA, JSON.stringify(showcaseData));
}
