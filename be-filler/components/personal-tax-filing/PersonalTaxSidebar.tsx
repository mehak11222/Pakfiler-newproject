import React from "react";

interface PersonalTaxSidebarProps {
  formData: any;
}

export default function PersonalTaxSidebar({ formData }: PersonalTaxSidebarProps) {
  // Helper to extract tax deducted from income details
  const getIncomeTaxDeducted = () => {
    let total = 0;
    if (formData?.salaryIncome && typeof formData.salaryIncome === 'object' && formData.salaryIncome.taxDeducted) {
      total += Number(formData.salaryIncome.taxDeducted) || 0;
    } else if (formData?.salaryIncome && !isNaN(Number(formData.salaryIncome))) {
      // If salaryIncome is just a number, treat as income, not tax
    }
    if (formData?.businessIncome && typeof formData.businessIncome === 'object' && formData.businessIncome.taxDeducted) {
      total += Number(formData.businessIncome.taxDeducted) || 0;
    }
    if (formData?.rentalIncome && typeof formData.rentalIncome === 'object' && formData.rentalIncome.taxDeducted) {
      total += Number(formData.rentalIncome.taxDeducted) || 0;
    }
    if (formData?.otherIncome && typeof formData.otherIncome === 'object' && formData.otherIncome.taxDeducted) {
      total += Number(formData.otherIncome.taxDeducted) || 0;
    }
    if (Array.isArray(formData?.incomes)) {
      for (const inc of formData.incomes) {
        if (inc.details && inc.details.taxDeducted) {
          total += Number(inc.details.taxDeducted) || 0;
        }
      }
    }
    return total;
  };

  // Helper to extract tax deducted from deduction details
  const getDeductionTaxDeducted = () => {
    let total = 0;
    if (formData?.deductionDetails?.bankTransactions) {
      total += formData.deductionDetails.bankTransactions.reduce((sum: number, t: any) => sum + (Number(t.taxDeducted) || 0), 0);
    }
    if (formData?.deductionDetails?.utilities) {
      total += formData.deductionDetails.utilities.reduce((sum: number, t: any) => sum + (Number(t.taxDeducted) || 0), 0);
    }
    if (formData?.deductionDetails?.vehicles) {
      total += formData.deductionDetails.vehicles.reduce((sum: number, t: any) => sum + (Number(t.taxDeducted) || 0), 0);
    }
    if (formData?.deductionDetails?.other) {
      total += Object.values(formData.deductionDetails.other).reduce((sum: number, v: any) => sum + (Number(v) || 0), 0);
    }
    return total;
  };

  // Total tax paid and refundable (sum of all tax deducted fields)
  const totalTaxDeducted = getIncomeTaxDeducted() + getDeductionTaxDeducted();

  // Total income
  const totalIncome = [
    formData?.salaryIncome && typeof formData.salaryIncome !== 'object' ? formData.salaryIncome : 0,
    formData?.businessIncome && typeof formData.businessIncome !== 'object' ? formData.businessIncome : 0,
    formData?.rentalIncome && typeof formData.rentalIncome !== 'object' ? formData.rentalIncome : 0,
    formData?.otherIncome && typeof formData.otherIncome !== 'object' ? formData.otherIncome : 0,
  ].reduce((sum, val) => sum + (typeof val === 'number' ? val : Number(val) || 0), 0);

  // Total expenses
  const totalExpenses = Number(formData?.expense?.householdExpenses) || 0;

  // Total liabilities
  let totalLiabilities = 0;
  const liabilities = formData?.wealthStatement?.liabilities || {};
  if (liabilities.bankLoans) totalLiabilities += liabilities.bankLoans.reduce((sum: number, l: any) => sum + (Number(l.outstandingLoan) || 0), 0);
  if (liabilities.otherLiabilities) totalLiabilities += liabilities.otherLiabilities.reduce((sum: number, l: any) => sum + (Number(l.amount) || 0), 0);

  // Opening wealth: sum of all asset values at the start
  const openingAssets = formData?.wealthStatement?.assets || {};
  let openingWealth = 0;
  if (openingAssets.properties) openingWealth += openingAssets.properties.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (openingAssets.vehicles) openingWealth += openingAssets.vehicles.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (openingAssets.bankAccounts) openingWealth += openingAssets.bankAccounts.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (openingAssets.insurances) openingWealth += openingAssets.insurances.reduce((sum: number, a: any) => sum + (Number(a.premiumPaid) || 0), 0);
  if (openingAssets.possessions) openingWealth += openingAssets.possessions.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (openingAssets.foreignAssets) openingWealth += openingAssets.foreignAssets.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (openingAssets.cash) openingWealth += Number(openingAssets.cash.balance) || 0;
  if (openingAssets.otherAssets) openingWealth += openingAssets.otherAssets.reduce((sum: number, a: any) => sum + (Number(a.amount) || 0), 0);

  // Assets at closing (sum all asset values)
  const assets = formData?.wealthStatement?.assets || {};
  let assetsAtClosing = 0;
  if (assets.properties) assetsAtClosing += assets.properties.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (assets.vehicles) assetsAtClosing += assets.vehicles.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (assets.bankAccounts) assetsAtClosing += assets.bankAccounts.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (assets.insurances) assetsAtClosing += assets.insurances.reduce((sum: number, a: any) => sum + (Number(a.premiumPaid) || 0), 0);
  if (assets.possessions) assetsAtClosing += assets.possessions.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (assets.foreignAssets) assetsAtClosing += assets.foreignAssets.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
  if (assets.cash) assetsAtClosing += Number(assets.cash.balance) || 0;
  if (assets.otherAssets) assetsAtClosing += assets.otherAssets.reduce((sum: number, a: any) => sum + (Number(a.amount) || 0), 0);

  // Calculate closing wealth
  const closingWealth = openingWealth + totalIncome - totalExpenses + assetsAtClosing - totalLiabilities - totalTaxDeducted;

  // Format number with commas
  const fmt = (n: number) => isNaN(n) ? '0' : n.toLocaleString();

  return (
    <aside className="bg-[#232323] text-white w-72 min-h-screen sticky top-0 p-4 flex flex-col gap-4" style={{fontFamily: 'inherit'}}>
      <div className="text-xs text-gray-400 mb-2 tracking-widest">INCOME TAX</div>
      <div className="flex flex-col gap-2 border-b border-gray-700 pb-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">– TAX PAID</span>
          <span>{fmt(totalTaxDeducted)}</span>
        </div>
        {/* Example: Bank Transaction breakdown */}
        {formData?.deductionDetails?.bankTransactions && formData.deductionDetails.bankTransactions.length > 0 && (
          <div className="flex items-center justify-between text-sm text-gray-300 pl-4">
            <span>Bank Transaction</span>
            <span>{fmt(formData.deductionDetails.bankTransactions.reduce((sum: number, t: any) => sum + (Number(t.taxDeducted) || 0), 0))}</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between border-b border-gray-700 pb-2">
        <span className="font-semibold">REFUNDABLE</span>
        <span>{fmt(totalTaxDeducted)}</span>
      </div>
      <div className="text-xs text-gray-400 mt-4 mb-2 tracking-widest">WEALTH RECONCILIATION</div>
      <div className="flex flex-col gap-2 border-b border-gray-700 pb-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">OPENING WEALTH</span>
          <span>{fmt(openingWealth)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">TAX PAID</span>
          <span>{fmt(totalTaxDeducted)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">CLOSING WEALTH</span>
          <span>{fmt(closingWealth)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">DIFFERENCE</span>
          <span>{fmt(closingWealth - openingWealth)}</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="font-semibold">+ ASSETS AT CLOSING</span>
        <span>{fmt(assetsAtClosing)}</span>
      </div>
    </aside>
  );
} 