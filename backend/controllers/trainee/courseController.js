import Course from "../../models/Course.js";

// 1️⃣ Get all courses: return { id, name, icon }
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, "_id name icon");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

// 2️⃣ Get one course by ID: return { chapters, lessons }
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId, "chapters");

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error });
  }
};

// 3️⃣ Get lesson details: return {chapter, order, chaptertitle, lessonName, lessonDescription, example}
export const getLessonById = async (req, res) => {
  try {
    const { courseId, chapterId, lessonId } = req.params;
    const course = await Course.findById(courseId);

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    const chapter = course.chapters.id(chapterId);
    if (!chapter)
      return res.status(404).json({ message: "Chapter not found" });

    const lesson = chapter.lessons.id(lessonId);
    if (!lesson)
      return res.status(404).json({ message: "Lesson not found" });

    res.status(200).json({
      chapter: chapter._id,
      order: lesson.order,
      chapterTitle: chapter.title,
      lessonName: lesson.name,
      lessonDescription: lesson.description,
      example: lesson.example
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lesson", error });
  }
};
