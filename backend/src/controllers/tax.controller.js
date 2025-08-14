import TaxFiling from "../models/tax.model.js";

export const submitTax = async (req, res) => {
  const tax = await TaxFiling.create({ ...req.body, userId: req.user.id });
  res.status(201).json(tax);
};

export const getTaxHistory = async (req, res) => {
  const taxes = await TaxFiling.find({ userId: req.user.id });
  res.json(taxes);
};
