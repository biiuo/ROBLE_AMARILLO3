import Course from "../../models/course.model.js";

export default async () => {
  return await Course.find();
};
