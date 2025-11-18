import Purchase from "../models/purchase.model.js";

export const purchaseController = {
  buy: async (req, res) => {
    try {
      const purchase = new Purchase(req.body);
      await purchase.save();
      res.json(purchase);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  userPurchases: async (req, res) => {
    const data = await Purchase.find({ userId: req.params.userId }).populate("courseId");
    res.json(data);
  }
};
