import Course from "../models/course.model.js";

export const courseController = {
  create: async (req, res) => {
    try {
      const course = new Course(req.body);
      await course.save();
      res.json(course);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  list: async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
  },

  findOne: async (req, res) => {
    const course = await Course.findById(req.params.id);
    res.json(course);
  }
};
