import React from "react";
import { Input } from "../ui/input";

interface ProfessionalIncomeFormProps {
  details: any;
  typeKey: string;
  updateIncomeDetails: (sourceId: string, field: string, value: any) => void;
  handleCurrencyInput: (field: string, value: string) => string;
  sourceId: string;
  setTraderDirectExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setTraderIndirectExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setTraderAssetsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  setTraderLiabilitiesExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  traderDirectExpanded: boolean;
  traderIndirectExpanded: boolean;
  traderAssetsExpanded: boolean;
  traderLiabilitiesExpanded: boolean;
  addOtherTaxRow: () => void;
  removeOtherTaxRow: (idx: number) => void;
  handleOtherTaxChange: (idx: number, field: 'type' | 'amount', value: string) => void;
  taxTypeOptions: { value: string; label: string }[];
  traderOtherTaxes: { type: string; amount: string }[];
  otherAdjustableTaxesKey: string;
  withholdingSelection: string | null;
}

const ProfessionalIncomeForm: React.FC<ProfessionalIncomeFormProps> = ({
  details,
  typeKey,
  updateIncomeDetails,
  handleCurrencyInput,
  sourceId,
  setTraderDirectExpanded,
  setTraderIndirectExpanded,
  setTraderAssetsExpanded,
  setTraderLiabilitiesExpanded,
  traderDirectExpanded,
  traderIndirectExpanded,
  traderAssetsExpanded,
  traderLiabilitiesExpanded,
  addOtherTaxRow,
  removeOtherTaxRow,
  handleOtherTaxChange,
  taxTypeOptions,
  traderOtherTaxes,
  otherAdjustableTaxesKey,
  withholdingSelection,
}) => (
  <>
    {(withholdingSelection === 'none' || withholdingSelection === 'both') && (
      <>
        <div className="text-right font-bold text-lg pr-4 text-[#5a2323] underline">Revenue on which tax was not deducted</div>
        <div>
          <Input
            className="border-2 border-green-400 text-lg font-semibold"
            value={details[`${typeKey}RevenueNotDeducted`] || ""}
            onChange={e => updateIncomeDetails(sourceId, `${typeKey}RevenueNotDeducted`, handleCurrencyInput(`${typeKey}RevenueNotDeducted`, e.target.value))}
            placeholder="Enter amount here"
          />
        </div>
      </>
    )}
    <div className="text-xl font-bold mb-2 text-center">Total Expense</div>
    {/* Direct Expense Section */}
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">Direct Expense</span>
        <button
          type="button"
          className="text-[#15803d] underline text-base font-medium"
          onClick={() => setTraderDirectExpanded((prev) => !prev)}
        >
          {traderDirectExpanded ? "Less Options" : "More Options"}
        </button>
      </div>
      <Input
        value={details[`${typeKey}DirectExpense`] || ""}
        onChange={e => updateIncomeDetails(sourceId, `${typeKey}DirectExpense`, handleCurrencyInput(`${typeKey}DirectExpense`, e.target.value))}
        placeholder="Direct Expense"
      />
      {traderDirectExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Cost of Sales</span>
            <Input
              value={details[`${typeKey}CostOfSales`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}CostOfSales`, handleCurrencyInput(`${typeKey}CostOfSales`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Salaries</span>
            <Input
              value={details[`${typeKey}DirectSalaries`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}DirectSalaries`, handleCurrencyInput(`${typeKey}DirectSalaries`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Rent</span>
            <Input
              value={details[`${typeKey}DirectRent`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}DirectRent`, handleCurrencyInput(`${typeKey}DirectRent`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Freight & Transportation</span>
            <Input
              value={details[`${typeKey}Freight`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}Freight`, handleCurrencyInput(`${typeKey}Freight`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
        </div>
      )}
    </div>
    {/* Indirect Expense Section */}
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">Indirect Expense</span>
        <button
          type="button"
          className="text-[#15803d] underline text-base font-medium"
          onClick={() => setTraderIndirectExpanded((prev) => !prev)}
        >
          {traderIndirectExpanded ? "Less Options" : "More Options"}
        </button>
      </div>
      <Input
        value={details[`${typeKey}IndirectExpense`] || ""}
        onChange={e => updateIncomeDetails(sourceId, `${typeKey}IndirectExpense`, handleCurrencyInput(`${typeKey}IndirectExpense`, e.target.value))}
        placeholder="Indirect Expense"
      />
      {traderIndirectExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Salaries, Wages & Benefits</span>
            <Input
              value={details[`${typeKey}IndirectSalaries`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}IndirectSalaries`, handleCurrencyInput(`${typeKey}IndirectSalaries`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Rent</span>
            <Input
              value={details[`${typeKey}IndirectRent`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}IndirectRent`, handleCurrencyInput(`${typeKey}IndirectRent`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Traveling & Communication</span>
            <Input
              value={details[`${typeKey}TravelComm`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}TravelComm`, handleCurrencyInput(`${typeKey}TravelComm`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Utilities</span>
            <Input
              value={details[`${typeKey}Utilities`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}Utilities`, handleCurrencyInput(`${typeKey}Utilities`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Repair & Maintenance</span>
            <Input
              value={details[`${typeKey}Repair`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}Repair`, handleCurrencyInput(`${typeKey}Repair`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Legal & Professional</span>
            <Input
              value={details[`${typeKey}Legal`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}Legal`, handleCurrencyInput(`${typeKey}Legal`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Deprecation</span>
            <Input
              value={details[`${typeKey}Deprecation`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}Deprecation`, handleCurrencyInput(`${typeKey}Deprecation`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium w-48">Other indirect expense</span>
            <Input
              value={details[`${typeKey}OtherIndirect`] || ""}
              onChange={e => updateIncomeDetails(sourceId, `${typeKey}OtherIndirect`, handleCurrencyInput(`${typeKey}OtherIndirect`, e.target.value))}
              placeholder="Enter amount here"
            />
          </div>
        </div>
      )}
    </div>
    {/* Balance Sheet Section */}
    <div className="mb-8">
      <h3 className="text-2xl font-bold mb-4 text-[#5a2323] underline">Balance Sheet</h3>
      {/* Total Assets */}
      <div className="grid grid-cols-3 items-center mb-2">
        <span className="font-bold text-lg text-[#5a2323]">Total Assets</span>
        <Input
          value={details[`${typeKey}TotalAssets`] || ""}
          onChange={e => updateIncomeDetails(sourceId, `${typeKey}TotalAssets`, handleCurrencyInput(`${typeKey}TotalAssets`, e.target.value))}
          placeholder="Enter amount here"
          className="col-span-1"
        />
        <button
          type="button"
          className="text-[#15803d] underline font-semibold ml-2"
          onClick={() => setTraderAssetsExpanded(prev => !prev)}
        >
          {traderAssetsExpanded ? "Less Options" : "More Options"}
        </button>
      </div>
      {traderAssetsExpanded && (
        <div className="mb-4">
          <h4 className="font-bold text-center text-lg text-[#5a2323] underline mb-2">Total Assets</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <span>Plant/Machinery/Equipment/Furniture</span>
              <Input value={details[`${typeKey}PlantMachinery`] || ""} onChange={e => updateIncomeDetails(sourceId, `${typeKey}PlantMachinery`, handleCurrencyInput(`${typeKey}PlantMachinery`, e.target.value))} placeholder="Enter amount here" />
            </div>
            <div className="flex items-center gap-4">
              <span>Advances / Deposits / Prepayments</span>
              <Input value={details[`${typeKey}Advances`] || ""} onChange={e => updateIncomeDetails(sourceId, `${typeKey}Advances`, handleCurrencyInput(`${typeKey}Advances`, e.target.value))} placeholder="Enter amount here" />
            </div>
            <div className="flex items-center gap-4">
              <span>Stocks/Stores/Spares</span>
              <Input value={details[`${typeKey}Stocks`] || ""} onChange={e => updateIncomeDetails(sourceId, `${typeKey}Stocks`, handleCurrencyInput(`${typeKey}Stocks`, e.target.value))} placeholder="Enter amount here" />
            </div>
            <div className="flex items-center gap-4">
              <span>Cash/Bank Balance</span>
              <Input value={details[`${typeKey}CashBank`] || ""} onChange={e => updateIncomeDetails(sourceId, `${typeKey}CashBank`, handleCurrencyInput(`${typeKey}CashBank`, e.target.value))} placeholder="Enter amount here" />
            </div>
            <div className="flex items-center gap-4">
              <span>Other Assets</span>
              <Input value={details[`${typeKey}OtherAssets`] || ""} onChange={e => updateIncomeDetails(sourceId, `${typeKey}OtherAssets`, handleCurrencyInput(`${typeKey}OtherAssets`, e.target.value))} placeholder="Enter amount here" />
            </div>
          </div>
        </div>
      )}
      {/* Total Liabilities */}
      <div className="grid grid-cols-3 items-center mb-2">
        <span className="font-bold text-lg text-[#5a2323]">Total Liabilities</span>
        <Input
          value={details[`${typeKey}TotalLiabilities`] || ""}
          onChange={e => updateIncomeDetails(sourceId, `${typeKey}TotalLiabilities`, handleCurrencyInput(`${typeKey}TotalLiabilities`, e.target.value))}
          placeholder="Enter amount here"
          className="col-span-1"
        />
        <button
          type="button"
          className="text-[#15803d] underline font-semibold ml-2"
          onClick={() => setTraderLiabilitiesExpanded(prev => !prev)}
        >
          {traderLiabilitiesExpanded ? "Less Options" : "More Options"}
        </button>
      </div>
      {traderLiabilitiesExpanded && (
        <div className="mb-4">
          <h4 className="font-bold text-center text-lg text-[#5a2323] underline mb-2">Total Liabilities</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <span>Long Term Borrowings/Debt/Loan</span>
              <Input value={details[`${typeKey}LongTermBorrowings`] || ""} onChange={e => updateIncomeDetails(sourceId, `${typeKey}LongTermBorrowings`, handleCurrencyInput(`${typeKey}LongTermBorrowings`, e.target.value))} placeholder="Enter amount here" />
            </div>
            <div className="flex items-center gap-4">
              <span>Other Liabilities</span>
              <Input value={details[`${typeKey}OtherLiabilities`] || ""} onChange={e => updateIncomeDetails(sourceId, `${typeKey}OtherLiabilities`, handleCurrencyInput(`${typeKey}OtherLiabilities`, e.target.value))} placeholder="Enter amount here" />
            </div>
            <div className="flex items-center gap-4">
              <span>Trade Creditors/Payable</span>
              <Input value={details[`${typeKey}TradeCreditors`] || ""} onChange={e => updateIncomeDetails(sourceId, `${typeKey}TradeCreditors`, handleCurrencyInput(`${typeKey}TradeCreditors`, e.target.value))} placeholder="Enter amount here" />
            </div>
            <div className="flex items-center gap-4">
              <span>Total Capital</span>
              <Input value={details[`${typeKey}LiabilityTotalCapital`] || ""} onChange={e => updateIncomeDetails(sourceId, `${typeKey}LiabilityTotalCapital`, handleCurrencyInput(`${typeKey}LiabilityTotalCapital`, e.target.value))} placeholder="Enter amount here" />
            </div>
          </div>
        </div>
      )}
      {/* Total Capital */}
      <div className="grid grid-cols-3 items-center mb-2">
        <span className="font-bold text-lg text-[#5a2323]">Total Capital</span>
        <Input
          value={details[`${typeKey}TotalCapital`] || ""}
          onChange={e => updateIncomeDetails(sourceId, `${typeKey}TotalCapital`, handleCurrencyInput(`${typeKey}TotalCapital`, e.target.value))}
          placeholder="Enter amount here"
          className="col-span-1"
        />
      </div>
    </div>
    {/* Other adjustable taxes section (reuse from Trader) */}
    <div className="mb-4 grid grid-cols-3 items-start">
      <span className="font-medium text-lg">Other adjustable taxes</span>
      <div className="col-span-2">
        <div className="flex items-center mb-2">
          <span>Are there any brought forward taxes, advance taxes paid or other withholding taxes against your business activity?</span>
          <div className="flex gap-4 ml-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name={`${typeKey}OtherAdjustableTaxes`}
                value="yes"
                checked={details[otherAdjustableTaxesKey] === "yes"}
                onChange={() => updateIncomeDetails(sourceId, otherAdjustableTaxesKey, "yes")}
              />
              <span className="text-[#15803d] font-semibold">YES</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name={`${typeKey}OtherAdjustableTaxes`}
                value="no"
                checked={details[otherAdjustableTaxesKey] === "no"}
                onChange={() => updateIncomeDetails(sourceId, otherAdjustableTaxesKey, "no")}
              />
              <span className="text-black font-semibold">NO</span>
            </label>
          </div>
        </div>
        {details[otherAdjustableTaxesKey] === "yes" && (
          <div className="mt-4">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2 font-bold">Description</th>
                  <th className="text-left px-4 py-2 font-bold">Tax Deducted</th>
                  <th className="px-2"></th>
                </tr>
              </thead>
              <tbody>
                {traderOtherTaxes.map((row, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">
                      <select
                        className="border rounded px-2 py-1 w-full"
                        value={row.type}
                        onChange={e => handleOtherTaxChange(idx, 'type', e.target.value)}
                      >
                        <option value="">Select Type of Tax</option>
                        {taxTypeOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        value={row.amount}
                        onChange={e => handleOtherTaxChange(idx, 'amount', handleCurrencyInput('otherTaxAmount', e.target.value))}
                        placeholder="Tax Deducted"
                      />
                    </td>
                    <td className="px-2 text-center">
                      <button type="button" className="text-green-600" onClick={() => removeOtherTaxRow(idx)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button type="button" className="mt-2 text-green-600 text-2xl" onClick={addOtherTaxRow}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  </>
);

export default ProfessionalIncomeForm; 