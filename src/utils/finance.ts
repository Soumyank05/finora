/**
 * Mathematical models for Indian wealth management & retirement planning.
 */

/**
 * Calculates future value of a Systematic Investment Plan (SIP).
 * Monthly compounding with deposits at the beginning of each period.
 */
export function calculateSIPFutureValue(monthlyInvestment: number, annualReturnRate: number, tenureYears: number): number {
  if (monthlyInvestment <= 0 || tenureYears <= 0) return 0;
  const monthlyRate = annualReturnRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const fv = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.round(fv);
}

/**
 * Calculates required monthly SIP to achieve a target corpus.
 */
export function calculateRequiredSIP(targetCorpus: number, annualReturnRate: number, tenureYears: number): number {
  if (targetCorpus <= 0 || tenureYears <= 0) return 0;
  const monthlyRate = annualReturnRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const sip = (targetCorpus * monthlyRate) / (((Math.pow(1 + monthlyRate, totalMonths) - 1)) * (1 + monthlyRate));
  return Math.round(sip);
}

/**
 * Calculates inflation-adjusted retirement corpus requirements using the 30x rule
 * and post-retirement annuity drawdown.
 */
export function calculateRetirementPlan(params: {
  currentAge: number;
  retirementAge: number;
  currentMonthlyExpense: number;
  currentNetWorth: number;
  monthlySavings: number;
  expectedPreRetirementReturn?: number; // default 11.5%
  inflationRate?: number; // default 6%
  lifeExpectancy?: number; // default 82
}) {
  const {
    currentAge,
    retirementAge,
    currentMonthlyExpense,
    currentNetWorth,
    monthlySavings,
    expectedPreRetirementReturn = 11.5,
    inflationRate = 6.0,
    lifeExpectancy = 82
  } = params;

  const yearsToRetirement = Math.max(1, retirementAge - currentAge);
  const yearsInRetirement = Math.max(1, lifeExpectancy - retirementAge);

  // Future annual living expense at the moment of retirement
  const futureMonthlyExpense = currentMonthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);
  const futureAnnualExpense = futureMonthlyExpense * 12;

  // Targeted corpus: rule of 30x annual expenses at retirement
  const targetCorpus = Math.round(futureAnnualExpense * 30);

  // Projected wealth at retirement from current portfolio + ongoing SIP
  const monthlyReturnRate = expectedPreRetirementReturn / 12 / 100;
  const totalMonths = yearsToRetirement * 12;
  const fvExistingPortfolio = currentNetWorth * Math.pow(1 + monthlyReturnRate, totalMonths);
  const fvSavings = calculateSIPFutureValue(monthlySavings, expectedPreRetirementReturn, yearsToRetirement);
  const projectedCorpus = Math.round(fvExistingPortfolio + fvSavings);

  const surplusOrShortfall = projectedCorpus - targetCorpus;
  const isFunded = surplusOrShortfall >= 0;

  return {
    yearsToRetirement,
    yearsInRetirement,
    futureAnnualExpense: Math.round(futureAnnualExpense),
    targetCorpus,
    projectedCorpus,
    surplusOrShortfall,
    isFunded,
    progressPercentage: Math.min(100, Number(((projectedCorpus / targetCorpus) * 100).toFixed(1)))
  };
}

/**
 * Generates year-by-year projected wealth trajectory from current age to retirement age.
 */
export function generateCorpusTrajectory(params: {
  currentAge: number;
  retirementAge: number;
  currentNetWorth: number;
  monthlySavings: number;
  annualReturnRate?: number;
  inflationRate?: number;
  currentMonthlyExpense: number;
}): Array<{
  age: number;
  year: number;
  portfolio: number;
  targetCorpus: number;
}> {
  const {
    currentAge,
    retirementAge,
    currentNetWorth,
    monthlySavings,
    annualReturnRate = 11.5,
    inflationRate = 6.0,
    currentMonthlyExpense
  } = params;

  const currentYear = new Date().getFullYear();
  const trajectory = [];
  const years = Math.max(1, retirementAge - currentAge);

  for (let y = 0; y <= years; y++) {
    const age = currentAge + y;
    const year = currentYear + y;

    const monthlyRate = annualReturnRate / 12 / 100;
    const months = y * 12;
    const compoundedInitial = currentNetWorth * Math.pow(1 + monthlyRate, months);
    const compoundedSIP = y > 0 ? calculateSIPFutureValue(monthlySavings, annualReturnRate, y) : 0;
    const portfolio = Math.round(compoundedInitial + compoundedSIP);

    const inflatedAnnualExpense = currentMonthlyExpense * Math.pow(1 + inflationRate / 100, y) * 12;
    const targetCorpus = Math.round(inflatedAnnualExpense * 30);

    trajectory.push({
      age,
      year,
      portfolio,
      targetCorpus
    });
  }

  return trajectory;
}

/**
 * Calculates Indian Income Tax comparison for FY 2024-25 (Budget 2024 revised slabs)
 * comparing New Tax Regime vs Old Tax Regime.
 */
export function calculateIndianIncomeTax(params: {
  annualGrossSalary: number;
  deductions80C?: number;
  deductions80D?: number;
  hraExemption?: number;
}) {
  const {
    annualGrossSalary,
    deductions80C = 150000,
    deductions80D = 25000,
    hraExemption = 0
  } = params;

  // 1. NEW TAX REGIME (Budget 2024 Standard Deduction: ₹75,000)
  const newStdDeduction = 75000;
  const newTaxableIncome = Math.max(0, annualGrossSalary - newStdDeduction);

  let newBaseTax = 0;
  if (newTaxableIncome > 1500000) {
    newBaseTax += (newTaxableIncome - 1500000) * 0.30;
    newBaseTax += 300000 * 0.20; // 12L-15L
    newBaseTax += 200000 * 0.15; // 10L-12L
    newBaseTax += 300000 * 0.10; // 7L-10L
    newBaseTax += 400000 * 0.05; // 3L-7L
  } else if (newTaxableIncome > 1200000) {
    newBaseTax += (newTaxableIncome - 1200000) * 0.20;
    newBaseTax += 200000 * 0.15;
    newBaseTax += 300000 * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxableIncome > 1000000) {
    newBaseTax += (newTaxableIncome - 1000000) * 0.15;
    newBaseTax += 300000 * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxableIncome > 700000) {
    newBaseTax += (newTaxableIncome - 700000) * 0.10;
    newBaseTax += 400000 * 0.05;
  } else if (newTaxableIncome > 300000) {
    newBaseTax += (newTaxableIncome - 300000) * 0.05;
  }

  // Section 87A rebate for New Regime: if taxable income <= 7,00,000, tax is nil
  if (newTaxableIncome <= 700000) {
    newBaseTax = 0;
  }
  const newCess = newBaseTax * 0.04;
  const newTotalTax = Math.round(newBaseTax + newCess);

  // 2. OLD TAX REGIME (Standard Deduction: ₹50,000 + 80C + 80D + HRA)
  const oldStdDeduction = 50000;
  const oldDeductions = oldStdDeduction + Math.min(150000, deductions80C) + Math.min(50000, deductions80D) + hraExemption;
  const oldTaxableIncome = Math.max(0, annualGrossSalary - oldDeductions);

  let oldBaseTax = 0;
  if (oldTaxableIncome > 1000000) {
    oldBaseTax += (oldTaxableIncome - 1000000) * 0.30;
    oldBaseTax += 500000 * 0.20; // 5L-10L
    oldBaseTax += 250000 * 0.05; // 2.5L-5L
  } else if (oldTaxableIncome > 500000) {
    oldBaseTax += (oldTaxableIncome - 500000) * 0.20;
    oldBaseTax += 250000 * 0.05;
  } else if (oldTaxableIncome > 250000) {
    oldBaseTax += (oldTaxableIncome - 250000) * 0.05;
  }

  // Section 87A rebate for Old Regime: if taxable income <= 5,00,000, tax is nil
  if (oldTaxableIncome <= 500000) {
    oldBaseTax = 0;
  }
  const oldCess = oldBaseTax * 0.04;
  const oldTotalTax = Math.round(oldBaseTax + oldCess);

  const difference = oldTotalTax - newTotalTax;
  const recommendedRegime: 'NEW' | 'OLD' = difference >= 0 ? 'NEW' : 'OLD';
  const taxSavings = Math.abs(difference);

  return {
    annualGrossSalary,
    newRegime: {
      standardDeduction: newStdDeduction,
      taxableIncome: newTaxableIncome,
      totalTax: newTotalTax,
      effectiveTaxRate: annualGrossSalary > 0 ? Number(((newTotalTax / annualGrossSalary) * 100).toFixed(1)) : 0
    },
    oldRegime: {
      totalDeductions: oldDeductions,
      taxableIncome: oldTaxableIncome,
      totalTax: oldTotalTax,
      effectiveTaxRate: annualGrossSalary > 0 ? Number(((oldTotalTax / annualGrossSalary) * 100).toFixed(1)) : 0
    },
    recommendedRegime,
    taxSavings
  };
}
