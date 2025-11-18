import Certificate from "../models/certificate.model.js";

export const certificateController = {
  generate: async (req, res) => {
    try {
      const cert = new Certificate(req.body);
      await cert.save();
      res.json(cert);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  listByUser: async (req, res) => {
    const data = await Certificate.find({ userId: req.params.userId })
      .populate("courseId");
    res.json(data);
  }
};
