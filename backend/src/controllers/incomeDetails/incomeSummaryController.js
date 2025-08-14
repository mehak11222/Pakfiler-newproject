import IncomeSummary from "../../models/incomeDetails/incomeSummaryModel.js";

// Create or update income summary
export const createUnifiedIncome = async (req, res) => {
  try {
    const userId = req.user?._id;
    const {
      taxYear,
      salary,
      business,
      freelance,
      foreign,
      agriculture,
      capitalGains,
      dividend,
      property,
      profitOnSavings,
      rent,
      commission,
      other,
    } = req.body;

    if (!taxYear) {
      return res.status(400).json({ success: false, message: "Tax year is required" });
    }

    const existing = await IncomeSummary.findOne({ userId, taxYear });

    if (existing) {
      const updated = await IncomeSummary.findOneAndUpdate(
        { userId, taxYear },
        {
          salary,
          business,
          freelance,
          foreign,
          agriculture,
          capitalGains,
          dividend,
          property,
          profitOnSavings,
          rent,
          commission,
          other,
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Income summary updated successfully",
        data: updated,
      });
    }

    const newSummary = new IncomeSummary({
      userId,
      taxYear,
      salary,
      business,
      freelance,
      foreign,
      agriculture,
      capitalGains,
      dividend,
      property,
      profitOnSavings,
      rent,
      commission,
      other,
    });

    await newSummary.save();

    res.status(201).json({
      success: true,
      message: "Income summary created successfully",
      data: newSummary,
    });
  } catch (error) {
    console.error("Error saving income summary:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Get by userId and taxYear
export const getUnifiedIncome = async (req, res) => {
  try {
    const userId = req.userId;
    const { taxYear } = req.query;

    if (!taxYear) {
      return res.status(400).json({ success: false, message: "Tax year is required" });
    }

    const summary = await IncomeSummary.findOne({ userId, taxYear });

    if (!summary) {
      return res.status(404).json({ success: false, message: "No income summary found" });
    }

    res.status(200).json({
      success: true,
      message: "Income summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching income summary:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
