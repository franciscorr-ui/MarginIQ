// ===== Extracted script block 01 from original HTML =====
const STEP_TITLES = ["Flat-rate","Reimbursables","Non-reimbursables","Summary","Confirmation"];
const POSITION_CLASSIFICATIONS = ["Long-term international","Short-term international","Long-term national","Short-term national"];
const CONTRACTUAL_TYPES = ["Company Partner","Company Subconsultant","Individual Freelancer","Individual Employee"];
const INPUT_MODES = ["Gross","Net"];
const USERS = ["Consultant","ITR"];

let currentStep = 0;
let showBackstage = false;
let intro = { userType:"Consultant", appName:"MarginIQ" };
let backstage = {
  implementationCountry:"Germany",
  implementationMode:"No Branch",

  germanVatApplicable:true,
  germanVatRate:0.19,
  germanVatExemption:false,
  germanVatOffset:true,
  germanVatReverseCharge:false,
  germanVatReimbursable:false,

  intraEuVatApplicable:false,
  intraEuVatRate:0,
  intraEuVatExemption:false,
  intraEuVatOffset:true,
  intraEuVatReverseCharge:false,
  intraEuVatReimbursable:false,

  nonEuVatApplicable:false,
  nonEuVatRate:0,
  nonEuVatExemption:false,
  nonEuVatOffset:false,
  nonEuVatReverseCharge:false,
  nonEuVatReimbursable:false,

  otherIndirectTaxApplicable:false,
  otherIndirectTaxRate:0,
  otherIndirectTaxExemption:false,
  otherIndirectTaxOffset:false,
  otherIndirectTaxReverseCharge:false,
  otherIndirectTaxReimbursable:false,

  residentWhtApplicable:false,
  residentWhtRate:0.10,
  residentWhtExemption:false,
  residentWhtGrossedUp:false,
  residentWhtReimbursable:false,

  residentHqWhtApplicable:false,
  residentHqWhtRate:0.10,
  residentHqWhtExemption:false,
  residentHqWhtGrossedUp:false,
  residentHqWhtReimbursable:false,

  residentBranchWhtApplicable:true,
  residentBranchWhtRate:0.10,
  residentBranchWhtExemption:true,
  residentBranchWhtGrossedUp:false,
  residentBranchWhtReimbursable:true,

  nonResidentWhtApplicable:false,
  nonResidentWhtRate:0.15,
  nonResidentWhtExemption:false,
  nonResidentWhtGrossedUp:false,
  nonResidentWhtReimbursable:false,

  nonResidentHqWhtApplicable:false,
  nonResidentHqWhtRate:0.15,
  nonResidentHqWhtExemption:false,
  nonResidentHqWhtGrossedUp:false,
  nonResidentHqWhtReimbursable:false,

  nonResidentBranchWhtApplicable:true,
  nonResidentBranchWhtRate:0.15,
  nonResidentBranchWhtExemption:true,
  nonResidentBranchWhtGrossedUp:true,
  nonResidentBranchWhtReimbursable:true,

  residentHqAnotherDirectTaxApplicable:false,
  residentHqAnotherDirectTaxRate:0,
  residentHqAnotherDirectTaxExemption:false,
  residentHqAnotherDirectTaxGrossedUp:false,
  residentHqAnotherDirectTaxReimbursable:false,

  residentBranchAnotherDirectTaxApplicable:false,
  residentBranchAnotherDirectTaxRate:0,
  residentBranchAnotherDirectTaxExemption:false,
  residentBranchAnotherDirectTaxGrossedUp:false,
  residentBranchAnotherDirectTaxReimbursable:false,

  nonResidentHqAnotherDirectTaxApplicable:false,
  nonResidentHqAnotherDirectTaxRate:0,
  nonResidentHqAnotherDirectTaxExemption:false,
  nonResidentHqAnotherDirectTaxGrossedUp:true,
  nonResidentHqAnotherDirectTaxReimbursable:false,

  nonResidentBranchAnotherDirectTaxApplicable:false,
  nonResidentBranchAnotherDirectTaxRate:0,
  nonResidentBranchAnotherDirectTaxExemption:false,
  nonResidentBranchAnotherDirectTaxGrossedUp:true,
  nonResidentBranchAnotherDirectTaxReimbursable:false,

  doubleTaxAgreementCountries:[]
};
let flatRates = [];
let reimbursableRows = [];
let reimbursables = [];
let nonReimbursables = [];

function uid(){ return Math.random().toString(36).slice(2) + Date.now().toString(36); }
function parseFormattedNumber(v){
  const s = String(v ?? "").trim();
  if (!s) return "";

  if (/^-?\d{1,3}(?:\.\d{3})+(?:,\d+)?$/.test(s)) {
    return s.replace(/\./g, "").replace(",", ".");
  }
  if (/^-?\d+(?:,\d+)?$/.test(s)) {
    return s.replace(",", ".");
  }
  if (/^-?\d+(?:\.\d+)?$/.test(s)) {
    return s;
  }
  return s.replace(/\./g, "").replace(",", ".");
}
function n(v){ const x = parseFloat(parseFormattedNumber(v)); return Number.isFinite(x) ? x : 0; }
function money(v){ var x = Number.isFinite(v) ? v : 0; return "€ " + new Intl.NumberFormat("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2}).format(x); }
function formatPlainNumber(v){
  if (v === "" || v === null || v === undefined) return "";
  const x = Number(v);
  if (!Number.isFinite(x)) return "";
  return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(x);
}
function countDigitsBeforeCaret(value, caret){
  return (value.slice(0, caret).match(/\d/g) || []).length;
}
function caretFromDigitCount(value, digitCount){
  if (digitCount <= 0) {
    return value.startsWith('-') ? 1 : 0;
  }
  let seen = 0;
  for (let i = 0; i < value.length; i++) {
    if (/\d/.test(value[i])) {
      seen += 1;
      if (seen >= digitCount) return i + 1;
    }
  }
  return value.length;
}
function normalizeGermanEditableInput(value){
  let s = String(value ?? '').replace(/[^\d,\-]/g, '');
  const negative = s.startsWith('-');
  s = s.replace(/-/g, '');
  const commaIndex = s.indexOf(',');
  if (commaIndex !== -1) {
    s = s.slice(0, commaIndex + 1) + s.slice(commaIndex + 1).replace(/,/g, '');
  }
  return (negative ? '-' : '') + s;
}
function formatGermanNumberString(value){
  let s = normalizeGermanEditableInput(value);
  if (!s || s === '-') return s;
  const negative = s.startsWith('-');
  if (negative) s = s.slice(1);
  let [intPart, decPart] = s.split(',');
  intPart = (intPart || '').replace(/^0+(?=\d)/, '');
  if (intPart === '') intPart = '0';
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  let result = grouped;
  if (s.includes(',')) result += ',' + (decPart || '');
  return (negative ? '-' : '') + result;
}
function handleGermanLiveFormattedInput(e){
  const rawValue = e.target.value;
  const caret = e.target.selectionStart ?? rawValue.length;
  const digitsBefore = countDigitsBeforeCaret(rawValue, caret);
  const formatted = formatGermanNumberString(rawValue);
  e.target.value = formatted;
  const nextCaret = caretFromDigitCount(formatted, digitsBefore);
  requestAnimationFrame(() => e.target.setSelectionRange(nextCaret, nextCaret));
}
function shouldFormatFlatField(field){
  return ["feeRate","feeQty","housingRate","housingQty","perDiemRate","perDiemQty","transportRate","transportQty","otherRate","otherQty","insuranceRate","insuranceQty","otherCostRate","otherCostQty","nonTaxableAllowances","reimbursables","nonReimbursables","marginRate"].includes(field);
}
function esc(s){ return String(s||"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;"); }

function createFlatRatePosition(){
  return {
    id: uid(),
    title: "", name: "",
    classification: "",
    contractualType: "",
    inputMode: INPUT_MODES[0],
    countryOfResidence: "",
    countryOfImplementation: "",
    taxStatus: "",
    contractingEntity: "",
    vatJurisdiction: "",
    contractingEntityOverwriteActive: false,
    contractingEntityOverwriteValue: "",
    contractingEntityOverwriteReasonCode: "",
    contractingEntityOverwriteReasonText: "",
    contractingEntityOverwriteAccepted: false,
    contractingEntityOverwriteMeta: null,
    feeRate: 0, feeQty: 0, feeUnit: "month",
    housingRate: 0, housingQty: 0, housingUnit: "month",
    perDiemRate: 0, perDiemQty: 0, perDiemUnit: "day",
    transportRate: 0, transportQty: 0, transportUnit: "trip",
    otherRate: 0, otherQty: 0, otherUnit: "unit",
    nonTaxableAllowances: 0,
    reimbursables: 0,
    nonReimbursables: 0,
    insuranceRate: 0,
    insuranceQty: 0,
    otherCostRate: 0,
    otherCostQty: 0,
    marginRate: "",
    _saved: false,
    _collapsed: true
  };
}
function createExpenseItem(kind){ return { id: uid(), kind, title:"", amount:0 }; }
function componentTotal(rate, qty){ return n(rate) * n(qty); }

const EU_COUNTRIES = new Set([
  "austria","belgium","bulgaria","croatia","cyprus","czech republic","czechia","denmark","estonia","finland",
  "france","germany","greece","hungary","ireland","italy","latvia","lithuania","luxembourg","malta",
  "netherlands","poland","portugal","romania","slovakia","slovenia","spain","sweden"
]);

function normCountry(v){
  return String(v || "").trim().toLowerCase();
}

function getImplementationCountryForPosition(){
  return String(backstage.implementationCountry || "").trim();
}

function deriveTaxStatus(p){
  const implementationCountry = normCountry(getImplementationCountryForPosition());
  const residenceCountry = normCountry(p && p.countryOfResidence);
  if (!implementationCountry || !residenceCountry) return "";
  return implementationCountry === residenceCountry ? "Resident" : "Non-resident";
}

function syncFlatRateDerivedBasicFields(p){
  if (!p) return p;
  p.countryOfImplementation = getImplementationCountryForPosition();
  p.taxStatus = deriveTaxStatus(p);
  return p;
}

function deriveContractingEntity(p){
  const implementationMode = String(backstage.implementationMode || "").trim();
  const implementationCountry = normCountry(backstage.implementationCountry);
  const residenceCountry = normCountry(p.countryOfResidence);
  const resident = residenceCountry && implementationCountry && residenceCountry === implementationCountry;

  if (implementationMode === "No Branch") return "Headquarters";
  if (implementationMode === "Branch performs contract") return "Branch";
  if (implementationMode === "Branch for local support") return resident ? "Branch" : "Headquarters";
  return "";
}

function getAutoContractingEntity(p){
  return deriveContractingEntity(p);
}

function getAvailableContractingEntities(p){
  const auto = getAutoContractingEntity(p);
  const all = ["Headquarters", "Branch"];
  return all.filter(v => v && v !== auto);
}

function getAlternativeContractingEntity(p){
  return getAvailableContractingEntities(p)[0] || "";
}

function getEffectiveContractingEntity(p){
  if (p.contractingEntityOverwriteActive && p.contractingEntityOverwriteValue) {
    return p.contractingEntityOverwriteValue;
  }
  return getAutoContractingEntity(p);
}

function hasContractingEntityOverwrite(p){
  return !!(p && p.contractingEntityOverwriteActive && p.contractingEntityOverwriteValue);
}

function deriveVatJurisdiction(p){
  const residenceCountry = normCountry(p.countryOfResidence);
  if (!residenceCountry) return "";
  if (residenceCountry === "germany") return "Germany";
  if (EU_COUNTRIES.has(residenceCountry)) return "Intra-EU";
  return "Non-EU";
}

function derivedCalculationValue(value){
  const text = String(value || "").trim();
  return text || "Pending calculation";
}

function displayVatJurisdiction(value){
  const text = String(value || "").trim();
  if (text === "ITR country") return getImplementationCountryForPosition() || "ITR country";
  return text;
}

function derivedCalculationClass(value){
  return String(value || "").trim() ? "" : " derived-pending";
}

function deriveWithholdingApplicabilityFromMode(mode){

  return { resident: true, nonResident: true, nonResidentGrossedUp: true };
}

function syncDerivedWithholdingApplicability(updateDom = false){
  backstage.residentWhtApplicable = true;
  backstage.nonResidentWhtApplicable = true;
  backstage.nonResidentWhtGrossedUp = true;

  backstage.residentHqWhtApplicable = false;
  backstage.residentHqWhtExemption = false;
  backstage.residentHqWhtGrossedUp = false;
  backstage.residentHqWhtReimbursable = false;

  backstage.nonResidentHqWhtApplicable = false;
  backstage.nonResidentHqWhtExemption = false;
  backstage.nonResidentHqWhtGrossedUp = false;
  backstage.nonResidentHqWhtReimbursable = false;

  backstage.residentBranchWhtApplicable = true;
  backstage.residentBranchWhtExemption = true;
  backstage.residentBranchWhtGrossedUp = false;
  backstage.residentBranchWhtReimbursable = true;

  backstage.nonResidentBranchWhtApplicable = true;
  backstage.nonResidentBranchWhtExemption = true;
  backstage.nonResidentBranchWhtGrossedUp = true;
  backstage.nonResidentBranchWhtReimbursable = true;

  if (updateDom) {
    const setValue = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.value = typeof value === "boolean" ? String(value) : String(value);
    };
    setValue("bResidentHqWhtApplicable", false);
    setValue("bResidentHqWhtExemption", false);
    setValue("bResidentHqWhtGrossedUp", false);
    setValue("bResidentHqWhtReimbursable", false);
    setValue("bNonResidentHqWhtApplicable", false);
    setValue("bNonResidentHqWhtExemption", false);
    setValue("bNonResidentHqWhtGrossedUp", false);
    setValue("bNonResidentHqWhtReimbursable", false);
    setValue("bResidentBranchWhtApplicable", true);
    setValue("bResidentBranchWhtExemption", true);
    setValue("bResidentBranchWhtGrossedUp", false);
    setValue("bResidentBranchWhtReimbursable", true);
    setValue("bNonResidentBranchWhtApplicable", true);
    setValue("bNonResidentBranchWhtExemption", true);
    setValue("bNonResidentBranchWhtGrossedUp", true);
    setValue("bNonResidentBranchWhtReimbursable", true);
  }
}

function computePosition(p){
  syncFlatRateDerivedBasicFields(p);
  const fee = componentTotal(p.feeRate, p.feeQty);
  const housing = componentTotal(p.housingRate, p.housingQty);
  const perDiem = componentTotal(p.perDiemRate, p.perDiemQty);
  const insurance = componentTotal(p.insuranceRate, p.insuranceQty);
  const transport = componentTotal(p.transportRate, p.transportQty);
  const other = componentTotal(p.otherRate, p.otherQty);
  const otherCost = componentTotal(p.otherCostRate, p.otherCostQty);

  const nonRemunerationTotal = housing + insurance + transport + otherCost;
  const remunerationInput = fee + perDiem + other;
  const nonTaxableAllowance = Math.max(0, n(p.nonTaxableAllowances));

  const implementationCountry = normCountry(backstage.implementationCountry);
  const residenceCountry = normCountry(p.countryOfResidence);
  const resident = !!(implementationCountry && residenceCountry && implementationCountry === residenceCountry);
  const whtRate = Math.max(0, resident ? n(backstage.residentWhtRate) : n(backstage.nonResidentWhtRate));
  const inputMode = String(p.inputMode || INPUT_MODES[0]);

  let gross = 0;
  let taxableBase = 0;
  let standardWht = 0;
  let netRemuneration = 0;
  let grossUpAmount = 0;

  if (inputMode === "Net") {
    netRemuneration = remunerationInput;
    if (whtRate > 0) {
      const denominator = Math.max(0.0001, 1 - whtRate);
      const candidateGross = (netRemuneration - (nonTaxableAllowance * whtRate)) / denominator;
      gross = Math.max(netRemuneration, candidateGross);
    } else {
      gross = netRemuneration;
    }
    taxableBase = Math.max(0, gross - nonTaxableAllowance);
    standardWht = taxableBase * whtRate;
    gross = netRemuneration + standardWht;
    taxableBase = Math.max(0, gross - nonTaxableAllowance);
    standardWht = taxableBase * whtRate;
    netRemuneration = gross - standardWht;
    grossUpAmount = Math.max(0, gross - remunerationInput);
  } else {
    gross = remunerationInput;
    taxableBase = Math.max(0, gross - nonTaxableAllowance);
    standardWht = taxableBase * whtRate;
    netRemuneration = gross - standardWht;
    grossUpAmount = 0;
  }

  const remunerationTotal = gross;
  const directDeductionsTotal = standardWht;
  const grossUpEnabled = inputMode === "Net" && grossUpAmount > 0;

  const contractingEntity = getEffectiveContractingEntity(p);
  const providerResidencyCategory = resident ? "ITR country" : (residenceCountry === "germany" ? "Germany" : "Other");

  function vatDecision(){
    const contract = String(contractingEntity || "").trim();
    const mode = inputMode === "Net" ? "Net" : "Gross";
    if (contract === "Headquarters") {
      if (providerResidencyCategory === "Germany") return { jurisdiction: "German", vatApplication: true, reverseCharge: false, fallback: false };
      if (providerResidencyCategory === "ITR country") {
        if (mode === "Gross") return { jurisdiction: "ITR country", vatApplication: true, reverseCharge: false, fallback: false };
        return { jurisdiction: "German", vatApplication: false, reverseCharge: true, fallback: true };
      }
      return { jurisdiction: "German", vatApplication: true, reverseCharge: false, fallback: false };
    }
    if (contract === "Branch") {
      if (providerResidencyCategory === "ITR country") return { jurisdiction: "ITR country", vatApplication: true, reverseCharge: false, fallback: false };
      return { jurisdiction: "ITR country", vatApplication: false, reverseCharge: true, fallback: false };
    }
    return { jurisdiction: deriveVatJurisdiction(p) || "", vatApplication: false, reverseCharge: false, fallback: false };
  }

  const vatRule = vatDecision();
  const vatJurisdiction = vatRule.jurisdiction;
  const vatBase = remunerationTotal + nonRemunerationTotal;
  const vatRate = vatJurisdiction === "German" || vatJurisdiction === "Germany"
    ? Math.max(0, n(backstage.germanVatRate))
    : Math.max(0, n(backstage.intraEuVatRate || backstage.nonEuVatRate || backstage.otherIndirectTaxRate));

  const vatExempt = !!(backstage.germanVatExemption || backstage.intraEuVatExemption || backstage.nonEuVatExemption || backstage.otherIndirectTaxExemption);
  const vatRecoverable = !!(backstage.germanVatOffset || backstage.intraEuVatOffset || backstage.nonEuVatOffset || backstage.otherIndirectTaxOffset || backstage.germanVatReimbursable || backstage.intraEuVatReimbursable || backstage.nonEuVatReimbursable || backstage.otherIndirectTaxReimbursable);

  const vatCollected = vatRule.vatApplication && !vatRule.reverseCharge && !vatExempt ? vatBase * vatRate : 0;
  const vatCost = vatCollected && !vatRecoverable ? vatCollected : 0;

  const germanVat = (vatJurisdiction === "German" || vatJurisdiction === "Germany") ? vatCollected : 0;
  const intraEuVat = vatJurisdiction === "ITR country" ? vatCollected : 0;
  const nonEuVat = 0;
  const otherIndirectTax = 0;
  const indirectCollected = vatCollected;
  const indirectCost = vatCost;

  const transfer = netRemuneration + nonRemunerationTotal + indirectCollected;
  const notPartOfRemuneration = nonRemunerationTotal + indirectCollected + nonTaxableAllowance;
  const companyCost = remunerationTotal + nonRemunerationTotal + indirectCost;
  const marginRateDecimal = Math.max(0, Math.min(0.95, n(p.marginRate) / 100));
  const revenue = marginRateDecimal < 1 ? companyCost / Math.max(0.0001, 1 - marginRateDecimal) : companyCost;
  const margin = revenue - companyCost;

  const vatRateLabel = `${formatPlainNumber(vatRate * 100)}%`;
  return {
    fee, housing, perDiem, insurance, transport, other, otherCost,
    remunerationInput, remunerationTotal, nonRemunerationTotal, gross, taxableBase,
    whtRate, standardWht, grossUpEnabled, grossUpAmount,
    directDeductionsTotal,
    germanVat, intraEuVat, nonEuVat, otherIndirectTax, indirectCollected, indirectCost,
    vatCollected, vatCost, vatApplication: vatRule.vatApplication, reverseCharge: vatRule.reverseCharge, fallback: vatRule.fallback,
    providerResidencyCategory,
    netRemuneration, transfer, notPartOfRemuneration, companyCost, revenue, margin, marginRateDecimal,
    contractingEntity, vatJurisdiction,
    vatLine2Label: "Implementation-country VAT",
    vatLine3Label: "Other indirect tax",
    vatGermanNote: germanVat > 0 ? `Applied at ${vatRateLabel}.` : (vatRule.reverseCharge && vatJurisdiction === "German" ? "Reverse charge applies; no VAT is collected." : ""),
    vatIntraEuNote: intraEuVat > 0 ? `Applied at ${vatRateLabel}.` : (vatRule.reverseCharge && vatJurisdiction === "ITR country" ? "Reverse charge applies; no VAT is collected." : ""),
    vatNonEuNote: vatRule.fallback ? "Fallback booking treatment." : ""
  };
}

function computeSummary(){
  const flatRevenue = flatRates.reduce((a,p)=>a+computePosition(p).revenue,0);
  const flatCost = flatRates.reduce((a,p)=>a+computePosition(p).companyCost,0);
  const reimb = reimbursables.reduce((a,x)=>a+n(x.amount),0);
  const nonReimb = nonReimbursables.reduce((a,x)=>a+n(x.amount),0);
  const totalRevenue = flatRevenue + reimb;
  const totalCost = flatCost + nonReimb;
  const totalMargin = totalRevenue - totalCost;
  const marginRate = totalRevenue > 0 ? totalMargin / totalRevenue : 0;
  return { totalRevenue, totalCost, totalMargin, marginRate };
}

function formatContractDate(date = new Date()){
  return date.toLocaleDateString("en-GB", { day:"2-digit", month:"2-digit", year:"numeric" });
}

function providerStatusLabel(p){
  const raw = String(p.contractualType || "").trim();
  if (!raw) return "consultant";
  const map = {
    "Employment contract": "employee",
    "Service contract": "consultant",
    "Framework contract": "company"
  };
  return map[raw] || raw.toLowerCase();
}

function contractEntityLabel(p, c){
  return String((c && c.contractingEntity) || getEffectiveContractingEntity(p) || p.contractingEntity || "GFA Consulting Group GmbH").trim();
}

function getLogoDataUri(){
  const img = document.querySelector('.logo');
  return img && img.src ? img.src : "";
}

function buildContractFileName(p, idx){
  const base = (p.title || `position-${idx+1}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return `${base || `position-${idx+1}`}-contract.doc`;
}

function buildContractHtml(p, idx){
  const c = computePosition(p);
  const logoSrc = getLogoDataUri();
  const today = formatContractDate();
  const position = esc(p.title || `Position ${idx+1}`);
  const provider = esc(p.name || "Expert / Entity");
  const country = esc(backstage.implementationCountry || p.countryOfResidence || "Country");
  const durationValue = n(p.feeQty || 0);
  const duration = `${formatPlainNumber(durationValue)} ${esc(p.feeUnit || 'unit')}${durationValue === 1 ? '' : 's'}`;
  const providerStatus = esc(providerStatusLabel(p));
  const contractingEntity = esc(contractEntityLabel(p, c));
  const powSubtitle = 'Generated from MarginIQ - Financial Structuring Tool';

  return `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Pre-Agreement</title>
<style id="section-style-alignment-v2">
/* Align Basics, Input and Output section treatment */
.flat-basics-head,
.flat-subsection-head,
.flow-results > h3{
  margin:22px 0 12px 0!important;
  padding:0!important;
  border:0!important;
  background:transparent!important;
  border-radius:0!important;
}
.flat-basics-title,
.flat-subsection-title,
.flow-results > h3{
  font-size:22px!important;
  line-height:1.2!important;
  font-weight:900!important;
  color:#0f172a!important;
  letter-spacing:0!important;
  text-transform:none!important;
}
.flat-basics-panel,
.flat-basics-body{
  background:transparent!important;
  border:0!important;
  padding:0!important;
  margin-top:0!important;
}
.flat-basics-body,
.component-breakdown,
.invoice-breakdown{
  display:grid!important;
  gap:14px!important;
}
.flat-basics-group,
.component-section,
.invoice-section{
  border:1px solid #e6edf7!important;
  border-radius:16px!important;
  background:#fff!important;
  overflow:hidden!important;
  margin:0!important;
  box-shadow:none!important;
}
.flat-basics-group-head,
.component-section > .invoice-head,
.invoice-section > .invoice-head{
  padding:14px 16px!important;
  margin:0!important;
  border-bottom:1px solid #e6edf7!important;
  background:#fff!important;
  min-height:52px!important;
  display:flex!important;
  align-items:center!important;
  justify-content:space-between!important;
  gap:12px!important;
}
.flat-basics-group-title,
.component-section > .invoice-head .invoice-title,
.invoice-section > .invoice-head .invoice-title{
  margin:0!important;
  font-size:15px!important;
  line-height:1.25!important;
  font-weight:850!important;
  color:#1f2937!important;
  letter-spacing:0!important;
  text-transform:none!important;
}
.flat-basics-grid{
  padding:16px!important;
  gap:14px 18px!important;
}
.flat-basics-grid label,
.component-section label,
.invoice-section label{
  margin-bottom:7px!important;
}
.flat-input,
.flat-basics-grid input,
.flat-basics-grid select,
.component-editor input{
  min-height:44px!important;
  height:44px!important;
  border-radius:14px!important;
}
.component-breakdown,
.invoice-breakdown,
.flat-input-breakdown{
  border:0!important;
  background:transparent!important;
  border-radius:0!important;
  margin-top:0!important;
  overflow:visible!important;
}
.component-table,
.invoice-table.story-table{
  table-layout:fixed!important;
}
.component-line td,
.invoice-line td{
  padding:10px 16px!important;
  vertical-align:middle!important;
  min-height:52px!important;
}
.component-line.total td,
.invoice-line.total td,
.invoice-line.final td{
  padding-top:12px!important;
  padding-bottom:12px!important;
}
.component-colhead td{
  padding:10px 16px!important;
  min-height:40px!important;
}
.component-line .component-editor,
.component-colhead .component-editor{
  align-items:center!important;
}
.invoice-name,
.component-total,
.invoice-amount{
  line-height:1.25!important;
}
.invoice-section + .invoice-section,
.component-section + .component-section{
  border-top:1px solid #e6edf7!important;
}
.invoice-sub{
  display:none!important;
}
</style>

</head><body><div class="header">
    ${logoSrc ? `<img class="logo" src="${logoSrc}" alt="Company logo" width="80" height="23" style="width:80px;height:23px;object-fit:contain;display:block;margin-bottom:10px;">` : ''}
    <p class="title">PRE-AGREEMENT (FLAT RATE)</p><div class="subtitle">${powSubtitle}</div></div><div class="meta"><strong>between</strong><br><strong>GFA Consulting Group GmbH (GFA), Hamburg</strong><br>and<br><strong>${provider}</strong></div><hr><div class="section"><div class="section-title">1. Assignment</div><div>GFA intends to include the Expert as <strong>${position}</strong> for work in <strong>${country}</strong>, with an expected input of <strong>${duration}</strong>.</div></div><div class="section"><div class="section-title">2. Contracting Setup</div><div>The Expert will be engaged by <strong>${contractingEntity}</strong> as <strong>${providerStatus}</strong>. Final contractual terms will be defined upon project award.</div></div><div class="section"><div class="section-title">3. Remuneration</div><div class="flow"><div class="flow-row"><span>Net fee</span><strong>${money(c.netRemuneration || 0)}</strong></div><div class="flow-row"><span>Deductions / adjustments</span><strong>${money(c.directDeductionsTotal || 0)}</strong></div><div class="flow-row"><span>Transfer to provider</span><strong>${money(c.transfer || 0)}</strong></div><div class="flow-row"><span>Indirect taxes (if applicable)</span><strong>${money(c.indirectCollected || 0)}</strong></div><div class="flow-row total"><strong>Total gross remuneration</strong><strong>${money(c.companyCost || 0)}</strong></div></div><div class="small" style="margin-top:5px;">This structure reflects the financial flows applicable to the assignment.</div></div><div class="section"><div class="section-title">4. Payment & Conditions</div><div>The transfer to provider represents the agreed payable amount to the Expert. The gross remuneration represents the total cost for the contracting entity. This pre-agreement is conditional upon project award and approval of the Expert.</div></div><div class="section"><div class="section-title">5. Legal & Confidentiality</div><div>Applicable tax, social security and legal conditions depend on the final contractual setup and jurisdiction. The Expert agrees to maintain confidentiality.</div></div><div class="section"><div class="section-title">6. Validity</div><div>Valid until <strong>${today}</strong>.</div></div><div style="margin-top:10px;">Hamburg, ${today}</div><div class="signatures"><div class="sig"><div class="sig-line">GFA</div></div><div class="sig"><div class="sig-line">Expert</div></div></div>



<style id="flat-rate-basics-entered-calculated-update">
.flat-basics-panel{margin-top:12px;padding:0!important;overflow:hidden;background:#fff!important;}
.flat-basics-head{padding:14px 16px;border-bottom:1px solid var(--line);background:#fbfdff;}
.flat-basics-title{margin:0;font-size:17px;line-height:1.2;font-weight:900;color:#1A497F;letter-spacing:0;text-transform:none;}
.flat-basics-sub{margin-top:4px;font-size:12px;color:#64748b;line-height:1.35;}
.flat-basics-body{display:grid;gap:14px;padding:14px 16px 16px;}
.flat-basics-group{border:1px solid #e6edf7;border-radius:16px;background:#fff;overflow:visible;}
.flat-basics-group-head{padding:12px 14px;border-bottom:1px solid #e6edf7;background:#fbfdff;}
.flat-basics-group-title{margin:0;font-size:14px;line-height:1.25;font-weight:850;color:#1f2937;}
.flat-basics-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:14px;overflow:visible;}
.flat-basics-calculated .flat-input[readonly],.flat-basics-calculated .auto-derived-select{background:#f4f7fb!important;color:#31506f!important;font-weight:700!important;cursor:default!important;opacity:1!important;-webkit-text-fill-color:#31506f!important;}
.flat-basics-panel .country-autocomplete-field{position:relative;display:block;overflow:visible;}
.flat-basics-panel .country-autocomplete-field input{padding-left:46px!important;}
.flat-basics-panel .country-selected-flag{position:absolute;left:13px;top:50%;transform:translateY(-50%);z-index:3;width:24px;height:18px;display:flex;align-items:center;justify-content:center;pointer-events:none;}
.flat-basics-panel .country-selected-flag img,.flat-basics-panel .country-suggest-flag img{width:24px;height:18px;object-fit:cover;border-radius:3px;box-shadow:0 0 0 1px rgba(15,23,42,.12);display:block;}
.flat-basics-panel .country-selected-flag .country-flag-fallback,.flat-basics-panel .country-suggest-flag .country-flag-fallback{width:24px;height:18px;border-radius:4px;background:#eef4fb;color:#1A497F;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;box-shadow:0 0 0 1px rgba(15,23,42,.10);}
.flat-basics-panel .country-suggest-dropdown{position:absolute;z-index:5000;margin-top:6px;min-width:100%;max-height:280px;overflow:auto;border:1px solid #d8e0ee;border-radius:14px;background:#fff;box-shadow:0 18px 42px rgba(15,23,42,.14);padding:6px;}
.flat-basics-panel .country-suggest-option{display:flex;align-items:center;gap:10px;width:100%;padding:9px 10px;border:0;border-radius:10px;background:#fff;color:#1f2937;font-size:14px;font-weight:600;line-height:1.25;text-align:left;cursor:pointer;}
.flat-basics-panel .country-suggest-option:hover,.flat-basics-panel .country-suggest-option.is-active{background:#f8fbff;color:#1A497F;}
.flat-basics-panel .country-suggest-flag{width:24px!important;min-width:24px!important;height:18px;display:flex;align-items:center;justify-content:center;}
.flat-basics-panel .country-suggest-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.flat-basics-panel .country-suggest-empty{padding:10px 12px;color:#64748b;font-size:13px;}
@media (max-width:900px){.flat-basics-grid{grid-template-columns:1fr;}}
</style>
<script id="flat-rate-basics-entered-calculated-script">
(function(){
  function htmlEscape(value){
    return String(value == null ? '' : value)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function flagForCountry(value){
    if (window.marginIqCountryFlagMarkup) return window.marginIqCountryFlagMarkup(value || '');
    return '<span class="country-flag-fallback">•</span>';
  }
  function countryInputHtml(opts){
    opts = opts || {};
    var value = opts.value || '';
    var attrs = opts.attrs || '';
    var inputAttrs = opts.inputAttrs || '';
    return '<div class="country-autocomplete-field flat-country-field"><span class="country-selected-flag">' + flagForCountry(value) + '</span><input ' + attrs + ' value="' + htmlEscape(value) + '" class="flat-input ' + (opts.extraClass || '') + '" data-flat-country-autocomplete="true" list="countryOptions" autocomplete="off" ' + inputAttrs + '></div>';
  }
  function basicGroup(title, body, extraClass){
    return '<section class="flat-basics-group ' + (extraClass || '') + '"><div class="flat-basics-group-head"><h5 class="flat-basics-group-title">' + title + '</h5></div><div class="flat-basics-grid">' + body + '</div></section>';
  }
  window.renderPositionDetails = function(p, idx){
    var entered = '';
    entered += field('Position title', '<input data-idx="' + idx + '" data-field="title" value="' + esc(p.title) + '" class="flat-input" placeholder="Write position title">');
    entered += field('Name', '<input data-idx="' + idx + '" data-field="name" value="' + esc(p.name || '') + '" class="flat-input" placeholder="Write name">');
    entered += field('Country of residence', countryInputHtml({ value:p.countryOfResidence || '', attrs:'data-idx="' + idx + '" data-field="countryOfResidence"', inputAttrs:'placeholder="Select or type a country"' }));
    entered += field('Contract classification', '<select data-idx="' + idx + '" data-field="classification" class="flat-input"><option value="" ' + (!p.classification ? 'selected' : '') + '>Select contract classification</option>' + POSITION_CLASSIFICATIONS.map(function(v){ return '<option value="' + esc(v) + '" ' + (v === p.classification ? 'selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select>');
    entered += field('Provider type', '<select data-idx="' + idx + '" data-field="contractualType" class="flat-input"><option value="" ' + (!p.contractualType ? 'selected' : '') + '>Select provider type</option>' + CONTRACTUAL_TYPES.map(function(v){ return '<option value="' + esc(v) + '" ' + (v === p.contractualType ? 'selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select>');
    entered += field('Input mode', '<div><select data-idx="' + idx + '" data-field="inputMode" class="flat-input">' + INPUT_MODES.map(function(v){ return '<option ' + (v === p.inputMode ? 'selected' : '') + '>' + esc(v) + '</option>'; }).join('') + '</select>' + ((p.inputMode && String(p.inputMode).toLowerCase() !== 'gross') ? '<div class="inline-warning">It is recommendable to always negotiate gross. Continue only if you are sure.</div>' : '') + '</div>');

    var computedEntity = '<div class="ce-overwrite-wrap ' + (hasContractingEntityOverwrite(p) ? 'is-overwritten' : '') + '"><div class="ce-overwrite-top"><div class="ce-input-with-gear"><input id="computed-contracting-entity-' + idx + '" value="' + esc(getEffectiveContractingEntity(p)) + '" class="flat-input ce-overwrite-input" placeholder="Computed from implementation mode and residence" readonly><button type="button" class="ce-gear-btn" onclick="handleContractingEntityGearClick(' + idx + ')" title="Overwrite" aria-label="Overwrite">⚙</button></div></div>' +
      (hasContractingEntityOverwrite(p)
        ? '<div class="ce-overwrite-meta"><span class="ce-overwrite-badge">Overwritten</span><div class="ce-overwrite-note">Auto: <strong>' + esc(getAutoContractingEntity(p) || '—') + '</strong> → Current: <strong>' + esc(getEffectiveContractingEntity(p) || '—') + '</strong></div><div class="ce-overwrite-note">Reason: ' + esc(p.contractingEntityOverwriteReasonCode || '—') + '</div><div class="ce-overwrite-actions"><button type="button" class="small secondary" onclick="resetContractingEntityOverwrite(' + idx + ')">Reset to automatic</button></div></div>'
        : '<div class="mini-note">Assigned automatically from implementation mode and residence.</div>') + '</div>';

    var calculated = '';
    calculated += field('ITR country', countryInputHtml({ value:getImplementationCountryForPosition(), attrs:'id="computed-ITR-country-' + idx + '"', extraClass:'auto-derived-select', inputAttrs:'placeholder="From backstage ITR country" readonly' }));
    calculated += field('Tax status', '<input id="computed-tax-status-' + idx + '" value="' + esc(derivedCalculationValue(deriveTaxStatus(p))) + '" class="flat-input auto-derived-select' + derivedCalculationClass(deriveTaxStatus(p)) + '" placeholder="Pending calculation" readonly>');
    calculated += field('Contracting entity', computedEntity);
    calculated += field('VAT jurisdiction', '<input id="computed-vat-jurisdiction-' + idx + '" value="' + esc(derivedCalculationValue(displayVatJurisdiction(deriveVatJurisdiction(p)))) + '" class="flat-input auto-derived-select' + derivedCalculationClass(deriveVatJurisdiction(p)) + '" placeholder="Pending calculation" readonly>');

    return '<div class="details-panel flat-basics-panel"><div class="flat-basics-head"><h4 class="flat-basics-title">Basics</h4></div><div class="flat-basics-body">' + basicGroup('Entered details', entered, 'flat-basics-entered') + basicGroup('Calculated details', calculated, 'flat-basics-calculated') + '</div></div>';
  };

  function norm(value){ return String(value || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function countryList(){
    var dl = document.getElementById('countryOptions');
    if (!dl) return [];
    return Array.from(dl.querySelectorAll('option')).map(function(o){ return String(o.value || '').trim(); }).filter(Boolean);
  }
  function ensureDropdown(input){
    var wrap = input.closest('.country-autocomplete-field');
    if (!wrap) return null;
    var selectedFlag = wrap.querySelector('.country-selected-flag');
    if (!selectedFlag) {
      selectedFlag = document.createElement('span');
      selectedFlag.className = 'country-selected-flag';
      wrap.insertBefore(selectedFlag, input);
    }
    selectedFlag.innerHTML = input.value ? flagForCountry(input.value) : '<span class="country-flag-fallback">•</span>';
    var dd = wrap.querySelector('.country-suggest-dropdown');
    if (!dd) {
      dd = document.createElement('div');
      dd.className = 'country-suggest-dropdown';
      dd.hidden = true;
      wrap.appendChild(dd);
    }
    return {wrap:wrap, dd:dd};
  }
  function matches(query){
    var q = norm(query);
    var all = countryList();
    if (!q) return all.slice(0, 14);
    return all.filter(function(c){ return norm(c).startsWith(q); }).concat(all.filter(function(c){ return !norm(c).startsWith(q) && norm(c).indexOf(q) !== -1; })).slice(0, 14);
  }
  function show(input){
    if (!input || input.readOnly || input.disabled) return;
    var parts = ensureDropdown(input); if (!parts) return;
    var list = matches(input.value);
    parts.dd.innerHTML = list.length ? list.map(function(name, i){ return '<button type="button" class="country-suggest-option' + (i === 0 ? ' is-active' : '') + '" data-country-value="' + htmlEscape(name) + '"><span class="country-suggest-flag">' + flagForCountry(name) + '</span><span class="country-suggest-name">' + htmlEscape(name) + '</span></button>'; }).join('') : '<div class="country-suggest-empty">No matching country</div>';
    parts.dd.hidden = false;
  }
  function hide(input){
    var wrap = input && input.closest('.country-autocomplete-field');
    var dd = wrap && wrap.querySelector('.country-suggest-dropdown');
    if (dd) dd.hidden = true;
    if (input) ensureDropdown(input);
  }
  function select(input, value){
    input.value = value;
    ensureDropdown(input);
    input.dispatchEvent(new Event('input', {bubbles:true}));
    input.dispatchEvent(new Event('change', {bubbles:true}));
    hide(input);
  }
  document.addEventListener('focusin', function(e){
    var input = e.target && e.target.matches && e.target.matches('[data-flat-country-autocomplete]') ? e.target : null;
    if (input) show(input);
  });
  document.addEventListener('input', function(e){
    var input = e.target && e.target.matches && e.target.matches('[data-flat-country-autocomplete]') ? e.target : null;
    if (input) show(input);
  });
  document.addEventListener('click', function(e){
    var opt = e.target.closest && e.target.closest('.flat-basics-panel .country-suggest-option');
    if (opt) {
      var wrap = opt.closest('.country-autocomplete-field');
      var input = wrap && wrap.querySelector('[data-flat-country-autocomplete]');
      if (input) select(input, opt.dataset.countryValue || opt.textContent.trim());
      return;
    }
    document.querySelectorAll('.flat-basics-panel [data-flat-country-autocomplete]').forEach(function(input){
      var wrap = input.closest('.country-autocomplete-field');
      if (wrap && !wrap.contains(e.target)) hide(input);
    });
  });
  document.addEventListener('keydown', function(e){
    var input = e.target && e.target.matches && e.target.matches('[data-flat-country-autocomplete]') ? e.target : null;
    if (!input) return;
    var parts = ensureDropdown(input); if (!parts) return;
    var options = Array.from(parts.dd.querySelectorAll('.country-suggest-option'));
    if (e.key === 'Escape') { hide(input); return; }
    if (!options.length) return;
    var current = Math.max(0, options.findIndex(function(o){ return o.classList.contains('is-active'); }));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var next = e.key === 'ArrowDown' ? Math.min(options.length - 1, current + 1) : Math.max(0, current - 1);
      options.forEach(function(o){ o.classList.remove('is-active'); });
      options[next].classList.add('is-active');
      options[next].scrollIntoView({block:'nearest'});
    }
    if (e.key === 'Enter' && !parts.dd.hidden) {
      e.preventDefault();
      var active = options.find(function(o){ return o.classList.contains('is-active'); }) || options[0];
      if (active) select(input, active.dataset.countryValue || active.textContent.trim());
    }
  });
  function refreshFlatCountryFlags(){
    document.querySelectorAll('.flat-basics-panel [data-flat-country-autocomplete]').forEach(function(input){ ensureDropdown(input); });
  }
  var oldUpdate = window.updateFlatPositionCalculatedOutputs;
  if (typeof oldUpdate === 'function') {
    window.updateFlatPositionCalculatedOutputs = function(idx){
      oldUpdate(idx);
      refreshFlatCountryFlags();
    };
  }
  var oldRenderAll = window.renderAll;
  if (typeof oldRenderAll === 'function') {
    window.renderAll = function(){
      var result = oldRenderAll.apply(this, arguments);
      setTimeout(refreshFlatCountryFlags, 0);
      return result;
    };
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshFlatCountryFlags, {once:true});
  } else {
    setTimeout(refreshFlatCountryFlags, 0);
  }
})();
<\/script>



<style id="currency-before-and-compact-flat-row-fix">
/* Currency, compact rhythm, and Flat-rate row alignment polish */
#stepContent .component-section > .invoice-head,
#stepContent .invoice-section > .invoice-head,
#stepContent .flat-basics-group-head{
  min-height:40px!important;
  height:40px!important;
  padding:7px 14px!important;
}
#stepContent .component-colhead,
#stepContent .component-colhead td{
  height:31px!important;
  min-height:31px!important;
  padding:4px 14px!important;
}
#stepContent .component-line,
#stepContent .invoice-line{
  height:45px!important;
}
#stepContent .component-line td,
#stepContent .invoice-line td{
  height:45px!important;
  min-height:45px!important;
  padding:5px 14px!important;
  vertical-align:middle!important;
}
#stepContent .component-line.total,
#stepContent .invoice-line.total,
#stepContent .invoice-line.final{
  height:42px!important;
}
#stepContent .component-line.total td,
#stepContent .invoice-line.total td,
#stepContent .invoice-line.final td{
  height:42px!important;
  min-height:42px!important;
  padding:5px 14px!important;
}
#stepContent .flat-input,
#stepContent .flat-basics-grid input,
#stepContent .flat-basics-grid select,
#stepContent .component-editor input,
#stepContent .country-input-shell input,
#stepContent .country-input-shell .flat-input{
  min-height:34px!important;
  height:34px!important;
  padding-top:4px!important;
  padding-bottom:4px!important;
  border-radius:11px!important;
}
/* Keep row numbers inside the card and prevent clipped/misplaced text. */
#stepContent .component-section{
  counter-reset:componentLine!important;
}
#stepContent .component-line:not(.total){
  counter-increment:componentLine!important;
}
#stepContent .component-line td:first-child{
  position:relative!important;
  padding-left:38px!important;
}
#stepContent .component-line:not(.total) .invoice-label::before{
  content:counter(componentLine)!important;
  position:absolute!important;
  left:-24px!important;
  top:50%!important;
  transform:translateY(-50%)!important;
  width:14px!important;
  text-align:right!important;
  font-size:11px!important;
  line-height:1!important;
  color:#6b7a90!important;
  font-weight:700!important;
}
#stepContent .component-line.total .invoice-label::before{
  content:none!important;
  display:none!important;
}
#stepContent .component-line .invoice-label,
#stepContent .component-line .invoice-name{
  display:block!important;
  min-width:0!important;
  background:transparent!important;
}
#stepContent .component-line .invoice-name{
  white-space:normal!important;
  overflow-wrap:break-word!important;
  line-height:1.2!important;
}
#stepContent .component-line.total .invoice-name{
  white-space:nowrap!important;
}
/* Align total columns and currency strings consistently. */
#stepContent .component-colhead .component-editor,
#stepContent .component-line .component-editor,
#stepContent .component-colhead .component-editor-margin,
#stepContent .component-line .component-editor-margin{
  grid-template-columns:88px 104px 148px!important;
  column-gap:10px!important;
  align-items:center!important;
}
#stepContent .component-total-wrap,
#stepContent .component-total,
#stepContent .component-colhead .component-total-spacer{
  width:148px!important;
  min-width:148px!important;
  max-width:148px!important;
}
#stepContent .component-total,
#stepContent .invoice-amount,
#stepContent .cf-value,
#stepContent .reimb-total-value,
#stepContent .budget-row-amount{
  font-variant-numeric:tabular-nums!important;
  text-align:right!important;
  white-space:nowrap!important;
}
@media (max-width:900px){
  #stepContent .component-colhead .component-editor,
  #stepContent .component-line .component-editor,
  #stepContent .component-colhead .component-editor-margin,
  #stepContent .component-line .component-editor-margin{
    grid-template-columns:76px 92px 132px!important;
    column-gap:8px!important;
  }
  #stepContent .component-total-wrap,
  #stepContent .component-total,
  #stepContent .component-colhead .component-total-spacer{
    width:132px!important;
    min-width:132px!important;
    max-width:132px!important;
  }
}
</style>
<script id="currency-before-runtime-patch">
(function(){
  function toCurrencyBefore(value){
    var n = Number(value);
    if (!Number.isFinite(n)) n = 0;
    return '€ ' + new Intl.NumberFormat('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  }
  window.money = toCurrencyBefore;
  try { money = toCurrencyBefore; } catch(_) {}
})();
<\/script>


<style id="final-inputs-assumptions-width-and-output-alignment-patch">
/* Final override: Inputs increased by another 20% and clearer per-row inputs. */
@media (min-width:1101px){
  .flat-workspace-shell{
    grid-template-columns:minmax(460px,548px) minmax(0,1fr)!important;
  }
}
.flat-workspace-left .component-editor .component-field-label{
  display:block!important;
  margin:0 0 4px 0!important;
  font-size:11px!important;
  line-height:1.2!important;
  font-weight:800!important;
  color:#64748b!important;
  letter-spacing:.04em!important;
  text-transform:uppercase!important;
}
.flat-workspace-left .component-line .component-editor,
.flat-workspace-left .component-line .component-editor.component-editor-margin{
  grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
  column-gap:12px!important;
  row-gap:10px!important;
}
.flat-workspace-left .component-total-wrap{
  grid-column:1/-1!important;
}
.flat-workspace-right .flat-calculated-output-panel{
  margin:0 0 14px 0!important;
}
.flat-workspace-right .flat-calculated-output-panel .flat-basics-title{
  margin:0!important;
  font-size:16px!important;
  color:#0f172a!important;
}
.flat-workspace-right .flat-calculated-output-panel .flat-basics-grid{
  display:grid!important;
  grid-template-columns:repeat(2,minmax(0,1fr))!important;
  gap:12px!important;
}
@media (max-width:900px){
  .flat-workspace-right .flat-calculated-output-panel .flat-basics-grid{
    grid-template-columns:1fr!important;
  }
}
</style>
<script id="final-calculated-details-output-and-input-labels-patch">
(function(){
  function cleanDash(value){ return value == null || value === '' ? '—' : value; }

  function calculatedDetailsBlock(p, idx){
    var contractingEntityField = '' +
      '<div class="ce-overwrite-wrap ' + (hasContractingEntityOverwrite(p) ? 'is-overwritten' : '') + '">' +
        '<div class="ce-overwrite-top"><div class="ce-input-with-gear">' +
          '<input id="computed-contracting-entity-' + idx + '" value="' + esc(getEffectiveContractingEntity(p)) + '" class="flat-input ce-overwrite-input auto-derived-select" placeholder="Computed from implementation mode and residence" readonly>' +
          '<button type="button" class="ce-gear-btn" onclick="handleContractingEntityGearClick(' + idx + ')" title="Overwrite" aria-label="Overwrite">⚙</button>' +
        '</div></div>' +
        (hasContractingEntityOverwrite(p)
          ? '<div class="ce-overwrite-meta"><span class="ce-overwrite-badge">Overwritten</span><div class="ce-overwrite-note">Auto: <strong>' + esc(cleanDash(getAutoContractingEntity(p))) + '</strong> → Current: <strong>' + esc(cleanDash(getEffectiveContractingEntity(p))) + '</strong></div><div class="ce-overwrite-note">Reason: ' + esc(cleanDash(p.contractingEntityOverwriteReasonCode)) + '</div><div class="ce-overwrite-actions"><button type="button" class="small secondary" onclick="resetContractingEntityOverwrite(' + idx + ')">Reset to automatic</button></div></div>'
          : '<div class="mini-note">Assigned automatically from implementation mode and residence.</div>') +
      '</div>';

    var calculatedDetails = '' +
      field('ITR country', flatCountryInputHtml(getImplementationCountryForPosition(), 'id="computed-ITR-country-' + idx + '"', 'placeholder="From backstage ITR country" readonly', 'auto-derived-select')) +
      field('Tax status', '<input id="computed-tax-status-' + idx + '" value="' + esc(derivedCalculationValue(deriveTaxStatus(p))) + '" class="flat-input auto-derived-select' + derivedCalculationClass(deriveTaxStatus(p)) + '" placeholder="Pending calculation" readonly>') +
      field('Contracting entity', contractingEntityField) +
      field('VAT jurisdiction', '<input id="computed-vat-jurisdiction-' + idx + '" value="' + esc(derivedCalculationValue(displayVatJurisdiction(deriveVatJurisdiction(p)))) + '" class="flat-input auto-derived-select' + derivedCalculationClass(deriveVatJurisdiction(p)) + '" placeholder="Pending calculation" readonly>');

    return '<div class="details-panel flat-basics-panel flat-calculated-output-panel"><div class="flat-basics-head"><h4 class="flat-basics-title">Calculated details</h4></div><div class="flat-basics-body">' + flatBasicsGroup('Calculated details', calculatedDetails, 'flat-basics-calculated') + '</div></div>';
  }

  // Expose this helper so the active Output renderer can insert it directly.
  window.calculatedDetailsBlock = calculatedDetailsBlock;

  window.renderPositionDetails = renderPositionDetails = function(p, idx){
    var enteredDetails = '' +
      field('Position title', '<input data-idx="' + idx + '" data-field="title" value="' + esc(p.title) + '" class="flat-input" placeholder="Write position title">') +
      field('Name', '<input data-idx="' + idx + '" data-field="name" value="' + esc(p.name || '') + '" class="flat-input" placeholder="Write name">') +
      field('Country of residence', flatCountryInputHtml(p.countryOfResidence, 'data-idx="' + idx + '" data-field="countryOfResidence"', 'placeholder="Select or type a country"', '')) +
      field('Contract classification', '<select data-idx="' + idx + '" data-field="classification" class="flat-input"><option value="" ' + (!p.classification ? 'selected' : '') + '>Select contract classification</option>' + POSITION_CLASSIFICATIONS.map(function(v){ return '<option value="' + v + '" ' + (v === p.classification ? 'selected' : '') + '>' + v + '</option>'; }).join('') + '</select>') +
      field('Provider type', '<select data-idx="' + idx + '" data-field="contractualType" class="flat-input"><option value="" ' + (!p.contractualType ? 'selected' : '') + '>Select provider type</option>' + CONTRACTUAL_TYPES.map(function(v){ return '<option value="' + v + '" ' + (v === p.contractualType ? 'selected' : '') + '>' + v + '</option>'; }).join('') + '</select>') +
      field('Input mode', '<div><select data-idx="' + idx + '" data-field="inputMode" class="flat-input">' + INPUT_MODES.map(function(v){ return '<option ' + (v === p.inputMode ? 'selected' : '') + '>' + v + '</option>'; }).join('') + '</select>' + ((p.inputMode && String(p.inputMode).toLowerCase() !== 'gross') ? '<div class="inline-warning">It is recommendable to always negotiate gross. Continue only if you are sure.</div>' : '') + '</div>');

    return '<div class="details-panel flat-basics-panel"><div class="flat-basics-head"><h4 class="flat-basics-title">Basics</h4></div><div class="flat-basics-body">' + flatBasicsGroup('Entered details', enteredDetails, 'flat-basics-entered') + '</div></div>';
  };

  window.renderSmartComponentRows = renderSmartComponentRows = function(p, c, idx){
    var sections = [
      { title:'Provider remuneration', totalValue:c.remunerationTotal || 0, rows:[
        { key:'fee', label:'Base fee', rateField:'feeRate', qtyField:'feeQty', total:c.fee },
        { key:'perDiem', label:'Per diems', rateField:'perDiemRate', qtyField:'perDiemQty', total:c.perDiem },
        { key:'other', label:'Other remuneration', rateField:'otherRate', qtyField:'otherQty', total:c.other }
      ]},
      { title:'Non-remuneration costs', totalValue:c.nonRemunerationTotal || 0, rows:[
        { key:'housing', label:'Short-term accommodation', rateField:'housingRate', qtyField:'housingQty', total:c.housing },
        { key:'insurance', label:'Insurance', rateField:'insuranceRate', qtyField:'insuranceQty', total:c.insurance },
        { key:'transport', label:'Travel costs', rateField:'transportRate', qtyField:'transportQty', total:c.transport },
        { key:'otherCost', label:'Other costs', rateField:'otherCostRate', qtyField:'otherCostQty', total:c.otherCost }
      ]},
      { title:'Margin', totalValue:null, rows:[
        { key:'marginRate', label:'Margin rate', rateField:'marginRate', qtyField:'', total:(c.marginRateDecimal || 0) * 100, special:'percent' }
      ]}
    ];

    function inputWithLabel(label, html){
      return '<div><span class="component-field-label">' + label + '</span>' + html + '</div>';
    }
    function renderLine(row){
      if (row.special === 'percent'){
        return '<tr class="component-line"><td><div class="invoice-label"><div class="invoice-name">' + row.label + '</div></div></td><td><div class="component-editor component-editor-margin">' +
          inputWithLabel('Rate', '<div class="margin-rate-input-wrap"><input type="text" class="flat-input formatted-number-input" data-idx="' + idx + '" data-field="' + row.rateField + '" value="' + formatPlainNumber(p[row.rateField]) + '" placeholder="0"><span class="margin-rate-suffix">%</span></div>') +
          '<div></div><div class="component-total-wrap"><div class="component-total" id="component-total-' + idx + '-' + row.key + '">' + formatPlainNumber(row.total) + '%</div></div></div></td></tr>';
      }
      return '<tr class="component-line"><td><div class="invoice-label"><div class="invoice-name">' + row.label + '</div></div></td><td><div class="component-editor">' +
        inputWithLabel('Quantity', '<input type="text" class="flat-input formatted-number-input" data-idx="' + idx + '" data-field="' + row.qtyField + '" value="' + formatPlainNumber(p[row.qtyField]) + '">') +
        inputWithLabel('Rate', '<input type="text" class="flat-input formatted-number-input" data-idx="' + idx + '" data-field="' + row.rateField + '" value="' + formatPlainNumber(p[row.rateField]) + '">') +
        '<div class="component-total-wrap"><div class="component-total" id="component-total-' + idx + '-' + row.key + '">' + money(row.total) + '</div></div></div></td></tr>';
    }
    return '<div class="flat-subsection-head"><h4 class="flat-subsection-title">Input</h4></div><div class="component-breakdown flat-input-breakdown">' + sections.map(function(section){
      var body = section.rows.map(renderLine).join('');
      return '<div class="component-section"><div class="invoice-head"><div class="invoice-title">' + section.title + '</div></div><table class="component-table"><colgroup><col><col></colgroup><tbody><tr class="component-colhead"><td></td><td><div class="component-editor ' + (section.rows.some(function(r){ return r.special === 'percent'; }) ? 'component-editor-margin' : '') + '"><div class="component-hlabel">' + (section.rows.some(function(r){ return r.special === 'percent'; }) ? '' : 'Quantity') + '</div><div class="component-hlabel">Rate</div><div class="component-total-spacer"></div></div></td></tr>' + body + (section.totalValue === null ? '' : '<tr class="component-line total"><td><div class="invoice-label"><div class="invoice-name">Section total</div></div></td><td><div class="component-editor"><div></div><div></div><div class="component-total-wrap"><div class="component-total">' + money(section.totalValue) + '</div></div></div></td></tr>') + '</tbody></table></div>';
    }).join('') + '</div>';
  };

  // The Calculated details block is inserted directly in the active renderFlatMetrics function below.

  window.renderFlatPosition = renderFlatPosition = function(p, idx){
    var c = computePosition(p);
    var displayTitle = positionDisplayTitle(p, idx);
    if (!!p._collapsed){
      return '<div class="position is-collapsed">' + renderPositionSummary(p, idx) + '</div>';
    }
    return '<div class="position flat-workspace-position"><div class="top-actions flat-workspace-header"><div><h4>' + esc(displayTitle) + '</h4></div><div class="position-tools"><button class="small primary" onclick="saveFlat(' + idx + ')">' + (p._saved ? 'Save position' : 'Save changes') + '</button><button class="secondary small" onclick="event.stopPropagation(); removeFlat(' + idx + ')">Remove</button></div></div><div class="position-open-shell flat-workspace-shell"><aside class="flat-workspace-left" aria-label="Inputs"><div class="flat-workspace-panel-title">Inputs</div>' + renderPositionDetails(p, idx) + renderSmartComponentRows(p, c, idx) + '</aside><section class="flat-workspace-right" aria-label="Calculation output">' + renderFlatMetrics(c, idx) + '</section></div></div>';
  };
})();
<\/script>







<style id="inputs-assumptions-plus-20-v5">
/* User request: increase the Inputs panel by 20%. */
@media (min-width:1101px){
  .flat-workspace-shell{
    grid-template-columns:minmax(460px,548px) minmax(0,1fr)!important;
  }
  .flat-workspace-left{
    width:100%!important;
  }
}
</style>


<style id="mi-half-screen-layout-v6">
/* FINAL LAYOUT FIX: Inputs take the left half, Output takes the right half. */
@media (min-width:1101px){
  #stepContent .flat-workspace-shell{
    display:grid!important;
    grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
    gap:20px!important;
    align-items:start!important;
    width:100%!important;
    max-width:none!important;
  }
  #stepContent .flat-workspace-left,
  #stepContent .flat-workspace-right{
    width:100%!important;
    max-width:none!important;
    min-width:0!important;
    box-sizing:border-box!important;
  }
  #stepContent .flat-workspace-left{
    position:sticky!important;
    top:24px!important;
    max-height:calc(100vh - 48px)!important;
    overflow:auto!important;
  }
  #stepContent .flat-workspace-right{
    overflow:visible!important;
  }
}
@media (max-width:1100px){
  #stepContent .flat-workspace-shell{
    display:grid!important;
    grid-template-columns:1fr!important;
    gap:16px!important;
  }
  #stepContent .flat-workspace-left{
    position:relative!important;
    top:auto!important;
    max-height:none!important;
    overflow:visible!important;
  }
}
/* Keep Qty and Rate usable inside the left half. */
#stepContent .flat-workspace-left .mi-cost-breakdown{
  display:grid!important;
  gap:14px!important;
  width:100%!important;
  overflow:visible!important;
}
#stepContent .flat-workspace-left .mi-cost-section{
  width:100%!important;
  max-width:none!important;
  overflow:hidden!important;
}
#stepContent .flat-workspace-left .mi-cost-row{
  display:grid!important;
  grid-template-columns:minmax(170px,1.25fr) minmax(95px,.75fr) minmax(110px,.85fr) minmax(120px,.9fr)!important;
  gap:12px!important;
  align-items:end!important;
  width:100%!important;
  max-width:none!important;
  box-sizing:border-box!important;
}
#stepContent .flat-workspace-left .mi-cost-field,
#stepContent .flat-workspace-left .mi-cost-total-cell,
#stepContent .flat-workspace-left .mi-cost-label-cell{
  min-width:0!important;
  width:100%!important;
  box-sizing:border-box!important;
}
#stepContent .flat-workspace-left .mi-cost-field input{
  width:100%!important;
  min-width:0!important;
  max-width:none!important;
}
#stepContent .flat-workspace-left .mi-cost-total{
  white-space:nowrap!important;
  overflow:hidden!important;
  text-overflow:ellipsis!important;
}
@media (max-width:1280px){
  #stepContent .flat-workspace-left .mi-cost-row{
    grid-template-columns:minmax(0,1fr) minmax(92px,.55fr) minmax(104px,.6fr)!important;
  }
  #stepContent .flat-workspace-left .mi-cost-total-cell{
    grid-column:1/-1!important;
    display:flex!important;
    justify-content:space-between!important;
    align-items:center!important;
    padding-top:2px!important;
  }
}
@media (max-width:700px){
  #stepContent .flat-workspace-left .mi-cost-row{
    grid-template-columns:1fr!important;
  }
}
</style>
<script id="mi-half-screen-layout-v6-script">
(function(){
  function applyHalfScreenLayout(){
    document.querySelectorAll('#stepContent .flat-workspace-shell').forEach(function(shell){
      shell.style.setProperty('display','grid','important');
      if (window.innerWidth > 1100) {
        shell.style.setProperty('grid-template-columns','minmax(0,1fr) minmax(0,1fr)','important');
        shell.style.setProperty('gap','20px','important');
      } else {
        shell.style.setProperty('grid-template-columns','1fr','important');
        shell.style.setProperty('gap','16px','important');
      }
    });
  }
  window.addEventListener('resize', applyHalfScreenLayout);
  var oldRender = window.renderFlatPosition;
  if (typeof oldRender === 'function') {
    window.renderFlatPosition = function(){
      var result = oldRender.apply(this, arguments);
      setTimeout(applyHalfScreenLayout, 0);
      return result;
    };
    try { renderFlatPosition = window.renderFlatPosition; } catch(e) {}
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHalfScreenLayout);
  } else {
    applyHalfScreenLayout();
  }
})();
<\/script>

</body></html>`;
}

function downloadContract(idx){
  const p = flatRates[idx];
  if (!p) return;
  const html = buildContractHtml(p, idx);
  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = buildContractFileName(p, idx);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function renderStepsBar(){
  const stepsEl = document.getElementById("stepsBar");
  if (!stepsEl) return;
  if (currentStep === 0){
    stepsEl.innerHTML = "";
    return;
  }
  stepsEl.innerHTML = STEP_TITLES.map((title, idx) => {
    const step = idx + 1;
    const cls = step === currentStep ? "step active" : step < currentStep ? "step done" : "step";
    return `<div class="${cls}" onclick="goToStep(${step})"><div class="label">${title}</div></div>`;
  }).join("");
}

function updateProgress(){
  const total = STEP_TITLES.length;
  const pct = currentStep === 0 ? 0 : Math.round((currentStep / total) * 100);
  const bar = document.getElementById("barFill");
  if (bar) bar.style.width = `${pct}%`;
  const pill = document.getElementById("progressPill");
  if (pill) pill.textContent = currentStep === 0 ? "" : `Step ${currentStep} of ${total}`;
  const label = document.getElementById("progressLabel");
  if (label) label.textContent = currentStep === 0 ? "" : (showBackstage ? "Backstage" : (pct === 100 ? "Completed" : "Progress"));
}

function navButtons(){
  return `<div class="wizard-nav"><button class="secondary" onclick="prevStep()" ${currentStep===1?'disabled':''}>Back</button><button onclick="nextStep()" ${currentStep===6?'disabled':''}>Next</button></div>`;
}

function field(label, inner){
  const cls = label === "Position title" ? "position-title-label" : "";
  return `<div><label class="${cls}">${label}</label>${inner}</div>`;
}

function renderLandingPage(){
  return `<div class="intro-splash"><div class="intro-splash-card"><img alt="Company logo" class="intro-splash-logo" src="${document.querySelector('.logo')?.src || ''}"/><h1 class="intro-splash-title">MarginIQ</h1><div class="intro-splash-subtitle">For smart margin decisions</div><div class="intro-splash-actions"><div class="intro-field"><select id="introUserLanding"><option ${intro.userType==="Consultant"?'selected':''}>Consultant</option><option ${intro.userType==="ITR"?'selected':''}>ITR</option></select></div><button class="intro-start-btn" onclick="startApp()">Start</button></div></div></div>`;
}

function startApp(){
  const user = document.getElementById("introUserLanding");
  if (user) intro.userType = user.value;
  currentStep = 1;
  showBackstage = false;
  renderAll();
}

function renderStep1(){
  return `<div class="card"><h2>Introduction</h2><p>Description and user logging.</p><div class="row cols-3">
      ${field("User", `<select id="introUser"><option ${intro.userType==="Consultant"?'selected':''}>Consultant</option><option ${intro.userType==="ITR"?'selected':''}>ITR</option></select>`)}
      ${field("Application name", `<input id="introAppName" value="${esc(intro.appName)}">`)}
      <div style="padding-top:26px;color:#6b7280;font-size:14px">Only 2 users now with no password: Consultant and ITR.</div></div>
    ${navButtons()}
  </div>`;
}

function renderYesNoSelect(id, value){
  return `<select id="${id}"><option value="true" ${value ? 'selected' : ''}>Yes</option><option value="false" ${!value ? 'selected' : ''}>No</option></select>`;
}

function renderLockedYesNoSelect(id, value){
  return `<select id="${id}" disabled data-auto-derived="true" class="auto-derived-select"><option value="true" ${value ? 'selected' : ''}>Yes</option><option value="false" ${!value ? 'selected' : ''}>No</option></select>`;
}

function renderRateInput(id, value){
  return `<input id="${id}" type="number" step="0.01" value="${value}">`;
}

function availableCountryValues(){
  const datalist = document.getElementById("countryOptions");
  if (!datalist) return [];
  return Array.from(datalist.querySelectorAll("option"))
    .map(opt => String(opt.value || '').trim())
    .filter(Boolean);
}

function countryOptionsForMultiSelect(){
  return availableCountryValues()
    .map(value => `<option value="${esc(value)}" ${backstage.doubleTaxAgreementCountries.includes(value) ? 'selected' : ''}>${esc(value)}</option>`)
    .join("");
}

function renderDoubleTaxAgreementBlocks(){
  return buildDtaRegionGroups()
    .map(({ region, countries }) => `
      <div class="backstage-region-group"><div class="backstage-region-title">${esc(region)}</div><div class="backstage-country-blocks">
          ${countries.map(value => {
            const selected = backstage.doubleTaxAgreementCountries.includes(value);
            return `<button type="button" class="backstage-country-block ${selected ? 'selected' : ''}" data-dta-country="${esc(value)}" aria-pressed="${selected ? 'true' : 'false'}">${esc(value)}</button>`;
          }).join("")}
        </div></div>
    `)
    .join("");
}

const DTA_REGION_ORDER = [
  "Europe & Central Asia",
  "Middle East & North Africa",
  "Sub-Saharan Africa",
  "South Asia",
  "East Asia & Pacific",
  "Latin America & Caribbean",
  "North America"
];

const DTA_REGION_MAP = {
  "Uzbekistan": "Europe & Central Asia",
  "Kyrgyzstan": "Europe & Central Asia",
  "Morocco": "Middle East & North Africa",
  "Viet Nam": "East Asia & Pacific",
  "Egypt": "Middle East & North Africa",
  "India": "South Asia",
  "Armenia": "Europe & Central Asia",
  "Ethiopia": "Sub-Saharan Africa",
  "Uganda": "Sub-Saharan Africa",
  "Burundi": "Sub-Saharan Africa",
  "Lesotho": "Sub-Saharan Africa",
  "Namibia": "Sub-Saharan Africa",
  "Tanzania": "Sub-Saharan Africa",
  "Ghana": "Sub-Saharan Africa",
  "Zambia": "Sub-Saharan Africa",
  "Bosnia and Herzegovina": "Europe & Central Asia",
  "Tajikistan": "Europe & Central Asia",
  "Tunisia": "Middle East & North Africa",
  "Jordan": "Middle East & North Africa",
  "Togo": "Sub-Saharan Africa",
  "Nepal": "South Asia",
  "Mauritius": "Sub-Saharan Africa",
  "Kenya": "Sub-Saharan Africa",
  "Bangladesh": "South Asia",
  "Ecuador": "Latin America & Caribbean",
  "Serbia": "Europe & Central Asia",
  "Malawi": "Sub-Saharan Africa",
  "Moldova": "Europe & Central Asia",
  "Bolivia": "Latin America & Caribbean",
  "Senegal": "Sub-Saharan Africa",
  "Algeria": "Middle East & North Africa",
  "Poland": "Europe & Central Asia",
  "South Africa": "Sub-Saharan Africa",
  "Mali": "Sub-Saharan Africa",
  "Albania": "Europe & Central Asia",
  "Estonia": "Europe & Central Asia",
  "Latvia": "Europe & Central Asia",
  "Lithuania": "Europe & Central Asia",
  "Kazakhstan": "Europe & Central Asia",
  "Peru": "Latin America & Caribbean",
  "Azerbaijan": "Europe & Central Asia",
  "Georgia": "Europe & Central Asia",
  "South Sudan": "Sub-Saharan Africa",
  "Kosovo": "Europe & Central Asia",
  "Ukraine": "Europe & Central Asia",
  "Saint Lucia": "Latin America & Caribbean",
  "North Macedonia": "Europe & Central Asia",
  "Germany": "Europe & Central Asia",
  "Cameroon": "Sub-Saharan Africa",
  "Pakistan": "South Asia",
  "Benin": "Sub-Saharan Africa",
  "Mexico": "Latin America & Caribbean",
  "Rwanda": "Sub-Saharan Africa",
  "CÃ´te d'Ivoire": "Sub-Saharan Africa",
  "Colombia": "Latin America & Caribbean",
  "Indonesia": "East Asia & Pacific",
  "Greece": "Europe & Central Asia",
  "Nigeria": "Sub-Saharan Africa",
  "Costa Rica": "Latin America & Caribbean",
  "Yemen": "Middle East & North Africa",
  "Libya": "Middle East & North Africa",
  "Lebanon": "Middle East & North Africa",
  "Mongolia": "East Asia & Pacific",
  "Philippines": "East Asia & Pacific",
  "West Bank and Gaza": "Middle East & North Africa",
  "Montenegro": "Europe & Central Asia",
  "Niger": "Sub-Saharan Africa",
  "Thailand": "East Asia & Pacific",
  "Myanmar": "East Asia & Pacific",
  "Mozambique": "Sub-Saharan Africa",
  "Burkina Faso": "Sub-Saharan Africa",
  "Croatia": "Europe & Central Asia",
  "Brazil": "Latin America & Caribbean",
  "Belize": "Latin America & Caribbean",
  "Dominican Republic": "Latin America & Caribbean",
  "Jamaica": "Latin America & Caribbean",
  "Bulgaria": "Europe & Central Asia",
  "Romania": "Europe & Central Asia",
  "Sri Lanka": "South Asia",
  "Slovenia": "Europe & Central Asia",
  "Cambodia": "East Asia & Pacific",
  "Ãland Islands": "Europe & Central Asia",
  "Iraq": "Middle East & North Africa",
  "Cyprus": "Europe & Central Asia",
  "Honduras": "Latin America & Caribbean",
  "Gambia": "Sub-Saharan Africa",
  "Guinea": "Sub-Saharan Africa",
  "Sierra Leone": "Sub-Saharan Africa",
  "Madagascar": "Sub-Saharan Africa",
  "Turkiye": "Europe & Central Asia",
  "Papua New Guinea": "East Asia & Pacific",
  "Belarus": "Europe & Central Asia",
  "Mauritania": "Sub-Saharan Africa",
  "Angola": "Sub-Saharan Africa",
  "Paraguay": "Latin America & Caribbean",
  "Argentina": "Latin America & Caribbean",
  "Chile": "Latin America & Caribbean",
  "Canada": "North America",
  "Guatemala": "Latin America & Caribbean",
  "Gabon": "Sub-Saharan Africa",
  "Botswana": "Sub-Saharan Africa",
  "China": "East Asia & Pacific",
  "Comoros": "Sub-Saharan Africa",
  "Afghanistan": "South Asia",
  "Barbados": "Latin America & Caribbean",
  "Aruba": "Latin America & Caribbean",
  "Lao PDR": "East Asia & Pacific",
  "Nicaragua": "Latin America & Caribbean",
  "Saint Kitts and Nevis": "Latin America & Caribbean",
  "Vanuatu": "East Asia & Pacific",
  "Chad": "Sub-Saharan Africa",
  "Timor-Leste": "East Asia & Pacific",
  "Fiji": "East Asia & Pacific",
  "Belgium": "Europe & Central Asia",
  "Panama": "Latin America & Caribbean",
  "Luxembourg": "Europe & Central Asia",
  "Liberia": "Sub-Saharan Africa",
  "Congo, Dem. Rep.": "Sub-Saharan Africa",
  "El Salvador": "Latin America & Caribbean",
  "Trinidad and Tobago": "Latin America & Caribbean",
  "Malaysia": "East Asia & Pacific",
  "Somalia": "Sub-Saharan Africa",
  "Sudan": "Middle East & North Africa",
  "Syrian Arab Republic": "Middle East & North Africa",
  "Eswatini": "Sub-Saharan Africa",
  "Cook Islands": "East Asia & Pacific",
  "Central African Republic": "Sub-Saharan Africa",
  "Russian Federation": "Europe & Central Asia",
  "SÃ£o TomÃ© and PrÃ­ncipe": "Sub-Saharan Africa",
  "Congo, Rep.": "Sub-Saharan Africa",
  "United Kingdom": "Europe & Central Asia",
  "Zimbabwe": "Sub-Saharan Africa",
  "Equatorial Guinea": "Sub-Saharan Africa",
  "Brunei": "East Asia & Pacific",
  "Cabo Verde": "Sub-Saharan Africa",
  "Djibouti": "Sub-Saharan Africa",
  "Guyana": "Latin America & Caribbean",
  "Switzerland": "Europe & Central Asia",
  "Andorra": "Europe & Central Asia",
  "Grenada": "Latin America & Caribbean",
  "Saint Vincent and the Grenadines": "Latin America & Caribbean",
  "Guinea-Bissau": "Sub-Saharan Africa",
  "Bhutan": "South Asia",
  "Austria": "Europe & Central Asia",
  "Czechia": "Europe & Central Asia",
  "Hungary": "Europe & Central Asia",
  "Suriname": "Latin America & Caribbean",
  "Venezuela (Bolivarian Republic of)": "Latin America & Caribbean",
  "Slovakia": "Europe & Central Asia",
  "Cuba": "Latin America & Caribbean",
  "Haiti": "Latin America & Caribbean",
  "Italy": "Europe & Central Asia",
  "France": "Europe & Central Asia",
  "Ireland": "Europe & Central Asia",
  "Portugal": "Europe & Central Asia",
  "Kiribati": "East Asia & Pacific",
  "Uruguay": "Latin America & Caribbean",
  "Saudi Arabia": "Middle East & North Africa",
  "United States": "North America",
  "Turkmenistan": "Europe & Central Asia",
  "Korea, Rep.": "East Asia & Pacific",
  "Iran, Islamic Rep.": "Middle East & North Africa",
  "New Zealand": "East Asia & Pacific",
  "Dominica": "Latin America & Caribbean",
  "Guadeloupe": "Latin America & Caribbean",
  "Denmark": "Europe & Central Asia",
  "Eritrea": "Sub-Saharan Africa",
  "Greenland": "North America",
  "Saint Pierre and Miquelon": "North America",
  "Seychelles": "Sub-Saharan Africa",
  "Israel": "Middle East & North Africa",
  "Anguilla": "Latin America & Caribbean",
  "Japan": "East Asia & Pacific",
  "Taiwan": "East Asia & Pacific",
  "Korea, Dem. People's Rep.": "East Asia & Pacific",
  "Tuvalu": "East Asia & Pacific",
  "New Caledonia": "East Asia & Pacific",
  "Norway": "Europe & Central Asia",
  "United Arab Emirates": "Middle East & North Africa",
  "Wallis and Futuna Islands": "East Asia & Pacific",
  "Solomon Islands": "East Asia & Pacific",
  "Turks and Caicos Islands": "Latin America & Caribbean",
  "Maldives": "South Asia",
  "Iceland": "Europe & Central Asia",
  "Australia": "East Asia & Pacific",
  "Hong Kong": "East Asia & Pacific",
  "Singapore": "East Asia & Pacific",
  "Marshall Islands": "East Asia & Pacific",
  "Micronesia": "East Asia & Pacific",
  "Palau": "East Asia & Pacific",
  "Antigua and Barbuda": "Latin America & Caribbean",
  "Netherlands": "Europe & Central Asia",
  "Qatar": "Middle East & North Africa",
  "Sweden": "Europe & Central Asia",
  "Western Sahara": "Middle East & North Africa",
  "Faroe Islands": "Europe & Central Asia",
  "Malta": "Europe & Central Asia"
};

function buildDtaRegionGroups(){
  const available = availableCountryValues()
    .filter(country => country && country !== 'multi-country' && country !== 'Worldwide');

  const groups = new Map();
  DTA_REGION_ORDER.forEach(region => groups.set(region, []));
  const fallback = [];

  available.forEach(country => {
    const region = DTA_REGION_MAP[country];
    if (!region) {
      fallback.push(country);
      return;
    }
    groups.get(region).push(country);
  });

  const ordered = [];
  DTA_REGION_ORDER.forEach(region => {
    const countries = (groups.get(region) || []).slice().sort((a, b) => a.localeCompare(b));
    if (countries.length) ordered.push({ region, countries });
  });
  if (fallback.length) {
    ordered.push({ region: 'Unsorted', countries: fallback.slice().sort((a, b) => a.localeCompare(b)) });
  }
  return ordered;
}

function backstageSummaryValue(value, fallback='Not set'){
  return value ? esc(value) : fallback;
}

function backstageTaxCard(title, fieldsMarkup){
  return `<div class="backstage-tax-card"><div class="backstage-tax-card-title">${title}</div><div class="backstage-tax-grid">${fieldsMarkup}</div></div>`;
}

function renderWithholdingSplitCard({ title, hqApplicableId, hqApplicableValue, branchApplicableId, branchApplicableValue, rateId, rateValue, exemptionId, exemptionValue, grossedUpId, grossedUpValue, reimbursableId, reimbursableValue, grossUpNote = "" }){
  return backstageTaxCard(title, `
    ${field("Contract: Headquarters", renderYesNoSelect(hqApplicableId, hqApplicableValue))}
    ${field("Contract: Branch", renderYesNoSelect(branchApplicableId, branchApplicableValue))}
    ${field("Rate %", renderRateInput(rateId, rateValue))}
    ${field("Exempt", renderYesNoSelect(exemptionId, exemptionValue))}
    ${field("Gross-up (net input mode)", renderLockedYesNoSelect(grossedUpId, grossedUpValue))}${grossUpNote ? `<div class="backstage-note backstage-note-tight">${grossUpNote}</div>` : ""}
    ${field("Reimb.", renderYesNoSelect(reimbursableId, reimbursableValue))}
  `);
}

function getContractingLogicSummary(mode){
  const value = String(mode || "").trim();
  if (value === "No Branch"){
    return {
      modeLabel: "No Branch",
      title: "",
      copy: "",
      resident: "Headquarters",
      nonResident: "Headquarters",
      activeKey: "no-branch"
    };
  }
  if (value === "Branch performs contract"){
    return {
      modeLabel: "Branch performs contract",
      title: "",
      copy: "",
      resident: "Branch",
      nonResident: "Branch",
      activeKey: "branch-contract"
    };
  }
  if (value === "Branch for local support"){
    return {
      modeLabel: "Branch for local support",
      title: "",
      copy: "",
      resident: "Branch",
      nonResident: "Headquarters",
      activeKey: "local-support"
    };
  }
  return {
    modeLabel: "Not set",
    title: "Choose an implementation mode",
    copy: "Once you choose the implementation mode, the contracting entity logic will update here automatically.",
    resident: "â",
    nonResident: "â",
    activeKey: ""
  };
}

function renderContractingEntityLogicCard(){
  const summary = getContractingLogicSummary(backstage.implementationMode);
  const outcomeTag = (value) => `<span class="node-outcome-value ${value === 'Branch' ? 'branch' : 'hq'}">${esc(value)}</span>`;
  const modeCard = ({key, kicker, title, sub, resident, nonResident}) => `
    <div class="contracting-flow-node ${summary.activeKey === key ? 'active' : ''}" data-logic-key="${key}"><div class="node-active-pill">Selected</div><div class="node-kicker">${kicker}</div><div class="node-title">${title}</div><div class="node-sub">${sub}</div><div class="node-selected"><div class="node-selected-title">Contracting outcome</div><div class="node-outcome-row"><div class="node-outcome-label">Resident provider</div>
          ${outcomeTag(resident)}
        </div><div class="node-outcome-row"><div class="node-outcome-label">Non-resident provider</div>
          ${outcomeTag(nonResident)}
        </div></div></div>`;
  return `<div class="backstage-tax-card backstage-tax-card-wide contracting-logic-card" id="contractingLogicCard"><div class="contracting-flow"><div class="contracting-flow-grid">
        ${modeCard({key:'no-branch', kicker:'Mode 1', title:'No Branch', sub:'No branch in ITR country.', resident:'Headquarters', nonResident:'Headquarters'})}
        ${modeCard({key:'branch-contract', kicker:'Mode 2', title:'Branch performs contract', sub:'Branch is the contracting entity for all providers.', resident:'Branch', nonResident:'Branch'})}
        ${modeCard({key:'local-support', kicker:'Mode 3', title:'Branch for local support', sub:'Branch supports local implementation, but only residents contract there.', resident:'Branch', nonResident:'Headquarters'})}
      </div></div></div>`;
}

function updateContractingLogicCardDOM(){
  const summary = getContractingLogicSummary(backstage.implementationMode);
  const modeLabel = document.getElementById('contractingLogicModeLabel');
  const title = document.getElementById('contractingLogicTitle');
  const copy = document.getElementById('contractingLogicCopy');
  if (modeLabel) modeLabel.textContent = summary.modeLabel;
  if (title) title.textContent = summary.title;
  if (copy) copy.textContent = summary.copy;
  document.querySelectorAll('[data-logic-key]').forEach((node) => {
    node.classList.toggle('active', node.getAttribute('data-logic-key') === summary.activeKey);
  });
}

function fullTaxRulesEditing(){
  return !!window.__fullTaxRulesAdvancedEdit;
}
function ruleBoolSpan(value){
  return `<span class="rule-value ${value ? "yes" : "no"}">${value ? "Yes" : "No"}</span>`;
}
function ruleTextSpan(value, extraClass=""){
  return `<span class="rule-value ${extraClass}">${esc(String(value ?? ""))}</span>`;
}
function ruleRateSpan(value){
  const num = n(value);
  return `<span class="rule-value rate">${esc(formatPlainNumber(num))}</span>`;
}

function renderDeductionMatrixRow(providerLabel, deductionLabel, { applicableId, applicableValue, rateId, rateValue, exemptionId, exemptionValue, grossedUpId, grossedUpValue, reimbursableId, reimbursableValue, lockApplicability = false, forceGrossUpLocked = false }){
  const isApplicable = !!applicableValue;
  const disabledDependent = isApplicable ? "" : " disabled";
  const disabledClass = isApplicable ? "" : ' class="is-disabled"';
  const applyDisabled = lockApplicability ? ' disabled data-auto-derived="true" class="auto-derived-select"' : "";
  const grossUpDisabled = (!isApplicable || forceGrossUpLocked) ? " disabled" : "";
  const grossUpClass = forceGrossUpLocked ? ' class="auto-derived-select"' : "";
  const applySelect = `<select id="${applicableId}"${applyDisabled}><option value="true" ${isApplicable ? "selected" : ""}>Yes</option><option value="false" ${!isApplicable ? "selected" : ""}>No</option></select>`;
  const grossUpSelect = `<select id="${grossedUpId}"${grossUpDisabled}${grossUpClass}><option value="true" ${grossedUpValue ? "selected" : ""}>Yes</option><option value="false" ${!grossedUpValue ? "selected" : ""}>No</option></select>`;
  const applyCell = `${ruleBoolSpan(isApplicable)}${applySelect}`;
  const rateCell = `${ruleRateSpan(rateValue)}<input class="rate-input" id="${rateId}" type="number" step="0.01" value="${rateValue}"${disabledDependent}>`;
  const exemptionCell = `${ruleBoolSpan(exemptionValue)}<select id="${exemptionId}"${disabledDependent}><option value="true" ${exemptionValue ? "selected" : ""}>Yes</option><option value="false" ${!exemptionValue ? "selected" : ""}>No</option></select>`;
  const grossUpCell = `${ruleBoolSpan(grossedUpValue)}${grossUpSelect}`;
  const reimbCell = `${ruleBoolSpan(reimbursableValue)}<select id="${reimbursableId}"${disabledDependent}><option value="true" ${reimbursableValue ? "selected" : ""}>Yes</option><option value="false" ${!reimbursableValue ? "selected" : ""}>No</option></select>`;
  return `
    <tr${disabledClass}><td class="provider-cell">${esc(providerLabel)}</td><td class="deduction-cell">${esc(deductionLabel)}</td><td>${applyCell}</td><td>${rateCell}</td><td>${exemptionCell}</td><td>${grossUpCell}</td><td>${reimbCell}</td></tr>
  `;
}

function directTaxValuesForMode(config, forceNo = false){
  if (!forceNo) return config;
  return {
    ...config,
    applicableValue: false,
    rateValue: 0,
    exemptionValue: false,
    grossedUpValue: false,
    reimbursableValue: false,
    lockApplicability: true,
    forceGrossUpLocked: true
  };
}

function resetBranchOtherDeductionsDefaults(){
  [
    "residentBranchAnotherDirectTax",
    "nonResidentBranchAnotherDirectTax"
  ].forEach((prefix) => {
    backstage[prefix + "Applicable"] = false;
    backstage[prefix + "Rate"] = 0;
    backstage[prefix + "Exemption"] = false;
    backstage[prefix + "GrossedUp"] = false;
    backstage[prefix + "Reimbursable"] = false;
  });
}

function normalizedDeductionConfigsForContract({ residencyKey, withholdingConfig, anotherConfig, forceNo = false }){
  const isResident = residencyKey === "resident";
  const forceMode3NonResidentGrossUpNo = residencyKey === "nonResident" && String(backstage.implementationMode || "").trim() === "Branch for local support";
  const forceResidentGrossUpNo = isResident;

  const whtConfig = directTaxValuesForMode({
    ...withholdingConfig,
    lockApplicability: true,
    forceGrossUpLocked: forceNo || forceMode3NonResidentGrossUpNo || forceResidentGrossUpNo
  }, forceNo);
  if (forceNo || forceMode3NonResidentGrossUpNo || forceResidentGrossUpNo) {
    whtConfig.grossedUpValue = false;
  }

  const otherDirectConfig = directTaxValuesForMode({
    ...anotherConfig,
    forceGrossUpLocked: forceNo || forceResidentGrossUpNo
  }, forceNo);
  if (forceNo || forceResidentGrossUpNo) {
    otherDirectConfig.grossedUpValue = false;
  }

  return { whtConfig, otherDirectConfig };
}

function renderDeductionsMatrixTable(rows){
  return `
    <div class="deductions-matrix-wrap"><table class="deductions-matrix"><colgroup><col style="width:18%"><col style="width:22%"><col style="width:10%"><col style="width:12%"><col style="width:11%"><col style="width:15%"><col style="width:12%"></colgroup><thead><tr><th>Provider type</th><th>Deduction</th><th>Apply</th><th>Rate %</th><th>Exempt</th><th>Gross-up</th><th>Reimb.</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>
  `;
}

function taxBoolText(value){ return value ? `<span class="yes">Yes</span>` : `<span class="no">No</span>`; }
function taxCompactBool(value){ return value ? `<span class="tax-var-yes">Yes</span>` : `<span class="tax-var-no">No</span>`; }
function taxSummaryDirectRow(label, cfg, forceNo = false){
  const apply = forceNo ? false : !!cfg.applicableValue;
  const rate = forceNo ? 0 : cfg.rateValue;
  const exempt = forceNo ? false : !!cfg.exemptionValue;
  const gross = forceNo ? false : !!cfg.grossedUpValue;
  const reimb = forceNo ? false : !!cfg.reimbursableValue;
  return `<tr><td class="tax-var-name">${esc(label)}</td><td>${taxCompactBool(apply)}</td><td class="tax-var-rate">${esc(formatPlainNumber(rate))}%</td><td>${taxCompactBool(exempt)}</td><td>${taxCompactBool(gross)}</td><td>${taxCompactBool(reimb)}</td></tr>`;
}
function taxSummaryIndirectRow(label, values, forceNo = false){
  const v = forceNo ? {apply:false, exempt:false, reverse:false, offset:false, reimb:false} : values;
  return `<tr><td class="tax-var-name">${esc(label)}</td><td>${taxCompactBool(v.apply)}</td><td>${taxCompactBool(v.exempt)}</td><td>${taxCompactBool(v.reverse)}</td><td>${taxCompactBool(v.offset)}</td><td>${taxCompactBool(v.reimb)}</td></tr>`;
}
function taxRateText(value){ return `${esc(formatPlainNumber(n(value)))}%`; }
function taxRuleCell(v){ return `<div class="tax-rule-cell"><div class="tax-rule-line"><span>Apply</span><strong>${taxBoolText(v.applicableValue)}</strong></div><div class="tax-rule-line"><span>Rate</span><strong>${taxRateText(v.rateValue)}</strong></div><div class="tax-rule-line"><span>Exempt</span><strong>${taxBoolText(v.exemptionValue)}</strong></div><div class="tax-rule-line"><span>Gross-up</span><strong>${taxBoolText(v.grossedUpValue)}</strong></div><div class="tax-rule-line"><span>Reimb.</span><strong>${taxBoolText(v.reimbursableValue)}</strong></div></div>`; }
function taxVatCard(label, values, rateLabel){ return `<div class="tax-vat-card"><div class="tax-vat-title">${esc(label)}</div><div class="tax-vat-grid"><div><span>Apply</span><strong>${taxBoolText(values.applicable)}</strong></div><div><span>Rate</span><strong>${esc(rateLabel || taxRateText((values.rate || 0) * 100))}</strong></div><div><span>Exempt</span><strong>${taxBoolText(values.exemption)}</strong></div><div><span>Reverse charge</span><strong>${taxBoolText(values.reverseCharge)}</strong></div><div><span>Offset</span><strong>${taxBoolText(values.offset)}</strong></div><div><span>Reimb.</span><strong>${taxBoolText(values.reimbursable)}</strong></div></div></div>`; }
function taxOutcomeCard(label, value, meta, cls=""){ return `<div class="tax-outcome-card ${cls}"><div class="tax-outcome-label">${esc(label)}</div><div class="tax-outcome-value">${value}</div>${meta ? `<div class="tax-outcome-meta">${esc(meta)}</div>` : ""}</div>`; }

function niceTaxValue(value, extraClass=""){
  const raw = String(value || "").trim();
  const low = raw.toLowerCase();
  const yn = low === "yes" ? "yes" : (low === "no" ? "no" : "");
  return `<span class="nice-tax-value ${yn} ${extraClass}">${esc(raw)}</span>`;
}
function niceTaxBool(value){ return niceTaxValue(value ? "Yes" : "No"); }
function renderNiceTaxCard(title, rows){
  return `<div class="nice-tax-card"><h4 class="nice-tax-card-title">${esc(title)}</h4><table class="nice-tax-table"><tbody>${rows.map(r => `<tr><td class="nice-tax-label">${esc(r[0])}</td><td>${r[1]}</td></tr>`).join("")}</tbody></table></div>`;
}
function renderNiceDirectTaxCard(title, cfg, forceNo=false){
  const isWithholding = String(title || "").toLowerCase().includes("withholding tax");
  const inputLabel = "(2)";

  if (forceNo) {
    if (isWithholding) {
      return renderNiceTaxCard(title, [
        ["Apply", niceTaxValue("No")],
        ["Rate %", niceTaxValue(inputLabel)],
        ["Exempt", niceTaxValue(inputLabel)],
        ["Gross-up", niceTaxValue("No")],
        ["Reimb.", niceTaxValue(inputLabel)]
      ]);
    }
    return renderNiceTaxCard(title, [
      ["Apply", niceTaxValue("No")],
      ["Rate %", niceTaxValue("No")],
      ["Exempt", niceTaxValue("No")],
      ["Gross-up", niceTaxValue("No")],
      ["Reimb.", niceTaxValue("No")]
    ]);
  }

  const apply = !!cfg.applicableValue;
  if (isWithholding) {
    const isNonResident = String(title || "").toLowerCase().includes("non-resident");
    return renderNiceTaxCard(title, [
      ["Apply", niceTaxValue(apply ? "Yes" : "No")],
      ["Rate %", niceTaxValue(inputLabel)],
      ["Exempt", niceTaxValue(inputLabel)],
      ["Gross-up", niceTaxValue(isNonResident ? "Yes" : "No")],
      ["Reimb.", niceTaxValue(inputLabel)]
    ]);
  }

  const rate = cfg.rateValue;
  const exempt = !!cfg.exemptionValue;
  const gross = !!cfg.grossedUpValue;
  const reimb = !!cfg.reimbursableValue;
  return renderNiceTaxCard(title, [
    ["Apply", niceTaxBool(apply)],
    ["Rate %", niceTaxValue(formatPlainNumber(rate), "rate")],
    ["Exempt", niceTaxBool(exempt)],
    ["Gross-up", niceTaxBool(gross)],
    ["Reimb.", niceTaxBool(reimb)]
  ]);
}

function renderNiceIndirectTaxCard(title, values, forceNo=false){
  const v = forceNo ? {apply:false, exempt:false, reverse:false, offset:false, reimb:false} : values;
  return renderNiceTaxCard(title, [
    ["Apply", niceTaxBool(!!v.apply)],
    ["Exempt", niceTaxBool(!!v.exempt)],
    ["Reverse", niceTaxBool(!!v.reverse)],
    ["Offset", niceTaxBool(!!v.offset)],
    ["Reimb.", niceTaxBool(!!v.reimb)]
  ]);
}

function renderDeductionsMatrixForContract({ residentDirectConfig, residentAnotherConfig, nonResidentDirectConfig, nonResidentAnotherConfig, forceDirectNo = false }){
  const resident = normalizedDeductionConfigsForContract({ residencyKey: "resident", withholdingConfig: residentDirectConfig, anotherConfig: residentAnotherConfig, forceNo: forceDirectNo });
  const nonResident = normalizedDeductionConfigsForContract({ residencyKey: "nonResident", withholdingConfig: nonResidentDirectConfig, anotherConfig: nonResidentAnotherConfig, forceNo: forceDirectNo });
  const withholdingRows = [renderDeductionMatrixRow("Residents", "Withholding tax", resident.whtConfig), renderDeductionMatrixRow("Non-residents", "Withholding tax", nonResident.whtConfig)];
  const otherRows = [renderDeductionMatrixRow("Residents", "Other deductions", resident.otherDirectConfig), renderDeductionMatrixRow("Non-residents", "Other deductions", nonResident.otherDirectConfig)];
  return `
    <section class="tax-workbook-section"><div class="tax-workbook-section-head"><h3 class="tax-section-title">Deductions</h3></div><div class="tax-section-body"><div class="nice-tax-grid">
        ${renderNiceDirectTaxCard("WHT tax for residents (1)", resident.whtConfig, forceDirectNo)}
        ${renderNiceDirectTaxCard("WHT tax for non-residents (1)", nonResident.whtConfig, forceDirectNo)}
      </div></div></section><details class="tax-advanced-details"><summary><span>Other deductions</span><span>â</span></summary><div class="tax-advanced-body"><div class="nice-tax-grid">
          ${renderNiceDirectTaxCard("Residents", resident.otherDirectConfig, forceDirectNo)}
          ${renderNiceDirectTaxCard("Non-residents", nonResident.otherDirectConfig, forceDirectNo)}
        </div><details class="tax-advanced-details" style="margin-top:14px"><summary><span>Advanced direct-deduction variables</span><span>â</span></summary><div class="tax-advanced-body"><div class="deductions-matrix-card"><h3 class="deductions-matrix-title">Editable deduction variables</h3>${renderDeductionsMatrixTable(withholdingRows)}<details class="other-deductions-details"><summary><span>Other deduction variables</span><span>â</span></summary>${renderDeductionsMatrixTable(otherRows)}</details></div></div></details></div></details>`;
}

function isEuImplementationCountry(country){
  const euCountries = new Set([
    "austria","belgium","bulgaria","croatia","cyprus","czechia","czech republic",
    "denmark","estonia","finland","france","germany","greece","hungary",
    "ireland","italy","latvia","lithuania","luxembourg","malta",
    "netherlands","poland","portugal","romania","slovakia","slovenia",
    "spain","sweden"
  ]);
  return euCountries.has(String(country || "").trim().toLowerCase());
}

function vatTaxTypeLabel(baseLabel){
  const country = String(backstage.implementationCountry || "").trim();
  if (!country) return baseLabel;
  const isEu = isEuImplementationCountry(country);
  const isGermany = country.toLowerCase() === "germany";
  if (baseLabel === "Intra-EU VAT") return (isEu && !isGermany) ? `Intra-EU VAT (${country})` : "Intra-EU VAT";
  if (baseLabel === "Non-EU VAT") return isEu ? "Non-EU VAT" : `Non-EU VAT (${country})`;
  return baseLabel;
}

function renderIndirectTaxMatrixRow(taxType, prefix, values, realIds, forceNo = false, options = {}){
  const id = (name) => realIds ? `b${prefix}${name}` : `b${prefix}${name}Mirror`;
  const disabled = (!realIds || forceNo) ? " disabled" : "";
  const lockedClass = (!realIds || forceNo) ? "auto-derived-select" : "";
  const yesNo = (name, value) => `<select id="${id(name)}" class="${lockedClass}"${disabled}><option value="true" ${value ? "selected" : ""}>Yes</option><option value="false" ${!value ? "selected" : ""}>No</option></select>`;
  const reverseChargeClass = [lockedClass, !values.applicable ? "reverse-charge-inactive" : ""].filter(Boolean).join(" ");
  const reverseChargeDisabled = disabled || (!values.applicable ? " disabled" : "");
  const reverseCharge = (name, value) => `<select id="${id(name)}" class="${reverseChargeClass}"${reverseChargeDisabled}><option value="true" ${value ? "selected" : ""}>Yes</option><option value="false" ${!value ? "selected" : ""}>No</option></select>`;
  const rateInput = (name, value) => `<input id="${id(name)}" class="${lockedClass}" value="${formatPlainNumber(value || 0)}"${disabled}>`;
  const rateCell = options.fixedRateNote
    ? `${ruleTextSpan(options.fixedRateNote, "rate")}<div class="tax-engine-fixed">${esc(options.fixedRateNote)}</div>`
    : `${ruleRateSpan(values.rate || 0)}${rateInput("Rate", values.rate)}`;
  const exemptionCell = options.hideExemption
    ? `${ruleTextSpan("Not shown for Germany")}<span class="mini-note">Not shown for Germany</span>`
    : `${ruleBoolSpan(values.exemption)}${yesNo("Exemption", values.exemption)}`;
  return `
    <tr><td class="matrix-label-cell"${options.vatKind ? ` data-vat-kind="${options.vatKind}"` : ""}>${esc(taxType)}</td><td>${ruleBoolSpan(values.applicable)}${yesNo("Applicable", values.applicable)}</td><td>${rateCell}</td><td>${exemptionCell}</td><td>${ruleBoolSpan(values.reverseCharge)}${reverseCharge("ReverseCharge", values.reverseCharge)}</td><td>${ruleBoolSpan(values.offset)}${yesNo("Offset", values.offset)}</td><td>${ruleBoolSpan(values.reimbursable)}${yesNo("Reimbursable", values.reimbursable)}</td></tr>
  `;
}

function renderIndirectTaxMatrixTable(rows){
  return `
    <div class="deductions-matrix-wrap indirect-tax-matrix-wrap"><table class="deductions-matrix indirect-tax-matrix"><colgroup><col style="width:22%"><col style="width:13%"><col style="width:13%"><col style="width:13%"><col style="width:13%"><col style="width:13%"><col style="width:13%"></colgroup><thead><tr><th>Tax type</th><th>Apply</th><th>Rate %</th><th>Exempt</th><th>Reverse charge</th><th>Offset</th><th>Reimb.</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>
  `;
}

function indirectTaxValuesForMode(values, forceNo = false){
  if (!forceNo) return values;
  return { applicable: false, rate: 0, exemption: false, reverseCharge: false, offset: false, reimbursable: false };
}

const INDIRECT_TAX_SCENARIOS = [
  { key:"germany", label:"Germany", note:"Provider resident in Germany." },
  { key:"eu", label:"EU country", note:"Provider resident in another EU country." },
  { key:"implementation", label:"ITR country", note:"Provider resident in the ITR country." },
  { key:"other", label:"Other country", note:"Provider resident outside the EU and not in the ITR country." }
];

function currentIndirectTaxScenario(entityKey){
  window.__indirectTaxScenario = window.__indirectTaxScenario || { hq:"germany", branch:"implementation" };
  return window.__indirectTaxScenario[entityKey] || (entityKey === "branch" ? "implementation" : "germany");
}

function setIndirectTaxScenario(entityKey, scenarioKey){
  const fullLogicDetails = document.getElementById("fullTaxLogicDetails");
  if (fullLogicDetails) window.__fullTaxLogicOpen = fullLogicDetails.open;
  window.__indirectTaxScenario = window.__indirectTaxScenario || {};
  window.__indirectTaxScenario[entityKey] = scenarioKey;
  if (typeof renderStep === "function") renderStep();
}

function indirectTaxRuleDefaults(entityKey, scenarioKey){

  const vat = (apply, exempt, reverse, offset, reimb = false) => ({ apply, exempt, reverse, offset, reimb });
  const no = vat(false, false, false, false);
  const branch = entityKey === "branch";

  let german = no, intra = no, nonEu = no;

  if (!branch) {
    if (scenarioKey === "germany") {
      german = vat(true, false, false, false);
    } else if (scenarioKey === "eu") {
      german = vat(false, false, true, false);
    } else if (scenarioKey === "implementation") {
      german = vat(false, false, true, false);
    } else {
      german = vat(false, false, true, false);
    }
  } else {
    if (scenarioKey === "germany") {
      nonEu = vat(true, false, false, false);
    } else if (scenarioKey === "eu") {
      german = vat(false, false, true, false);
      nonEu = vat(false, false, true, false);
    } else if (scenarioKey === "implementation") {
      nonEu = vat(true, false, false, false);
    } else {
      nonEu = vat(false, false, true, false);
    }
  }

  return {
    german,
    intra,
    nonEu,

    germanVat: german.apply,
    intraEuVat: intra.apply,
    nonEuVat: nonEu.apply,
    reverseCharge: !!(german.reverse || intra.reverse || nonEu.reverse),
    offset: !!(german.offset || intra.offset || nonEu.offset),
    reimbursable: !!(german.reimb || intra.reimb || nonEu.reimb)
  };
}

function boolChip(value){
  return `<span class="${value ? "indirect-rule-yes" : "indirect-rule-no"}">${value ? "Yes" : "No"}</span>`;
}

function renderIndirectTaxRulePreview(entityKey, scenarioKey){
  const d = indirectTaxRuleDefaults(entityKey, scenarioKey);
  const lines = [["German VAT", d.german, "19% fixed"], [vatTaxTypeLabel("Intra-EU VAT"), d.intra, "Implementation VAT rate"], [vatTaxTypeLabel("Non-EU VAT"), d.nonEu, "Implementation VAT rate"]];
  const active = lines.filter(function(pair){ const v = pair[1]; return !!(v.apply || v.reverse); });
  const rows = active.map(function(pair){
    const label = pair[0], v = pair[1], rate = pair[2];
    const outcome = v.apply ? "Charge VAT" : (v.reverse ? "Reverse charge" : "No VAT");
    return `<tr><td class="simple-vat-name">${esc(label)}</td><td class="${v.apply ? "simple-vat-yes" : "simple-vat-no"}">${esc(outcome)}</td><td>${esc(rate)}</td></tr>`;
  }).join("");
  return `<section class="tax-workbook-section"><div class="tax-workbook-section-head"><h3 class="tax-section-title">Indirect tax outcome</h3></div><div class="tax-section-body"><div class="simple-vat-outcome"><div class="simple-vat-head"><div class="simple-vat-title">Active VAT result</div><div class="simple-vat-badge">${active.length ? active.length + " active rule" + (active.length === 1 ? "" : "s") : "No active VAT"}</div></div>${active.length ? `<div class="simple-vat-scroll"><table class="simple-vat-table"><thead><tr><th>VAT type</th><th>Outcome</th><th>Rate</th></tr></thead><tbody>${rows}</tbody></table></div>` : `<div class="simple-vat-empty">No VAT is charged and no reverse charge applies for this provider location.</div>`}</div></div></section>`;
}

function renderIndirectTaxFieldsForContract(realIds, forceNo = false, entityKey = "hq"){
  const scenarioKey = currentIndirectTaxScenario(entityKey);
  const tabs = INDIRECT_TAX_SCENARIOS.map(s => `<button type="button" class="tax-scenario-tab indirect-scenario-tab ${s.key === scenarioKey ? "active" : ""}" data-indirect-scenario="${s.key}" data-indirect-entity="${entityKey}">${esc(s.label)}</button>`).join("");
  const defaults = indirectTaxRuleDefaults(entityKey, scenarioKey);
  const vatRows = [renderIndirectTaxMatrixRow("German VAT", "GermanVat", indirectTaxValuesForMode({ applicable: backstage.germanVatApplicable, rate: backstage.germanVatRate, exemption: backstage.germanVatExemption, reverseCharge: backstage.germanVatReverseCharge || false, offset: backstage.germanVatOffset, reimbursable: backstage.germanVatReimbursable }, forceNo), realIds, forceNo, { fixedRateNote: "19% fixed" }), renderIndirectTaxMatrixRow(vatTaxTypeLabel("Intra-EU VAT"), "IntraEuVat", indirectTaxValuesForMode({ applicable: backstage.intraEuVatApplicable, rate: backstage.intraEuVatRate, exemption: backstage.intraEuVatExemption, reverseCharge: backstage.intraEuVatReverseCharge || false, offset: backstage.intraEuVatOffset, reimbursable: backstage.intraEuVatReimbursable }, forceNo), realIds, forceNo, { vatKind: "intra-eu", hideExemption: String(backstage.implementationCountry || "").trim().toLowerCase() === "germany" }), renderIndirectTaxMatrixRow(vatTaxTypeLabel("Non-EU VAT"), "NonEuVat", indirectTaxValuesForMode({ applicable: backstage.nonEuVatApplicable, rate: backstage.nonEuVatRate, exemption: backstage.nonEuVatExemption, reverseCharge: backstage.nonEuVatReverseCharge || false, offset: backstage.nonEuVatOffset, reimbursable: backstage.nonEuVatReimbursable }, forceNo), realIds, forceNo, { vatKind: "non-eu" })];
  const otherRow = renderIndirectTaxMatrixRow("Other indirect taxes", "OtherIndirectTax", indirectTaxValuesForMode({ applicable: backstage.otherIndirectTaxApplicable, rate: backstage.otherIndirectTaxRate, exemption: backstage.otherIndirectTaxExemption, reverseCharge: backstage.otherIndirectTaxReverseCharge || false, offset: backstage.otherIndirectTaxOffset, reimbursable: backstage.otherIndirectTaxReimbursable }, forceNo), realIds, forceNo);
  return `
    <section class="tax-workbook-section"><div class="tax-workbook-section-head"><h3 class="tax-section-title">VAT applicability</h3></div><div class="tax-section-body"><div class="tax-scenario-tabs">${tabs}</div><div class="nice-tax-grid cols-3" style="margin-top:14px">
          ${renderNiceIndirectTaxCard("German VAT", defaults.german, forceNo)}
          ${renderNiceIndirectTaxCard(vatTaxTypeLabel("Intra-EU VAT"), defaults.intra, forceNo)}
          ${renderNiceIndirectTaxCard(vatTaxTypeLabel("Non-EU VAT"), defaults.nonEu, forceNo)}
        </div></div></section><details class="tax-advanced-details"><summary><span>Other indirect taxes</span><span>â</span></summary><div class="tax-advanced-body"><div class="nice-tax-grid">
          ${renderNiceIndirectTaxCard("Other indirect taxes", indirectTaxValuesForMode({ applicable: backstage.otherIndirectTaxApplicable, rate: backstage.otherIndirectTaxRate, exemption: backstage.otherIndirectTaxExemption, reverseCharge: backstage.otherIndirectTaxReverseCharge || false, offset: backstage.otherIndirectTaxOffset, reimbursable: backstage.otherIndirectTaxReimbursable }, forceNo), forceNo)}
        </div><details class="tax-advanced-details" style="margin-top:14px"><summary><span>Advanced indirect-tax variables</span><span>â</span></summary><div class="tax-advanced-body"><div class="deductions-matrix-card indirect-tax-matrix-card"><h3 class="deductions-matrix-title">Advanced editable VAT variables</h3>${renderIndirectTaxMatrixTable(vatRows)}<details class="other-indirect-details"><summary><span>Other indirect-tax variables</span><span>â</span></summary>${renderIndirectTaxMatrixTable([otherRow])}</details></div></div></details></div></details>`;
}

function contractDeductionConfigs(entityKey, entityLabel){
  const isHq = entityKey === "hq";
  return {
    residentDirectConfig: {
      entityLabel,
      applicableId: isHq ? "bResidentHqWhtApplicable" : "bResidentBranchWhtApplicable",
      applicableValue: isHq ? backstage.residentHqWhtApplicable : backstage.residentBranchWhtApplicable,
      rateId: isHq ? "bResidentHqWhtRate" : "bResidentBranchWhtRate",
      rateValue: isHq ? backstage.residentHqWhtRate : backstage.residentBranchWhtRate,
      exemptionId: isHq ? "bResidentHqWhtExemption" : "bResidentBranchWhtExemption",
      exemptionValue: isHq ? backstage.residentHqWhtExemption : backstage.residentBranchWhtExemption,
      grossedUpId: isHq ? "bResidentHqWhtGrossedUp" : "bResidentBranchWhtGrossedUp",
      grossedUpValue: isHq ? backstage.residentHqWhtGrossedUp : backstage.residentBranchWhtGrossedUp,
      reimbursableId: isHq ? "bResidentHqWhtReimbursable" : "bResidentBranchWhtReimbursable",
      reimbursableValue: isHq ? backstage.residentHqWhtReimbursable : backstage.residentBranchWhtReimbursable
    },
    residentAnotherConfig: {
      applicableId: isHq ? "bResidentHqAnotherDirectTaxApplicable" : "bResidentBranchAnotherDirectTaxApplicable",
      applicableValue: isHq ? backstage.residentHqAnotherDirectTaxApplicable : backstage.residentBranchAnotherDirectTaxApplicable,
      rateId: isHq ? "bResidentHqAnotherDirectTaxRate" : "bResidentBranchAnotherDirectTaxRate",
      rateValue: isHq ? backstage.residentHqAnotherDirectTaxRate : backstage.residentBranchAnotherDirectTaxRate,
      exemptionId: isHq ? "bResidentHqAnotherDirectTaxExemption" : "bResidentBranchAnotherDirectTaxExemption",
      exemptionValue: isHq ? backstage.residentHqAnotherDirectTaxExemption : backstage.residentBranchAnotherDirectTaxExemption,
      grossedUpId: isHq ? "bResidentHqAnotherDirectTaxGrossedUp" : "bResidentBranchAnotherDirectTaxGrossedUp",
      grossedUpValue: isHq ? backstage.residentHqAnotherDirectTaxGrossedUp : backstage.residentBranchAnotherDirectTaxGrossedUp,
      reimbursableId: isHq ? "bResidentHqAnotherDirectTaxReimbursable" : "bResidentBranchAnotherDirectTaxReimbursable",
      reimbursableValue: isHq ? backstage.residentHqAnotherDirectTaxReimbursable : backstage.residentBranchAnotherDirectTaxReimbursable
    },
    nonResidentDirectConfig: {
      entityLabel,
      applicableId: isHq ? "bNonResidentHqWhtApplicable" : "bNonResidentBranchWhtApplicable",
      applicableValue: isHq ? backstage.nonResidentHqWhtApplicable : backstage.nonResidentBranchWhtApplicable,
      rateId: isHq ? "bNonResidentHqWhtRate" : "bNonResidentBranchWhtRate",
      rateValue: isHq ? backstage.nonResidentHqWhtRate : backstage.nonResidentBranchWhtRate,
      exemptionId: isHq ? "bNonResidentHqWhtExemption" : "bNonResidentBranchWhtExemption",
      exemptionValue: isHq ? backstage.nonResidentHqWhtExemption : backstage.nonResidentBranchWhtExemption,
      grossedUpId: isHq ? "bNonResidentHqWhtGrossedUp" : "bNonResidentBranchWhtGrossedUp",
      grossedUpValue: isHq ? backstage.nonResidentHqWhtGrossedUp : backstage.nonResidentBranchWhtGrossedUp,
      reimbursableId: isHq ? "bNonResidentHqWhtReimbursable" : "bNonResidentBranchWhtReimbursable",
      reimbursableValue: isHq ? backstage.nonResidentHqWhtReimbursable : backstage.nonResidentBranchWhtReimbursable
    },
    nonResidentAnotherConfig: {
      applicableId: isHq ? "bNonResidentHqAnotherDirectTaxApplicable" : "bNonResidentBranchAnotherDirectTaxApplicable",
      applicableValue: isHq ? backstage.nonResidentHqAnotherDirectTaxApplicable : backstage.nonResidentBranchAnotherDirectTaxApplicable,
      rateId: isHq ? "bNonResidentHqAnotherDirectTaxRate" : "bNonResidentBranchAnotherDirectTaxRate",
      rateValue: isHq ? backstage.nonResidentHqAnotherDirectTaxRate : backstage.nonResidentBranchAnotherDirectTaxRate,
      exemptionId: isHq ? "bNonResidentHqAnotherDirectTaxExemption" : "bNonResidentBranchAnotherDirectTaxExemption",
      exemptionValue: isHq ? backstage.nonResidentHqAnotherDirectTaxExemption : backstage.nonResidentBranchAnotherDirectTaxExemption,
      grossedUpId: isHq ? "bNonResidentHqAnotherDirectTaxGrossedUp" : "bNonResidentBranchAnotherDirectTaxGrossedUp",
      grossedUpValue: isHq ? backstage.nonResidentHqAnotherDirectTaxGrossedUp : backstage.nonResidentBranchAnotherDirectTaxGrossedUp,
      reimbursableId: isHq ? "bNonResidentHqAnotherDirectTaxReimbursable" : "bNonResidentBranchAnotherDirectTaxReimbursable",
      reimbursableValue: isHq ? backstage.nonResidentHqAnotherDirectTaxReimbursable : backstage.nonResidentBranchAnotherDirectTaxReimbursable
    }
  };
}

function renderContractTaxSection(entityKey, entityLabel){
  if (typeof syncDerivedWithholdingApplicability === "function") syncDerivedWithholdingApplicability(false);
  const isHq = entityKey === "hq";
  const forceHqIndirectNo = isHq && String(backstage.implementationMode || "").trim() === "Branch performs contract";
  const forceHqDirectNo = isHq;
  const configs = contractDeductionConfigs(entityKey, entityLabel);
  const scenarioKey = currentIndirectTaxScenario(entityKey);
  const defaults = indirectTaxRuleDefaults(entityKey, scenarioKey);
  const anyVat = !!(defaults.german.apply || defaults.intra.apply || defaults.nonEu.apply);
  const anyReverse = !!(defaults.german.reverse || defaults.intra.reverse || defaults.nonEu.reverse);
  const residentWht = forceHqDirectNo ? false : !!configs.residentDirectConfig.applicableValue;
  const nonResidentWht = forceHqDirectNo ? false : !!configs.nonResidentDirectConfig.applicableValue;
  const residentRate = formatPlainNumber(forceHqDirectNo ? 0 : configs.residentDirectConfig.rateValue);
  const nonResidentRate = formatPlainNumber(forceHqDirectNo ? 0 : configs.nonResidentDirectConfig.rateValue);
  const scenarioLabel = currentIndirectTaxScenario(entityKey).replace(/-/g," ");
  const detailsId = 'taxContractCard_' + entityKey;
  return `
    <details id="${detailsId}" class="tax-contract-card"><summary><div class="tax-contract-card-head"><div><h2 class="tax-contract-card-title">${esc(entityLabel)}</h2><div class="tax-contract-card-sub">Click to review direct deductions and indirect taxes</div></div><span class="tax-contract-card-toggle">View</span></div><div class="tax-nice-section-title">Deductions</div><div class="tax-contract-summary-grid tax-contract-variable-summary nice-tax-grid">
          ${renderNiceDirectTaxCard("WHT tax for residents (1)", configs.residentDirectConfig, forceHqDirectNo)}
          ${renderNiceDirectTaxCard("WHT tax for non-residents (1)", configs.nonResidentDirectConfig, forceHqDirectNo)}
        </div></summary><div class="tax-contract-details tax-contract-details-title-only" aria-hidden="true"></div></details>`;
}

function yesNoEngine(id, value){
  return `<select id="${id}"><option value="true" ${value ? "selected" : ""}>Yes</option><option value="false" ${!value ? "selected" : ""}>No</option></select>`;
}

function renderTaxSetupEngine(){
  const country = String(backstage.implementationCountry || "").trim();
  const implementationVatRate = (backstage.nonEuVatRate || backstage.intraEuVatRate || backstage.otherIndirectTaxRate || 0);
  const implementationVatPercent = Math.max(0, Math.min(50, n(implementationVatRate) * 100));
  const vatExemption = !!(backstage.germanVatExemption || backstage.intraEuVatExemption || backstage.nonEuVatExemption);
  const vatOffset = !!(backstage.germanVatOffset || backstage.intraEuVatOffset || backstage.nonEuVatOffset);
  const vatReimb = !!(backstage.germanVatReimbursable || backstage.intraEuVatReimbursable || backstage.nonEuVatReimbursable);
  const deductionExemption = !!(backstage.residentHqWhtExemption || backstage.residentBranchWhtExemption || backstage.nonResidentHqWhtExemption || backstage.nonResidentBranchWhtExemption);
  const deductionReimb = !!(backstage.residentHqWhtReimbursable || backstage.residentBranchWhtReimbursable || backstage.nonResidentHqWhtReimbursable || backstage.nonResidentBranchWhtReimbursable);
  return `
    <details id="taxSetupEngineDetails" class="backstage-section tax-setup-engine-details"><summary><div><div class="backstage-section-title">Tax setup engine</div></div><div class="backstage-chevron">â</div></summary><div class="backstage-section-body tax-engine-body"><div class="tax-engine-section"><div class="tax-engine-section-title">Indirect taxes / VAT</div><div class="tax-engine-grid">
            ${field("VAT rate % in country X?", `<input id="bEngineImplVatRate" type="number" min="0" max="50" step="0.01" value="${formatPlainNumber(implementationVatPercent)}">`)}
            ${field("Exemption available?", yesNoEngine("bEngineVatExemption", vatExemption))}
            ${field("Offset possible?", yesNoEngine("bEngineVatOffset", vatOffset))}
            ${field("Reimbursement possible?", yesNoEngine("bEngineVatReimbursable", vatReimb))}
          </div></div><div class="tax-engine-section"><div class="tax-engine-section-title">Deductions</div><div class="tax-engine-grid">
            ${field("Residents", `<input id="bEngineResidentWhtRate" type="number" step="0.01" value="${formatPlainNumber(backstage.residentHqWhtRate || backstage.residentBranchWhtRate || 0)}">`)}
            ${field("Non-residents", `<input id="bEngineNonResidentWhtRate" type="number" step="0.01" value="${formatPlainNumber(backstage.nonResidentHqWhtRate || backstage.nonResidentBranchWhtRate || 0)}">`)}
            ${field("Exemption available?", yesNoEngine("bEngineDeductionExemption", deductionExemption))}
            ${field("Reimbursement possible?", yesNoEngine("bEngineDeductionReimbursable", deductionReimb))}
          </div></div></div></details>
  `;
}

function setFullTaxLogicEdit(enabled){
  window.__fullTaxLogicOpen = true;
  window.__fullTaxRulesAdvancedEdit = !!enabled;
  if (typeof renderStep === "function") renderStep();
}

function renderCalculationFormulaReference(){
  return `
    <details class="calculation-formula-reference"><summary><div><h3 class="formula-reference-title">Calculation formulas</h3></div><div class="formula-reference-chevron">⌄</div></summary><div class="formula-reference-body"><div class="formula-reference-grid"><div class="formula-card"><h4 class="formula-card-title">A. Remuneration direction</h4><div class="formula-lines"><div class="formula-line"><span>Gross mode</span><code>Gross = input</code></div><div class="formula-line"><span>Gross mode WHT</span><code>WHT = taxable base × WHT rate</code></div><div class="formula-line"><span>Gross mode net</span><code>Net = Gross − WHT</code></div><div class="formula-line"><span>Net mode / gross-up</span><code>Gross = Net / (1 − WHT rate)</code></div><div class="formula-line"><span>Net mode WHT</span><code>WHT = Gross − Net</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">B. Taxable base and deductions</h4><div class="formula-lines"><div class="formula-line"><span>Taxable base</span><code>Taxable base = Gross − non-taxable allowances</code></div><div class="formula-line"><span>Direct deductions</span><code>DD = taxable base × deduction rate</code></div><div class="formula-line"><span>Net remuneration</span><code>Net = Gross − DD</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">C. VAT / indirect tax</h4><div class="formula-lines"><div class="formula-line"><span>VAT collected</span><code>VAT collected = Gross × VAT rate × VAT applicability</code></div><div class="formula-line"><span>VAT cost</span><code>VAT cost = VAT collected × non-recoverable flag</code></div><div class="formula-line"><span>Reverse charge</span><code>VAT collected = 0 when reverse charge is used</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">D. Transfer to provider</h4><div class="formula-lines"><div class="formula-line"><span>Transfer</span><code>Transfer = Net + VAT collected + reimbursables</code></div><div class="formula-line"><span>Not remuneration</span><code>VAT collected + reimbursables + non-taxable allowances</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">E. Company cost</h4><div class="formula-lines"><div class="formula-line"><span>Company cost</span><code>Cost = Gross + VAT cost + reimbursables</code></div><div class="formula-line"><span>Gross-up effect</span><code>Cost increases through higher Gross, not separate WHT</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">F. Revenue and margin</h4><div class="formula-lines"><div class="formula-line"><span>Revenue</span><code>Revenue = Company cost / (1 − margin rate)</code></div><div class="formula-line"><span>Margin amount</span><code>Margin = Revenue − Company cost</code></div><div class="formula-line"><span>Margin rate</span><code>Margin rate = Margin / Revenue</code></div></div></div></div></div></details>
  `;
}

function renderFullTaxLogicPanel(){
  const editing = !!window.__fullTaxRulesAdvancedEdit;
  return `
    <details id="fullTaxLogicDetails" class="backstage-section"><summary><div><div class="backstage-section-title">Contracts tax settings</div></div><div class="backstage-chevron">â</div></summary><div class="backstage-section-body full-tax-logic-wrap ${editing ? "is-editing" : ""}"><div class="full-tax-logic-toolbar"><button type="button" class="secondary small" onclick="setFullTaxLogicEdit(${editing ? "false" : "true"})">${editing ? "Lock rules" : "Advanced edit"}</button></div><div class="tax-contract-card-grid">
          ${renderContractTaxSection("hq", "Headquarters contract settings")}
          ${renderContractTaxSection("branch", "Branch contract settings")}
        </div></div></details>
  `;
}

function syncTaxSetupEngineToBackstage(){
  const engineSeen = document.getElementById("bEngineVatExemption") || document.getElementById("bEngineResidentWhtRate");
  if (!engineSeen) return;
  const country = String((document.getElementById("bImplementationCountry") && document.getElementById("bImplementationCountry").value) || backstage.implementationCountry || "").trim();
  const getBool = (id, fallback=false) => {
    const el = document.getElementById(id);
    return el ? el.value === "true" : fallback;
  };
  const getNum = (id, fallback=0) => {
    const el = document.getElementById(id);
    return el ? n(el.value) : fallback;
  };
  const setDom = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = typeof value === "boolean" ? String(value) : String(value);
  };

  const vatExemption = getBool("bEngineVatExemption", false);
  const vatOffset = getBool("bEngineVatOffset", false);
  const vatReimb = getBool("bEngineVatReimbursable", false);
  const vatRatePercent = Math.max(0, Math.min(50, getNum("bEngineImplVatRate", (backstage.nonEuVatRate || backstage.intraEuVatRate || 0) * 100)));
  const vatRate = vatRatePercent / 100;

  backstage.intraEuVatRate = vatRate;
  backstage.nonEuVatRate = vatRate;
  backstage.otherIndirectTaxRate = vatRate;
  backstage.germanVatRate = 0.19;
  ["germanVat", "intraEuVat", "nonEuVat", "otherIndirectTax"].forEach((prefix) => {
    backstage[prefix + "Exemption"] = vatExemption;
    backstage[prefix + "Offset"] = vatOffset;
    backstage[prefix + "Reimbursable"] = vatReimb;
  });

  const residentRate = getNum("bEngineResidentWhtRate", backstage.residentHqWhtRate || 0);
  const nonResidentRate = getNum("bEngineNonResidentWhtRate", backstage.nonResidentHqWhtRate || 0);
  const deductionExemption = getBool("bEngineDeductionExemption", false);
  const deductionReimb = getBool("bEngineDeductionReimbursable", false);

  ["residentHqWht", "residentBranchWht"].forEach((prefix) => {
    backstage[prefix + "Rate"] = residentRate;
    backstage[prefix + "Exemption"] = deductionExemption;
    backstage[prefix + "Reimbursable"] = deductionReimb;
    backstage[prefix + "GrossedUp"] = false;
  });
  ["nonResidentHqWht", "nonResidentBranchWht"].forEach((prefix) => {
    backstage[prefix + "Rate"] = nonResidentRate;
    backstage[prefix + "Exemption"] = deductionExemption;
    backstage[prefix + "Reimbursable"] = deductionReimb;
  });
  ["residentHqAnotherDirectTax", "residentBranchAnotherDirectTax", "nonResidentHqAnotherDirectTax", "nonResidentBranchAnotherDirectTax"].forEach((prefix) => {
    backstage[prefix + "Exemption"] = deductionExemption;
    backstage[prefix + "Reimbursable"] = deductionReimb;
    if (prefix.startsWith("resident")) backstage[prefix + "GrossedUp"] = false;
  });

  const capMap = {
    germanVat:"GermanVat", intraEuVat:"IntraEuVat", nonEuVat:"NonEuVat", otherIndirectTax:"OtherIndirectTax",
    residentHqWht:"ResidentHqWht", residentBranchWht:"ResidentBranchWht", nonResidentHqWht:"NonResidentHqWht", nonResidentBranchWht:"NonResidentBranchWht",
    residentHqAnotherDirectTax:"ResidentHqAnotherDirectTax", residentBranchAnotherDirectTax:"ResidentBranchAnotherDirectTax", nonResidentHqAnotherDirectTax:"NonResidentHqAnotherDirectTax", nonResidentBranchAnotherDirectTax:"NonResidentBranchAnotherDirectTax"
  };
  Object.entries(capMap).forEach(([prefix, cap]) => {
    ["Rate","Exemption","Offset","Reimbursable","GrossedUp"].forEach((suffix) => {
      const key = prefix + suffix;
      if (key in backstage) setDom("b" + cap + suffix, backstage[key]);
    });
  });
}

function renderBackstageCalculationFormulaPanel(){
  return `
    <details id="calculationFormulasDetails" class="backstage-section bs-section formula-backstage-section"><summary><div><h2 class="backstage-section-title bs-section-title">Calculation formulas</h2></div><div class="backstage-chevron">v</div></summary><div class="backstage-section-body"><div class="calculation-formula-reference formula-reference-visible"><div class="formula-reference-body"><div class="formula-reference-grid"><div class="formula-card"><h4 class="formula-card-title">A. Remuneration direction</h4><div class="formula-lines"><div class="formula-line"><span>Gross mode</span><code>Gross = input</code></div><div class="formula-line"><span>Gross mode WHT</span><code>WHT = taxable base x WHT rate</code></div><div class="formula-line"><span>Gross mode net</span><code>Net = Gross - WHT</code></div><div class="formula-line"><span>Net mode / gross-up</span><code>Gross = Net / (1 - WHT rate)</code></div><div class="formula-line"><span>Net mode WHT</span><code>WHT = Gross - Net</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">B. Taxable base and deductions</h4><div class="formula-lines"><div class="formula-line"><span>Taxable base</span><code>Taxable base = Gross - non-taxable allowances</code></div><div class="formula-line"><span>Direct deductions</span><code>DD = taxable base x deduction rate</code></div><div class="formula-line"><span>Net remuneration</span><code>Net = Gross - DD</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">C. VAT / indirect tax</h4><div class="formula-lines"><div class="formula-line"><span>VAT collected</span><code>VAT collected = Gross x VAT rate x VAT applicability</code></div><div class="formula-line"><span>VAT cost</span><code>VAT cost = VAT collected x non-recoverable flag</code></div><div class="formula-line"><span>Reverse charge</span><code>VAT collected = 0 when reverse charge is used</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">D. Transfer to provider</h4><div class="formula-lines"><div class="formula-line"><span>Transfer</span><code>Transfer = Net + VAT collected + reimbursables</code></div><div class="formula-line"><span>Not remuneration</span><code>VAT collected + reimbursables + non-taxable allowances</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">E. Company cost</h4><div class="formula-lines"><div class="formula-line"><span>Company cost</span><code>Cost = Gross + VAT cost + reimbursables</code></div><div class="formula-line"><span>Gross-up effect</span><code>Cost increases through higher Gross, not separate WHT</code></div></div></div><div class="formula-card"><h4 class="formula-card-title">F. Revenue and margin</h4><div class="formula-lines"><div class="formula-line"><span>Revenue</span><code>Revenue = Company cost / (1 - margin rate)</code></div><div class="formula-line"><span>Margin amount</span><code>Margin = Revenue - Company cost</code></div><div class="formula-line"><span>Margin rate</span><code>Margin rate = Margin / Revenue</code></div></div></div></div></div></div></div></details>`;
}

function renderBackstageForm(){
  return `<div class="backstage-wrap"><details id="basicsDetails" class="backstage-section"><summary><div><div class="backstage-section-title">Basics</div><div class="backstage-section-sub">Implementation context</div></div><div class="backstage-chevron">â</div></summary><div class="backstage-section-body"><div class="metric"><div class="backstage-grid-2">
            ${field("ITR country", `<div class="country-autocomplete-field"><input id="bImplementationCountry" data-country-autocomplete="implementation" placeholder="Select or type a country" value="${esc(backstage.implementationCountry)}" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false"></div>`)}
            ${field("Implementation mode", `<select id="bImplementationMode"><option ${backstage.implementationMode==='No Branch'?'selected':''}>No Branch</option><option ${backstage.implementationMode==='Branch performs contract'?'selected':''}>Branch performs contract</option><option ${backstage.implementationMode==='Branch for local support'?'selected':''}>Branch for local support</option></select>`)}
          </div><div class="backstage-card-grid backstage-tax-grid-single" style="margin-top:14px;">
            ${renderContractingEntityLogicCard()}
          </div>

          ${renderFullTaxLogicPanel()}
          ${renderBackstageCalculationFormulaPanel()}
        </div></div></details>

    ${renderTaxSetupEngine()}

    <details class="backstage-section"><summary><div><div class="backstage-section-title">Double tax agreements with the ITR country</div></div><div class="backstage-chevron">â</div></summary><div class="backstage-section-body"><div class="backstage-tax-card backstage-tax-card-wide"><div><div class="backstage-region-groups" id="bDoubleTaxAgreementCountryBlocks">${renderDoubleTaxAgreementBlocks()}</div><select id="bDoubleTaxAgreementCountries" class="backstage-multiselect-native" multiple size="8">${countryOptionsForMultiSelect()}</select><div class="backstage-note backstage-country-help">Grouped using a simplified World Bank-style regional classification based on the ITR-country list. Aggregate entries are excluded. Click any country block to select or remove it.</div></div></div></div></details><details class="backstage-section"><summary><div><div class="backstage-section-title">EU Countries</div></div><div class="backstage-chevron">â</div></summary><div class="backstage-section-body"><div class="backstage-tax-card backstage-tax-card-wide"><div><div class="backstage-region-groups" id="bEuCountryBlocks"><div class="backstage-region-group"><div class="backstage-region-title">European Union</div><div class="backstage-country-blocks"><button type="button" class="backstage-country-block">Austria</button><button type="button" class="backstage-country-block">Belgium</button><button type="button" class="backstage-country-block">Bulgaria</button><button type="button" class="backstage-country-block">Croatia</button><button type="button" class="backstage-country-block">Cyprus</button><button type="button" class="backstage-country-block">Czechia</button><button type="button" class="backstage-country-block">Denmark</button><button type="button" class="backstage-country-block">Estonia</button><button type="button" class="backstage-country-block">Finland</button><button type="button" class="backstage-country-block">France</button><button type="button" class="backstage-country-block">Germany</button><button type="button" class="backstage-country-block">Greece</button><button type="button" class="backstage-country-block">Hungary</button><button type="button" class="backstage-country-block">Ireland</button><button type="button" class="backstage-country-block">Italy</button><button type="button" class="backstage-country-block">Latvia</button><button type="button" class="backstage-country-block">Lithuania</button><button type="button" class="backstage-country-block">Luxembourg</button><button type="button" class="backstage-country-block">Malta</button><button type="button" class="backstage-country-block">Netherlands</button><button type="button" class="backstage-country-block">Poland</button><button type="button" class="backstage-country-block">Portugal</button><button type="button" class="backstage-country-block">Romania</button><button type="button" class="backstage-country-block">Slovakia</button><button type="button" class="backstage-country-block">Slovenia</button><button type="button" class="backstage-country-block">Spain</button><button type="button" class="backstage-country-block">Sweden</button></div></div></div><div class="backstage-note backstage-country-help">EU countries listed separately from double tax agreement selections.</div></div></div></div></details></div>`;
}

function renderStep2(){
  return `<div class="card"><h2>Backstage</h2><p>For the tax specialist, to define the tax and financial model and the fixed parameters.</p>
    ${renderBackstageForm()}
    ${navButtons()}
  </div>`;
}

function renderTopCalculationFormulaReference(){
  return '<section id="topCalculationFormulas" style="margin:16px 0 18px 0;border:1px solid #d8e0ee;border-radius:18px;background:#fff;overflow:hidden;">' +
    '<details>' +
      '<summary style="list-style:none;cursor:pointer;padding:16px 18px;background:#fbfcfe;border-bottom:1px solid #d8e0ee;display:flex;justify-content:space-between;gap:12px;align-items:center;">' +
        '<div><div style="font-size:17px;line-height:1.2;font-weight:850;letter-spacing:0;text-transform:none;color:#1A497F;">Calculation formulas</div></div><div style="color:#64748b;font-weight:800;">v</div>' +
      '</summary>' +
      '<div style="padding:16px 18px;background:#fff;">' +
        '<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">' +
          '<div style="border:1px solid #e6edf7;border-radius:14px;background:#fbfdff;padding:12px;"><h4 style="margin:0 0 8px 0;font-size:15px;color:#1f2937;">A. Remuneration direction</h4><p style="margin:0 0 5px 0;font-size:13px;color:#334155;"><b>Gross mode:</b> Gross = input; WHT = taxable base x WHT rate; Net = Gross - WHT</p><p style="margin:0;font-size:13px;color:#334155;"><b>Net mode / gross-up:</b> Gross = Net / (1 - WHT rate); WHT = Gross - Net</p></div>' +
          '<div style="border:1px solid #e6edf7;border-radius:14px;background:#fbfdff;padding:12px;"><h4 style="margin:0 0 8px 0;font-size:15px;color:#1f2937;">B. Taxable base and deductions</h4><p style="margin:0 0 5px 0;font-size:13px;color:#334155;">Taxable base = Gross - non-taxable allowances</p><p style="margin:0;font-size:13px;color:#334155;">Direct deductions = taxable base x deduction rate</p></div>' +
          '<div style="border:1px solid #e6edf7;border-radius:14px;background:#fbfdff;padding:12px;"><h4 style="margin:0 0 8px 0;font-size:15px;color:#1f2937;">C. VAT / indirect tax</h4><p style="margin:0 0 5px 0;font-size:13px;color:#334155;">VAT collected = Gross x VAT rate x VAT applicability</p><p style="margin:0;font-size:13px;color:#334155;">VAT cost = VAT collected x non-recoverable flag; reverse charge means VAT collected = 0</p></div>' +
          '<div style="border:1px solid #e6edf7;border-radius:14px;background:#fbfdff;padding:12px;"><h4 style="margin:0 0 8px 0;font-size:15px;color:#1f2937;">D. Transfer and non-remuneration</h4><p style="margin:0 0 5px 0;font-size:13px;color:#334155;">Transfer = Net + VAT collected + reimbursables</p><p style="margin:0;font-size:13px;color:#334155;">Not remuneration = VAT collected + reimbursables + non-taxable allowances</p></div>' +
          '<div style="border:1px solid #e6edf7;border-radius:14px;background:#fbfdff;padding:12px;"><h4 style="margin:0 0 8px 0;font-size:15px;color:#1f2937;">E. Company cost</h4><p style="margin:0;font-size:13px;color:#334155;">Company cost = Gross + VAT cost + reimbursables</p></div>' +
          '<div style="border:1px solid #e6edf7;border-radius:14px;background:#fbfdff;padding:12px;"><h4 style="margin:0 0 8px 0;font-size:15px;color:#1f2937;">F. Revenue and margin</h4><p style="margin:0 0 5px 0;font-size:13px;color:#334155;">Revenue = Company cost / (1 - margin rate)</p><p style="margin:0;font-size:13px;color:#334155;">Margin = Revenue - Company cost</p></div>' +
        '</div>' +
      '</div>' +
    '</details>' +
  '</section>';
}

function renderBackstagePanel(){
  return `<div class="card"><div class="top-actions"><div><h2>Backstage</h2><p>For the tax specialist, to define the tax and financial model and the fixed parameters.</p></div><button class="secondary" onclick="closeBackstage()">Close</button></div>
    ${renderBackstageForm()}
  </div>`;
}

function componentCard(p, idx, title, prefix){
  const rateField = prefix + "Rate";
  const qtyField = prefix + "Qty";
  const unitField = prefix + "Unit";
  const total = componentTotal(p[rateField], p[qtyField]);
  return `<div class="component"><h4>${title}</h4>
    ${field("Rate per unit", `<input type="text" inputmode="decimal" data-idx="${idx}" data-field="${rateField}" value="${formatPlainNumber(p[rateField])}" class="flat-input formatted-number-input">`)}
    ${field("Quantity", `<input type="text" inputmode="decimal" data-idx="${idx}" data-field="${qtyField}" value="${formatPlainNumber(p[qtyField])}" class="flat-input formatted-number-input">`)}
    ${field("Unit type", `<input data-idx="${idx}" data-field="${unitField}" value="${esc(p[unitField])}" class="flat-input">`)}
    <div style="margin-top:8px;color:#6b7280;font-size:12px">Component total: <span id="component-total-${idx}-${prefix}">${money(total)}</span></div></div>`;
}

function sectionIconSvg(type){
  const icons = {
    input: '<span class="section-title-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></span>',
    remuneration: '<span class="section-title-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="4"/></svg></span>',
    nonremuneration: '<span class="section-title-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 8l8 8"/></svg></span>',
    margin: '<span class="section-title-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 7-8"/><path d="M14 7h6v6"/></svg></span>'
  };
  return icons[type] || '';
}

function renderSmartComponentRows(p, c, idx){
  const sections = [
    {
      title: `Provider remuneration`,
      subtitle: "",
      totalValue: c.remunerationTotal || 0,
      rows: [
        { key: "fee", kicker: "Line A1", label: "Base fee", note: "", rateField: "feeRate", qtyField: "feeQty", total: c.fee },
        { key: "perDiem", kicker: "Line A2", label: "Per diems", note: "", rateField: "perDiemRate", qtyField: "perDiemQty", total: c.perDiem },
        { key: "other", kicker: "Line A3", label: "Other remuneration", note: "", rateField: "otherRate", qtyField: "otherQty", total: c.other }
      ]
    },
    {
      title: `Non-remuneration costs`,
      subtitle: "",
      totalValue: c.nonRemunerationTotal || 0,
      rows: [
        { key: "housing", kicker: "Line B1", label: "Short-term accommodation", note: "", rateField: "housingRate", qtyField: "housingQty", total: c.housing },
        { key: "insurance", kicker: "Line B2", label: "Insurance", note: "", rateField: "insuranceRate", qtyField: "insuranceQty", total: c.insurance },
        { key: "transport", kicker: "Line B3", label: "Travel costs", note: "", rateField: "transportRate", qtyField: "transportQty", total: c.transport },
        { key: "otherCost", kicker: "Line B4", label: "Custom cost item", note: "", rateField: "otherCostRate", qtyField: "otherCostQty", total: c.otherCost }
      ]
    },
    {
      title: `Margin`,
      subtitle: "",
      totalValue: null,
      rows: [
        { key: "marginRate", kicker: "Line C1", label: "Margin rate", note: "Enter the mandatory percentage used to calculate revenue for this position.", rateField: "marginRate", qtyField: "", total: c.marginRateDecimal * 100, special: "percent" }
      ]
    }
  ];

  const renderLine = (row) => {
    if (row.special === "percent"){
      return `
      <tr class="component-line"><td><div class="invoice-label"><div class="invoice-kicker">${row.kicker}</div><div class="invoice-name">${row.label}</div>
            ${row.note ? `<div class="invoice-note">${row.note}</div>` : ''}
          </div></td><td><div class="component-editor component-editor-margin"><div></div><div class="margin-rate-input-wrap"><input type="text" class="flat-input formatted-number-input" data-idx="${idx}" data-field="${row.rateField}" value="${formatPlainNumber(p[row.rateField])}" placeholder="0"><span class="margin-rate-suffix">%</span></div><div class="component-total-wrap"><div class="component-total" id="component-total-${idx}-${row.key}">${formatPlainNumber(row.total)}%</div></div></div></td></tr>`;
    }

    return `
    <tr class="component-line"><td><div class="invoice-label"><div class="invoice-kicker">${row.kicker}</div><div class="invoice-name">${row.label}</div>
          ${row.note ? `<div class="invoice-note">${row.note}</div>` : ''}
        </div></td><td><div class="component-editor"><div class="component-input-cell"><label class="component-mobile-label">Qty</label><input type="text" inputmode="decimal" class="flat-input formatted-number-input" data-idx="${idx}" data-field="${row.qtyField}" value="${formatPlainNumber(p[row.qtyField])}" placeholder="Qty" aria-label="Quantity for ${row.label}"></div><div class="component-input-cell"><label class="component-mobile-label">Rate</label><input type="text" inputmode="decimal" class="flat-input formatted-number-input" data-idx="${idx}" data-field="${row.rateField}" value="${formatPlainNumber(p[row.rateField])}" placeholder="Rate" aria-label="Rate for ${row.label}"></div><div class="component-total-wrap"><div class="component-total" id="component-total-${idx}-${row.key}">${money(row.total)}</div></div></div></td></tr>`;
  };

  return `<div class="flat-subsection-head"><h4 class="flat-subsection-title">Input</h4></div><div class="component-breakdown flat-input-breakdown">` + sections.map(section => {
    const body = section.rows.map(row => renderLine(row)).join("");

    return `<div class="component-section"><div class="invoice-head"><div class="invoice-title">${section.title}</div>${section.subtitle ? `<div class="invoice-sub">${section.subtitle}</div>` : ``}</div><table class="component-table"><colgroup><col><col></colgroup><tbody><tr class="component-colhead"><td></td><td><div class="component-editor ${section.rows.some(r => r.special === "percent") ? "component-editor-margin" : ""}"><div class="component-hlabel">${section.rows.some(r => r.special === "percent") ? "" : "Qty"}</div><div class="component-hlabel">${section.rows.some(r => r.special === "percent") ? "Rate" : "Rate"}</div><div class="component-total-spacer"></div></div></td></tr>
          ${body}
          ${section.totalValue === null ? "" : `
          <tr class="component-line total"><td><div class="invoice-label"><div class="invoice-name">Section total</div></div></td><td><div class="component-editor"><div></div><div></div><div class="component-total-wrap"><div class="component-total">${money(section.totalValue)}</div></div></div></td></tr>`}
        </tbody></table></div>`;
  }).join("") + `</div>`;
}

function renderFlatMetrics(c, idx){
  const position = flatRates[idx] || {};
  const residentWht = c.whtRate > 0 && c.standardWht > 0 && String(position.countryOfResidence || "").trim().toLowerCase() === String(backstage.implementationCountry || "").trim().toLowerCase()
    ? c.standardWht
    : 0;
  const nonResidentWht = c.whtRate > 0 && c.standardWht > 0 && String(position.countryOfResidence || "").trim().toLowerCase() !== String(backstage.implementationCountry || "").trim().toLowerCase()
    ? c.standardWht
    : 0;

  const ratePct = `${formatPlainNumber((c.whtRate || 0) * 100)}%`;
  const marginPct = `${formatPlainNumber((c.marginRateDecimal || 0) * 100)}%`;
  const vatBase = (c.remunerationTotal || 0) + (c.nonRemunerationTotal || 0);
  const vatRateApplied = (c.vatCollected || 0) > 0 ? `${formatPlainNumber(((c.vatCollected || 0) / Math.max(0.0001, vatBase)) * 100)}%` : "0%";
  const vatCostFlag = (c.vatCollected || 0) > 0 ? ((c.vatCost || 0) > 0 ? "non-recoverable" : "recoverable") : "not collected";
  const grossFormula = (position.inputMode === "Net") ? "Net input / (1 - WHT rate)" : "Fees + Per diem + Other";
  const calculatedDetailsHtml = (typeof window !== "undefined" && typeof window.calculatedDetailsBlock === "function")
    ? window.calculatedDetailsBlock(position, idx)
    : "";

  const invoiceLine = (kicker, name, formula, id, value, note = '', extraClass = '') => {
    const tooltipText = `Calculation: ${formula}${note ? ` — ${note}` : ''}`;
    const tooltip = esc(tooltipText);
    return `
    <tr class="invoice-line ${extraClass}"><td><div class="invoice-label"><div class="invoice-kicker">${kicker}</div><div class="invoice-name">${name}</div>
          ${note ? `<div class="invoice-note">${note}</div>` : ''}
        </div></td><td class="invoice-amount-cell"><div class="invoice-amount calculation-tooltip" id="metric-${idx}-${id}" tabindex="0" title="${tooltip}" aria-label="${tooltip}" data-tooltip="${tooltip}">${value}</div></td></tr>`;
  };

  return `<div class="flow-results"><h3>Output</h3>${calculatedDetailsHtml}<div class="invoice-breakdown"><div class="invoice-section"><div class="invoice-head"><div class="invoice-title">Provider remuneration</div><div class="invoice-sub">Gross-to-net story. Hover over an amount to see the calculation.</div></div><table class="invoice-table story-table"><colgroup><col class="concept-col"><col class="amount-col"></colgroup>
          ${invoiceLine('Line 1', 'Contractual gross remuneration', grossFormula, 'Gj', money(c.remunerationTotal))}
          ${invoiceLine('Line 2', 'Taxable base', 'Gross remuneration - non-taxable allowances', 'Gjtax', money(c.taxableBase))}
          ${invoiceLine('Line 3', 'Gross-up effect', 'Gross remuneration - net input', 'GrossUp', money(c.grossUpAmount || 0))}
          ${invoiceLine('Line 4', 'Contractual net remuneration (N_j)', 'Gross remuneration - WHT', 'Nj', money(c.netRemuneration), '', 'final')}
        </table></div><div class="invoice-section"><div class="invoice-head"><div class="invoice-title">Indirect taxes</div><div class="invoice-sub">Hover over an amount to see the VAT calculation and treatment.</div></div><table class="invoice-table story-table"><colgroup><col class="concept-col"><col class="amount-col"></colgroup>
          ${invoiceLine('Line 5', 'VAT collected', `VAT base x VAT rate (${vatRateApplied})`, 'VatCollected', money(c.vatCollected || c.indirectCollected || 0), c.reverseCharge ? 'Reverse charge applies; no VAT is collected.' : '')}
          ${invoiceLine('Line 6', 'VAT cost', `VAT collected x ${vatCostFlag}`, 'VatCost', money(c.vatCost || c.indirectCost || 0))}
          ${invoiceLine('Line 7', 'German VAT', 'If VAT jurisdiction = Germany', 'GermanVat', money(c.germanVat), c.vatGermanNote)}
          ${invoiceLine('Line 8', c.vatLine2Label || 'Implementation-country VAT', 'If VAT jurisdiction = ITR country', 'IntraEuVat', money(c.intraEuVat), c.vatIntraEuNote)}
          ${invoiceLine('Line 9', 'Total indirect collected', 'VAT collected + other indirect taxes', 'TotalIndirect', money(c.indirectCollected), '', 'total')}
        </table></div><div class="invoice-section"><div class="invoice-head"><div class="invoice-title">Deductions</div><div class="invoice-sub">Hover over an amount to see the deduction calculation.</div></div><table class="invoice-table story-table"><colgroup><col class="concept-col"><col class="amount-col"></colgroup>
          ${invoiceLine('Line 10', 'Withholding tax for residents', `Taxable base x resident WHT rate (${ratePct})`, 'ResidentWht', money(residentWht))}
          ${invoiceLine('Line 11', 'Withholding tax for non-residents', `Taxable base x non-resident WHT rate (${ratePct})`, 'NonResidentWht', money(nonResidentWht))}
          ${invoiceLine('Line 12', 'Other deductions', 'Other deduction base x rate', 'OtherDeductions', money(0))}
          ${invoiceLine('Line 13', 'Total deduction', 'Resident WHT + non-resident WHT + other deductions', 'TotalDeduction', money(c.directDeductionsTotal), '', 'total')}
        </table></div><div class="invoice-section"><div class="invoice-head"><div class="invoice-title">Cash flows and margin</div><div class="invoice-sub">Hover over an amount to see how each cash-flow figure is calculated.</div></div><table class="invoice-table story-table"><colgroup><col class="concept-col"><col class="amount-col"></colgroup>
          ${invoiceLine('Line 14', 'Transfer to the provider', 'Net remuneration + VAT collected + not-remuneration items', 'Transfer', money(c.transfer), '', 'total')}
          ${invoiceLine('Line 15', 'Not part of the remuneration', 'Housing + insurance + transport + other costs + VAT + non-taxable allowances', 'NotPartRemuneration', money(c.notPartOfRemuneration || c.nonRemunerationTotal))}
          ${invoiceLine('Line 16', 'Company cost', 'Gross remuneration + VAT cost + not-remuneration items', 'CompanyCost', money(c.companyCost), '', 'total')}
          ${invoiceLine('Line 17', 'Margin rate', 'Input margin rate', 'MarginRate', marginPct)}
          ${invoiceLine('Line 18', 'Revenue', 'Company cost / (1 - margin rate)', 'Revenue', money(c.revenue), '', 'final')}
          ${invoiceLine('Line 19', 'Margin amount', 'Revenue - company cost', 'MarginAmount', money(c.margin || 0), '', 'final')}
        </table></div></div></div>`;
}
function positionDisplayTitle(p, idx){
  return `Position ${idx+1}` + ((p.title || p.name) ? `: ${[p.title, p.name].filter(Boolean).join(", ")}` : "");
}

function positionStatusText(p){
  return p._saved ? "Saved" : "Unsaved changes";
}

function renderFlatSummaryTotals(){
  const totals = flatRates.reduce((acc, p) => {
    const c = computePosition(p);
    acc.transfer += c.transfer || 0;
    acc.companyCost += c.companyCost || 0;
    acc.revenue += c.revenue || 0;
    return acc;
  }, { transfer: 0, companyCost: 0, revenue: 0 });

  const totalMarginRate = totals.revenue > 0
    ? ((totals.revenue - totals.companyCost) / totals.revenue) * 100
    : 0;

  return `<div class="flat-summary-totals"><div class="totals-label">Total</div><div class="totals-muted">All positions</div><div class="cf-cell"><span class="cf-value">${money(totals.transfer)}</span></div><div class="cf-cell"><span class="cf-value">${money(totals.companyCost)}</span></div><div class="cf-cell"><span class="cf-value">${money(totals.revenue)}</span></div><div class="cf-cell"><span class="cf-value">${formatPlainNumber(totalMarginRate)}%</span></div><div></div></div>`;
}

function renderPositionSummary(p, idx){
  const c = computePosition(p);
  const t = esc(p.title || `Position ${idx+1}`);
  const nLabel = esc(p.name || "â");
  const transfer = money(c.transfer || 0);
  const companyCost = money(c.companyCost || 0);
  const revenue = money(c.revenue || 0);
  const marginRate = `${formatPlainNumber((c.marginRateDecimal || 0) * 100)}%`;
  return `<div class="position-summary-compact"><div><div class="identity-main">${t}</div></div><div><div class="identity-main">${nLabel}</div></div><div class="cf-cell"><span class="cf-value">${transfer}</span></div><div class="cf-cell"><span class="cf-value">${companyCost}</span></div><div class="cf-cell"><span class="cf-value">${revenue}</span></div><div class="cf-cell"><span class="cf-value">${marginRate}</span></div><div class="summary-actions"><button type="button" class="small secondary open-btn" onclick="event.stopPropagation(); openFlat(${idx})">Open</button><button type="button" class="small secondary" onclick="event.stopPropagation(); openFlat(${idx})">Edit</button><button type="button" class="small remove-btn" onclick="event.stopPropagation(); removeFlat(${idx})">Remove</button></div></div>`;
}

function flatCountryInputHtml(value, attrs, inputAttrs, extraClass){
  const safeValue = esc(value || "");
  const flag = (typeof flagMarkup === "function") ? flagMarkup(value || "") : '<span class="country-flag-fallback">•</span>';
  return `<div class="country-autocomplete-field flat-country-field"><span class="country-selected-flag">${flag}</span><input ${attrs || ""} value="${safeValue}" class="flat-input ${extraClass || ""}" data-flat-country-autocomplete="true" list="countryOptions" autocomplete="off" ${inputAttrs || ""}></div>`;
}

function flatBasicsGroup(title, body, extraClass){
  return `<section class="flat-basics-group ${extraClass || ""}"><div class="flat-basics-group-head"><h5 class="flat-basics-group-title">${title}</h5></div><div class="flat-basics-grid">${body}</div></section>`;
}

function renderPositionDetails(p, idx){
  const enteredDetails = `
      ${field("Position title", `<input data-idx="${idx}" data-field="title" value="${esc(p.title)}" class="flat-input" placeholder="Write position title">`)}
      ${field("Name", `<input data-idx="${idx}" data-field="name" value="${esc(p.name||"")}" class="flat-input" placeholder="Write name">`)}
      ${field("Country of residence", flatCountryInputHtml(p.countryOfResidence, `data-idx="${idx}" data-field="countryOfResidence"`, `placeholder="Select or type a country"`, ""))}
      ${field("Contract classification", `<select data-idx="${idx}" data-field="classification" class="flat-input"><option value="" ${!p.classification?'selected':''}>Select contract classification</option>${POSITION_CLASSIFICATIONS.map(v=>`<option value="${v}" ${v===p.classification?'selected':''}>${v}</option>`).join("")}</select>`)}
      ${field("Provider type", `<select data-idx="${idx}" data-field="contractualType" class="flat-input"><option value="" ${!p.contractualType?'selected':''}>Select provider type</option>${CONTRACTUAL_TYPES.map(v=>`<option value="${v}" ${v===p.contractualType?'selected':''}>${v}</option>`).join("")}</select>`)}
      ${field("Input mode", `<div><select data-idx="${idx}" data-field="inputMode" class="flat-input">${INPUT_MODES.map(v=>`<option ${v===p.inputMode?'selected':''}>${v}</option>`).join("")}</select>${(p.inputMode && String(p.inputMode).toLowerCase() !== "gross") ? `<div class="inline-warning">It is recommendable to always negotiate gross. Continue only if you are sure.</div>` : ``}</div>`)}
  `;

  const contractingEntityField = `
        <div class="ce-overwrite-wrap ${hasContractingEntityOverwrite(p) ? 'is-overwritten' : ''}"><div class="ce-overwrite-top"><div class="ce-input-with-gear"><input id="computed-contracting-entity-${idx}" value="${esc(getEffectiveContractingEntity(p))}" class="flat-input ce-overwrite-input auto-derived-select" placeholder="Computed from implementation mode and residence" readonly><button type="button" class="ce-gear-btn" onclick="handleContractingEntityGearClick(${idx})" title="Overwrite" aria-label="Overwrite">⚙</button></div></div>
          ${hasContractingEntityOverwrite(p)
            ? `
              <div class="ce-overwrite-meta"><span class="ce-overwrite-badge">Overwritten</span><div class="ce-overwrite-note">Auto: <strong>${esc(getAutoContractingEntity(p) || "—")}</strong> → Current: <strong>${esc(getEffectiveContractingEntity(p) || "—")}</strong></div><div class="ce-overwrite-note">Reason: ${esc(p.contractingEntityOverwriteReasonCode || "—")}</div><div class="ce-overwrite-actions"><button type="button" class="small secondary" onclick="resetContractingEntityOverwrite(${idx})">Reset to automatic</button></div></div>
            `
            : `<div class="mini-note">Assigned automatically from implementation mode and residence.</div>`
          }
        </div>
      `;

  const calculatedDetails = `
      ${field("ITR country", flatCountryInputHtml(getImplementationCountryForPosition(), `id="computed-ITR-country-${idx}"`, `placeholder="From backstage ITR country" readonly`, "auto-derived-select"))}
      ${field("Tax status", `<input id="computed-tax-status-${idx}" value="${esc(derivedCalculationValue(deriveTaxStatus(p)))}" class="flat-input auto-derived-select${derivedCalculationClass(deriveTaxStatus(p))}" placeholder="Pending calculation" readonly>`)}
      ${field("Contracting entity", contractingEntityField)}
      ${field("VAT jurisdiction", `<input id="computed-vat-jurisdiction-${idx}" value="${esc(derivedCalculationValue(displayVatJurisdiction(deriveVatJurisdiction(p))))}" class="flat-input auto-derived-select${derivedCalculationClass(deriveVatJurisdiction(p))}" placeholder="Pending calculation" readonly>`)}
  `;

  return `<div class="details-panel flat-basics-panel"><div class="flat-basics-head"><h4 class="flat-basics-title">Basics</h4></div><div class="flat-basics-body">${flatBasicsGroup("Entered details", enteredDetails, "flat-basics-entered")}${flatBasicsGroup("Calculated details", calculatedDetails, "flat-basics-calculated")}</div></div>`;
}

function renderFlatPosition(p, idx){
  const c = computePosition(p);
  const displayTitle = positionDisplayTitle(p, idx);
  const collapsed = !!p._collapsed;
  if (collapsed){
    return `<div class="position is-collapsed">
      ${renderPositionSummary(p, idx)}
    </div>`;
  }
  return `<div class="position flat-workspace-position"><div class="top-actions flat-workspace-header"><div><h4>${esc(displayTitle)}</h4></div><div class="position-tools"><button class="small primary" onclick="saveFlat(${idx})">${p._saved ? "Save position" : "Save changes"}</button><button class="secondary small" onclick="event.stopPropagation(); removeFlat(${idx})">Remove</button></div></div><div class="position-open-shell flat-workspace-shell"><aside class="flat-workspace-left" aria-label="Inputs"><div class="flat-workspace-panel-title">Inputs</div>${renderPositionDetails(p, idx)}${renderSmartComponentRows(p, c, idx)}</aside><section class="flat-workspace-right" aria-label="Calculation output">${renderFlatMetrics(c, idx)}</section></div></div>`;
}

function renderExpenseList(kind, items, title){
  return `<h3 style="margin-top:24px">${title}</h3><div style="margin-bottom:12px"><button class="secondary" onclick="addExpense('${kind}')">Add ${kind}</button></div>
    ${items.length ? items.map((x,i)=>`<div class="position"><div class="top-actions"><div><h4>${title} ${i+1}</h4></div><button class="secondary small" onclick="removeExpense('${kind}',${i})">Remove</button></div><div class="row cols-2">${field("Title", `<input data-kind="${kind}" data-idx="${i}" data-field="title" value="${esc(x.title)}" class="expense-input">`)}${field("Amount", `<input type="number" data-kind="${kind}" data-idx="${i}" data-field="amount" value="${x.amount}" class="expense-input">`)}</div></div>`).join("") : `<div class="empty">No items yet.</div>`}`;
}

function createReimbursableRow(){
  return {
    item: "",
    subItem: "",
    reimbursementType: "",
    number: "",
    budgetPrice: "",
    explanations: ""
  };
}

function computeReimbursableRow(row){
  const qty = n(row.number);
  const price = n(row.budgetPrice);
  return qty * price;
}

function computeReimbursablesTotal(){
  return reimbursableRows.reduce((sum, row) => sum + computeReimbursableRow(row), 0);
}

function addReimbursableRow(){
  reimbursableRows.push(createReimbursableRow());
  renderAll();
}

function removeReimbursableRow(idx){
  reimbursableRows.splice(idx, 1);
  renderAll();
}
function editReimbursableNote(idx){
  if (!reimbursableRows[idx]) return;
  const current = reimbursableRows[idx].explanations || "";
  const next = window.prompt("Add note", current);
  if (next === null) return;
  reimbursableRows[idx].explanations = next;
  renderAll();
}

function renderStep3(){
  if (!flatRates || flatRates.length === 0){
    return `<div class="card"><div class="top-actions"><div></div><button type="button" class="primary empty-cta-highlight" onclick="addFlat()" id="addFlatRateBtn">Add position</button></div><div class="flat-empty-state"><div class="flat-empty-copy"><div class="flat-empty-title">No flat-rate positions yet</div><div class="flat-empty-sub">Click <strong>Add position</strong> to start calculating the margin for this project.</div></div></div>
      ${navButtons()}
    </div>`;
  }

  const hasOpen = flatRates.some(p => !p._collapsed);
  return `<div class="card"><div class="top-actions" style="justify-content:flex-end;"><button type="button" onclick="addFlat()">Add position</button></div>
        ${flatRates.length ? `${hasOpen ? "" : `<div class="positions-summary-head"><div class="h">Position</div><div class="h">Name</div><div class="h">Transfer</div><div class="h">Company cost</div><div class="h">Revenue</div><div class="h">Margin %</div><div class="h"></div></div>`}` + flatRates.map((p, idx) => ({p, idx})).filter(({p}) => !hasOpen || !p._collapsed).map(({p, idx}) => renderFlatPosition(p, idx)).join("") + (!hasOpen ? renderFlatSummaryTotals() : "") : `<div class="empty">No Flat-Rate positions yet.</div>`}
    ${navButtons()}
  </div>`;
}

function updateReimbursablesStepOutputs(){
  document.querySelectorAll("[data-reimb-total]").forEach((el) => {
    const idx = Number(el.dataset.reimbTotal);
    const row = reimbursableRows[idx];
    el.textContent = money(computeReimbursableRow(row || {}));
  });
  const grand = document.getElementById("reimbGrandTotal");
  if (grand) grand.textContent = money(computeReimbursablesTotal());
}

function syncReimbursableField(idx, field, rawValue){
  if (!reimbursableRows[idx]) return;
  const numeric = field === "number" || field === "budgetPrice";
  reimbursableRows[idx][field] = numeric ? n(rawValue) : rawValue;
  updateReimbursablesStepOutputs();
}

function renderStep4(){
  if (!reimbursableRows || reimbursableRows.length === 0){
    return `<div class="card"><div class="top-actions" style="justify-content:flex-end;"><button type="button" class="primary empty-cta-highlight" onclick="addReimbursableRow()" id="addReimbursableBtn">Add position</button></div><div class="reimb-empty-state"><div class="reimb-empty-copy"><div class="reimb-empty-title">No reimbursable positions yet</div><div class="reimb-empty-sub">Click <strong>Add position</strong> to start adding project expenses that can be reimbursed.</div></div></div>
      ${navButtons()}
    </div>`;
  }

  const total = computeReimbursablesTotal();

  return `<div class="card"><div class="top-actions"><div><h2>Reimbursables</h2></div><button type="button" class="primary" onclick="addReimbursableRow()" id="addReimbursableBtn">Add position</button></div><div class="reimb-table-wrap"><table class="reimb-table"><colgroup><col style="width:15%"><col style="width:14%"><col style="width:17%"><col style="width:8%"><col style="width:11%"><col style="width:13%"><col style="width:11%"><col style="width:11%"></colgroup><thead><tr><th>Item</th><th>Sub-item</th><th>Type of reimbursement</th><th>Quantity</th><th>Budget / Price</th><th>Total</th><th>Notes</th><th></th></tr></thead><tbody>
          ${reimbursableRows.map((row, idx) => `
            <tr><td><input type="text" data-reimb-idx="${idx}" data-reimb-field="item" value="${esc(row.item || '')}" placeholder="Flights"></td><td><input type="text" data-reimb-idx="${idx}" data-reimb-field="subItem" value="${esc(row.subItem || '')}" placeholder=""></td><td><select data-reimb-idx="${idx}" data-reimb-field="reimbursementType"><option value="" ${!row.reimbursementType ? 'selected' : ''}>Select</option><option value="Lump sum amount" ${row.reimbursementType === 'Lump sum amount' ? 'selected' : ''}>Lump sum amount</option><option value="Against evidence" ${row.reimbursementType === 'Against evidence' ? 'selected' : ''}>Against evidence</option><option value="Proof" ${row.reimbursementType === 'Proof' ? 'selected' : ''}>Proof</option></select></td><td><input class="num" type="text" data-reimb-idx="${idx}" data-reimb-field="number" value="${formatPlainNumber(row.number)}" placeholder="0"></td><td><input class="num" type="text" data-reimb-idx="${idx}" data-reimb-field="budgetPrice" value="${formatPlainNumber(row.budgetPrice)}" placeholder="0"></td><td class="num"><strong class="reimb-row-total" data-reimb-total="${idx}">${money(computeReimbursableRow(row))}</strong></td><td class="reimb-note-cell"><button type="button" class="reimb-note-btn ${row.explanations ? 'has-note' : ''}" onclick="editReimbursableNote(${idx})" title="${esc(row.explanations || 'Add note')}">${row.explanations ? '<span class="reimb-note-dot"></span> Note' : 'Add note'}</button></td><td class="reimb-actions-cell"><button class="small" onclick="removeReimbursableRow(${idx})">Remove</button></td></tr>
          `).join('')}
        </tbody></table><div class="reimb-total"><div class="reimb-total-label">Grand total</div><div class="reimb-total-value" id="reimbGrandTotal">${money(total)}</div></div></div>

    ${navButtons()}
  </div>`;
}

function renderStep5(){
  return `<div class="card"><div class="empty">This step is empty for now.</div>
    ${navButtons()}
  </div>`;
}

function renderStep6(){
  return `<div class="card"><p>in developing</p>
    ${navButtons()}
  </div>`;
}

function renderStep7(){
  const s = computeSummary();
  return `<div class="card"><h2>Confirmation</h2><div class="row cols-4"><div class="metric"><div class="name">Total Revenue</div><div class="value">${money(s.totalRevenue)}</div></div><div class="metric"><div class="name">Total Cost</div><div class="value">${money(s.totalCost)}</div></div><div class="metric"><div class="name">Total Margin</div><div class="value">${money(s.totalMargin)}</div></div><div class="metric"><div class="name">Margin Rate</div><div class="value">${(s.marginRate*100).toFixed(1)}%</div></div></div>
    ${navButtons()}
  </div>`;
}

function renderStep(){
  document.body.classList.toggle("is-intro", currentStep === 0);
  document.getElementById("heroTitle").innerText = intro.appName || "MarginIQ";
  const heroSubtitle = document.getElementById("heroSubtitle");
  if (heroSubtitle) heroSubtitle.innerText = "For smart margin decisions";

  const el = document.getElementById("stepContent");
  const hero = document.querySelector(".hero");
  const stepsBar = document.getElementById("stepsBar");
  const progressWrap = document.querySelector(".progressWrap");
  const backstageToggle = document.getElementById("backstageToggle");

  if (backstageToggle){
    backstageToggle.setAttribute("onclick", "toggleMainMenu(event)");
  }
  updateMainMenuState();

  if (currentStep === 0){
    if (hero) hero.style.display = "none";
    if (stepsBar) stepsBar.style.display = "none";
    if (progressWrap) progressWrap.style.display = "none";
    el.innerHTML = renderLandingPage();
    attachHandlers();
    return;
  }

  if (hero) hero.style.display = "";
  if (stepsBar) stepsBar.style.display = "";
  if (progressWrap) progressWrap.style.display = "";

  if (showBackstage){
    el.innerHTML = renderBackstagePanel();
    attachHandlers();
    return;
  }

  if (currentStep===1) el.innerHTML = renderStep3();
  if (currentStep===2) el.innerHTML = renderStep4();
  if (currentStep===3) el.innerHTML = renderStep5();
  if (currentStep===4) el.innerHTML = renderStep6();
  if (currentStep===5) el.innerHTML = renderStep7();

  attachHandlers();
}

function renderAll(){
  renderStepsBar();
  renderStep();
  updateProgress();
}

function goToStep(step){ showBackstage = false; currentStep = Math.min(5, Math.max(1, step)); renderAll(); }
function nextStep(){
  saveCurrentStepState();

  if (currentStep === 2){
    document.querySelectorAll("[data-reimb-idx]").forEach((el) => {
      const evt = el.tagName === "SELECT" || el.tagName === "TEXTAREA" ? "input" : "input";
      el.addEventListener(evt, (e) => {
        const idx = Number(e.target.dataset.reimbIdx);
        const field = e.target.dataset.reimbField;
        if (!reimbursableRows[idx]) return;
        reimbursableRows[idx][field] = e.target.value;
        renderAll();
      });
    });
    return;
  }

  if (currentStep === 1){
    const missing = flatRates.some(p => !hasValidMarginRate(p));
    if (missing){
      alert("Please enter a Margin rate (%) for every Flat-Rate position before continuing.");
      return;
    }
  }
  if (currentStep<5) currentStep += 1;
  showBackstage = false;
  renderAll();
}
function prevStep(){ saveCurrentStepState(); if (currentStep>1) currentStep -= 1; showBackstage = false; renderAll(); }

function openBackstage(){ saveCurrentStepState(); showBackstage = true; renderStep(); }
function closeBackstage(){ saveCurrentStepState(); showBackstage = false; renderStep(); }

function closeMainMenu(){
  const shell = document.getElementById("mainMenuShell");
  const btn = document.getElementById("backstageToggle");
  if (shell) shell.classList.add("collapsed");
  if (btn) {
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Expand menu");
  }
}

function updateMainMenuState(){
  const menu = document.getElementById("mainMenuPopover");
  if (!menu) return;
  menu.querySelectorAll(".menu-option").forEach((item) => item.classList.remove("active"));
  const taxItem = menu.querySelector('[data-menu-action="tax"]');
  if (taxItem && showBackstage) {
    taxItem.classList.add("active");
    if (!taxItem.querySelector(".menu-status")) {
      const status = document.createElement("span");
      status.className = "menu-status";
      status.textContent = "Open";
      taxItem.appendChild(status);
    }
  } else if (taxItem) {
    const status = taxItem.querySelector(".menu-status");
    if (status) status.remove();
  }
}

function toggleMainMenu(event){
  if (event) event.stopPropagation();
  const shell = document.getElementById("mainMenuShell");
  const btn = document.getElementById("backstageToggle");
  if (!shell) return;
  updateMainMenuState();
  const shouldExpand = shell.classList.contains("collapsed");
  shell.classList.toggle("collapsed", !shouldExpand);
  if (btn) {
    btn.setAttribute("aria-expanded", shouldExpand ? "true" : "false");
    btn.setAttribute("aria-label", shouldExpand ? "Collapse menu" : "Expand menu");
  }
}

function openMenuItem(action){
  if (action === "tax") {
    openBackstage();
    return;
  }
  updateMainMenuState();
}

document.addEventListener("keydown", function(event){
  if (event.key === "Escape") closeMainMenu();
});

function openFlat(idx){
  flatRates.forEach((p, i) => { p._collapsed = i !== idx; });
  renderAll();
}
function collapseFlat(idx, force=false){
  if (!flatRates[idx]) return;
  const pos = flatRates[idx];
  if (!force && pos._dirty){
    const shouldSave = confirm("Save changes before collapsing this position?\n\nOK = Save and collapse\nCancel = Collapse without saving");
    if (shouldSave){
      saveFlat(idx);
      return;
    }
    pos._dirty = false;
  }
  pos._collapsed = true;
  renderAll();
}

function hasValidMarginRate(p){
  return p && String(p.marginRate ?? "").trim() !== "" && n(p.marginRate) > 0;
}

function saveFlat(idx){
  if (!flatRates[idx]) return;
  if (!hasValidMarginRate(flatRates[idx])){
    alert("Please enter a Margin rate (%) for this position before saving.");
    return;
  }
  flatRates[idx]._saved = true;
  flatRates[idx]._dirty = false;
  flatRates[idx]._collapsed = true;
  renderAll();
}
function addFlat(){
  flatRates.forEach(p => { p._collapsed = true; });

  const newPosition = syncFlatRateDerivedBasicFields(createFlatRatePosition());
  newPosition._collapsed = false;
  newPosition._saved = false;
  newPosition._dirty = true;

  flatRates.push(newPosition);
  renderAll();
}
function removeFlat(idx){ flatRates.splice(idx, 1); renderAll(); }

function addExpense(kind){
  if (kind==="reimbursable") reimbursables.push(createExpenseItem(kind));
  else nonReimbursables.push(createExpenseItem(kind));
  renderAll();
}
function removeExpense(kind, idx){
  if (kind==="reimbursable") reimbursables.splice(idx, 1);
  else nonReimbursables.splice(idx, 1);
  renderAll();
}

function saveCurrentStepState(){
  if (currentStep === 1){
    const user = document.getElementById("introUser");
    const appName = document.getElementById("introAppName");
    if (user) intro.userType = user.value;
    if (appName) intro.appName = appName.value;
  }
  if (showBackstage){
    backstage.implementationCountry = document.getElementById("bImplementationCountry").value;
    backstage.implementationMode = document.getElementById("bImplementationMode").value;
    if (typeof syncTaxSetupEngineToBackstage === "function") syncTaxSetupEngineToBackstage();
    syncDerivedWithholdingApplicability(true);
    backstage.germanVatApplicable = document.getElementById("bGermanVatApplicable").value === "true";
    backstage.germanVatRate = 0.19;
    backstage.germanVatExemption = document.getElementById("bGermanVatExemption").value === "true";
    backstage.germanVatReverseCharge = !!document.getElementById("bGermanVatReverseCharge") && document.getElementById("bGermanVatReverseCharge").value === "true";
    backstage.germanVatOffset = document.getElementById("bGermanVatOffset").value === "true";
    backstage.germanVatReimbursable = document.getElementById("bGermanVatReimbursable").value === "true";

    backstage.intraEuVatApplicable = document.getElementById("bIntraEuVatApplicable").value === "true";
    backstage.intraEuVatRate = n(document.getElementById("bIntraEuVatRate").value);
    const intraEuVatExemptionEl = document.getElementById("bIntraEuVatExemption");
    if (intraEuVatExemptionEl) backstage.intraEuVatExemption = intraEuVatExemptionEl.value === "true";
    backstage.intraEuVatReverseCharge = !!document.getElementById("bIntraEuVatReverseCharge") && document.getElementById("bIntraEuVatReverseCharge").value === "true";
    backstage.intraEuVatOffset = document.getElementById("bIntraEuVatOffset").value === "true";
    backstage.intraEuVatReimbursable = document.getElementById("bIntraEuVatReimbursable").value === "true";

    backstage.nonEuVatApplicable = document.getElementById("bNonEuVatApplicable").value === "true";
    backstage.nonEuVatRate = n(document.getElementById("bNonEuVatRate").value);
    backstage.nonEuVatExemption = document.getElementById("bNonEuVatExemption").value === "true";
    backstage.nonEuVatReverseCharge = !!document.getElementById("bNonEuVatReverseCharge") && document.getElementById("bNonEuVatReverseCharge").value === "true";
    backstage.nonEuVatOffset = document.getElementById("bNonEuVatOffset").value === "true";
    backstage.nonEuVatReimbursable = document.getElementById("bNonEuVatReimbursable").value === "true";

    backstage.otherIndirectTaxApplicable = document.getElementById("bOtherIndirectTaxApplicable").value === "true";
    backstage.otherIndirectTaxRate = n(document.getElementById("bOtherIndirectTaxRate").value);
    backstage.otherIndirectTaxExemption = document.getElementById("bOtherIndirectTaxExemption").value === "true";
    backstage.otherIndirectTaxReverseCharge = !!document.getElementById("bOtherIndirectTaxReverseCharge") && document.getElementById("bOtherIndirectTaxReverseCharge").value === "true";
    backstage.otherIndirectTaxOffset = document.getElementById("bOtherIndirectTaxOffset").value === "true";
    backstage.otherIndirectTaxReimbursable = document.getElementById("bOtherIndirectTaxReimbursable").value === "true";

    backstage.residentHqWhtApplicable = document.getElementById("bResidentHqWhtApplicable").value === "true";
    backstage.residentBranchWhtApplicable = document.getElementById("bResidentBranchWhtApplicable").value === "true";
    backstage.nonResidentHqWhtApplicable = document.getElementById("bNonResidentHqWhtApplicable").value === "true";
    backstage.nonResidentBranchWhtApplicable = document.getElementById("bNonResidentBranchWhtApplicable").value === "true";

    backstage.residentHqWhtRate = n(document.getElementById("bResidentHqWhtRate").value);
    backstage.residentHqWhtExemption = document.getElementById("bResidentHqWhtExemption").value === "true";
    backstage.residentHqWhtGrossedUp = false;
    backstage.residentHqWhtReimbursable = document.getElementById("bResidentHqWhtReimbursable").value === "true";

    backstage.residentBranchWhtRate = n(document.getElementById("bResidentBranchWhtRate").value);
    backstage.residentBranchWhtExemption = document.getElementById("bResidentBranchWhtExemption").value === "true";
    backstage.residentBranchWhtGrossedUp = false;
    backstage.residentBranchWhtReimbursable = document.getElementById("bResidentBranchWhtReimbursable").value === "true";

    backstage.nonResidentHqWhtRate = n(document.getElementById("bNonResidentHqWhtRate").value);
    backstage.nonResidentHqWhtExemption = document.getElementById("bNonResidentHqWhtExemption").value === "true";
    backstage.nonResidentHqWhtGrossedUp = document.getElementById("bNonResidentHqWhtGrossedUp").value === "true";
    backstage.nonResidentHqWhtReimbursable = document.getElementById("bNonResidentHqWhtReimbursable").value === "true";

    backstage.nonResidentBranchWhtRate = n(document.getElementById("bNonResidentBranchWhtRate").value);
    backstage.nonResidentBranchWhtExemption = document.getElementById("bNonResidentBranchWhtExemption").value === "true";
    backstage.nonResidentBranchWhtGrossedUp = document.getElementById("bNonResidentBranchWhtGrossedUp").value === "true";
    backstage.nonResidentBranchWhtReimbursable = document.getElementById("bNonResidentBranchWhtReimbursable").value === "true";

    backstage.residentWhtApplicable = backstage.residentHqWhtApplicable || backstage.residentBranchWhtApplicable;
    backstage.residentWhtRate = backstage.residentHqWhtRate;
    backstage.residentWhtExemption = backstage.residentHqWhtExemption;
    backstage.residentWhtGrossedUp = false;
    backstage.residentWhtReimbursable = backstage.residentHqWhtReimbursable;

    backstage.nonResidentWhtApplicable = backstage.nonResidentHqWhtApplicable || backstage.nonResidentBranchWhtApplicable;
    backstage.nonResidentWhtRate = backstage.nonResidentHqWhtRate;
    backstage.nonResidentWhtExemption = backstage.nonResidentHqWhtExemption;
    backstage.nonResidentWhtGrossedUp = backstage.nonResidentHqWhtGrossedUp;
    backstage.nonResidentWhtReimbursable = backstage.nonResidentHqWhtReimbursable;

    [
      "residentHqAnotherDirectTax",
      "residentBranchAnotherDirectTax",
      "nonResidentHqAnotherDirectTax",
      "nonResidentBranchAnotherDirectTax"
    ].forEach((prefix) => {
      const cap = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      const get = (suffix) => document.getElementById(`b${cap}${suffix}`);
      if (get("Applicable")) backstage[`${prefix}Applicable`] = get("Applicable").value === "true";
      if (get("Rate")) backstage[`${prefix}Rate`] = n(get("Rate").value);
      if (get("Exemption")) backstage[`${prefix}Exemption`] = get("Exemption").value === "true";
      if (get("GrossedUp")) backstage[`${prefix}GrossedUp`] = get("GrossedUp").value === "true";
      if (get("Reimbursable")) backstage[`${prefix}Reimbursable`] = get("Reimbursable").value === "true";
    });

    backstage.residentHqAnotherDirectTaxGrossedUp = false;
    backstage.residentBranchAnotherDirectTaxGrossedUp = false;

    if (String(backstage.implementationMode || "").trim() === "Branch performs contract") {
      ["residentHqAnotherDirectTax", "nonResidentHqAnotherDirectTax"].forEach((prefix) => {
        backstage[`${prefix}Applicable`] = false;
        backstage[`${prefix}Rate`] = 0;
        backstage[`${prefix}Exemption`] = false;
        backstage[`${prefix}GrossedUp`] = false;
        backstage[`${prefix}Reimbursable`] = false;
      });
      backstage.residentHqWhtApplicable = false;
      backstage.nonResidentHqWhtApplicable = false;
      backstage.residentHqWhtGrossedUp = false;
      backstage.nonResidentHqWhtGrossedUp = false;
    }

    backstage.doubleTaxAgreementCountries = Array.from(document.getElementById("bDoubleTaxAgreementCountries").selectedOptions).map(option => option.value);
  }
}

function updateFlatPositionHeader(idx){
  const pos = flatRates[idx];
  if (!pos) return;
  const cards = document.querySelectorAll(".position");
  const card = cards[idx];
  if (!card) return;
  const h4 = card.querySelector(".top-actions h4");
  if (!h4) return;
  h4.textContent = positionDisplayTitle(pos, idx);
}

function updateVatLabelDom(){
  const input = document.getElementById("bImplementationCountry");
  const country = String((input && input.value) || backstage.implementationCountry || "").trim();
  const isEu = isEuImplementationCountry(country);
  const isGermany = country.toLowerCase() === "germany";
  document.querySelectorAll('[data-vat-kind="intra-eu"]').forEach((el) => {
    el.textContent = (country && isEu && !isGermany) ? `Intra-EU VAT (${country})` : "Intra-EU VAT";
  });
  document.querySelectorAll('[data-vat-kind="non-eu"]').forEach((el) => {
    el.textContent = (country && !isEu) ? `Non-EU VAT (${country})` : "Non-EU VAT";
  });
}

function refreshBackstageCountryDependentUi(){
  const input = document.getElementById("bImplementationCountry");
  if (input) backstage.implementationCountry = input.value;
  updateVatLabelDom();
}

function attachHandlers(){
  if (currentStep === 0){
    document.getElementById("introUserLanding")?.addEventListener("change", (e)=>{ intro.userType = e.target.value; });
    return;
  }

  if (currentStep === 2){
    document.querySelectorAll("[data-reimb-idx]").forEach((el) => {
      const idx = Number(el.dataset.reimbIdx);
      const field = el.dataset.reimbField;
      if (Number.isNaN(idx) || !field || !reimbursableRows[idx]) return;
      const isNumeric = field === "number" || field === "budgetPrice";

      if (isNumeric) {
        el.addEventListener("input", (e) => {
          handleGermanLiveFormattedInput(e);
          syncReimbursableField(idx, field, e.target.value);
        });
        el.addEventListener("blur", (e) => {
          reimbursableRows[idx][field] = n(e.target.value);
          e.target.value = formatPlainNumber(reimbursableRows[idx][field]);
          updateReimbursablesStepOutputs();
        });
        el.addEventListener("change", (e) => syncReimbursableField(idx, field, e.target.value));
      } else {
        el.addEventListener("input", (e) => syncReimbursableField(idx, field, e.target.value));
        el.addEventListener("change", (e) => syncReimbursableField(idx, field, e.target.value));
      }
    });
    updateReimbursablesStepOutputs();
    return;
  }

  if (currentStep === 1){
    document.getElementById("introUser")?.addEventListener("change", (e)=>{ intro.userType = e.target.value; });
    document.getElementById("introAppName")?.addEventListener("input", (e)=>{
      intro.appName = e.target.value;
      const hero = document.getElementById("heroTitle");
      if (hero) hero.innerText = intro.appName || "MarginIQ";
    });
  }

  [
    "bImplementationCountry","bImplementationMode",
    "bClientApplyGermanVat","bClientVatCollected","bClientVatRate","bClientVatNoReason","bClientVatReverseChargeBasis","bClientVatExplanation",
    "bEngineImplVatRate","bEngineVatExemption","bEngineVatOffset","bEngineVatReimbursable","bEngineResidentWhtRate","bEngineNonResidentWhtRate","bEngineDeductionExemption","bEngineDeductionReimbursable",
    "bGermanVatApplicable","bGermanVatRate","bGermanVatExemption","bGermanVatReverseCharge","bGermanVatOffset","bGermanVatReimbursable",
    "bIntraEuVatApplicable","bIntraEuVatRate","bIntraEuVatExemption","bIntraEuVatReverseCharge","bIntraEuVatOffset","bIntraEuVatReimbursable",
    "bNonEuVatApplicable","bNonEuVatRate","bNonEuVatExemption","bNonEuVatReverseCharge","bNonEuVatOffset","bNonEuVatReimbursable",
    "bOtherIndirectTaxApplicable","bOtherIndirectTaxRate","bOtherIndirectTaxExemption","bOtherIndirectTaxReverseCharge","bOtherIndirectTaxOffset","bOtherIndirectTaxReimbursable",
    "bResidentHqWhtApplicable","bResidentBranchWhtApplicable","bNonResidentHqWhtApplicable","bNonResidentBranchWhtApplicable",
    "bResidentHqWhtRate","bResidentHqWhtExemption","bResidentHqWhtGrossedUp","bResidentHqWhtReimbursable",
    "bResidentBranchWhtRate","bResidentBranchWhtExemption","bResidentBranchWhtGrossedUp","bResidentBranchWhtReimbursable",
    "bNonResidentHqWhtRate","bNonResidentHqWhtExemption","bNonResidentHqWhtGrossedUp","bNonResidentHqWhtReimbursable",
    "bNonResidentBranchWhtRate","bNonResidentBranchWhtExemption","bNonResidentBranchWhtGrossedUp","bNonResidentBranchWhtReimbursable",
    "bResidentHqAnotherDirectTaxApplicable","bResidentHqAnotherDirectTaxRate","bResidentHqAnotherDirectTaxExemption","bResidentHqAnotherDirectTaxGrossedUp","bResidentHqAnotherDirectTaxReimbursable",
    "bResidentBranchAnotherDirectTaxApplicable","bResidentBranchAnotherDirectTaxRate","bResidentBranchAnotherDirectTaxExemption","bResidentBranchAnotherDirectTaxGrossedUp","bResidentBranchAnotherDirectTaxReimbursable",
    "bNonResidentHqAnotherDirectTaxApplicable","bNonResidentHqAnotherDirectTaxRate","bNonResidentHqAnotherDirectTaxExemption","bNonResidentHqAnotherDirectTaxGrossedUp","bNonResidentHqAnotherDirectTaxReimbursable",
    "bNonResidentBranchAnotherDirectTaxApplicable","bNonResidentBranchAnotherDirectTaxRate","bNonResidentBranchAnotherDirectTaxExemption","bNonResidentBranchAnotherDirectTaxGrossedUp","bNonResidentBranchAnotherDirectTaxReimbursable",
    "bDoubleTaxAgreementCountries"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    const syncFn = () => {
      saveCurrentStepState();
      flatRates.forEach((_, idx) => updateFlatPositionCalculatedOutputs(idx));
    };

    el.addEventListener("input", syncFn);
    el.addEventListener("change", syncFn);
  });

  const fullTaxLogicDetails = document.getElementById("fullTaxLogicDetails");
  if (fullTaxLogicDetails) {
    window.__fullTaxLogicOpen = fullTaxLogicDetails.open;
    fullTaxLogicDetails.addEventListener("toggle", () => {
      window.__fullTaxLogicOpen = fullTaxLogicDetails.open;
    });
  }

  document.querySelectorAll('[data-indirect-scenario]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setIndirectTaxScenario(btn.dataset.indirectEntity || 'hq', btn.dataset.indirectScenario || 'germany');
    });
  });

  const implementationModeInput = document.getElementById('bImplementationMode');
  if (implementationModeInput) {
    const syncModeDrivenWithholding = () => {
      const previousImplementationMode = String(backstage.implementationMode || "").trim();
      backstage.implementationMode = implementationModeInput.value;
      const currentImplementationMode = String(backstage.implementationMode || "").trim();
      const shouldResetBranchOtherDeductions = currentImplementationMode === "Branch performs contract" && (previousImplementationMode !== currentImplementationMode || window.__resetBranchOtherDeductionsOnNextModeSync);
      syncDerivedWithholdingApplicability(true);
      updateContractingLogicCardDOM();
      saveCurrentStepState();
      if (shouldResetBranchOtherDeductions && typeof resetBranchOtherDeductionsDefaults === "function") {
        resetBranchOtherDeductionsDefaults();
      }
      window.__resetBranchOtherDeductionsOnNextModeSync = false;
      flatRates.forEach((_, idx) => updateFlatPositionCalculatedOutputs(idx));

      const basicsDetails = document.getElementById('basicsDetails');
      if (window.__keepBasicsOpenAfterModeCardSelection) {
        window.__basicsDetailsOpen = true;
        if (basicsDetails) basicsDetails.open = true;
      } else if (basicsDetails) {
        window.__basicsDetailsOpen = basicsDetails.open;
      }

      if (showBackstage && typeof renderStep === "function") {
        renderStep();
      } else if (typeof renderAll === "function") {
        renderAll();
      }
    };

    window.syncModeDrivenWithholding = syncModeDrivenWithholding;

    syncDerivedWithholdingApplicability(true);
    updateContractingLogicCardDOM();
    implementationModeInput.addEventListener('change', syncModeDrivenWithholding);
    implementationModeInput.addEventListener('input', syncModeDrivenWithholding);
  }

  const basicsDetails = document.getElementById('basicsDetails');
  if (basicsDetails) {
    window.__basicsDetailsOpen = basicsDetails.open;
    basicsDetails.addEventListener('toggle', () => {
      window.__basicsDetailsOpen = basicsDetails.open;
    });
  }

  const implementationCountryInput = document.getElementById('bImplementationCountry');
  if (implementationCountryInput) {
    let lastImplementationCountry = String(backstage.implementationCountry || '').trim().toLowerCase();

    const clearDtaSelectionsForImplementationCountryChange = () => {
      const nextImplementationCountry = String(implementationCountryInput.value || '').trim().toLowerCase();
      if (nextImplementationCountry === lastImplementationCountry) return;

      const select = document.getElementById('bDoubleTaxAgreementCountries');
      if (select) {
        Array.from(select.options).forEach((opt) => { opt.selected = false; });
      }

      backstage.doubleTaxAgreementCountries = [];

      document.querySelectorAll('[data-dta-country]').forEach((btn) => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      });

      lastImplementationCountry = nextImplementationCountry;
      saveCurrentStepState();
      flatRates.forEach((_, idx) => updateFlatPositionCalculatedOutputs(idx));
    };

    implementationCountryInput.addEventListener('change', clearDtaSelectionsForImplementationCountryChange);
    implementationCountryInput.addEventListener('input', clearDtaSelectionsForImplementationCountryChange);
    implementationCountryInput.addEventListener('change', refreshBackstageCountryDependentUi);
    implementationCountryInput.addEventListener('input', refreshBackstageCountryDependentUi);
    updateVatLabelDom();
  }

  document.querySelectorAll('[data-dta-country]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const country = btn.dataset.dtaCountry;
      const select = document.getElementById('bDoubleTaxAgreementCountries');
      if (!country || !select) return;
      let nextSelected = false;
      Array.from(select.options).forEach((opt) => {
        if (opt.value === country) {
          opt.selected = !opt.selected;
          nextSelected = opt.selected;
        }
      });
      document.querySelectorAll(`[data-dta-country="${CSS.escape(country)}"]`).forEach((match) => {
        match.classList.toggle('selected', nextSelected);
        match.setAttribute('aria-pressed', nextSelected ? 'true' : 'false');
      });
      saveCurrentStepState();
      flatRates.forEach((_, idx) => updateFlatPositionCalculatedOutputs(idx));
    });
  });

  if (currentStep === 1){
    document.querySelectorAll(".flat-input").forEach(el => {
      const idx = parseInt(el.dataset.idx, 10);
      const field = el.dataset.field;
      if (Number.isNaN(idx) || !field || !flatRates[idx]) return;
      const isNumeric = ["feeRate","feeQty","housingRate","housingQty","perDiemRate","perDiemQty","transportRate","transportQty","otherRate","otherQty","insuranceRate","insuranceQty","otherCostRate","otherCostQty","nonTaxableAllowances","reimbursables","nonReimbursables","marginRate"].includes(field);

      const syncFlat = (e) => {
        flatRates[idx][field] = isNumeric ? n(e.target.value) : e.target.value;
        flatRates[idx]._saved = false;
        flatRates[idx]._dirty = true;
        if (field === "title" || field === "name") updateFlatPositionHeader(idx);
        updateFlatPositionCalculatedOutputs(idx);
      };

      if (shouldFormatFlatField(field)) {
        el.addEventListener("input", (e) => {
          handleGermanLiveFormattedInput(e);
          syncFlat(e);
        });
        el.addEventListener("blur", (e) => {
          flatRates[idx][field] = n(e.target.value);
          e.target.value = formatPlainNumber(flatRates[idx][field]);
          updateFlatPositionCalculatedOutputs(idx);
        });
        el.addEventListener("change", syncFlat);
      } else {
        el.addEventListener("input", syncFlat);
        el.addEventListener("change", syncFlat);
      }
    });

    flatRates.forEach((_, idx) => updateFlatPositionHeader(idx));

    document.querySelectorAll(".expense-input").forEach(el => {
      const idx = parseInt(el.dataset.idx, 10);
      const kind = el.dataset.kind;
      const field = el.dataset.field;
      el.addEventListener("input", (e) => {
        const arr = kind === "reimbursable" ? reimbursables : nonReimbursables;
        if (!arr[idx]) return;
        arr[idx][field] = field === "amount" ? n(e.target.value) : e.target.value;
      });
    });
  }
}

function updateFlatPositionCalculatedOutputs(idx){
  if (!flatRates[idx]) return;

  const p = flatRates[idx];
  const c = computePosition(p);
  const totalForShare = Math.max(0.0001, (c.remunerationTotal + c.nonRemunerationTotal) || 0);
  const resident = String(p.countryOfResidence || "").trim().toLowerCase() === String(backstage.implementationCountry || "").trim().toLowerCase();
  const residentWht = c.whtRate > 0 && c.standardWht > 0 && resident ? c.standardWht : 0;
  const nonResidentWht = c.whtRate > 0 && c.standardWht > 0 && !resident ? c.standardWht : 0;

  const map = {
    fee: c.fee,
    housing: c.housing,
    perDiem: c.perDiem,
    insurance: c.insurance,
    transport: c.transport,
    other: c.other,
    otherCost: c.otherCost,
    marginRate: c.marginRateDecimal * 100
  };

  Object.entries(map).forEach(([prefix, value]) => {
    const totalEl = document.getElementById(`component-total-${idx}-${prefix}`);
    if (totalEl) totalEl.textContent = prefix === 'marginRate' ? `${formatPlainNumber(value)}%` : money(value);
    const shareEl = document.getElementById(`component-share-${idx}-${prefix}`);
    if (shareEl) {
      const share = ((value || 0) / totalForShare) * 100;
      shareEl.textContent = `${share.toFixed(1).replace('.', ',')}%`;
    }
  });

  const metricValues = {
    Gj: c.remunerationTotal,
    Gjtax: c.taxableBase,
    GrossUp: c.grossUpAmount,
    Nj: c.netRemuneration,
    GermanVat: c.germanVat,
    IntraEuVat: c.intraEuVat,
    NonEuVat: c.nonEuVat,
    TotalIndirect: c.indirectCollected,
    VatCollected: c.vatCollected || c.indirectCollected || 0,
    VatCost: c.vatCost || c.indirectCost || 0,
    ResidentWht: residentWht,
    NonResidentWht: nonResidentWht,
    OtherDeductions: 0,
    TotalDeduction: c.directDeductionsTotal,
    Transfer: c.transfer,
    NotPartRemuneration: c.notPartOfRemuneration || c.nonRemunerationTotal,
    CompanyCost: c.companyCost,
    Revenue: c.revenue
  };

  Object.entries(metricValues).forEach(([key, value]) => {
    const el = document.getElementById(`metric-${idx}-${key}`);
    if (el) el.textContent = money(value);
  });
  const marginRateEl = document.getElementById(`metric-${idx}-MarginRate`);
  if (marginRateEl) marginRateEl.textContent = `${formatPlainNumber(c.marginRateDecimal * 100)}%`;

  const implementationCountryEl = document.getElementById(`computed-ITR-country-${idx}`);
  if (implementationCountryEl) implementationCountryEl.value = getImplementationCountryForPosition();
  const taxStatusEl = document.getElementById(`computed-tax-status-${idx}`);
  if (taxStatusEl) {
    const taxStatusValue = deriveTaxStatus(p);
    taxStatusEl.value = derivedCalculationValue(taxStatusValue);
    taxStatusEl.classList.toggle("derived-pending", !String(taxStatusValue || "").trim());
  }
  const ceEl = document.getElementById(`computed-contracting-entity-${idx}`);
  if (ceEl) ceEl.value = c.contractingEntity || "";
  const vatEl = document.getElementById(`computed-vat-jurisdiction-${idx}`);
  if (vatEl) {
    const vatValue = c.vatJurisdiction || deriveVatJurisdiction(p);
    vatEl.value = derivedCalculationValue(displayVatJurisdiction(vatValue));
    vatEl.classList.toggle("derived-pending", !String(vatValue || "").trim());
  }
}

let ceOverwriteModalState = {
  idx: null,
  step: 1,
  draftValue: "",
  reasonCode: "",
  reasonText: "",
  accepted: false
};

function handleContractingEntityGearClick(idx){
  const p = flatRates[idx];
  if (!p) return;

  if (hasContractingEntityOverwrite(p)) {
    openContractingEntityResetConfirm(idx);
  } else {
    openContractingEntityOverwriteModal(idx);
  }
}

function openContractingEntityResetConfirm(idx){
  const p = flatRates[idx];
  if (!p) return;

  const autoValue = getAutoContractingEntity(p);
  const modal = document.getElementById("ceOverwriteModal");
  if (!modal) return;

  modal.hidden = false;
  document.getElementById("ceModalSteps").innerHTML = "";
  document.getElementById("ceModalTitle").textContent = "Reset to automatic";
  document.getElementById("ceModalBody").innerHTML = `
    <div class="ce-modal-stack"><p>Are you sure you want to return to the automatic value: <strong>${esc(autoValue || "â")}</strong>?</p><div class="ce-cons-box">
        This will remove the overwrite and restore the system-derived contracting entity.
      </div></div>
  `;
  document.getElementById("ceModalFooter").innerHTML = `
    <button type="button" class="secondary" onclick="closeContractingEntityOverwriteModal()">Cancel</button><button type="button" class="primary" onclick="confirmResetContractingEntity(${idx})">Reset to automatic</button>
  `;
}

function confirmResetContractingEntity(idx){
  const p = flatRates[idx];
  if (!p) return;

  p.contractingEntityOverwriteActive = false;
  p.contractingEntityOverwriteValue = "";
  p.contractingEntityOverwriteReasonCode = "";
  p.contractingEntityOverwriteReasonText = "";
  p.contractingEntityOverwriteAccepted = false;
  p.contractingEntityOverwriteMeta = null;

  p._saved = false;
  p._dirty = true;

  closeContractingEntityOverwriteModal();
  renderAll();
}

function openContractingEntityOverwriteModal(idx){
  const p = flatRates[idx];
  if (!p) return;

  ceOverwriteModalState = {
    idx,
    step: 1,
    draftValue: getAlternativeContractingEntity(p),
    reasonCode: p.contractingEntityOverwriteReasonCode || "",
    reasonText: p.contractingEntityOverwriteReasonText || "",
    accepted: false
  };

  const modal = document.getElementById("ceOverwriteModal");
  if (modal) modal.hidden = false;
  renderContractingEntityOverwriteModal();
}

function closeContractingEntityOverwriteModal(){
  const modal = document.getElementById("ceOverwriteModal");
  if (modal) modal.hidden = true;
}

function renderOverwriteReasonOption(value, label){
  const checked = ceOverwriteModalState.reasonCode === value ? "checked" : "";
  return `
    <label class="ce-reason-option"><input type="radio" name="ceOverwriteReasonCode" value="${esc(value)}" ${checked} onchange="ceOverwriteModalState.reasonCode = this.value"><span>${esc(label)}</span></label>
  `;
}

function renderContractingEntityOverwriteModal(){
  const { idx, step } = ceOverwriteModalState;
  const p = flatRates[idx];
  if (!p) return;

  const autoValue = getAutoContractingEntity(p);
  const altValue = ceOverwriteModalState.draftValue || getAlternativeContractingEntity(p);
  const steps = ["Overwrite", "Justification", "Consequences", "Confirmation"];

  document.getElementById("ceModalSteps").innerHTML = steps.map((label, i) => `
    <div class="ce-modal-step ${step === (i + 1) ? "active" : ""}">${label}</div>
  `).join("");

  if (step === 1){
    document.getElementById("ceModalTitle").textContent = "Overwrite";
    document.getElementById("ceModalBody").innerHTML = `
      <div class="ce-modal-stack"><p>The contracting entity was assigned automatically. Overwriting will replace it with the alternative option.</p><div class="ce-modal-grid"><div class="metric-line"><div class="metric-label">Current value</div><div class="metric-value">${esc(autoValue || "â")}</div></div><div class="metric-line"><div class="metric-label">Alternative value</div><div class="metric-value">${esc(altValue || "â")}</div></div></div></div>
    `;
    document.getElementById("ceModalFooter").innerHTML = `
      <button type="button" class="secondary" onclick="closeContractingEntityOverwriteModal()">Cancel</button><button type="button" class="primary" onclick="nextContractingEntityOverwriteStep()">Overwrite</button>
    `;
  }

  if (step === 2){
    document.getElementById("ceModalTitle").textContent = "Justify overwrite";
    document.getElementById("ceModalBody").innerHTML = `
      <div class="ce-modal-stack"><p>You must provide a reason before continuing.</p><div class="ce-reason-list">
          ${renderOverwriteReasonOption("Taxes are too expensive", "Taxes are too expensive")}
          ${renderOverwriteReasonOption("The provider refused the initial proposal", "The provider refused the initial proposal")}
          ${renderOverwriteReasonOption("Any other reason", "Any other reason")}
        </div><div><label>Explanation</label><textarea id="ceOverwriteReasonText" placeholder="Provide explanation" oninput="ceOverwriteModalState.reasonText = this.value">${esc(ceOverwriteModalState.reasonText || "")}</textarea></div></div>
    `;
    document.getElementById("ceModalFooter").innerHTML = `
      <button type="button" class="secondary" onclick="prevContractingEntityOverwriteStep()">Back</button><button type="button" class="primary" onclick="nextContractingEntityOverwriteStep()">Continue</button>
    `;
  }

  if (step === 3){
    document.getElementById("ceModalTitle").textContent = "Consequences";
    document.getElementById("ceModalBody").innerHTML = `
      <div class="ce-modal-stack"><p>Overwriting may affect calculations, compliance, or approvals.</p><div class="ce-cons-box">No specific consequences are currently configured. Future versions may include financial or compliance impacts.</div></div>
    `;
    document.getElementById("ceModalFooter").innerHTML = `
      <button type="button" class="secondary" onclick="prevContractingEntityOverwriteStep()">Back</button><button type="button" class="primary" onclick="nextContractingEntityOverwriteStep()">Continue</button>
    `;
  }

  if (step === 4){
    document.getElementById("ceModalTitle").textContent = "Confirm overwrite";
    document.getElementById("ceModalBody").innerHTML = `
      <div class="ce-modal-stack"><div class="ce-modal-grid"><div class="metric-line"><div class="metric-label">From</div><div class="metric-value">${esc(autoValue || "â")}</div></div><div class="metric-line"><div class="metric-label">To</div><div class="metric-value">${esc(altValue || "â")}</div></div><div class="metric-line"><div class="metric-label">Reason</div><div class="metric-value">${esc(ceOverwriteModalState.reasonCode || "â")}</div></div><div class="metric-line"><div class="metric-label">Explanation</div><div class="metric-value">${esc(ceOverwriteModalState.reasonText || "â")}</div></div></div><label class="ce-final-check"><input type="checkbox" ${ceOverwriteModalState.accepted ? "checked" : ""} onchange="ceOverwriteModalState.accepted = this.checked"><span>I understand that this action overrides the automatic assignment.</span></label></div>
    `;
    document.getElementById("ceModalFooter").innerHTML = `
      <button type="button" class="secondary" onclick="prevContractingEntityOverwriteStep()">Back</button><button type="button" class="primary" onclick="confirmContractingEntityOverwrite()">Confirm overwrite</button>
    `;
  }
}

function nextContractingEntityOverwriteStep(){
  const { step } = ceOverwriteModalState;
  if (step === 2){
    const text = String(ceOverwriteModalState.reasonText || "").trim();
    if (!ceOverwriteModalState.reasonCode){
      alert("Please select a reason before continuing.");
      return;
    }
    if (text.length < 15){
      alert("Please provide a more complete explanation before continuing.");
      return;
    }
  }
  if (step < 4){
    ceOverwriteModalState.step += 1;
    renderContractingEntityOverwriteModal();
  }
}

function prevContractingEntityOverwriteStep(){
  if (ceOverwriteModalState.step > 1){
    ceOverwriteModalState.step -= 1;
    renderContractingEntityOverwriteModal();
  }
}

function confirmContractingEntityOverwrite(){
  const { idx, draftValue, reasonCode, reasonText, accepted } = ceOverwriteModalState;
  const p = flatRates[idx];
  if (!p) return;
  if (!accepted){
    alert("You must accept the overwrite before continuing.");
    return;
  }
  p.contractingEntityOverwriteActive = true;
  p.contractingEntityOverwriteValue = draftValue;
  p.contractingEntityOverwriteReasonCode = reasonCode;
  p.contractingEntityOverwriteReasonText = reasonText.trim();
  p.contractingEntityOverwriteAccepted = true;
  p.contractingEntityOverwriteMeta = {
    timestamp: new Date().toISOString(),
    source: "manual-overwrite"
  };
  p._saved = false;
  closeContractingEntityOverwriteModal();
  renderAll();
}

function resetContractingEntityOverwrite(idx){
  const p = flatRates[idx];
  if (!p) return;
  p.contractingEntityOverwriteActive = false;
  p.contractingEntityOverwriteValue = "";
  p.contractingEntityOverwriteReasonCode = "";
  p.contractingEntityOverwriteReasonText = "";
  p.contractingEntityOverwriteAccepted = false;
  p.contractingEntityOverwriteMeta = null;
  p._saved = false;
  renderAll();
}

window.addEventListener("DOMContentLoaded", ()=>{
  flatRates = [];
  renderAll();
});

(function(){
  if (window.MIQRender && window.MIQRender.__centralHooksV1) return;
  var beforeHooks = [];
  var afterHooks = [];
  var installed = Object.create(null);
  var pendingAfter = Object.create(null);

  function asList(names){ return Array.isArray(names) ? names : [names]; }
  function runHooks(list, name){
    list.slice().forEach(function(item){
      if (item.names.indexOf(name) === -1 && item.names.indexOf('*') === -1) return;
      try { item.fn(name); } catch(e) { console.error(e); }
    });
  }
  function scheduleAfter(name){
    if (pendingAfter[name]) return;
    pendingAfter[name] = true;
    (window.requestAnimationFrame || function(fn){ return setTimeout(fn, 0); })(function(){
      pendingAfter[name] = false;
      runHooks(afterHooks, name);
    });
  }
  function wrap(name){
    var fn = window[name];
    if (typeof fn !== 'function' || fn.__miqCentralWrapped) return;
    var wrapped = function(){
      runHooks(beforeHooks, name);
      var result = fn.apply(this, arguments);
      scheduleAfter(name);
      return result;
    };
    wrapped.__miqCentralWrapped = true;
    wrapped.__miqOriginal = fn;
    window[name] = wrapped;
    installed[name] = true;
  }
  function install(){
    ['renderAll','renderStep','renderBackstageForm'].forEach(wrap);
  }
  window.MIQRender = {
    __centralHooksV1: true,
    before: function(names, fn){ beforeHooks.push({names:asList(names), fn:fn}); install(); },
    after: function(names, fn){ afterHooks.push({names:asList(names), fn:fn}); install(); },
    install: install,
    runAfter: scheduleAfter
  };
  install();
  document.addEventListener('DOMContentLoaded', install);
  setTimeout(install, 0);
  setTimeout(install, 300);
})();

document.addEventListener("change", function(e){
  const sel = e.target;
  if (!sel.matches('select[data-field="inputMode"]')) return;
  const wrap = sel.parentElement;
  if (!wrap) return;
  let warn = wrap.querySelector('.inline-warning');
  const val = String(sel.value || '').toLowerCase();
  if (val && val !== 'gross') {
    if (!warn) {
      warn = document.createElement('div');
      warn.className = 'inline-warning';
      warn.textContent = 'It is recommendable to always negotiate gross. Continue only if you are sure.';
      wrap.appendChild(warn);
    }
  } else if (warn) {
    warn.remove();
  }
}, true);

(function(){
  let isRenderingFromCard = false;

  function getModeSelect(){ return document.getElementById("bImplementationMode"); }
  function modeFromCard(card){
    const txt = String(card.textContent || "").toLowerCase();
    if(txt.includes("no branch")) return "No Branch";
    if(txt.includes("performs contract")) return "Branch performs contract";
    return "Branch for local support";
  }
  function wireCards(){
    document.querySelectorAll(".contracting-flow-node").forEach(function(card){
      if(card.dataset.v34Wired === "1") return;
      card.dataset.v34Wired = "1";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      function selectThisCard(){
        if(isRenderingFromCard) return;
        const basicsDetails = document.getElementById("basicsDetails");
        window.__keepBasicsOpenAfterModeCardSelection = true;
        window.__basicsDetailsOpen = true;
        if(basicsDetails) basicsDetails.open = true;
        const mode = modeFromCard(card);
        const select = getModeSelect();
        if(select) select.value = mode;
        try{
          if(typeof backstage !== "undefined"){
            const previousImplementationMode = String(backstage.implementationMode || "").trim();
            if (mode === "Branch performs contract" && previousImplementationMode !== mode) {
              window.__resetBranchOtherDeductionsOnNextModeSync = true;
            }
          }
        }catch(e){}
        isRenderingFromCard = true;
        try{
          if(window.syncModeDrivenWithholding && typeof window.syncModeDrivenWithholding === "function"){
            window.syncModeDrivenWithholding();
          }else{
            if(typeof syncDerivedWithholdingApplicability === "function") syncDerivedWithholdingApplicability(true);
            if(typeof saveCurrentStepState === "function") saveCurrentStepState();
            if(typeof renderStep === "function") renderStep(); else if(typeof renderAll === "function") renderAll();
          }
        }finally{
          isRenderingFromCard = false;
          window.__basicsDetailsOpen = true;
          setTimeout(function(){
            var details = document.getElementById("basicsDetails");
            if(details) details.open = true;
            window.__keepBasicsOpenAfterModeCardSelection = false;
          }, 0);
          setTimeout(function(){ var details = document.getElementById("basicsDetails"); if(details) details.open = true; }, 80);
        }
      }
      card.addEventListener("click", selectThisCard);
      card.addEventListener("keydown", function(e){ if(e.key === "Enter" || e.key === " "){ e.preventDefault(); selectThisCard(); } });
    });
  }
  document.addEventListener("DOMContentLoaded", wireCards);
  if (window.MIQRender) window.MIQRender.after(['renderAll','renderBackstageForm'], wireCards);
})();

(function(){
  function escSafe(v){ return (typeof esc === 'function') ? esc(v) : String(v ?? '').replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  window.renderDeductionsMatrixForContract = function({ residentDirectConfig, residentAnotherConfig, nonResidentDirectConfig, nonResidentAnotherConfig, forceDirectNo = false }){
    const resident = normalizedDeductionConfigsForContract({ residencyKey: "resident", withholdingConfig: residentDirectConfig, anotherConfig: residentAnotherConfig, forceNo: forceDirectNo });
    const nonResident = normalizedDeductionConfigsForContract({ residencyKey: "nonResident", withholdingConfig: nonResidentDirectConfig, anotherConfig: nonResidentAnotherConfig, forceNo: forceDirectNo });
    const withholdingRows = [
      renderDeductionMatrixRow("Residents", "Withholding tax", resident.whtConfig),
      renderDeductionMatrixRow("Non-residents", "Withholding tax", nonResident.whtConfig)
    ];
    const otherRows = [
      renderDeductionMatrixRow("Residents", "Other deductions", resident.otherDirectConfig),
      renderDeductionMatrixRow("Non-residents", "Other deductions", nonResident.otherDirectConfig)
    ];
    return `
      <section class="tax-logic-section tax-logic-deductions" aria-label="Deductions rules"><header class="tax-logic-section-head"><div><h3 class="tax-logic-section-title">Deductions</h3></div></header><div class="tax-logic-section-body"><div class="tax-rule-card"><div class="tax-rule-card-head"><div class="tax-rule-title">Withholding tax</div></div><div class="tax-rule-card-body">${renderDeductionsMatrixTable(withholdingRows)}</div></div><details class="tax-rule-details other-deductions-details"><summary><span>Other deductions</span><span class="tax-chevron">â</span></summary>
            ${renderDeductionsMatrixTable(otherRows)}
          </details></div></section>
    `;
  };

  window.renderIndirectTaxRulePreview = function(entityKey, scenarioKey){
    const d = indirectTaxRuleDefaults(entityKey, scenarioKey);
    const lines = [
      ["German VAT", d.german, "19% fixed"],
      [vatTaxTypeLabel("Intra-EU VAT"), d.intra, "Implementation VAT rate"],
      [vatTaxTypeLabel("Non-EU VAT"), d.nonEu, "Implementation VAT rate"]
    ];
    const active = lines.filter(function(pair){ const v = pair[1]; return !!(v.apply || v.reverse); });
    const rows = active.map(function(pair){
      const label = pair[0], v = pair[1], rate = pair[2];
      const outcome = v.apply ? "Charge VAT" : (v.reverse ? "Reverse charge" : "No VAT");
      return `<tr><td class="simple-vat-name">${escSafe(label)}</td><td class="${v.apply ? "simple-vat-yes" : "simple-vat-no"}">${escSafe(outcome)}</td><td>${escSafe(rate)}</td></tr>`;
    }).join("");
    return `
      <div class="simple-vat-outcome"><div class="simple-vat-head"><div class="simple-vat-title">Active VAT result</div><div class="simple-vat-badge">${active.length ? active.length + " active rule" + (active.length === 1 ? "" : "s") : "No active VAT"}</div></div>
        ${active.length ? `<div class="simple-vat-scroll"><table class="simple-vat-table"><thead><tr><th>VAT type</th><th>Outcome</th><th>Rate</th></tr></thead><tbody>${rows}</tbody></table></div>` : `<div class="simple-vat-empty">No VAT is charged and no reverse charge applies for this provider location.</div>`}
      </div>
    `;
  };

  window.renderIndirectTaxFieldsForContract = function(realIds, forceNo = false, entityKey = "hq"){
    const scenarioKey = currentIndirectTaxScenario(entityKey);
    const scenario = INDIRECT_TAX_SCENARIOS.find(function(s){ return s.key === scenarioKey; }) || INDIRECT_TAX_SCENARIOS[0];
    const tabs = INDIRECT_TAX_SCENARIOS.map(function(s){ return `<button type="button" class="indirect-scenario-tab tax-scenario-card ${s.key === scenarioKey ? "active" : ""}" data-indirect-scenario="${s.key}" data-indirect-entity="${entityKey}"><span class="tax-scenario-card-title">${escSafe(s.label)}</span></button>`; }).join("");
    const vatRows = [
      renderIndirectTaxMatrixRow("German VAT", "GermanVat", indirectTaxValuesForMode({
        applicable: backstage.germanVatApplicable,
        rate: backstage.germanVatRate,
        exemption: backstage.germanVatExemption,
        reverseCharge: backstage.germanVatReverseCharge || false,
        offset: backstage.germanVatOffset,
        reimbursable: backstage.germanVatReimbursable
      }, forceNo), realIds, forceNo, { fixedRateNote: "19% fixed" }),
      renderIndirectTaxMatrixRow(vatTaxTypeLabel("Intra-EU VAT"), "IntraEuVat", indirectTaxValuesForMode({
        applicable: backstage.intraEuVatApplicable,
        rate: backstage.intraEuVatRate,
        exemption: backstage.intraEuVatExemption,
        reverseCharge: backstage.intraEuVatReverseCharge || false,
        offset: backstage.intraEuVatOffset,
        reimbursable: backstage.intraEuVatReimbursable
      }, forceNo), realIds, forceNo, { vatKind: "intra-eu", hideExemption: String(backstage.implementationCountry || "").trim().toLowerCase() === "germany" }),
      renderIndirectTaxMatrixRow(vatTaxTypeLabel("Non-EU VAT"), "NonEuVat", indirectTaxValuesForMode({
        applicable: backstage.nonEuVatApplicable,
        rate: backstage.nonEuVatRate,
        exemption: backstage.nonEuVatExemption,
        reverseCharge: backstage.nonEuVatReverseCharge || false,
        offset: backstage.nonEuVatOffset,
        reimbursable: backstage.nonEuVatReimbursable
      }, forceNo), realIds, forceNo, { vatKind: "non-eu" })
    ];
    const otherRow = renderIndirectTaxMatrixRow("Other indirect taxes", "OtherIndirectTax", indirectTaxValuesForMode({
      applicable: backstage.otherIndirectTaxApplicable,
      rate: backstage.otherIndirectTaxRate,
      exemption: backstage.otherIndirectTaxExemption,
      reverseCharge: backstage.otherIndirectTaxReverseCharge || false,
      offset: backstage.otherIndirectTaxOffset,
      reimbursable: backstage.otherIndirectTaxReimbursable
    }, forceNo), realIds, forceNo);
    return `
      <section class="tax-logic-section tax-logic-indirect" aria-label="Indirect tax rules"><header class="tax-logic-section-head"><div><div class="tax-logic-section-kicker">Indirect taxes</div><h3 class="tax-logic-section-title">VAT applicability</h3></div></header><div class="tax-logic-section-body"><div class="tax-scenario-panel"><div class="tax-scenario-cards">${tabs}</div></div>
          ${renderIndirectTaxRulePreview(entityKey, scenarioKey)}
          <details class="tax-rule-details other-indirect-details"><summary><span>Other indirect taxes</span><span class="tax-chevron">â</span></summary>
            ${renderIndirectTaxMatrixTable([otherRow])}
          </details></div></section>
    `;
  };

  window.renderContractTaxSection = function(entityKey, entityLabel){
    if (typeof syncDerivedWithholdingApplicability === "function") {
      syncDerivedWithholdingApplicability(false);
    }
    const isHq = entityKey === "hq";
    const forceHqIndirectNo = isHq && String(backstage.implementationMode || "").trim() === "Branch performs contract";
    const forceHqDirectNo = isHq;
    const configs = contractDeductionConfigs(entityKey, entityLabel);
    return `
      <details class="contract-tax-section" open><summary><div class="tax-logic-hero"><div><h2 class="tax-logic-title">${escSafe(entityLabel)}</h2></div></div></summary><div class="contract-tax-body">
          ${renderDeductionsMatrixForContract({ ...configs, forceDirectNo: forceHqDirectNo })}
          ${renderIndirectTaxFieldsForContract(isHq, forceHqIndirectNo, entityKey)}
        </div></details>
    `;
  };
})();

/* ==========================================================================
   Original inline script block 6 | attrs: id="full-tax-logic-rerender-v22"
   ========================================================================== */
try { if (typeof renderAll === "function") renderAll(); } catch (e) { console.error(e); }

/* ==========================================================================
   Original inline script block 7 | attrs: id="v40-clean-backstage-renderer"
   ========================================================================== */
(function(){
  function e(v){ try { return esc(String(v == null ? "" : v)); } catch(_) { return String(v == null ? "" : v).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); } }
  function yn(v){ return v ? '<span class="yes">Yes</span>' : '<span class="no">No</span>'; }
  function rawRate(v){ const n = Number(v || 0); return (Number.isFinite(n) ? String(n).replace('.', ',') : '0'); }
  function boolSelect(id, value){ return `<select id="${id}"><option value="true" ${value ? 'selected' : ''}>Yes</option><option value="false" ${!value ? 'selected' : ''}>No</option></select>`; }
  function fieldClean(label, inner){ return `<div class="bs-field"><label>${e(label)}</label>${inner}</div>`; }
  function modeCard(key, kicker, title, copy, resident, nonResident){
    const active = String(backstage.implementationMode || '') === key;
    return `<button type="button" class="bs-mode-card ${active ? 'active' : ''}" onclick="cleanBackstageSetMode('${e(key)}')"><div class="bs-mode-kicker">${e(kicker)}</div><div class="bs-mode-title">${e(title)}</div><div class="bs-mode-copy">${e(copy)}</div><div class="bs-mode-outcome"><div class="bs-mode-row"><span>Resident provider</span><span class="bs-pill">${e(resident)}</span></div><div class="bs-mode-row"><span>Non-resident provider</span><span class="bs-pill">${e(nonResident)}</span></div></div></button>`;
  }
  function directRows(entity){
    const p = entity === 'hq' ? 'Hq' : 'Branch';
    const rows = [
      ['Residents', backstage[`resident${p}WhtApplicable`], backstage[`resident${p}WhtRate`], backstage[`resident${p}WhtExemption`], backstage[`resident${p}WhtGrossedUp`], backstage[`resident${p}WhtReimbursable`]],
      ['Non-residents', backstage[`nonResident${p}WhtApplicable`], backstage[`nonResident${p}WhtRate`], backstage[`nonResident${p}WhtExemption`], backstage[`nonResident${p}WhtGrossedUp`], backstage[`nonResident${p}WhtReimbursable`]]
    ];
    return rows.map(r=>`<tr><td><strong>${e(r[0])}</strong></td><td>${yn(!!r[1])}</td><td>${rawRate(r[2])}</td><td>${yn(!!r[3])}</td><td>${yn(!!r[4])}</td><td>${yn(!!r[5])}</td></tr>`).join('');
  }
  function indirectRows(entity){
    let scenario = 'germany';
    try { scenario = currentIndirectTaxScenario(entity); } catch(_) {}
    let defaults = { germanVat:true, intraEuVat:false, nonEuVat:false, reverseCharge:false, offset:false, reimbursable:false };
    try { defaults = indirectTaxRuleDefaults(entity, scenario); } catch(_) {}
    const german = defaults.german || {apply:false, exempt:false, reverse:false, offset:false, reimb:false};
    const intra = defaults.intra || {apply:false, exempt:false, reverse:false, offset:false, reimb:false};
    const nonEu = defaults.nonEu || {apply:false, exempt:false, reverse:false, offset:false, reimb:false};
    const rows = [
      ['German VAT', german.apply, german.exempt, german.reverse, german.offset, german.reimb],
      ['Intra-EU VAT', intra.apply, intra.exempt, intra.reverse, intra.offset, intra.reimb],
      ['Non-EU VAT', nonEu.apply, nonEu.exempt, nonEu.reverse, nonEu.offset, nonEu.reimb]
    ];
    return rows.map(r=>`<tr><td><strong>${e(r[0])}</strong></td><td>${yn(!!r[1])}</td><td>${yn(!!r[2])}</td><td>${yn(!!r[3])}</td><td>${yn(!!r[4])}</td><td>${yn(!!r[5])}</td></tr>`).join('');
  }
  function scenarioTabs(entity){
    const tabs = (window.INDIRECT_TAX_SCENARIOS || [{key:'germany',label:'Germany'},{key:'eu',label:'EU country'},{key:'implementation',label:'ITR country'},{key:'other',label:'Other country'}]);
    let current = 'germany'; try { current = currentIndirectTaxScenario(entity); } catch(_) {}
    return tabs.map(s=>`<button type="button" class="bs-tab ${s.key===current?'active':''}" onclick="setIndirectTaxScenario('${entity}','${e(s.key)}')">${e(s.label)}</button>`).join('');
  }
  function miniIndirectCard(title, values, forceNo=false){
    const v = forceNo ? {apply:false, exempt:false, reverse:false, offset:false, reimb:false} : (values || {});
    return `<div class="bs-mini bs-mini-vat"><div class="bs-mini-title">${e(title)}</div><div class="bs-mini-line"><span>Apply</span><strong>${yn(!!v.apply)}</strong></div><div class="bs-mini-line"><span>Exempt</span><strong>${yn(!!v.exempt)}</strong></div><div class="bs-mini-line"><span>Reverse</span><strong>${yn(!!v.reverse)}</strong></div><div class="bs-mini-line"><span>Offset</span><strong>${yn(!!v.offset)}</strong></div><div class="bs-mini-line"><span>Reimb.</span><strong>${yn(!!v.reimb)}</strong></div></div>`;
  }
  function vatMatrix(entity){
    const residentStatusLabel = '(1)';
    const countryOfImplementationLabel = '(2)';
    const germanyLabel = '(3)';
    const supplierChargeLabel = '(4)';
    const reverseChargeLabel = '(5)';
    const providerTaxLabel = '(6)';
    const offsetInteractionLabel = '(7)';
    const clientVatOffsetValue = (() => {
      const implementationCountry = String((backstage && backstage.implementationCountry) || '').trim().toLowerCase();
      if (implementationCountry === 'germany') return 'No';
      if (backstage.clientVatCollected === true) return 'Yes';
      if (backstage.clientVatCollected === false) return 'No';
      return 'TBD';
    })();
    const clientVatOffsetDerived = { value: clientVatOffsetValue, note: offsetInteractionLabel, branchResidentVatOffset: true };
    const isBranch = entity === 'branch';
    const groups = isBranch ? [
      {
        title:'VAT for residents (1)',
        cols:[
          { negotiation:'Gross', jurisdiction:'CO (2)', mechanism:supplierChargeLabel, rate:providerTaxLabel, offset:clientVatOffsetDerived, exempt:providerTaxLabel, reimb:providerTaxLabel },
          { negotiation:'Net', jurisdiction:'CO (2)', mechanism:supplierChargeLabel, rate:providerTaxLabel, offset:clientVatOffsetDerived, exempt:providerTaxLabel, reimb:providerTaxLabel }
        ]
      },
      {
        title:'VAT for non-residents (1)',
        cols:[
          { negotiation:'Gross', jurisdiction:'CO (2)', mechanism:reverseChargeLabel, rate:providerTaxLabel, offset:'No', exempt:providerTaxLabel, reimb:providerTaxLabel },
          { negotiation:'Net', jurisdiction:'CO (2)', mechanism:reverseChargeLabel, rate:providerTaxLabel, offset:'No', exempt:providerTaxLabel, reimb:providerTaxLabel }
        ]
      }
    ] : [
      {
        title:'VAT for residents (1)',
        cols:[
          { negotiation:'Gross', jurisdiction:'CO (2)', mechanism:supplierChargeLabel, rate:providerTaxLabel, offset:'No', exempt:providerTaxLabel, reimb:providerTaxLabel },
          { negotiation:'Net', jurisdiction:'GE (3)', mechanism:reverseChargeLabel, rate:'19%', offset:'Yes', exempt:'No', reimb:'No' }
        ]
      },
      {
        title:'VAT for non-residents (1)',
        cols:[
          { negotiation:'Gross', jurisdiction:'GE (3)', mechanism:reverseChargeLabel, rate:'19%', offset:'No', exempt:'No', reimb:'No' },
          { negotiation:'Net', jurisdiction:'GE (3)', mechanism:reverseChargeLabel, rate:'19%', offset:'Yes', exempt:'No', reimb:'No' }
        ]
      }
    ];
    const rows = [
      ['Juris','jurisdiction'],
      ['Way','mechanism'],
      ['Rate','rate'],
      ['Offset','offset'],
      ['Exempt','exempt'],
      ['Reimb.','reimb']
    ];
    const normalizeVatValue = (value) => (value && typeof value === 'object') ? value.value : value;
    const valueClass = (value) => {
      const v = String(normalizeVatValue(value) || '').toLowerCase();
      if (v === 'no') return ' no';
      if (v === 'yes') return ' yes';
      if (v === 'undefined') return ' undefined';
      if (v === 'tbd') return ' tbd';
      if (v === '(1)') return ' resident-status-value footnote-marker';
      if (v === '(2)') return ' country-of-implementation-value footnote-marker';
      if (v === '(3)') return ' germany-value footnote-marker';
      if (v === '(4)') return ' supplier-charge-value footnote-marker';
      if (v === '(5)') return ' reverse-charge-value footnote-marker';
      if (v === '(6)') return ' provider-tax-source footnote-marker';
      if (v === '(7)') return ' vat-offset-interaction footnote-marker';
      return '';
    };
    const valueHtml = (value) => {
      const displayValue = normalizeVatValue(value);
      const note = (value && typeof value === 'object' && value.note) ? value.note : '';
      const isBranchResidentVatOffset = !!(value && typeof value === 'object' && value.branchResidentVatOffset);
      const valueDataAttr = isBranchResidentVatOffset ? ' data-branch-resident-vat-offset="value"' : '';
      const noteDataAttr = isBranchResidentVatOffset ? ' data-branch-resident-vat-offset="note"' : '';
      return `<span class="vat-value${valueClass(displayValue)}"${valueDataAttr}>${e(displayValue)}</span>${note ? `<span class="vat-value${valueClass(note)}"${noteDataAttr}>${e(note)}</span>` : ''}`;
    };
    const cardHtml = groups.map(function(group){
      const gross = group.cols[0] || {};
      const net = group.cols[1] || {};
      return `<div class="bs-mini bs-mini-vat-app vat-deduction-style-card"><div class="bs-mini-title">${e(group.title)}</div><div class="vat-deduction-header"><span></span><strong>Gross</strong><strong>Net</strong></div>
        ${rows.map(function(row){
          const label = row[0], key = row[1];
          return `<div class="bs-mini-line vat-deduction-line"><span>${e(label)}</span><strong>${valueHtml(gross[key])}</strong><strong>${valueHtml(net[key])}</strong></div>`;
        }).join('')}
      </div>`;
    }).join('');
    return `<div class="vat-clean-card vat-applicability-card vat-app-mini-card vat-deduction-wrapper"><div class="bs-tax-summary vat-deduction-summary">${cardHtml}</div><div class="vat-footnotes vat-legend"><span><strong>(1)</strong> Resident status in relationship with the ITR country</span><span><strong>(2)</strong> ITR country</span><span><strong>(3)</strong> Germany</span><span><strong>(4)</strong> Supplier charge</span><span><strong>(5)</strong> Reverse charge applies</span><span><strong>(6)</strong> Defined in Providers’ taxes</span><span><strong>(7)</strong> Depends on the client’s VAT treatment; derived from the Client taxes section</span></div></div>`;
  }

  function miniWhtCard(title, p, residency, forceNo=false){
    const isHq = p === 'Hq' || forceNo;
    const isNonResident = residency !== 'resident';
    const value = (v) => `<span class="bs-plain-value">${e(v)}</span>`;
    const providerTaxLabel = '(2)';
    const rows = isHq
      ? { apply:'No', rate:providerTaxLabel, exempt:providerTaxLabel, gross:'No', reimb:providerTaxLabel }
      : { apply:'Yes', rate:providerTaxLabel, exempt:providerTaxLabel, gross:(isNonResident ? 'Yes' : 'No'), reimb:providerTaxLabel };
    return `<div class="bs-mini bs-mini-wht"><div class="bs-mini-title">${e(title)}</div><div class="bs-mini-line"><span>Apply</span><strong>${value(rows.apply)}</strong></div><div class="bs-mini-line"><span>Rate %</span><strong>${value(rows.rate)}</strong></div><div class="bs-mini-line"><span>Exempt</span><strong>${value(rows.exempt)}</strong></div><div class="bs-mini-line"><span>Gross-up</span><strong>${value(rows.gross)}</strong></div><div class="bs-mini-line"><span>Reimb.</span><strong>${value(rows.reimb)}</strong></div></div>`;
  }
  function taxCard(entity, title){
    const p = entity === 'hq' ? 'Hq' : 'Branch';
    const forceNo = entity === 'hq';
    return `<details class="bs-tax-card bs-tax-card-summary-only"><summary><div class="bs-tax-title-row"><h3 class="bs-tax-title">${e(title)}</h3><span class="bs-tax-toggle">Details</span></div><div class="bs-tax-body-frame"><div class="bs-card-head bs-deductions-head"><h4 class="bs-card-title">Deductions</h4></div><div class="bs-tax-summary">
          ${miniWhtCard('WHT tax for residents (1)', p, 'resident', forceNo)}
          ${miniWhtCard('WHT tax for non-residents (1)', p, 'nonResident', forceNo)}
        </div><div class="deduction-footnotes"><span><strong>(1)</strong> Withholding for non-residents in the ITR country</span><span><strong>(2)</strong> Defined in Providers’ taxes</span></div><div class="bs-card-head bs-vat-visible-head"><h4 class="bs-card-title">VAT applicability</h4></div>
          ${vatMatrix(entity)}
        </div></summary><div class="bs-tax-details bs-tax-details-empty" aria-hidden="true"></div></details>`;
  }
  function companyTaxInput(id, value, opts){
    opts = opts || {};
    const type = opts.type || 'number';
    const step = opts.step || '0.01';
    const placeholder = opts.placeholder || '';
    const suffix = opts.suffix ? `<span class="company-tax-suffix">${e(opts.suffix)}</span>` : '';
    const raw = value == null ? '' : value;
    return `<div class="company-tax-input-wrap"><input id="${id}" class="company-tax-input" type="${type}" step="${step}" value="${e(raw)}" placeholder="${e(placeholder)}">${suffix}</div>`;
  }
  function companyTaxRate(id, value){ return companyTaxInput(id, value, {suffix:'%'}); }
  function companyTaxAmountMode(id, value){
    const v = value || 'Percentage';
    return `<select id="${id}" class="company-tax-select"><option value="Percentage" ${v === 'Percentage' ? 'selected' : ''}>Percentage</option><option value="Amount" ${v === 'Amount' ? 'selected' : ''}>Amount</option></select>`;
  }

  function defaultCompanyTaxValue(value, fallback){
    return (value !== null && value !== undefined && value !== '') ? value : fallback;
  }
  function companyTaxCard(modeKey, number, title, body){
    const active = String(backstage.implementationMode || 'No Branch') === modeKey;
    return `<div class="company-tax-mode-card ${active ? 'active' : ''}"><div class="company-tax-mode-head"><span class="company-tax-mode-number">${number}</span><h4>${e(title)}</h4>${active ? '<span class="company-tax-active-pill">Selected mode</span>' : ''}</div><div class="company-tax-mode-body">${body}</div></div>`;
  }
  function companyTaxesClean(){
    const noBranch = companyTaxCard('No Branch', '1', 'No branch', `
      <div class="company-tax-group company-tax-group-actual"><div class="company-tax-group-title">Actual tax rates</div><div class="company-tax-group-helper">Rates applied directly when no branch is used. Defaults are editable.</div><div class="bs-grid">
          ${fieldClean('WHT tax for non-residents %', companyTaxRate('bCompanyNoBranchNonResidentWhtRate', defaultCompanyTaxValue(backstage.companyNoBranchNonResidentWhtRate, 15)))}
          ${fieldClean('Other tax %', companyTaxRate('bCompanyNoBranchOtherTaxRate', defaultCompanyTaxValue(backstage.companyNoBranchOtherTaxRate, 0)))}
        </div></div><div class="company-tax-group company-tax-group-assumption"><div class="company-tax-group-title">Estimation assumptions</div><div class="company-tax-group-helper">Editable planning inputs used to estimate which share of income is exposed to each tax in a no-branch setup. These are assumptions, not statutory rates.</div><div class="bs-grid">
          ${fieldClean('Income subject to WHT to non-residents %', companyTaxRate('bCompanyNoBranchIncomeSubjectToNonResidentWhtRate', defaultCompanyTaxValue(backstage.companyNoBranchIncomeSubjectToNonResidentWhtRate, 100)))}
          ${fieldClean('Income subject to other tax %', companyTaxRate('bCompanyNoBranchIncomeSubjectToOtherTaxRate', defaultCompanyTaxValue(backstage.companyNoBranchIncomeSubjectToOtherTaxRate, 100)))}
        </div></div>`);
    const branchContract = companyTaxCard('Branch performs contract', '2', 'Branch to perform the contract', `
      <div class="company-tax-group company-tax-group-actual"><div class="company-tax-group-title">Actual tax rates</div><div class="company-tax-group-helper">Rates applied to the estimated taxable base. Defaults are editable.</div><div class="bs-grid company-tax-main-fields">
          ${fieldClean('Corporate Income tax rate %', companyTaxRate('bCompanyBranchContractCorporateIncomeTaxRate', defaultCompanyTaxValue(backstage.companyBranchContractCorporateIncomeTaxRate, 30)))}
          ${fieldClean('WHT tax for non-residents %', companyTaxRate('bCompanyBranchContractNonResidentWhtRate', defaultCompanyTaxValue(backstage.companyBranchContractNonResidentWhtRate, 15)))}
        </div></div><div class="company-tax-group company-tax-group-assumption"><div class="company-tax-group-title">Estimation assumptions</div><div class="company-tax-group-helper">Planning inputs used only to estimate the taxable base. They are not statutory tax rates and remain editable.</div><div class="bs-grid bs-grid-3">
          ${fieldClean('Profit abroad %', companyTaxRate('bCompanyBranchContractProfitAbroadRate', backstage.companyBranchContractProfitAbroadRate != null ? backstage.companyBranchContractProfitAbroadRate : 5))}
          ${fieldClean('Transfer prices %', companyTaxRate('bCompanyBranchContractTransferPricesRate', backstage.companyBranchContractTransferPricesRate != null ? backstage.companyBranchContractTransferPricesRate : 20))}
          ${fieldClean('Project Margin %', companyTaxRate('bCompanyBranchContractProjectMarginRate', backstage.companyBranchContractProjectMarginRate != null ? backstage.companyBranchContractProjectMarginRate : 25))}
        </div></div>`);
    const localSupport = companyTaxCard('Branch for local support', '3', 'Branch for local support', `
      <div class="company-tax-group company-tax-group-actual"><div class="company-tax-group-title">Actual tax rates</div><div class="company-tax-group-helper">Actual tax rates applied to the estimated local support taxable base. Defaults are editable.</div><div class="bs-grid company-tax-main-fields">
          ${fieldClean('Corporate Income tax rate %', companyTaxRate('bCompanyLocalSupportCorporateIncomeTaxRate', defaultCompanyTaxValue(backstage.companyLocalSupportCorporateIncomeTaxRate, 30)))}
          ${fieldClean('Other tax %', companyTaxRate('bCompanyLocalSupportOtherTaxRate', defaultCompanyTaxValue(backstage.companyLocalSupportOtherTaxRate, 0)))}
        </div></div><div class="company-tax-group company-tax-group-assumption"><div class="company-tax-group-title">Estimation assumptions</div><div class="company-tax-group-helper">Editable planning inputs used to estimate the local support taxable base. These are assumptions, not statutory rates.</div><div class="bs-grid">
          ${fieldClean('Local costs type', companyTaxAmountMode('bCompanyLocalSupportLocalCostsMode', backstage.companyLocalSupportLocalCostsMode || 'Percentage'))}
          ${fieldClean('Local costs value', companyTaxInput('bCompanyLocalSupportLocalCostsValue', defaultCompanyTaxValue(backstage.companyLocalSupportLocalCostsValue, 20), {placeholder:'Percentage or amount'}))}
          ${fieldClean('Branch fee type', companyTaxAmountMode('bCompanyLocalSupportBranchFeeMode', backstage.companyLocalSupportBranchFeeMode || 'Percentage'))}
          ${fieldClean('Branch fee value', companyTaxInput('bCompanyLocalSupportBranchFeeValue', defaultCompanyTaxValue(backstage.companyLocalSupportBranchFeeValue, 6), {placeholder:'Percentage or amount'}))}
        </div></div>`);
    return `<div class="bs-card tax-setup-group company-taxes-card" style="margin-top:14px"><div class="bs-card-head"><h3 class="bs-card-title">Company taxes</h3></div><div class="bs-card-body"><div class="company-tax-mode-grid">${noBranch}${branchContract}${localSupport}</div></div></div>`;
  }

  function taxSetupClean(){
    const clientVatRateSet = backstage.clientVatRatePercent !== null && backstage.clientVatRatePercent !== undefined && backstage.clientVatRatePercent !== '' && Number.isFinite(Number(backstage.clientVatRatePercent));
    const implementationVatPercent = clientVatRateSet ? Number(backstage.clientVatRatePercent) : Math.max(0, Math.min(50, Number(backstage.nonEuVatRate || backstage.intraEuVatRate || backstage.otherIndirectTaxRate || 0) * 100));
    const vatOffset = backstage.clientVatResidentProviderOffset === true;
    const vatExemption = vatOffset ? false : !!(backstage.germanVatExemption || backstage.intraEuVatExemption || backstage.nonEuVatExemption);
    const vatReimbursable = vatExemption ? false : !!(backstage.germanVatReimbursable || backstage.intraEuVatReimbursable || backstage.nonEuVatReimbursable);
    const deductionExemption = !!(backstage.residentHqWhtExemption || backstage.nonResidentHqWhtExemption || backstage.residentBranchWhtExemption || backstage.nonResidentBranchWhtExemption);
    const deductionReimbursable = !!(backstage.residentHqWhtReimbursable || backstage.nonResidentHqWhtReimbursable || backstage.residentBranchWhtReimbursable || backstage.nonResidentBranchWhtReimbursable);
    return `<details class="bs-section"><summary><div><h2 class="bs-section-title">Tax setup engine</h2></div><span class="bs-chevron">⌄</span></summary><div class="bs-body bs-body-soft tax-setup-split"><div class="bs-card tax-setup-group client-tax-card"><div class="bs-card-head"><h3 class="bs-card-title">Client's taxes</h3></div><div class="bs-card-body client-tax-body"><div class="client-tax-subsection client-vat-treatment-subsection"><div class="client-tax-subsection-head"><h4 class="client-tax-subsection-title">Client VAT treatment</h4></div><div class="bs-grid client-tax-primary-grid">
            ${fieldClean('Legally applicable jurisdiction', `<input id="bClientVatJurisdictionResolved" readonly value="${e(backstage.implementationCountry || 'ITR country')}">`)}
            ${String(backstage.implementationCountry || '').trim().toLowerCase() !== 'germany' ? fieldClean('Practical treatment: Apply the German VAT jurisdiction instead?', `<select id="bClientApplyGermanVat"><option value="false" ${(backstage.clientApplyGermanVat !== true) ? 'selected' : ''}>No</option><option value="true" ${(backstage.clientApplyGermanVat === true) ? 'selected' : ''}>Yes</option></select>`) : ''}
          </div><div id="clientVatGermanyRateSlot" class="client-tax-rate-slot" style="margin-top:12px"></div><div id="clientVatCountryBlock" class="client-tax-conditional" style="margin-top:12px"><div class="bs-grid"><div class="bs-field"><label>Will VAT from <span id="bClientVatCollectedCountryLabel">${e(backstage.implementationCountry || 'the ITR country')}</span> be collected?</label><select id="bClientVatCollected"><option value="" ${(backstage.clientVatCollected !== true && backstage.clientVatCollected !== false) ? 'selected' : ''}>Undefined</option><option value="true" ${(backstage.clientVatCollected === true) ? 'selected' : ''}>Yes</option><option value="false" ${(backstage.clientVatCollected === false) ? 'selected' : ''}>No</option></select></div><div></div></div></div><div id="clientVatLocalRateSlot" class="client-tax-rate-slot" style="margin-top:12px"></div><div id="clientVatRateBlock" class="client-tax-conditional"><div class="bs-grid">
              ${fieldClean('VAT rate %', `<input id="bClientVatRate" type="number" min="0" max="100" step="0.01" value="${e(backstage.clientVatRatePercent != null ? backstage.clientVatRatePercent : ((backstage.clientApplyGermanVat === true || String(backstage.implementationCountry || '').trim().toLowerCase() === 'germany') ? 19 : ''))}">`)}
              <div></div></div></div><div id="clientVatNoBlock" class="client-tax-conditional" style="margin-top:12px"><div class="bs-grid">
              ${fieldClean('Reason VAT is not collected', `<select id="bClientVatNoReason"><option value="Exemption" ${(backstage.clientVatNoReason || '') === 'Exemption' ? 'selected' : ''}>Exemption</option><option value="Reverse charge" ${(backstage.clientVatNoReason || '') === 'Reverse charge' ? 'selected' : ''}>Reverse charge</option><option value="Risk-based decision" ${(backstage.clientVatNoReason || '') === 'Risk-based decision' ? 'selected' : ''}>Risk-based decision</option><option value="Other" ${(backstage.clientVatNoReason || '') === 'Other' ? 'selected' : ''}>Other</option></select>`)}
              <div></div></div></div><div id="clientVatReverseChargeBlock" class="client-tax-conditional" style="margin-top:12px"><div class="bs-grid">
              ${fieldClean('Basis for reverse charge application', `<select id="bClientVatReverseChargeBasis"><option value="Based on applicable law" ${(backstage.clientVatReverseChargeBasis || '') === 'Based on applicable law' ? 'selected' : ''}>Based on applicable law</option><option value="Confirmed by the client" ${(backstage.clientVatReverseChargeBasis || '') === 'Confirmed by the client' ? 'selected' : ''}>Confirmed by the client</option></select>`)}
              <div></div></div></div><div id="clientVatResidentProviderOffsetBlock" class="client-tax-conditional" style="margin-top:12px">
            ${fieldClean('Can VAT from resident providers offset?', `<input id="bClientVatResidentProviderOffset" readonly value="${backstage.clientVatResidentProviderOffset === true ? 'Yes' : 'No'}">`)}
          </div><div id="clientVatExplanationBlock" style="margin-top:12px">
            ${fieldClean('Explanation', `<textarea id="bClientVatExplanation" rows="4" placeholder="Explain the VAT treatment, legal basis, client confirmation, assumptions, or internal decision rationale.">${e(backstage.clientVatExplanation || '')}</textarea>`)}
          </div></div><div class="client-tax-subsection other-client-taxes-subsection"><div class="client-tax-subsection-head"><h4 class="client-tax-subsection-title">Other client taxes</h4><div class="client-tax-subsection-sub">No additional client-side taxes configured yet.</div></div><div class="tax-empty-note">Additional client-side tax logic can be added here later.</div></div></div></div>
      ${companyTaxesClean()}
      <div class="bs-card tax-setup-group provider-taxes-card" style="margin-top:14px"><div class="bs-card-head"><h3 class="bs-card-title">Providers' taxes</h3></div><div class="bs-card-body provider-tax-body" style="display:block!important;grid-template-columns:1fr!important;"><div class="provider-tax-vertical-stack" style="display:flex!important;flex-direction:column!important;gap:14px!important;width:100%!important;max-width:100%!important;align-items:stretch!important;"><div class="provider-tax-subcard provider-tax-frame provider-tax-vat-frame" style="width:100%!important;display:block!important;grid-column:1 / -1!important;"><div class="provider-tax-subtitle">Indirect taxes / VAT</div><div class="bs-grid-4 provider-vat-grid">
          ${fieldClean(`VAT rate % in ${backstage.implementationCountry || 'country X'}?`, `<input id="bEngineImplVatRate" type="number" step="0.01" value="${implementationVatPercent}" ${clientVatRateSet ? 'readonly data-linked-client-vat-rate="true"' : ''}>`)}
          ${fieldClean('Offset possible?', `<select id="bEngineVatOffset" class="auto-derived-select" disabled data-derived-from-client-vat-offset="true"><option value="true" ${vatOffset ? 'selected' : ''}>Yes</option><option value="false" ${!vatOffset ? 'selected' : ''}>No</option></select>`)}
          ${fieldClean('Exemption available?', `<select id="bEngineVatExemption" ${vatOffset ? 'class="auto-derived-select" disabled data-forced-by-vat-offset="true"' : ''}><option value="true" ${vatExemption ? 'selected' : ''}>Yes</option><option value="false" ${!vatExemption ? 'selected' : ''}>No</option></select>`)}
          ${fieldClean('Reimbursement possible?', `<select id="bEngineVatReimbursable" ${vatExemption ? 'class="auto-derived-select" disabled data-forced-by-vat-exemption="true"' : ''}><option value="true" ${vatReimbursable ? 'selected' : ''}>Yes</option><option value="false" ${!vatReimbursable ? 'selected' : ''}>No</option></select>`)}
        </div></div><div class="provider-tax-subcard provider-tax-frame provider-tax-deduction-frame" style="width:100%!important;display:block!important;grid-column:1 / -1!important;"><div class="provider-tax-subtitle">Deductions / withholding tax</div><div class="bs-grid-4">
          ${fieldClean('Residents', `<input id="bEngineResidentWhtRate" type="number" step="0.01" value="${rawRate(backstage.residentHqWhtRate).replace(',', '.')}">`)}
          ${fieldClean('Non-residents', `<input id="bEngineNonResidentWhtRate" type="number" step="0.01" value="${rawRate(backstage.nonResidentHqWhtRate).replace(',', '.')}">`)}
          ${fieldClean('Exemption available?', boolSelect('bEngineDeductionExemption', deductionExemption))}
          ${fieldClean('Reimbursement possible?', boolSelect('bEngineDeductionReimbursable', deductionReimbursable))}
        </div></div></div></div></div></div></details>`;
  }
  function dtaSection(){ return `<details class="bs-section"><summary><div><h2 class="bs-section-title">Double tax agreements</h2></div><span class="bs-chevron">â</span></summary><div class="bs-body"><div class="bs-country-blocks" id="bDoubleTaxAgreementCountryBlocks">${renderDoubleTaxAgreementBlocks()}</div><select id="bDoubleTaxAgreementCountries" multiple size="8" style="display:none">${countryOptionsForMultiSelect()}</select></div></details>`; }
  function euSection(){ return `<details class="bs-section"><summary><div><h2 class="bs-section-title">EU countries</h2></div><span class="bs-chevron">â</span></summary><div class="bs-body"><div class="bs-country-blocks"><button type="button" class="backstage-country-block">Austria</button><button type="button" class="backstage-country-block">Belgium</button><button type="button" class="backstage-country-block">Bulgaria</button><button type="button" class="backstage-country-block">Croatia</button><button type="button" class="backstage-country-block">Cyprus</button><button type="button" class="backstage-country-block">Czechia</button><button type="button" class="backstage-country-block">Denmark</button><button type="button" class="backstage-country-block">Estonia</button><button type="button" class="backstage-country-block">Finland</button><button type="button" class="backstage-country-block">France</button><button type="button" class="backstage-country-block">Germany</button><button type="button" class="backstage-country-block">Greece</button><button type="button" class="backstage-country-block">Hungary</button><button type="button" class="backstage-country-block">Ireland</button><button type="button" class="backstage-country-block">Italy</button><button type="button" class="backstage-country-block">Latvia</button><button type="button" class="backstage-country-block">Lithuania</button><button type="button" class="backstage-country-block">Luxembourg</button><button type="button" class="backstage-country-block">Malta</button><button type="button" class="backstage-country-block">Netherlands</button><button type="button" class="backstage-country-block">Poland</button><button type="button" class="backstage-country-block">Portugal</button><button type="button" class="backstage-country-block">Romania</button><button type="button" class="backstage-country-block">Slovakia</button><button type="button" class="backstage-country-block">Slovenia</button><button type="button" class="backstage-country-block">Spain</button><button type="button" class="backstage-country-block">Sweden</button></div></div></details>`; }
  window.cleanBackstageSetMode = function(mode){
    window.__marginIqKeepBasicsOpen = true;
    window.__keepBasicsOpenAfterModeCardSelection = true;
    window.__basicsDetailsOpen = true;
    try { sessionStorage.setItem('marginIqBasicsWasOpen', '1'); } catch(_) {}
    const basicsBefore = document.getElementById('basicsDetails');
    if (basicsBefore) basicsBefore.open = true;
    const sel = document.getElementById('bImplementationMode');
    if(sel) sel.value = mode;
    backstage.implementationMode = mode;
    try{ saveCurrentStepState(); }catch(_){}
    try{ renderAll(); }catch(_){}
    const reopen = function(){ var d = document.getElementById('basicsDetails'); if(d) d.open = true; };
    reopen();
    setTimeout(reopen, 0);
    setTimeout(reopen, 80);
    setTimeout(reopen, 250);
  };

  function definitionsSection(){
    return `<details class="bs-section"><summary><div><h2 class="bs-section-title">Definitions</h2></div><span class="bs-chevron">⌄</span></summary><div class="bs-body"><div class="bs-card"><div class="bs-card-body"><p class="definition-copy"><strong>MarginIQ</strong> is a guided project-pricing and tax-treatment tool that captures the legal, practical, and commercial reasoning behind international advisory offers before the invoice exists.</p></div></div></div></details>`;
  }
  function futureFeaturesSection(){
    return `<details class="bs-section"><summary><div><h2 class="bs-section-title">Future features</h2></div><span class="bs-chevron">⌄</span></summary><div class="bs-body"><div class="bs-card"><div class="bs-card-body"><ul class="future-features-list"><li>A clear decision log: who selected what, when, and why</li><li>Exportable calculation/tax treatment memo</li><li>Risk flags for non-standard choices</li><li>Calculation summary</li><li>Approval checklist</li><li>Versioned tax assumptions and rates</li><li>Links to supporting documents or client confirmations</li></ul></div></div></div></details>`;
  }

  window.renderBackstageForm = function(){
    const mode = backstage.implementationMode || 'No Branch';
    return `<div class="backstage-clean">
      ${definitionsSection()}
      <details id="basicsDetails" class="bs-section"><summary><div><h2 class="bs-section-title">Basics</h2></div><span class="bs-chevron">â</span></summary><div class="bs-body"><div class="bs-grid bs-grid-country-only">${fieldClean('ITR country', `<div class="country-autocomplete-field"><input id="bImplementationCountry" data-country-autocomplete="implementation" placeholder="Select or type a country" value="${e(backstage.implementationCountry)}" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded="false"></div>`)}<select id="bImplementationMode" hidden aria-hidden="true"><option ${mode==='No Branch'?'selected':''}>No Branch</option><option ${mode==='Branch performs contract'?'selected':''}>Branch performs contract</option><option ${mode==='Branch for local support'?'selected':''}>Branch for local support</option></select></div><div class="bs-mode-grid">${modeCard('No Branch','Mode 1','No Branch','No branch in ITR country.','Headquarters','Headquarters')}${modeCard('Branch performs contract','Mode 2','Branch performs contract','Branch is the contracting entity for all providers.','Branch','Branch')}${modeCard('Branch for local support','Mode 3','Branch for local support','Branch supports local implementation; resident providers contract there.','Branch','Headquarters')}</div><div style="margin-top:14px"><details class="bs-section"><summary><div><h2 class="bs-section-title">Contracts tax settings</h2></div><span class="bs-chevron">â</span></summary><div class="bs-body bs-body-soft"><div class="bs-tax-cards">${taxCard('hq','Headquarters contract settings')}${taxCard('branch','Branch contract settings')}</div></div></details></div><div style="margin-top:14px">${renderBackstageCalculationFormulaPanel()}</div></div></details>
      ${taxSetupClean()}
      ${dtaSection()}
      ${euSection()}
      ${futureFeaturesSection()}
      <div class="backstage-clean-hidden" aria-hidden="true">${renderFullTaxLogicPanel()}</div></div>`;
  };
  try { if (typeof renderAll === 'function') renderAll(); } catch(e) { console.error(e); }
})();

/* ==========================================================================
   Original inline script block 8 | attrs: id="v42-fixed-wht-runtime-guard"
   ========================================================================== */
(function(){
  function applyFixedWithholdingParameters(){
    const b = (typeof backstage !== 'undefined') ? backstage : null;
    if (!b) return;
    b.residentWhtApplicable = true;
    b.nonResidentWhtApplicable = true;
    b.nonResidentWhtGrossedUp = true;
    b.residentHqWhtApplicable = false;
    b.residentHqWhtExemption = false;
    b.residentHqWhtGrossedUp = false;
    b.residentHqWhtReimbursable = false;
    b.nonResidentHqWhtApplicable = false;
    b.nonResidentHqWhtExemption = false;
    b.nonResidentHqWhtGrossedUp = false;
    b.nonResidentHqWhtReimbursable = false;
    b.residentBranchWhtApplicable = true;
    b.residentBranchWhtExemption = true;
    b.residentBranchWhtGrossedUp = false;
    b.residentBranchWhtReimbursable = true;
    b.nonResidentBranchWhtApplicable = true;
    b.nonResidentBranchWhtExemption = true;
    b.nonResidentBranchWhtGrossedUp = true;
    b.nonResidentBranchWhtReimbursable = true;
  }
  if (window.MIQRender) window.MIQRender.before(['renderAll','renderStep'], applyFixedWithholdingParameters);
  applyFixedWithholdingParameters();
})();

/* ==========================================================================
   Original inline script block 9 | attrs: id="v35-defensive-basics-open-and-title-fix"
   ========================================================================== */
(function(){
  function basics(){ return document.getElementById('basicsDetails'); }
  function shouldKeepOpen(){ try { return sessionStorage.getItem('marginIqBasicsWasOpen') === '1'; } catch(e) { return true; } }
  function rememberOpen(){ var d = basics(); if (d && d.open) { try { sessionStorage.setItem('marginIqBasicsWasOpen','1'); } catch(e) {} } }
  function restoreOpen(){ var d = basics(); if (d && shouldKeepOpen()) d.open = true; }
  document.addEventListener('click', function(e){
    var modeCard = e.target && e.target.closest && e.target.closest('.contracting-flow-node');
    if (!modeCard) return;
    rememberOpen(); setTimeout(restoreOpen, 0); setTimeout(restoreOpen, 50); setTimeout(restoreOpen, 250);
  }, true);
  document.addEventListener('change', function(e){
    if (e.target && (e.target.id === 'implementationMode' || e.target.id === 'implementationModeInput' || e.target.name === 'implementationMode')) {
      rememberOpen(); setTimeout(restoreOpen, 0); setTimeout(restoreOpen, 50); setTimeout(restoreOpen, 250);
    }
  }, true);
  if (window.MIQRender) {
    window.MIQRender.before('renderAll', rememberOpen);
    window.MIQRender.after('renderAll', function(){ restoreOpen(); setTimeout(restoreOpen, 0); });
  }
  function normalizeFormulaTitle(){
    var roots = document.querySelectorAll('#calculationFormulasDetails .backstage-section-title, #calculationFormulasDetails .bs-section-title');
    roots.forEach(function(el){ el.textContent = 'Calculation formulas'; });
  }
  document.addEventListener('DOMContentLoaded', normalizeFormulaTitle);
  setTimeout(normalizeFormulaTitle, 0);
})();

/* ==========================================================================
   Original inline script block 10 | attrs: id="v37-hard-keep-basics-open-on-mode-selection"
   ========================================================================== */
(function(){
  function findBasicsDetails(){
    var byId = document.getElementById('basicsDetails');
    if (byId) return byId;
    var titles = document.querySelectorAll('.backstage-clean .bs-section-title, .backstage-clean .backstage-section-title');
    for (var i = 0; i < titles.length; i++) {
      if ((titles[i].textContent || '').trim().toLowerCase() === 'basics') return titles[i].closest('details');
    }
    return null;
  }
  function openBasics(){ var d = findBasicsDetails(); if (d) d.open = true; }
  function modeCardFromEvent(e){ return e && e.target && e.target.closest ? e.target.closest('.bs-mode-card, .contracting-flow-node') : null; }
  function protect(){
    window.__marginIqKeepBasicsOpen = true;
    try { sessionStorage.setItem('marginIqBasicsWasOpen', '1'); } catch(_) {}
    openBasics(); setTimeout(openBasics, 0); setTimeout(openBasics, 50); setTimeout(openBasics, 200); setTimeout(openBasics, 600);
  }
  document.addEventListener('click', function(e){ if (modeCardFromEvent(e)) protect(); }, true);
  document.addEventListener('keydown', function(e){ if ((e.key === 'Enter' || e.key === ' ') && modeCardFromEvent(e)) protect(); }, true);
  document.addEventListener('toggle', function(e){
    if (!e || !e.target || e.target !== findBasicsDetails()) return;
    if (window.__marginIqKeepBasicsOpen && !e.target.open) setTimeout(openBasics, 0);
  }, true);
  if (window.MIQRender) window.MIQRender.after(['renderAll','renderStep','renderBackstageForm'], function(){ if (window.__marginIqKeepBasicsOpen) protect(); });
})();

/* ==========================================================================
   Original inline script block 11 | attrs: id="v41-client-taxes-runtime"
   ========================================================================== */
(function(){
  function getBackstage(){ return (typeof backstage !== 'undefined') ? backstage : null; }
  function val(id){ var el = document.getElementById(id); return el ? el.value : ''; }
  function setVal(id, value){ var el = document.getElementById(id); if(el) el.value = value == null ? '' : String(value); }
  function visible(el, show){ if(el) el.hidden = !show; }
  function isGermanyName(name){ return String(name || '').trim().toLowerCase() === 'germany'; }
  function implementationCountryName(){
    var b = getBackstage() || {};
    return String(val('bImplementationCountry') || b.implementationCountry || 'ITR country').trim() || 'ITR country';
  }
  function implementationIsGermany(){ return isGermanyName(implementationCountryName()); }
  function applyGermanOverride(){ return implementationIsGermany() ? false : (val('bClientApplyGermanVat') === 'true'); }
  function effectiveVatJurisdiction(){
    var implementation = implementationCountryName();
    return (implementationIsGermany() || applyGermanOverride()) ? 'Germany' : implementation;
  }
  window.syncClientTaxesToBackstage = function(){
    var b = getBackstage(); if(!b) return;
    var rateEl = document.getElementById('bClientVatRate');
    if(!rateEl) return;
    var implementation = implementationCountryName();
    var implGermany = implementationIsGermany();
    var effective = effectiveVatJurisdiction();
    var germany = isGermanyName(effective);
    var collectedRaw = val('bClientVatCollected');
    var collected = germany ? true : (collectedRaw === 'true' ? true : (collectedRaw === 'false' ? false : null));
    var rateRaw = val('bClientVatRate');
    var rateNum = Number(String(rateRaw).replace(',', '.'));
    b.clientVatJurisdiction = effective;
    b.clientVatJurisdictionResolved = implementation;
    b.clientApplyGermanVat = implGermany ? false : applyGermanOverride();
    b.clientVatEffectiveJurisdiction = effective;
    b.clientVatCollected = collected;
    b.clientVatResidentProviderOffset = collected === true;
    b.clientVatRatePercent = germany ? (Number.isFinite(rateNum) ? rateNum : 19) : (Number.isFinite(rateNum) ? rateNum : null);
    b.clientVatNoReason = (!germany && collected === false) ? (val('bClientVatNoReason') || 'Exemption') : '';
    b.clientVatReverseChargeBasis = (!germany && collected === false && (val('bClientVatNoReason') || '') === 'Reverse charge') ? (val('bClientVatReverseChargeBasis') || 'Based on applicable law') : '';
    b.clientVatExplanation = germany ? '' : (val('bClientVatExplanation') || '');
  };
  window.updateBranchResidentVatOffsetUi = function(){
    var b = getBackstage() || {};
    var implementationCountry = String((val('bImplementationCountry') || b.implementationCountry || '')).trim().toLowerCase();
    var text = implementationCountry === 'germany' ? 'No' : ((b.clientVatCollected === true) ? 'Yes' : (b.clientVatCollected === false ? 'No' : 'TBD'));
    document.querySelectorAll('[data-branch-resident-vat-offset="value"]').forEach(function(el){
      el.textContent = text;
      el.classList.remove('yes', 'no', 'undefined', 'tbd');
      el.classList.add(String(text).toLowerCase());
    });
    document.querySelectorAll('[data-branch-resident-vat-offset="note"]').forEach(function(el){
      el.textContent = '(7)';
      if(!el.classList.contains('vat-offset-interaction')) el.classList.add('vat-offset-interaction');
      if(!el.classList.contains('footnote-marker')) el.classList.add('footnote-marker');
    });
  };
  window.updateClientTaxesUi = function(options){
    options = options || {};
    var b = getBackstage() || {};
    var rateEl = document.getElementById('bClientVatRate');
    if(!rateEl) return;
    var implementation = implementationCountryName();
    var implGermany = implementationIsGermany();
    var effective = effectiveVatJurisdiction();
    var germany = isGermanyName(effective);
    var collectedRaw = val('bClientVatCollected');
    var collected = germany ? true : (collectedRaw === 'true' ? true : (collectedRaw === 'false' ? false : null));
    var noReason = val('bClientVatNoReason') || b.clientVatNoReason || 'Exemption';
    setVal('bClientVatJurisdictionResolved', implementation);
    var countryLabelEl = document.getElementById('bClientVatCollectedCountryLabel');
    if(countryLabelEl) countryLabelEl.textContent = implementation;
    var applyGermanEl = document.getElementById('bClientApplyGermanVat');
    if(applyGermanEl && implGermany) applyGermanEl.value = 'false';
    var rateBlock = document.getElementById('clientVatRateBlock');
    var germanyRateSlot = document.getElementById('clientVatGermanyRateSlot');
    var localRateSlot = document.getElementById('clientVatLocalRateSlot');
    if(germany){
      if((rateEl.value || '').trim() === '') rateEl.value = '19';
      rateEl.disabled = false;
      rateEl.required = false;
      if(rateBlock && germanyRateSlot && rateBlock.parentNode !== germanyRateSlot) germanyRateSlot.appendChild(rateBlock);
    } else {
      rateEl.disabled = false;
      rateEl.required = collected === true;
      if(collected !== true) rateEl.value = '';
      if(rateBlock && localRateSlot && rateBlock.parentNode !== localRateSlot) localRateSlot.appendChild(rateBlock);
    }
    visible(rateBlock, germany || collected === true);
    visible(document.getElementById('clientVatCountryBlock'), !germany);
    visible(document.getElementById('clientVatNoBlock'), !germany && collected === false);
    visible(document.getElementById('clientVatReverseChargeBlock'), !germany && collected === false && noReason === 'Reverse charge');
    visible(document.getElementById('clientVatResidentProviderOffsetBlock'), !germany);
    var residentProviderOffsetEl = document.getElementById('bClientVatResidentProviderOffset');
    if(residentProviderOffsetEl) residentProviderOffsetEl.value = collected === true ? 'Yes' : 'No';
    visible(document.getElementById('clientVatExplanationBlock'), !germany);
    var collectedEl = document.getElementById('bClientVatCollected'); if(collectedEl) collectedEl.required = !germany;
    var noReasonEl = document.getElementById('bClientVatNoReason'); if(noReasonEl) noReasonEl.required = !germany && collected === false;
    var basisEl = document.getElementById('bClientVatReverseChargeBasis'); if(basisEl) basisEl.required = !germany && collected === false && noReason === 'Reverse charge';
    var explanationEl = document.getElementById('bClientVatExplanation'); if(explanationEl) explanationEl.required = !germany && collected === false;
    if(typeof window.syncClientTaxesToBackstage === 'function') window.syncClientTaxesToBackstage();
    if(typeof window.updateBranchResidentVatOffsetUi === 'function') window.updateBranchResidentVatOffsetUi();
  };
  var previousSync = window.syncTaxSetupEngineToBackstage;
  if(typeof previousSync === 'function' && !previousSync.v41ClientTaxesWrapped){
    var wrapped = function(){
      var result = previousSync.apply(this, arguments);
      try { window.updateClientTaxesUi(); window.syncClientTaxesToBackstage(); } catch(e) { console.error(e); }
      return result;
    };
    wrapped.v41ClientTaxesWrapped = true;
    window.syncTaxSetupEngineToBackstage = wrapped;
  }
  function handleClientTaxEvent(e){
    var target = e.target;
    if(!target || !target.id) return;
    if(['bClientApplyGermanVat','bClientVatCollected','bClientVatRate','bClientVatNoReason','bClientVatReverseChargeBasis','bClientVatExplanation','bImplementationCountry'].indexOf(target.id) === -1) return;
    window.updateClientTaxesUi();
  }
  document.addEventListener('input', handleClientTaxEvent, true);
  document.addEventListener('change', handleClientTaxEvent, true);
  var previousAttach = window.attachHandlers;
  if(typeof previousAttach === 'function' && !previousAttach.v41ClientTaxesWrapped){
    var attachWrapped = function(){
      var result = previousAttach.apply(this, arguments);
      try { window.updateClientTaxesUi(); } catch(e) { console.error(e); }
      return result;
    };
    attachWrapped.v41ClientTaxesWrapped = true;
    window.attachHandlers = attachWrapped;
  }
  try { window.updateClientTaxesUi(); } catch(e) { console.error(e); }
})();

/* ==========================================================================
   Original inline script block 12 | attrs: id="v46-other-client-taxes-percent-fields"
   ========================================================================== */
(function(){
  function getBackstage(){ return (typeof backstage !== 'undefined') ? backstage : null; }
  function esc(value){
    return String(value == null ? '' : value)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }
  function parsePercent(value){
    var n = Number(String(value == null ? '' : value).replace(',', '.'));
    return Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
  }
  function percentValue(key){
    var b = getBackstage() || {};
    var v = b[key];
    return v == null || v === '' ? 0 : parsePercent(v);
  }
  function field(label, id, value){
    return '<div class="bs-field other-client-tax-field">' +
      '<label for="' + id + '">' + label + '</label>' +
      '<input id="' + id + '" type="number" min="0" max="100" step="0.01" value="' + esc(value) + '">' +
      '</div>';
  }
  window.syncOtherClientTaxesToBackstage = function(){
    var b = getBackstage(); if(!b) return;
    var stamp = document.getElementById('bClientStampDutyRate');
    var other = document.getElementById('bClientOtherTaxRate');
    if(stamp) b.clientStampDutyPercent = parsePercent(stamp.value);
    if(other) b.clientOtherTaxPercent = parsePercent(other.value);
  };
  window.enhanceOtherClientTaxesUi = function(){
    var card = document.querySelector('.other-client-taxes-subsection');
    if(!card) return;
    if(!document.getElementById('bClientStampDutyRate')){
      var existingEmpty = card.querySelector('.tax-empty-note');
      if(existingEmpty) existingEmpty.remove();
      var sub = card.querySelector('.client-tax-subsection-sub');
      if(sub) sub.textContent = 'Additional client-side taxes as percentages.';
      var wrap = document.createElement('div');
      wrap.className = 'other-client-taxes-grid';
      wrap.innerHTML = field('Stamp duty %', 'bClientStampDutyRate', percentValue('clientStampDutyPercent')) +
        field('Other %', 'bClientOtherTaxRate', percentValue('clientOtherTaxPercent'));
      card.appendChild(wrap);
    }
    window.syncOtherClientTaxesToBackstage();
  };

  var previousUpdateClientTaxesUi = window.updateClientTaxesUi;
  if(typeof previousUpdateClientTaxesUi === 'function' && !previousUpdateClientTaxesUi.v46OtherClientTaxesWrapped){
    var wrappedUpdate = function(){
      var result = previousUpdateClientTaxesUi.apply(this, arguments);
      try { window.enhanceOtherClientTaxesUi(); } catch(e) { console.error(e); }
      return result;
    };
    wrappedUpdate.v46OtherClientTaxesWrapped = true;
    window.updateClientTaxesUi = wrappedUpdate;
  }

  var previousSyncTaxSetupEngineToBackstage = window.syncTaxSetupEngineToBackstage;
  if(typeof previousSyncTaxSetupEngineToBackstage === 'function' && !previousSyncTaxSetupEngineToBackstage.v46OtherClientTaxesWrapped){
    var wrappedSync = function(){
      var result = previousSyncTaxSetupEngineToBackstage.apply(this, arguments);
      try { window.syncOtherClientTaxesToBackstage(); } catch(e) { console.error(e); }
      return result;
    };
    wrappedSync.v46OtherClientTaxesWrapped = true;
    window.syncTaxSetupEngineToBackstage = wrappedSync;
  }

  function handleOtherClientTaxEvent(e){
    var target = e && e.target;
    if(!target || (target.id !== 'bClientStampDutyRate' && target.id !== 'bClientOtherTaxRate')) return;
    window.syncOtherClientTaxesToBackstage();
  }
  document.addEventListener('input', handleOtherClientTaxEvent, true);
  document.addEventListener('change', handleOtherClientTaxEvent, true);

  var previousAttach = window.attachHandlers;
  if(typeof previousAttach === 'function' && !previousAttach.v46OtherClientTaxesWrapped){
    var attachWrapped = function(){
      var result = previousAttach.apply(this, arguments);
      try { window.enhanceOtherClientTaxesUi(); } catch(e) { console.error(e); }
      return result;
    };
    attachWrapped.v46OtherClientTaxesWrapped = true;
    window.attachHandlers = attachWrapped;
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ try { window.enhanceOtherClientTaxesUi(); } catch(e) { console.error(e); } });
  } else {
    try { window.enhanceOtherClientTaxesUi(); } catch(e) { console.error(e); }
  }
})();

/* ==========================================================================
   Original inline script block 13 | attrs: id="v57-backstage-start-collapsed"
   ========================================================================== */
(function(){
  function collapseBackstageSections(){
    var root = document.querySelector('.backstage-clean') || document.getElementById('backstagePanel') || document;
    var titlesToCollapse = {
      'definitions': true,
      'basics': true,
      'tax setup engine': true,
      'double tax agreements': true,
      'eu countries': true,
      'future features': true
    };
    root.querySelectorAll('details').forEach(function(d){
      var titleEl = d.querySelector('summary .bs-section-title, summary .backstage-section-title, summary h2, summary h3');
      var title = titleEl ? (titleEl.textContent || '').trim().toLowerCase() : '';
      if (titlesToCollapse[title]) d.open = false;
    });
  }
  function installOpenBackstageGuard(){
    var originalOpenBackstage = window.openBackstage;
    if (typeof originalOpenBackstage !== 'function' || originalOpenBackstage.__v57StartCollapsed) return;
    window.openBackstage = function(){
      var result = originalOpenBackstage.apply(this, arguments);
      setTimeout(collapseBackstageSections, 0);
      setTimeout(collapseBackstageSections, 80);
      return result;
    };
    window.openBackstage.__v57StartCollapsed = true;
  }
  document.addEventListener('DOMContentLoaded', function(){
    try { sessionStorage.removeItem('marginIqBasicsWasOpen'); } catch(_) {}
    installOpenBackstageGuard();
    setTimeout(collapseBackstageSections, 0);
  });
  installOpenBackstageGuard();
  setTimeout(installOpenBackstageGuard, 0);
})();

/* ==========================================================================
   Original inline script block 14 | attrs: id="v57-right-menu-sync-script"
   ========================================================================== */
(function(){
  function syncRightMenuHeight(){
    if (document.body.classList.contains('is-intro')) return;
    const wrap = document.querySelector('.wrap');
    const hero = document.querySelector('.wrap > .hero');
    const main = document.querySelector('.app-menu-main');
    const menu = document.getElementById('mainMenuShell');
    if (!wrap || !hero || !main || !menu) return;
    const heroRect = hero.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const total = Math.max(0, Math.round(mainRect.bottom - heroRect.top));
    if (total > 0){ menu.style.height = total + 'px'; menu.style.maxHeight = total + 'px'; }
  }
  if (window.MIQRender) window.MIQRender.after(['renderAll','renderStep'], syncRightMenuHeight);
  window.addEventListener('resize', syncRightMenuHeight);
  window.addEventListener('load', syncRightMenuHeight);
  document.addEventListener('click', function(){ requestAnimationFrame(syncRightMenuHeight); }, true);
  requestAnimationFrame(syncRightMenuHeight);
})();

/* ==========================================================================
   Original inline script block 15 | attrs: id="v57-floating-hamburger-menu-script"
   ========================================================================== */
document.addEventListener('click', function(event){
  var shell = document.getElementById('mainMenuShell');
  if (!shell || shell.classList.contains('collapsed')) return;
  if (shell.contains(event.target)) return;
  closeMainMenu();
});

/* ==========================================================================
   Original inline script block 16 | attrs: id="miq-central-render-hooks-final-install"
   ========================================================================== */
(function(){
  if (window.MIQRender && typeof window.MIQRender.install === 'function') {
    window.MIQRender.install();
  }
})();

/* ==========================================================================
   Original inline script block 17 | attrs: id="vat-truncated-cell-tooltips-v1"
   ========================================================================== */
(function(){
  function syncVatTooltips(){
    window.requestAnimationFrame(function(){
      var cells = document.querySelectorAll('.vat-final-calculation-table .vat-ellipsis');
      cells.forEach(function(cell){
        var text = (cell.textContent || '').trim();
        if(text) cell.setAttribute('title', text);
      });
    });
  }
  document.addEventListener('DOMContentLoaded', syncVatTooltips);
  document.addEventListener('mouseover', function(e){ if(e.target && e.target.closest && e.target.closest('.vat-final-calculation-table')) syncVatTooltips(); }, true);
  if (window.MIQRender) window.MIQRender.after('renderAll', syncVatTooltips);
})();

/* ==========================================================================
   Original inline script block 18 | attrs: id="country-autocomplete-flags-v28"
   ========================================================================== */
(function(){
  const COUNTRY_CODES = {
    "Afghanistan":"AF","Albania":"AL","Algeria":"DZ","Andorra":"AD","Angola":"AO","Anguilla":"AI","Antigua and Barbuda":"AG","Argentina":"AR","Armenia":"AM","Aruba":"AW","Australia":"AU","Austria":"AT","Azerbaijan":"AZ","Bangladesh":"BD","Barbados":"BB","Belarus":"BY","Belgium":"BE","Belize":"BZ","Benin":"BJ","Bhutan":"BT","Bolivia":"BO","Bosnia and Herzegovina":"BA","Botswana":"BW","Brazil":"BR","Brunei":"BN","Bulgaria":"BG","Burkina Faso":"BF","Burundi":"BI","Cabo Verde":"CV","Cambodia":"KH","Cameroon":"CM","Canada":"CA","Central African Republic":"CF","Chad":"TD","Chile":"CL","China":"CN","Colombia":"CO","Comoros":"KM","Congo, Dem. Rep.":"CD","Congo, Rep.":"CG","Cook Islands":"CK","Costa Rica":"CR","Croatia":"HR","Cuba":"CU","Cyprus":"CY","Czechia":"CZ","Côte d'Ivoire":"CI","CÃ´te d'Ivoire":"CI","Denmark":"DK","Djibouti":"DJ","Dominica":"DM","Dominican Republic":"DO","Ecuador":"EC","Egypt":"EG","El Salvador":"SV","Equatorial Guinea":"GQ","Eritrea":"ER","Estonia":"EE","Eswatini":"SZ","Ethiopia":"ET","Faroe Islands":"FO","Fiji":"FJ","France":"FR","Gabon":"GA","Gambia":"GM","Georgia":"GE","Germany":"DE","Ghana":"GH","Greece":"GR","Greenland":"GL","Grenada":"GD","Guatemala":"GT","Guinea":"GN","Guinea-Bissau":"GW","Guyana":"GY","Haiti":"HT","Honduras":"HN","Hong Kong":"HK","Hungary":"HU","Iceland":"IS","India":"IN","Indonesia":"ID","Iran":"IR","Iraq":"IQ","Ireland":"IE","Israel":"IL","Italy":"IT","Jamaica":"JM","Japan":"JP","Jordan":"JO","Kazakhstan":"KZ","Kenya":"KE","Kiribati":"KI","Kosovo":"XK","Kuwait":"KW","Kyrgyzstan":"KG","Laos":"LA","Latvia":"LV","Lebanon":"LB","Lesotho":"LS","Liberia":"LR","Libya":"LY","Liechtenstein":"LI","Lithuania":"LT","Luxembourg":"LU","Madagascar":"MG","Malawi":"MW","Malaysia":"MY","Maldives":"MV","Mali":"ML","Malta":"MT","Marshall Islands":"MH","Mauritania":"MR","Mauritius":"MU","Mexico":"MX","Micronesia":"FM","Moldova":"MD","Monaco":"MC","Mongolia":"MN","Montenegro":"ME","Morocco":"MA","Mozambique":"MZ","Myanmar":"MM","Namibia":"NA","Nauru":"NR","Nepal":"NP","Netherlands":"NL","New Zealand":"NZ","Nicaragua":"NI","Niger":"NE","Nigeria":"NG","North Macedonia":"MK","Norway":"NO","Oman":"OM","Pakistan":"PK","Palau":"PW","Palestine":"PS","Panama":"PA","Papua New Guinea":"PG","Paraguay":"PY","Peru":"PE","Philippines":"PH","Poland":"PL","Portugal":"PT","Qatar":"QA","Romania":"RO","Russia":"RU","Rwanda":"RW","Saint Kitts and Nevis":"KN","Saint Lucia":"LC","Saint Vincent and the Grenadines":"VC","Samoa":"WS","San Marino":"SM","Sao Tome and Principe":"ST","Saudi Arabia":"SA","Senegal":"SN","Serbia":"RS","Seychelles":"SC","Sierra Leone":"SL","Singapore":"SG","Slovakia":"SK","Slovenia":"SI","Solomon Islands":"SB","Somalia":"SO","South Africa":"ZA","South Korea":"KR","South Sudan":"SS","Spain":"ES","Sri Lanka":"LK","Sudan":"SD","Suriname":"SR","Sweden":"SE","Switzerland":"CH","Syria":"SY","Taiwan":"TW","Tajikistan":"TJ","Tanzania":"TZ","Thailand":"TH","Timor-Leste":"TL","Togo":"TG","Tonga":"TO","Trinidad and Tobago":"TT","Tunisia":"TN","Turkey":"TR","Turkmenistan":"TM","Tuvalu":"TV","Uganda":"UG","Ukraine":"UA","United Arab Emirates":"AE","United Kingdom":"GB","United States":"US","Uruguay":"UY","Uzbekistan":"UZ","Vanuatu":"VU","Venezuela":"VE","Vietnam":"VN","Yemen":"YE","Zambia":"ZM","Zimbabwe":"ZW"
  };
  function flagFromCode(code){
    if(!code || code.length !== 2) return "🌍";
    const A = 127397;
    return String.fromCodePoint(...code.toUpperCase().split('').map(c => A + c.charCodeAt(0)));
  }
  function norm(s){ return String(s || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function countryCode(name){
    const exact = COUNTRY_CODES[String(name || '').trim()];
    if (exact) return exact;
    const wanted = norm(name);
    const key = Object.keys(COUNTRY_CODES).find(k => norm(k) === wanted);
    return key ? COUNTRY_CODES[key] : '';
  }
  function escHtml(s){
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function flagMarkup(name){
    const code = countryCode(name);
    if(!code) return '<span class="country-flag-fallback">•</span>';
    const lower = code.toLowerCase();
    return `<img src="https://flagcdn.com/24x18/${lower}.png" srcset="https://flagcdn.com/48x36/${lower}.png 2x" alt="${escHtml(code)} flag" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'country-flag-fallback',textContent:'${escHtml(code)}'}))">`;
  }
  function countryFlag(name){
    const code = countryCode(name);
    return code ? flagFromCode(code) : "🌍";
  }
  function countryList(){
    const dl = document.getElementById('countryOptions');
    if(!dl) return Object.keys(COUNTRY_CODES).sort((a,b)=>a.localeCompare(b));
    return Array.from(dl.querySelectorAll('option')).map(o => String(o.value || '').trim()).filter(Boolean);
  }
  function ensureDropdown(input){
    let wrap = input.closest('.country-autocomplete-field');
    if(!wrap){
      wrap = document.createElement('div');
      wrap.className = 'country-autocomplete-field';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
    }
    let selectedFlag = wrap.querySelector('.country-selected-flag');
    if(!selectedFlag){
      selectedFlag = document.createElement('span');
      selectedFlag.className = 'country-selected-flag';
      selectedFlag.innerHTML = '<span class="country-flag-fallback">•</span>';
      wrap.insertBefore(selectedFlag, input);
    }
    let dd = wrap.querySelector('.country-suggest-dropdown');
    if(!dd){
      dd = document.createElement('div');
      dd.className = 'country-suggest-dropdown';
      dd.hidden = true;
      wrap.appendChild(dd);
    }
    return {wrap, dd};
  }
  function updateFlag(input){
    const wrap = input.closest('.country-autocomplete-field');
    if(!wrap) return;
    const val = String(input.value || '').trim();
    wrap.setAttribute('data-selected-code', val ? countryCode(val) : '');
    let selectedFlag = wrap.querySelector('.country-selected-flag');
    if(!selectedFlag){
      selectedFlag = document.createElement('span');
      selectedFlag.className = 'country-selected-flag';
      wrap.insertBefore(selectedFlag, input);
    }
    selectedFlag.innerHTML = val ? flagMarkup(val) : '<span class="country-flag-fallback">•</span>';
  }
  function filteredCountries(query){
    const q = norm(query);
    const all = countryList();
    if(!q) return all.slice(0, 14);
    const starts = all.filter(c => norm(c).startsWith(q));
    const contains = all.filter(c => !norm(c).startsWith(q) && norm(c).includes(q));
    return starts.concat(contains).slice(0, 14);
  }
  function showSuggestions(input){
    const {dd} = ensureDropdown(input);
    const matches = filteredCountries(input.value);
    if(!matches.length){
      dd.innerHTML = '<div class="country-suggest-empty">No matching country</div>';
    } else {
      dd.innerHTML = matches.map((name, i) => `<button type="button" class="country-suggest-option${i===0?' is-active':''}" data-country-value="${escHtml(name)}"><span class="country-suggest-flag">${flagMarkup(name)}</span><span class="country-suggest-name">${escHtml(name)}</span></button>`).join('');
    }
    dd.hidden = false;
    input.setAttribute('aria-expanded','true');
    updateFlag(input);
  }
  function hideSuggestions(input){
    const wrap = input.closest('.country-autocomplete-field');
    const dd = wrap && wrap.querySelector('.country-suggest-dropdown');
    if(dd) dd.hidden = true;
    input.setAttribute('aria-expanded','false');
    updateFlag(input);
  }
  function selectCountry(input, value){
    input.value = value;
    updateFlag(input);
    input.dispatchEvent(new Event('input', {bubbles:true}));
    input.dispatchEvent(new Event('change', {bubbles:true}));
    hideSuggestions(input);
  }
  document.addEventListener('focusin', (e)=>{
    const input = e.target && e.target.matches && e.target.matches('#bImplementationCountry[data-country-autocomplete]') ? e.target : null;
    if(input) showSuggestions(input);
  });
  document.addEventListener('input', (e)=>{
    const input = e.target && e.target.matches && e.target.matches('#bImplementationCountry[data-country-autocomplete]') ? e.target : null;
    if(input) showSuggestions(input);
  });
  document.addEventListener('click', (e)=>{
    const opt = e.target.closest && e.target.closest('.country-suggest-option');
    if(opt){
      const wrap = opt.closest('.country-autocomplete-field');
      const input = wrap && wrap.querySelector('#bImplementationCountry');
      if(input) selectCountry(input, opt.dataset.countryValue || opt.textContent.trim());
      return;
    }
    document.querySelectorAll('#bImplementationCountry[data-country-autocomplete]').forEach(input => {
      if(!input.closest('.country-autocomplete-field')?.contains(e.target)) hideSuggestions(input);
    });
  });
  document.addEventListener('keydown', (e)=>{
    const input = e.target && e.target.matches && e.target.matches('#bImplementationCountry[data-country-autocomplete]') ? e.target : null;
    if(!input) return;
    const {dd} = ensureDropdown(input);
    const options = Array.from(dd.querySelectorAll('.country-suggest-option'));
    if(e.key === 'Escape'){ hideSuggestions(input); return; }
    if(!options.length) return;
    const current = Math.max(0, options.findIndex(o => o.classList.contains('is-active')));
    if(e.key === 'ArrowDown' || e.key === 'ArrowUp'){
      e.preventDefault();
      const next = e.key === 'ArrowDown' ? Math.min(options.length-1, current+1) : Math.max(0, current-1);
      options.forEach(o => o.classList.remove('is-active'));
      options[next].classList.add('is-active');
      options[next].scrollIntoView({block:'nearest'});
    }
    if(e.key === 'Enter' && !dd.hidden){
      const active = options.find(o => o.classList.contains('is-active')) || options[0];
      if(active){ e.preventDefault(); selectCountry(input, active.dataset.countryValue || active.textContent.trim()); }
    }
  });
  function initCountryAutocomplete(){
    document.querySelectorAll('#bImplementationCountry[data-country-autocomplete]').forEach(input => {
      ensureDropdown(input);
      updateFlag(input);
    });
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initCountryAutocomplete, {once:true});
  } else {
    initCountryAutocomplete();
  }
  window.marginIqCountryFlag = countryFlag;
  window.marginIqCountryFlagMarkup = flagMarkup;
})();

/* ==========================================================================
   Original inline script block 19 | attrs: id="v58-company-taxes-runtime"
   ========================================================================== */
(function(){
  function getB(){ return (typeof backstage !== 'undefined') ? backstage : null; }
  function val(id){ var el = document.getElementById(id); return el ? el.value : ''; }
  function num(id, fallback){ var raw = val(id); if(raw === '') return fallback == null ? '' : fallback; var n = Number(String(raw).replace(',', '.')); return Number.isFinite(n) ? n : (fallback == null ? '' : fallback); }
  window.syncCompanyTaxesToBackstage = function(){
    var b = getB(); if(!b) return;
    if(!document.getElementById('bCompanyNoBranchNonResidentWhtRate') && !document.getElementById('bCompanyBranchContractProfitAbroadRate') && !document.getElementById('bCompanyLocalSupportOtherTaxRate')) return;
    b.companyNoBranchNonResidentWhtRate = num('bCompanyNoBranchNonResidentWhtRate', b.companyNoBranchNonResidentWhtRate != null && b.companyNoBranchNonResidentWhtRate !== '' ? b.companyNoBranchNonResidentWhtRate : 15);
    b.companyNoBranchOtherTaxRate = num('bCompanyNoBranchOtherTaxRate', b.companyNoBranchOtherTaxRate != null && b.companyNoBranchOtherTaxRate !== '' ? b.companyNoBranchOtherTaxRate : 0);
    b.companyNoBranchIncomeSubjectToNonResidentWhtRate = num('bCompanyNoBranchIncomeSubjectToNonResidentWhtRate', b.companyNoBranchIncomeSubjectToNonResidentWhtRate != null && b.companyNoBranchIncomeSubjectToNonResidentWhtRate !== '' ? b.companyNoBranchIncomeSubjectToNonResidentWhtRate : 100);
    b.companyNoBranchIncomeSubjectToOtherTaxRate = num('bCompanyNoBranchIncomeSubjectToOtherTaxRate', b.companyNoBranchIncomeSubjectToOtherTaxRate != null && b.companyNoBranchIncomeSubjectToOtherTaxRate !== '' ? b.companyNoBranchIncomeSubjectToOtherTaxRate : 100);
    b.companyBranchContractProfitAbroadRate = num('bCompanyBranchContractProfitAbroadRate', b.companyBranchContractProfitAbroadRate != null ? b.companyBranchContractProfitAbroadRate : 5);
    b.companyBranchContractTransferPricesRate = num('bCompanyBranchContractTransferPricesRate', b.companyBranchContractTransferPricesRate != null ? b.companyBranchContractTransferPricesRate : 20);
    b.companyBranchContractProjectMarginRate = num('bCompanyBranchContractProjectMarginRate', b.companyBranchContractProjectMarginRate != null ? b.companyBranchContractProjectMarginRate : 25);
    b.companyBranchContractCorporateIncomeTaxRate = num('bCompanyBranchContractCorporateIncomeTaxRate', b.companyBranchContractCorporateIncomeTaxRate != null && b.companyBranchContractCorporateIncomeTaxRate !== '' ? b.companyBranchContractCorporateIncomeTaxRate : 30);
    b.companyBranchContractNonResidentWhtRate = num('bCompanyBranchContractNonResidentWhtRate', b.companyBranchContractNonResidentWhtRate != null && b.companyBranchContractNonResidentWhtRate !== '' ? b.companyBranchContractNonResidentWhtRate : 15);
    b.companyLocalSupportLocalCostsMode = val('bCompanyLocalSupportLocalCostsMode') || b.companyLocalSupportLocalCostsMode || 'Percentage';
    b.companyLocalSupportLocalCostsValue = num('bCompanyLocalSupportLocalCostsValue', b.companyLocalSupportLocalCostsValue != null && b.companyLocalSupportLocalCostsValue !== '' ? b.companyLocalSupportLocalCostsValue : 20);
    b.companyLocalSupportBranchFeeMode = val('bCompanyLocalSupportBranchFeeMode') || b.companyLocalSupportBranchFeeMode || 'Percentage';
    b.companyLocalSupportBranchFeeValue = num('bCompanyLocalSupportBranchFeeValue', b.companyLocalSupportBranchFeeValue != null && b.companyLocalSupportBranchFeeValue !== '' ? b.companyLocalSupportBranchFeeValue : 6);
    b.companyLocalSupportCorporateIncomeTaxRate = num('bCompanyLocalSupportCorporateIncomeTaxRate', b.companyLocalSupportCorporateIncomeTaxRate != null && b.companyLocalSupportCorporateIncomeTaxRate !== '' ? b.companyLocalSupportCorporateIncomeTaxRate : 30);
    b.companyLocalSupportOtherTaxRate = num('bCompanyLocalSupportOtherTaxRate', b.companyLocalSupportOtherTaxRate != null && b.companyLocalSupportOtherTaxRate !== '' ? b.companyLocalSupportOtherTaxRate : 0);
  };
  var previousSync = window.syncTaxSetupEngineToBackstage;
  if(typeof previousSync === 'function' && !previousSync.v58CompanyTaxesWrapped){
    var wrapped = function(){
      var result = previousSync.apply(this, arguments);
      try { window.syncCompanyTaxesToBackstage(); } catch(e) { console.error(e); }
      return result;
    };
    wrapped.v58CompanyTaxesWrapped = true;
    window.syncTaxSetupEngineToBackstage = wrapped;
  }
  function isCompanyTaxField(id){ return /^bCompany/.test(String(id || '')); }
  function handle(e){
    if(!e.target || !isCompanyTaxField(e.target.id)) return;
    try { window.syncCompanyTaxesToBackstage(); } catch(err) { console.error(err); }
  }
  document.addEventListener('input', handle, true);
  document.addEventListener('change', handle, true);
})();

/* ==========================================================================
   Original inline script block 20 | attrs: id="v59-provider-tax-runtime"
   ========================================================================== */
(function(){
  function getB(){ return (typeof backstage !== 'undefined') ? backstage : null; }
  function el(id){ return document.getElementById(id); }
  function val(id){ var node = el(id); return node ? node.value : ''; }
  function boolFromVal(id, fallback){ var v = val(id); if(v === 'true') return true; if(v === 'false') return false; return !!fallback; }
  function numFromVal(id, fallback){ var raw = val(id); if(raw === '') return fallback; var n = Number(String(raw).replace(',', '.')); return Number.isFinite(n) ? n : fallback; }
  function setSelect(id, value, locked){
    var node = el(id); if(!node) return;
    node.disabled = !!locked;
    node.value = value ? 'true' : 'false';
    node.classList.toggle('auto-derived-select', !!locked);
  }
  function clientVatRatePercent(){
    var b = getB() || {};
    var raw = val('bClientVatRate');
    if(raw !== ''){ var n = Number(String(raw).replace(',', '.')); if(Number.isFinite(n)) return n; }
    var stored = b.clientVatRatePercent;
    if(stored !== null && stored !== undefined && stored !== ''){ var s = Number(stored); if(Number.isFinite(s)) return s; }
    return null;
  }
  function clientResidentOffset(){
    var b = getB() || {};
    var field = val('bClientVatResidentProviderOffset');
    if(field === 'Yes') return true;
    if(field === 'No') return false;
    return b.clientVatResidentProviderOffset === true;
  }
  window.updateProviderVatRulesFromClientVat = function(){
    var b = getB();
    var rateEl = el('bEngineImplVatRate');
    var offsetEl = el('bEngineVatOffset');
    var exemptionEl = el('bEngineVatExemption');
    var reimbEl = el('bEngineVatReimbursable');
    if(!rateEl && !offsetEl && !exemptionEl && !reimbEl) return;
    var clientRate = clientVatRatePercent();
    if(rateEl){
      if(clientRate !== null){ rateEl.value = String(clientRate); rateEl.readOnly = true; rateEl.setAttribute('data-linked-client-vat-rate', 'true'); }
      else { rateEl.readOnly = false; rateEl.removeAttribute('data-linked-client-vat-rate'); }
    }
    var offset = clientResidentOffset();
    setSelect('bEngineVatOffset', offset, true);
    var exemption = offset ? false : boolFromVal('bEngineVatExemption', b && (b.germanVatExemption || b.intraEuVatExemption || b.nonEuVatExemption));
    setSelect('bEngineVatExemption', exemption, offset);
    var reimb = exemption ? false : boolFromVal('bEngineVatReimbursable', b && (b.germanVatReimbursable || b.intraEuVatReimbursable || b.nonEuVatReimbursable));
    setSelect('bEngineVatReimbursable', reimb, exemption);
    if(b){
      var pct = clientRate !== null ? clientRate : numFromVal('bEngineImplVatRate', (b.nonEuVatRate || b.intraEuVatRate || 0) * 100);
      var rate = Math.max(0, Math.min(50, Number(pct) || 0)) / 100;
      b.intraEuVatRate = rate; b.nonEuVatRate = rate; b.otherIndirectTaxRate = rate; b.germanVatRate = 0.19;
      ['germanVat','intraEuVat','nonEuVat','otherIndirectTax'].forEach(function(prefix){
        b[prefix + 'Offset'] = offset;
        b[prefix + 'Exemption'] = exemption;
        b[prefix + 'Reimbursable'] = reimb;
      });
    }
  };
  var previousClientUi = window.updateClientTaxesUi;
  if(typeof previousClientUi === 'function' && !previousClientUi.v59ProviderVatWrapped){
    var wrappedClientUi = function(){ var result = previousClientUi.apply(this, arguments); try { window.updateProviderVatRulesFromClientVat(); } catch(e) { console.error(e); } return result; };
    wrappedClientUi.v59ProviderVatWrapped = true; window.updateClientTaxesUi = wrappedClientUi;
  }
  var previousSync = window.syncTaxSetupEngineToBackstage;
  if(typeof previousSync === 'function' && !previousSync.v59ProviderVatWrapped){
    var wrappedSync = function(){ try { window.updateProviderVatRulesFromClientVat(); } catch(e) { console.error(e); } var result = previousSync.apply(this, arguments); try { window.updateProviderVatRulesFromClientVat(); } catch(e) { console.error(e); } return result; };
    wrappedSync.v59ProviderVatWrapped = true; window.syncTaxSetupEngineToBackstage = wrappedSync;
  }
  function handle(e){
    var id = e && e.target && e.target.id;
    if(['bClientVatRate','bClientVatCollected','bClientApplyGermanVat','bClientVatResidentProviderOffset','bEngineImplVatRate','bEngineVatOffset','bEngineVatExemption','bEngineVatReimbursable'].indexOf(id) === -1) return;
    try { window.updateProviderVatRulesFromClientVat(); } catch(err) { console.error(err); }
  }
  document.addEventListener('input', handle, true);
  document.addEventListener('change', handle, true);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ try { window.updateProviderVatRulesFromClientVat(); } catch(e) { console.error(e); } });
  else { try { window.updateProviderVatRulesFromClientVat(); } catch(e) { console.error(e); } }
})();

/* ==========================================================================
   Original inline script block 21 | attrs: id="v61-provider-tax-label-runtime"
   ========================================================================== */
(function(){
  function el(id){ return document.getElementById(id); }
  function implementationCountry(){
    var input = el('bImplementationCountry');
    var raw = (input && input.value) || (typeof backstage !== 'undefined' && backstage && backstage.implementationCountry) || 'country X';
    raw = String(raw || '').trim();
    return raw || 'country X';
  }
  function updateVatRateCountryLabel(){
    var rate = el('bEngineImplVatRate');
    if(!rate) return;
    var field = rate.closest ? rate.closest('.bs-field') : null;
    var label = field ? field.querySelector('label') : null;
    if(label) label.textContent = 'VAT rate % in ' + implementationCountry() + '?';
  }
  var previousProviderVatUpdate = window.updateProviderVatRulesFromClientVat;
  if(typeof previousProviderVatUpdate === 'function' && !previousProviderVatUpdate.v61LabelWrapped){
    var wrapped = function(){ var result = previousProviderVatUpdate.apply(this, arguments); try{ updateVatRateCountryLabel(); }catch(_){} return result; };
    wrapped.v61LabelWrapped = true;
    window.updateProviderVatRulesFromClientVat = wrapped;
  }
  function handle(e){
    var id = e && e.target && e.target.id;
    if(id === 'bImplementationCountry') updateVatRateCountryLabel();
  }
  document.addEventListener('input', handle, true);
  document.addEventListener('change', handle, true);
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', updateVatRateCountryLabel);
  else updateVatRateCountryLabel();
})();

/* ==========================================================================
   Original inline script block 22 | attrs: id="branch-related-costs-v1"
   ========================================================================== */
(function(){
  function escapeHtml(value){
    try { if (typeof esc === 'function') return esc(String(value == null ? '' : value)); } catch(_) {}
    return String(value == null ? '' : value).replace(/[&<>\"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; });
  }
  function asNumber(value){
    var n = Number(String(value == null ? '' : value).replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  }
  var BRANCH_COST_SECTIONS = [
    { title:'1. Costs for opening the registration', rows:[
      ['1.1 Legal fees','Once'],
      ['1.2 Governmet fees','Once'],
      ['1.3 Translation costs','Once'],
      ['1.4 Notary','Once'],
      ['1.5 Other costs','Once']
    ]},
    { title:'2. Costs for managing the registration', rows:[
      ['2.1 Accountant’s fees','Monthly'],
      ['2.2 Auditor’s fees','Monthly'],
      ['2.3 Accounting system fee.','Monthly'],
      ['2.4 Legal representative’s fees','Monthly'],
      ['2.5 Branch manager’s fees','Monthly'],
      ['2.6 Business license/similar costs','Yearly'],
      ['2.7 Other costs','Yearly']
    ]}
  ];
  var BRANCH_COST_MODES = [
    { key:'noBranch', mode:'Mode 1', title:'No Branch', backingMode:'No Branch', locked:true, note:'Quantity and Advice cost are fixed at 0 and cannot be edited.' },
    { key:'branchPerformsContract', mode:'Mode 2', title:'Branch performs contract', backingMode:'Branch performs contract', locked:false, note:'Quantity and Advice cost are editable.' },
    { key:'branchForLocalSupport', mode:'Mode 3', title:'Branch for local support', backingMode:'Branch for local support', locked:false, note:'Quantity and Advice cost are editable.' }
  ];
  function allRows(){
    var rows = [];
    BRANCH_COST_SECTIONS.forEach(function(section){ section.rows.forEach(function(row){ rows.push(row); }); });
    return rows;
  }
  function ensureBranchRelatedCosts(){
    if (typeof backstage === 'undefined') return;
    if (!backstage.branchRelatedCosts || typeof backstage.branchRelatedCosts !== 'object') backstage.branchRelatedCosts = {};
    BRANCH_COST_MODES.forEach(function(mode){
      if (!backstage.branchRelatedCosts[mode.key] || typeof backstage.branchRelatedCosts[mode.key] !== 'object') backstage.branchRelatedCosts[mode.key] = {};
      allRows().forEach(function(row, index){
        if (!backstage.branchRelatedCosts[mode.key][index]) backstage.branchRelatedCosts[mode.key][index] = { quantity:0, adviceCost:0 };
        if (mode.locked) {
          backstage.branchRelatedCosts[mode.key][index].quantity = 0;
          backstage.branchRelatedCosts[mode.key][index].adviceCost = 0;
        }
      });
    });
  }
  function readBranchRelatedCosts(){
    ensureBranchRelatedCosts();
    if (typeof backstage === 'undefined' || !backstage.branchRelatedCosts) return;
    BRANCH_COST_MODES.forEach(function(mode){
      allRows().forEach(function(row, index){
        var q = document.getElementById('branchCost_' + mode.key + '_' + index + '_quantity');
        var c = document.getElementById('branchCost_' + mode.key + '_' + index + '_adviceCost');
        if (mode.locked) {
          backstage.branchRelatedCosts[mode.key][index] = { quantity:0, adviceCost:0 };
        } else if (q || c) {
          backstage.branchRelatedCosts[mode.key][index] = {
            quantity: q ? asNumber(q.value) : asNumber(backstage.branchRelatedCosts[mode.key][index].quantity),
            adviceCost: c ? asNumber(c.value) : asNumber(backstage.branchRelatedCosts[mode.key][index].adviceCost)
          };
        }
      });
    });
  }
  function renderRows(mode){
    ensureBranchRelatedCosts();
    var rowIndex = 0;
    return BRANCH_COST_SECTIONS.map(function(section){
      var html = '<tr class="branch-cost-section-row"><td colspan="5">' + escapeHtml(section.title) + '</td></tr>';
      section.rows.forEach(function(row){
        var record = (backstage.branchRelatedCosts && backstage.branchRelatedCosts[mode.key] && backstage.branchRelatedCosts[mode.key][rowIndex]) || {quantity:0, adviceCost:0};
        var q = mode.locked ? 0 : asNumber(record.quantity);
        var c = mode.locked ? 0 : asNumber(record.adviceCost);
        var attrs = mode.locked ? ' readonly disabled aria-readonly="true"' : '';
        html += '<tr>' +
          '<td><span class="branch-cost-name">' + escapeHtml(row[0]) + '</span></td>' +
          '<td><input class="branch-cost-num" id="branchCost_' + mode.key + '_' + rowIndex + '_quantity" type="number" step="0.01" value="' + q + '"' + attrs + '></td>' +
          '<td><input class="branch-cost-num" id="branchCost_' + mode.key + '_' + rowIndex + '_adviceCost" type="number" step="0.01" value="' + c + '"' + attrs + '></td>' +
          '<td class="branch-cost-unit">' + escapeHtml(row[1]) + '</td>' +
          '<td class="branch-cost-category">Branch</td>' +
          '</tr>';
        rowIndex += 1;
      });
      return html;
    }).join('');
  }
  window.renderBranchRelatedCostsPanel = function(){
    ensureBranchRelatedCosts();
    var currentMode = typeof backstage !== 'undefined' ? String(backstage.implementationMode || 'No Branch') : 'No Branch';
    var cards = BRANCH_COST_MODES.map(function(mode){
      var active = currentMode === mode.backingMode ? ' is-active' : '';
      return '<div class="branch-cost-card' + active + '">' +
        '<div class="branch-cost-card-head"><div class="branch-cost-kicker">' + escapeHtml(mode.mode) + '</div><div class="branch-cost-title">' + escapeHtml(mode.title) + '</div><div class="branch-cost-note">' + escapeHtml(mode.note) + '</div></div>' +
        '<div class="branch-cost-table-wrap"><table class="branch-cost-table"><thead><tr><th>Cost category</th><th>Quantity</th><th>Advice cost</th><th>Unit</th><th>Cost category</th></tr></thead><tbody>' + renderRows(mode) + '</tbody></table></div>' +
        '</div>';
    }).join('');
    return '<details id="branchRelatedCostsDetails" class="bs-section branch-costs-panel"><summary><div><h2 class="bs-section-title">Branch related costs</h2></div><span class="bs-chevron">⌄</span></summary><div class="bs-body bs-body-soft"><div class="branch-costs-grid">' + cards + '</div></div></details>';
  };
  window.syncBranchRelatedCostsToBackstage = readBranchRelatedCosts;

  var originalSave = window.saveCurrentStepState;
  if (typeof originalSave === 'function' && !originalSave.__branchRelatedCostsWrapped) {
    var wrappedSave = function(){
      try { readBranchRelatedCosts(); } catch(e) { console.error(e); }
      return originalSave.apply(this, arguments);
    };
    wrappedSave.__branchRelatedCostsWrapped = true;
    window.saveCurrentStepState = wrappedSave;
  }

  var originalRenderBackstageForm = window.renderBackstageForm;
  if (typeof originalRenderBackstageForm === 'function' && !originalRenderBackstageForm.__branchRelatedCostsWrapped) {
    var wrappedRender = function(){
      ensureBranchRelatedCosts();
      var html = originalRenderBackstageForm.apply(this, arguments);
      var panel = window.renderBranchRelatedCostsPanel();
      if (html.indexOf('id="branchRelatedCostsDetails"') !== -1) return html;
      var target = '<div style="margin-top:14px">' + renderBackstageCalculationFormulaPanel() + '</div>';
      if (html.indexOf(target) !== -1) return html.replace(target, '<div style="margin-top:14px">' + panel + '</div>' + target);
      return html.replace('</div></details>\n      ' + (typeof taxSetupClean === 'function' ? taxSetupClean() : ''), '<div style="margin-top:14px">' + panel + '</div></div></details>\n      ' + (typeof taxSetupClean === 'function' ? taxSetupClean() : ''));
    };
    wrappedRender.__branchRelatedCostsWrapped = true;
    window.renderBackstageForm = wrappedRender;
  }

  document.addEventListener('input', function(ev){
    if (ev.target && ev.target.id && ev.target.id.indexOf('branchCost_') === 0) readBranchRelatedCosts();
  }, true);
  document.addEventListener('change', function(ev){
    if (ev.target && ev.target.id && ev.target.id.indexOf('branchCost_') === 0) readBranchRelatedCosts();
  }, true);
  try { ensureBranchRelatedCosts(); if (typeof renderAll === 'function') renderAll(); } catch(e) { console.error(e); }
})();

/* ==========================================================================
   Original inline script block 23 | attrs: id="final-nonreimb-branch-costs-override-v1"
   ========================================================================== */
(function(){
  function e(value){
    try { if (typeof esc === 'function') return esc(String(value == null ? '' : value)); } catch(_) {}
    return String(value == null ? '' : value).replace(/[&<>\"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c; });
  }
  function num(value){
    var x = Number(String(value == null ? '' : value).replace(',', '.'));
    return Number.isFinite(x) ? x : 0;
  }
  function fmt(value){
    try { if (typeof money === 'function') return money(num(value)); } catch(_) {}
    return num(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  var BRANCH_ROWS = [
    { group:'Costs for opening the registration', name:'Legal fees', cost:2000, unit:'Once' },
    { group:'Costs for opening the registration', name:'Governmet fees', cost:2000, unit:'Once' },
    { group:'Costs for opening the registration', name:'Translation costs', cost:500, unit:'Once' },
    { group:'Costs for opening the registration', name:'Notary', cost:400, unit:'Once' },
    { group:'Costs for opening the registration', name:'Other costs', cost:100, unit:'Once' },
    { group:'Costs for managing the registration', name:'Accountant’s fees', cost:600, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Auditor’s fees', cost:200, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Accounting system fee.', cost:50, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Legal representative’s fees', cost:150, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Branch manager’s fees', cost:500, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Business license/similar costs', cost:100, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Other costs', cost:0, unit:'Monthly' }
  ];
  var BACKSTOPPING_ROWS = [
    { name:'Fee', unit:'Day' },
    { name:'Per diem', unit:'Day' },
    { name:'Accommodation', unit:'Day' },
    { name:'Flights', unit:'Times' }
  ];
  function modeIsNoBranch(){
    var mode = typeof backstage !== 'undefined' ? String(backstage.implementationMode || 'No Branch') : 'No Branch';
    return mode === 'No Branch';
  }
  function ensureBranchRelatedCostsFinal(){
    if (typeof backstage === 'undefined') return;
    var rows = [];
    BRANCH_ROWS.forEach(function(row, index){
      rows[index] = {
        name: row.name,
        cost: modeIsNoBranch() ? 0 : row.cost,
        adviceCost: modeIsNoBranch() ? 0 : row.cost,
        unit: row.unit,
        costCategory: 'Branch'
      };
    });
    backstage.branchRelatedCosts = { rows: rows };
  }
  function branchCost(index){
    ensureBranchRelatedCostsFinal();
    if (modeIsNoBranch()) return 0;
    if (typeof backstage !== 'undefined' && backstage.branchRelatedCosts && backstage.branchRelatedCosts.rows && backstage.branchRelatedCosts.rows[index]) {
      return num(backstage.branchRelatedCosts.rows[index].cost != null ? backstage.branchRelatedCosts.rows[index].cost : backstage.branchRelatedCosts.rows[index].adviceCost);
    }
    return BRANCH_ROWS[index] ? BRANCH_ROWS[index].cost : 0;
  }
  window.renderBranchRelatedCostsPanel = function(){
    ensureBranchRelatedCostsFinal();
    var body = '';
    var currentGroup = '';
    BRANCH_ROWS.forEach(function(row, index){
      if (row.group !== currentGroup) {
        currentGroup = row.group;
        body += '<tr class="branch-cost-section-row"><td colspan="4">' + e(currentGroup) + '</td></tr>';
      }
      body += '<tr>' +
        '<td><span class="branch-cost-name">' + e(row.name) + '</span></td>' +
        '<td class="branch-cost-unit">' + fmt(branchCost(index)) + '</td>' +
        '<td class="branch-cost-unit">' + e(row.unit) + '</td>' +
        '<td class="branch-cost-category">Branch</td>' +
        '</tr>';
    });
    var card = '<div class="branch-cost-card"><div class="branch-cost-table-wrap"><table class="branch-cost-table"><thead><tr><th>Cost item</th><th>Cost</th><th>Unit</th><th>Cost category</th></tr></thead><tbody>' + body + '</tbody></table></div></div>';
    return '<details id="branchRelatedCostsDetails" class="bs-section branch-costs-panel"><summary><div><h2 class="bs-section-title">Branch related costs</h2></div><span class="bs-chevron">⌄</span></summary><div class="bs-body bs-body-soft"><div class="branch-costs-grid">' + card + '</div></div></details>';
  };
  window.syncBranchRelatedCostsToBackstage = ensureBranchRelatedCostsFinal;

  function getNonReimbData(){
    if (!window.__nonReimbTableData) window.__nonReimbTableData = { backstopping:{}, branchQty:{} };
    return window.__nonReimbTableData;
  }
  function input(id, value){
    return '<input class="nonreimb-input" data-nonreimb-id="' + e(id) + '" type="number" step="0.01" value="' + e(value) + '">';
  }
  function backstoppingRow(row, index){
    var data = getNonReimbData();
    var rec = data.backstopping[index] || { cost:0, quantity:0 };
    var cost = num(rec.cost);
    var qty = num(rec.quantity);
    var total = cost * qty;
    return '<tr>' +
      '<td class="item-cell">' + e(row.name) + '</td>' +
      '<td>' + input('back_' + index + '_cost', cost) + '</td>' +
      '<td>' + input('back_' + index + '_quantity', qty) + '</td>' +
      '<td class="total-cell" data-nonreimb-total="back_' + index + '">' + fmt(total) + '</td>' +
      '<td><div class="fixed-cell">' + e(row.unit) + '</div></td>' +
      '<td><div class="fixed-cell">Project</div></td>' +
      '</tr>';
  }
  function branchRow(row, index){
    var data = getNonReimbData();
    var qty = num(data.branchQty[index]);
    var cost = branchCost(index);
    var total = cost * qty;
    return '<tr>' +
      '<td class="item-cell">' + e(row.name) + '</td>' +
      '<td><div class="fixed-cell num" title="As in Branch related costs in Backstage">' + fmt(cost) + '</div></td>' +
      '<td>' + input('branch_' + index + '_quantity', qty) + '</td>' +
      '<td class="total-cell" data-nonreimb-total="branch_' + index + '">' + fmt(total) + '</td>' +
      '<td><div class="fixed-cell">' + e(row.unit) + '</div></td>' +
      '<td><div class="fixed-cell">Branch</div></td>' +
      '</tr>';
  }
  function nonReimbGrandTotal(){
    var data = getNonReimbData();
    var total = 0;
    BACKSTOPPING_ROWS.forEach(function(row, index){
      var rec = data.backstopping[index] || { cost:0, quantity:0 };
      total += num(rec.cost) * num(rec.quantity);
    });
    BRANCH_ROWS.forEach(function(row, index){
      total += branchCost(index) * num(data.branchQty[index]);
    });
    return total;
  }
  function syncNonReimbFromInputs(){
    var data = getNonReimbData();
    document.querySelectorAll('[data-nonreimb-id]').forEach(function(el){
      var id = el.getAttribute('data-nonreimb-id') || '';
      var parts = id.split('_');
      if (parts[0] === 'back') {
        var bi = Number(parts[1]);
        if (!data.backstopping[bi]) data.backstopping[bi] = { cost:0, quantity:0 };
        if (parts[2] === 'cost') data.backstopping[bi].cost = num(el.value);
        if (parts[2] === 'quantity') data.backstopping[bi].quantity = num(el.value);
      }
      if (parts[0] === 'branch') {
        data.branchQty[Number(parts[1])] = num(el.value);
      }
    });
    var grand = nonReimbGrandTotal();
    var totalEl = document.getElementById('nonReimbGrandTotal');
    if (totalEl) totalEl.textContent = fmt(grand);
    try { if (typeof nonReimbursables !== 'undefined') nonReimbursables = [{ type:'Non-reimbursables', amount:grand }]; } catch(_) {}
  }
  window.renderStep5 = function(){
    ensureBranchRelatedCostsFinal();
    var html = '<div class="card"><div class="nonreimb-table-wrap"><table class="nonreimb-table"><thead><tr><th>Cost item</th><th>Cost</th><th>Quantity</th><th>Total</th><th>Unit</th><th>Cost category</th></tr></thead><tbody>';
    html += '<tr class="section-row"><td colspan="6">Backstopping</td></tr>';
    BACKSTOPPING_ROWS.forEach(function(row, index){ html += backstoppingRow(row, index); });
    if (!modeIsNoBranch()) {
      var currentGroup = '';
      BRANCH_ROWS.forEach(function(row, index){
        if (row.group !== currentGroup) {
          currentGroup = row.group;
          html += '<tr class="section-row"><td colspan="6">' + e(currentGroup) + '</td></tr>';
        }
        html += branchRow(row, index);
      });
    }
    html += '</tbody></table><div class="nonreimb-grand-total"><div class="label">Grand total</div><div class="value" id="nonReimbGrandTotal">' + fmt(nonReimbGrandTotal()) + '</div></div></div>' + (typeof navButtons === 'function' ? navButtons() : '') + '</div>';
    return html;
  };
  document.addEventListener('input', function(ev){
    if (ev.target && ev.target.getAttribute && ev.target.getAttribute('data-nonreimb-id')) {
      syncNonReimbFromInputs();
      updateNonReimbTotalsLive();
    }
  }, true);
  document.addEventListener('change', function(ev){
    if (ev.target && ev.target.getAttribute && ev.target.getAttribute('data-nonreimb-id')) {
      syncNonReimbFromInputs();
      updateNonReimbTotalsLive();
    }
  }, true);
  var previousSave = window.saveCurrentStepState;
  if (typeof previousSave === 'function' && !previousSave.finalNonReimbWrapped) {
    var saveWrap = function(){
      try { ensureBranchRelatedCostsFinal(); syncNonReimbFromInputs(); } catch(err) { console.error(err); }
      return previousSave.apply(this, arguments);
    };
    saveWrap.finalNonReimbWrapped = true;
    window.saveCurrentStepState = saveWrap;
  }
  try { ensureBranchRelatedCostsFinal(); if (typeof renderAll === 'function') renderAll(); } catch(err) { console.error(err); }
})();

/* ==========================================================================
   Original inline script block 24 | attrs: id="cost-item-notes-and-centering-final-v1"
   ========================================================================== */
(function(){
  function e(value){
    try { if (typeof esc === 'function') return esc(String(value == null ? '' : value)); } catch(_) {}
    return String(value == null ? '' : value).replace(/[&<>\"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c] || c; });
  }
  function num(value){
    var x = Number(String(value == null ? '' : value).replace(',', '.'));
    return Number.isFinite(x) ? x : 0;
  }
  function fmt(value){
    try { if (typeof money === 'function') return money(num(value)); } catch(_) {}
    return num(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  var BRANCH_ROWS = [
    { group:'Costs for opening the registration', name:'Legal fees', cost:2000, unit:'Once' },
    { group:'Costs for opening the registration', name:'Governmet fees', cost:2000, unit:'Once' },
    { group:'Costs for opening the registration', name:'Translation costs', cost:500, unit:'Once' },
    { group:'Costs for opening the registration', name:'Notary', cost:400, unit:'Once' },
    { group:'Costs for opening the registration', name:'Other costs', cost:100, unit:'Once' },
    { group:'Costs for managing the registration', name:'Accountant’s fees', cost:600, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Auditor’s fees', cost:200, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Accounting system fee.', cost:50, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Legal representative’s fees', cost:150, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Branch manager’s fees', cost:500, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Business license/similar costs', cost:100, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Other costs', cost:0, unit:'Monthly' }
  ];
  var BACKSTOPPING_ROWS = [
    { name:'Fee', unit:'Day' },
    { name:'Per diem', unit:'Day' },
    { name:'Accommodation', unit:'Day' },
    { name:'Flights', unit:'Times' }
  ];
  function notes(){
    if (!window.__costItemNotes) window.__costItemNotes = {};
    return window.__costItemNotes;
  }
  function noteSpan(key, label){
    var note = String(notes()[key] || '');
    var has = note.trim() ? 'true' : 'false';
    var tip = has === 'true' ? '<span class="cost-note-tooltip">' + e(note) + '</span>' : '';
    return '<span class="cost-note-name" data-cost-note-key="' + e(key) + '" data-cost-note-label="' + e(label) + '" data-has-note="' + has + '" title="Double-click to edit note">' + e(label) + tip + '</span>';
  }
  function modeIsNoBranch(){
    var mode = typeof backstage !== 'undefined' ? String(backstage.implementationMode || 'No Branch') : 'No Branch';
    return mode === 'No Branch';
  }
  function ensureBranchRelatedCostsFinal(){
    if (typeof backstage === 'undefined') return;
    var rows = [];
    BRANCH_ROWS.forEach(function(row, index){
      var existing = backstage.branchRelatedCosts && backstage.branchRelatedCosts.rows && backstage.branchRelatedCosts.rows[index] ? backstage.branchRelatedCosts.rows[index] : {};
      rows[index] = {
        name: row.name,
        cost: modeIsNoBranch() ? 0 : (existing.cost != null ? num(existing.cost) : row.cost),
        adviceCost: modeIsNoBranch() ? 0 : (existing.adviceCost != null ? num(existing.adviceCost) : (existing.cost != null ? num(existing.cost) : row.cost)),
        unit: row.unit,
        costCategory: 'Branch'
      };
    });
    backstage.branchRelatedCosts = { rows: rows };
  }
  function branchCost(index){
    ensureBranchRelatedCostsFinal();
    if (modeIsNoBranch()) return 0;
    if (typeof backstage !== 'undefined' && backstage.branchRelatedCosts && backstage.branchRelatedCosts.rows && backstage.branchRelatedCosts.rows[index]) {
      return num(backstage.branchRelatedCosts.rows[index].cost != null ? backstage.branchRelatedCosts.rows[index].cost : backstage.branchRelatedCosts.rows[index].adviceCost);
    }
    return BRANCH_ROWS[index] ? BRANCH_ROWS[index].cost : 0;
  }
  function getNonReimbData(){
    if (!window.__nonReimbTableData) window.__nonReimbTableData = { backstopping:{}, branchQty:{} };
    return window.__nonReimbTableData;
  }
  function input(id, value){
    return '<input class="nonreimb-input" data-nonreimb-id="' + e(id) + '" type="number" step="0.01" value="' + e(value) + '">';
  }
  function backstoppingRow(row, index){
    var data = getNonReimbData();
    var rec = data.backstopping[index] || { cost:0, quantity:0 };
    var cost = num(rec.cost);
    var qty = num(rec.quantity);
    var total = cost * qty;
    return '<tr>' +
      '<td class="item-cell">' + noteSpan('nonreimb_back_' + index, row.name) + '</td>' +
      '<td>' + input('back_' + index + '_cost', cost) + '</td>' +
      '<td>' + input('back_' + index + '_quantity', qty) + '</td>' +
      '<td class="total-cell" data-nonreimb-total="back_' + index + '">' + fmt(total) + '</td>' +
      '<td><div class="fixed-cell">' + e(row.unit) + '</div></td>' +
      '<td><div class="fixed-cell">Project</div></td>' +
      '</tr>';
  }
  function branchRow(row, index){
    var data = getNonReimbData();
    var qty = num(data.branchQty[index]);
    var cost = branchCost(index);
    var total = cost * qty;
    return '<tr>' +
      '<td class="item-cell">' + noteSpan('nonreimb_branch_' + index, row.name) + '</td>' +
      '<td><div class="fixed-cell num" title="As in Branch related costs in Backstage">' + fmt(cost) + '</div></td>' +
      '<td>' + input('branch_' + index + '_quantity', qty) + '</td>' +
      '<td class="total-cell" data-nonreimb-total="branch_' + index + '">' + fmt(total) + '</td>' +
      '<td><div class="fixed-cell">' + e(row.unit) + '</div></td>' +
      '<td><div class="fixed-cell">Branch</div></td>' +
      '</tr>';
  }
  function nonReimbGrandTotal(){
    var data = getNonReimbData();
    var total = 0;
    BACKSTOPPING_ROWS.forEach(function(row, index){
      var rec = data.backstopping[index] || { cost:0, quantity:0 };
      total += num(rec.cost) * num(rec.quantity);
    });
    if (!modeIsNoBranch()) {
      BRANCH_ROWS.forEach(function(row, index){
        total += branchCost(index) * num(data.branchQty[index]);
      });
    }
    return total;
  }
  function syncNonReimbFromInputs(){
    var data = getNonReimbData();
    document.querySelectorAll('[data-nonreimb-id]').forEach(function(el){
      var id = el.getAttribute('data-nonreimb-id') || '';
      var parts = id.split('_');
      if (parts[0] === 'back') {
        var bi = Number(parts[1]);
        if (!data.backstopping[bi]) data.backstopping[bi] = { cost:0, quantity:0 };
        if (parts[2] === 'cost') data.backstopping[bi].cost = num(el.value);
        if (parts[2] === 'quantity') data.backstopping[bi].quantity = num(el.value);
      }
      if (parts[0] === 'branch') data.branchQty[Number(parts[1])] = num(el.value);
    });
    var grand = nonReimbGrandTotal();
    var totalEl = document.getElementById('nonReimbGrandTotal');
    if (totalEl) totalEl.textContent = fmt(grand);
    try { if (typeof nonReimbursables !== 'undefined') nonReimbursables = [{ type:'Non-reimbursables', amount:grand }]; } catch(_) {}
  }
  window.renderBranchRelatedCostsPanel = function(){
    ensureBranchRelatedCostsFinal();
    var body = '';
    var currentGroup = '';
    BRANCH_ROWS.forEach(function(row, index){
      if (row.group !== currentGroup) {
        currentGroup = row.group;
        body += '<tr class="branch-cost-section-row"><td colspan="4">' + e(currentGroup) + '</td></tr>';
      }
      body += '<tr>' +
        '<td><span class="branch-cost-name">' + noteSpan('branch_backstage_' + index, row.name) + '</span></td>' +
        '<td class="branch-cost-unit">' + fmt(branchCost(index)) + '</td>' +
        '<td class="branch-cost-unit">' + e(row.unit) + '</td>' +
        '<td class="branch-cost-category">Branch</td>' +
        '</tr>';
    });
    var card = '<div class="branch-cost-card"><div class="branch-cost-table-wrap"><table class="branch-cost-table"><thead><tr><th>Cost item</th><th>Cost</th><th>Unit</th><th>Cost category</th></tr></thead><tbody>' + body + '</tbody></table></div></div>';
    return '<details id="branchRelatedCostsDetails" class="bs-section branch-costs-panel"><summary><div><h2 class="bs-section-title">Branch related costs</h2></div><span class="bs-chevron">⌄</span></summary><div class="bs-body bs-body-soft"><div class="branch-costs-grid">' + card + '</div></div></details>';
  };
  window.renderStep5 = function(){
    ensureBranchRelatedCostsFinal();
    var html = '<div class="card"><div class="nonreimb-table-wrap"><table class="nonreimb-table"><thead><tr><th>Cost item</th><th>Cost</th><th>Quantity</th><th>Total</th><th>Unit</th><th>Cost category</th></tr></thead><tbody>';
    html += '<tr class="section-row"><td colspan="6">Backstopping</td></tr>';
    BACKSTOPPING_ROWS.forEach(function(row, index){ html += backstoppingRow(row, index); });
    if (!modeIsNoBranch()) {
      var currentGroup = '';
      BRANCH_ROWS.forEach(function(row, index){
        if (row.group !== currentGroup) {
          currentGroup = row.group;
          html += '<tr class="section-row"><td colspan="6">' + e(currentGroup) + '</td></tr>';
        }
        html += branchRow(row, index);
      });
    }
    html += '</tbody></table><div class="nonreimb-grand-total"><div class="label">Grand total</div><div class="value" id="nonReimbGrandTotal">' + fmt(nonReimbGrandTotal()) + '</div></div></div>' + (typeof navButtons === 'function' ? navButtons() : '') + '</div>';
    return html;
  };
  function openCostNoteEditor(key, label){
    var existing = document.getElementById('costNoteModalBackdrop');
    if (existing) existing.remove();
    var wrap = document.createElement('div');
    wrap.className = 'cost-note-modal-backdrop';
    wrap.id = 'costNoteModalBackdrop';
    wrap.innerHTML = '<div class="cost-note-modal" role="dialog" aria-modal="true"><h3>Note for ' + e(label) + '</h3><p>Double-clicked cost item. The saved note is shown only when hovering over this name.</p><textarea id="costNoteTextarea" placeholder="Write note here...">' + e(notes()[key] || '') + '</textarea><div class="cost-note-modal-actions"><button type="button" data-note-action="cancel">Cancel</button><button type="button" class="primary" data-note-action="save">Save note</button></div></div>';
    document.body.appendChild(wrap);
    var textarea = document.getElementById('costNoteTextarea');
    if (textarea) { textarea.focus(); textarea.select(); }
    wrap.addEventListener('click', function(ev){
      var action = ev.target && ev.target.getAttribute ? ev.target.getAttribute('data-note-action') : '';
      if (ev.target === wrap || action === 'cancel') wrap.remove();
      if (action === 'save') {
        notes()[key] = textarea ? textarea.value : '';
        wrap.remove();
        try { if (typeof renderStep === 'function') renderStep(); } catch(_) {}
      }
    });
  }
  document.addEventListener('dblclick', function(ev){
    var target = ev.target && ev.target.closest ? ev.target.closest('[data-cost-note-key]') : null;
    if (!target) return;
    ev.preventDefault();
    openCostNoteEditor(target.getAttribute('data-cost-note-key'), target.getAttribute('data-cost-note-label') || target.textContent || 'cost item');
  }, true);
  document.addEventListener('input', function(ev){
    if (ev.target && ev.target.getAttribute && ev.target.getAttribute('data-nonreimb-id')) {
      syncNonReimbFromInputs();
      updateNonReimbTotalsLive();
    }
  }, true);
  document.addEventListener('change', function(ev){
    if (ev.target && ev.target.getAttribute && ev.target.getAttribute('data-nonreimb-id')) {
      syncNonReimbFromInputs();
      updateNonReimbTotalsLive();
    }
  }, true);
  window.syncBranchRelatedCostsToBackstage = ensureBranchRelatedCostsFinal;
  var previousSave = window.saveCurrentStepState;
  if (typeof previousSave === 'function' && !previousSave.costNotesFinalWrapped) {
    var saveWrap = function(){
      try { ensureBranchRelatedCostsFinal(); syncNonReimbFromInputs(); } catch(err) { console.error(err); }
      return previousSave.apply(this, arguments);
    };
    saveWrap.costNotesFinalWrapped = true;
    window.saveCurrentStepState = saveWrap;
  }
  try { ensureBranchRelatedCostsFinal(); if (typeof renderAll === 'function') renderAll(); } catch(err) { console.error(err); }
})();

/* ==========================================================================
   Original inline script block 25 | attrs: id="nonreimb-input-focus-and-label-fix-v2"
   ========================================================================== */
(function(){
  function num(value){
    var x = Number(String(value == null ? '' : value).replace(',', '.'));
    return Number.isFinite(x) ? x : 0;
  }
  function fmt(value){
    try { if (typeof money === 'function') return money(num(value)); } catch(_) {}
    return num(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  window.updateNonReimbTotalsLive = function(){
    try {
      if (typeof syncNonReimbFromInputs === 'function') syncNonReimbFromInputs();
    } catch(_) {}
    try {
      var data = window.__nonReimbTableData || { backstopping:{}, branchQty:{} };
      document.querySelectorAll('[data-nonreimb-total]').forEach(function(cell){
        var key = cell.getAttribute('data-nonreimb-total') || '';
        var parts = key.split('_');
        var total = 0;
        if (parts[0] === 'back') {
          var bi = Number(parts[1]);
          var rec = data.backstopping && data.backstopping[bi] ? data.backstopping[bi] : { cost:0, quantity:0 };
          total = num(rec.cost) * num(rec.quantity);
        }
        if (parts[0] === 'branch') {
          var qi = Number(parts[1]);
          var cost = 0;
          try { cost = typeof branchCost === 'function' ? branchCost(qi) : 0; } catch(_) { cost = 0; }
          total = cost * num(data.branchQty && data.branchQty[qi]);
        }
        cell.textContent = fmt(total);
      });
      var grand = 0;
      document.querySelectorAll('[data-nonreimb-total]').forEach(function(cell){
        var raw = String(cell.textContent || '').replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(',', '.');
        var v = Number(raw);
        if (Number.isFinite(v)) grand += v;
      });
      var grandEl = document.getElementById('nonReimbGrandTotal');
      if (grandEl && typeof nonReimbGrandTotal === 'function') grandEl.textContent = fmt(nonReimbGrandTotal());
    } catch(err) { console.error(err); }
  };
})();

/* ==========================================================================
   Original inline script block 26 | attrs: id="nonreimb-live-total-updater-v3"
   ========================================================================== */
(function(){
  function num(value){
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g, '');
    if (!s) return 0;
    var lastComma = s.lastIndexOf(',');
    var lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function fmt(value){
    try { if (typeof money === 'function') return money(num(value)); } catch(_) {}
    return num(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  window.updateNonReimbTotalsLive = function(){
    try {
      document.querySelectorAll('[data-nonreimb-total]').forEach(function(cell){
        var row = cell.closest('tr');
        if (!row) return;
        var inputs = row.querySelectorAll('[data-nonreimb-id]');
        var cost = 0;
        var quantity = 0;
        inputs.forEach(function(input){
          var id = input.getAttribute('data-nonreimb-id') || '';
          if (id.indexOf('_cost') > -1) cost = num(input.value);
          if (id.indexOf('_quantity') > -1) quantity = num(input.value);
        });
        if (!cost) {
          var fixedCost = row.querySelector('td:nth-child(2) .fixed-cell, td:nth-child(2)');
          if (fixedCost) cost = num(fixedCost.textContent);
        }
        cell.textContent = fmt(cost * quantity);
      });
      var grand = 0;
      document.querySelectorAll('[data-nonreimb-total]').forEach(function(cell){ grand += num(cell.textContent); });
      var grandEl = document.getElementById('nonReimbGrandTotal');
      if (grandEl) grandEl.textContent = fmt(grand);
      try { if (typeof nonReimbursables !== 'undefined') nonReimbursables = [{ type:'Non-reimbursables', amount:grand }]; } catch(_) {}
    } catch(err) { console.error(err); }
  };
})();

/* ==========================================================================
   Original inline script block 27 | attrs: id="company-taxes-margin-before-override-v4"
   ========================================================================== */
(function(){
  function num(value){
    if (typeof n === 'function') return n(value);
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g, '');
    if (!s) return 0;
    var lastComma = s.lastIndexOf(',');
    var lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function fmt(value){
    try { if (typeof money === 'function') return money(num(value)); } catch(_) {}
    return num(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function pct(value){
    var x = num(value);
    try { if (typeof formatPlainNumber === 'function') return formatPlainNumber(x) + '%'; } catch(_) {}
    return x.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}) + '%';
  }
  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }
  function flatRateTotals(){
    var totals = { companyCost:0, revenue:0 };
    try {
      if (typeof flatRates !== 'undefined' && Array.isArray(flatRates)) {
        flatRates.forEach(function(p){
          try {
            var c = computePosition(p);
            totals.companyCost += num(c.companyCost || 0);
            totals.revenue += num(c.revenue || 0);
          } catch(_) {}
        });
      }
    } catch(_) {}
    return totals;
  }
  function reimbursablesTotal(){
    try { if (typeof computeReimbursablesTotal === 'function') return num(computeReimbursablesTotal()); } catch(_) {}
    try { if (typeof reimbursables !== 'undefined' && Array.isArray(reimbursables)) return reimbursables.reduce(function(sum, row){ return sum + num(row.amount); }, 0); } catch(_) {}
    return 0;
  }
  function nonReimbursablesTotal(){
    try { if (typeof syncNonReimbFromInputs === 'function') syncNonReimbFromInputs(); } catch(_) {}
    try { if (typeof nonReimbGrandTotal === 'function') return num(nonReimbGrandTotal()); } catch(_) {}
    try { if (typeof nonReimbursables !== 'undefined' && Array.isArray(nonReimbursables)) return nonReimbursables.reduce(function(sum, row){ return sum + num(row.amount); }, 0); } catch(_) {}
    return 0;
  }
  function companyTaxesBeforeTotals(){
    var flat = flatRateTotals();
    var reimb = reimbursablesTotal();
    var nonReimb = nonReimbursablesTotal();
    var income = flat.revenue;
    var flatCompanyCost = flat.companyCost;
    var costsExpenses = flatCompanyCost + reimb + nonReimb;
    var marginBeforeCompanyTaxes = income - costsExpenses;
    var marginBeforeCompanyTaxesPercent = income > 0 ? (marginBeforeCompanyTaxes / income) * 100 : 0;
    return { income: income, flatCompanyCost: flatCompanyCost, reimbursables: reimb, nonReimbursables: nonReimb, costsExpenses: costsExpenses, marginBeforeCompanyTaxes: marginBeforeCompanyTaxes, marginBeforeCompanyTaxesPercent: marginBeforeCompanyTaxesPercent };
  }
  function costRow(name, source, amount, total){
    var w = total > 0 ? Math.max(3, Math.min(100, Math.round((num(amount) / total) * 100))) : 0;
    return '<div class="company-tax-cost-row">' +
      '<div><div class="company-tax-cost-name">' + esc(name) + '</div><span class="company-tax-cost-source">' + esc(source) + '</span><div class="company-tax-cost-bar" aria-hidden="true"><span style="--w:' + w + '%"></span></div></div>' +
      '<div class="company-tax-cost-amount">' + fmt(amount) + '</div>' +
    '</div>';
  }
  function summaryBeforeCompanyTaxesHtml(){
    var t = companyTaxesBeforeTotals();
    var marginClass = t.marginBeforeCompanyTaxes >= 0 ? 'margin-positive' : 'margin-negative';
    return '<section class="company-tax-summary-before-card" aria-label="Company taxes before-tax margin base">' +
      '<div class="company-tax-summary-before-hero">' +
        '<div>' +
          '<div class="company-tax-eyebrow"><span class="dot"></span>Company taxes decision base</div>' +
          '<h3>Before-tax margin, clearly tied to the cost base.</h3>' +
          '<p>This view connects the commercial flat-rate income to the real company cost base before company taxes are applied. It is designed to make the margin logic easy to defend in a review.</p>' +
        '</div>' +
        '<div class="company-tax-hero-result ' + marginClass + '">' +
          '<div class="result-label">Margin before company taxes</div>' +
          '<div class="result-value">' + fmt(t.marginBeforeCompanyTaxes) + '</div>' +
          '<div class="result-sub"><span>Margin before company taxes %</span><span class="result-percent">' + pct(t.marginBeforeCompanyTaxesPercent) + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="company-tax-story">' +
        '<div class="company-tax-flow-row">' +
          '<div class="company-tax-flow-card income"><div><div class="company-tax-flow-label">Income</div><div class="company-tax-flow-value">' + fmt(t.income) + '</div></div><div class="company-tax-flow-note">Revenue from the flat rate.</div></div>' +
          '<div class="company-tax-flow-operator">−</div>' +
          '<div class="company-tax-flow-card costs"><div><div class="company-tax-flow-label">Costs/Expenses</div><div class="company-tax-flow-value">' + fmt(t.costsExpenses) + '</div></div>' +
            '<div class="company-tax-cost-breakdown">' +
              costRow('Flat-rate company cost','From flat-rate summary company cost',t.flatCompanyCost,t.costsExpenses) +
              costRow('Reimbursables','From reimbursables grand total',t.reimbursables,t.costsExpenses) +
              costRow('Non-reimbursables','From non-reimbursables grand total',t.nonReimbursables,t.costsExpenses) +
            '</div>' +
          '</div>' +
          '<div class="company-tax-flow-operator">=</div>' +
          '<div class="company-tax-flow-card ' + marginClass + '"><div><div class="company-tax-flow-label">Margin before company taxes</div><div class="company-tax-flow-value">' + fmt(t.marginBeforeCompanyTaxes) + '</div></div><div class="company-tax-flow-note">Equivalent to <strong>' + pct(t.marginBeforeCompanyTaxesPercent) + '</strong> of income.</div></div>' +
        '</div>' +
        '<div class="company-tax-proof">' +
          '<div class="company-tax-proof-card accent"><div class="proof-label">Income</div><div class="proof-value">' + fmt(t.income) + '</div></div>' +
          '<div class="company-tax-proof-card"><div class="proof-label">Costs/Expenses</div><div class="proof-value">' + fmt(t.costsExpenses) + '</div></div>' +
          '<div class="company-tax-proof-card ' + marginClass + '"><div class="proof-label">Margin before company taxes</div><div class="proof-value">' + fmt(t.marginBeforeCompanyTaxes) + '</div></div>' +
          '<div class="company-tax-proof-card ' + marginClass + '"><div class="proof-label">Margin before company taxes %</div><div class="proof-value">' + pct(t.marginBeforeCompanyTaxesPercent) + '</div></div>' +
        '</div>' +
      '</div>' +
    '</section>';
  }
  window.companyTaxesBeforeTotals = companyTaxesBeforeTotals;
  window.renderStep6 = function(){
    return '<div class="card company-taxes-step-card">' +
      '<h2>Company taxes</h2>' +
      summaryBeforeCompanyTaxesHtml() +
      (typeof navButtons === 'function' ? navButtons() : '') +
      '</div>';
  };
  try { renderStep6 = window.renderStep6; } catch(_) {}
  try {
    if (typeof computeSummary === 'function') {
      var alignedSummary = function(){
        var t = companyTaxesBeforeTotals();
        return { totalRevenue: t.income, totalCost: t.costsExpenses, totalMargin: t.marginBeforeCompanyTaxes, marginRate: t.income > 0 ? t.marginBeforeCompanyTaxes / t.income : 0 };
      };
      alignedSummary.companyTaxesAlignedV4 = true;
      computeSummary = alignedSummary;
      window.computeSummary = alignedSummary;
    }
  } catch(_) {}
})();

/* ==========================================================================
   Original inline script block 28 | attrs: id="company-taxes-executive-panel-render-v5"
   ========================================================================== */
(function(){
  function numV5(value){ if (typeof n === 'function') return n(value); var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g, ''); if (!s) return 0; var lastComma = s.lastIndexOf(','); var lastDot = s.lastIndexOf('.'); if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.'); else s = s.replace(/,/g, ''); var x = Number(s); return Number.isFinite(x) ? x : 0; }
  function fmtV5(value){ try { if (typeof money === 'function') return money(numV5(value)); } catch(_) {} return numV5(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function pctV5(value){ var x = numV5(value); try { if (typeof formatPlainNumber === 'function') return formatPlainNumber(x) + '%'; } catch(_) {} return x.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}) + '%'; }
  function escV5(s){ return String(s == null ? '' : s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function flatRateTotalsV5(){ var totals = { companyCost:0, revenue:0 }; try { if (typeof flatRates !== 'undefined' && Array.isArray(flatRates)) { flatRates.forEach(function(p){ try { var c = computePosition(p); totals.companyCost += numV5(c.companyCost || 0); totals.revenue += numV5(c.revenue || 0); } catch(_) {} }); } } catch(_) {} return totals; }
  function reimbursablesTotalV5(){ try { if (typeof computeReimbursablesTotal === 'function') return numV5(computeReimbursablesTotal()); } catch(_) {} try { if (typeof reimbursables !== 'undefined' && Array.isArray(reimbursables)) return reimbursables.reduce(function(sum, row){ return sum + numV5(row.amount); }, 0); } catch(_) {} return 0; }
  function nonReimbursablesTotalV5(){ try { if (typeof syncNonReimbFromInputs === 'function') syncNonReimbFromInputs(); } catch(_) {} try { if (typeof nonReimbGrandTotal === 'function') return numV5(nonReimbGrandTotal()); } catch(_) {} try { if (typeof nonReimbursables !== 'undefined' && Array.isArray(nonReimbursables)) return nonReimbursables.reduce(function(sum, row){ return sum + numV5(row.amount); }, 0); } catch(_) {} return 0; }
  function companyTaxesBeforeTotalsV5(){ var flat = flatRateTotalsV5(); var reimb = reimbursablesTotalV5(); var nonReimb = nonReimbursablesTotalV5(); var flatRateRevenue = flat.revenue; var income = flatRateRevenue + reimb + nonReimb; var flatCompanyCost = flat.companyCost; var costsExpenses = flatCompanyCost + reimb + nonReimb; var flatRateMargin = flatRateRevenue - flatCompanyCost; var flatRateMarginPercent = flatRateRevenue > 0 ? (flatRateMargin / flatRateRevenue) * 100 : 0; var marginBeforeCompanyTaxes = income - costsExpenses; var marginBeforeCompanyTaxesPercent = income > 0 ? (marginBeforeCompanyTaxes / income) * 100 : 0; return { income: income, flatRateRevenue: flatRateRevenue, flatCompanyCost: flatCompanyCost, reimbursables: reimb, nonReimbursables: nonReimb, costsExpenses: costsExpenses, flatRateMargin: flatRateMargin, flatRateMarginPercent: flatRateMarginPercent, marginBeforeCompanyTaxes: marginBeforeCompanyTaxes, marginBeforeCompanyTaxesPercent: marginBeforeCompanyTaxesPercent }; }
  function breakdownRowV5(name, source, amount, total, shareLabel){ var share = total > 0 ? (numV5(amount) / total) * 100 : 0; var barWidth = total > 0 ? Math.max(2, Math.min(100, Math.round(share))) : 0; return '<div class="ctv5-cost-card"><div class="ctv5-cost-top"><div><div class="ctv5-cost-name">' + escV5(name) + '</div></div><div class="ctv5-cost-amount">' + fmtV5(amount) + '</div></div><div class="ctv5-cost-share"><span>' + escV5(shareLabel) + '</span><span>' + pctV5(share) + '</span></div><div class="ctv5-cost-track" aria-hidden="true"><span style="--w:' + barWidth + '%"></span></div></div>'; }
  function evolutionRowV5(kind, label, amount, percent, note, emptyState){ var w = emptyState ? 0 : Math.max(0, Math.min(100, numV5(percent))); var amountText = emptyState ? '—' : fmtV5(amount); var percentText = emptyState ? '—' : pctV5(percent); return '<div class="ctv5-evolution-item ' + kind + '"><div class="ctv5-evolution-head"><div class="ctv5-evolution-label">' + escV5(label) + '</div><div class="ctv5-evolution-amount">' + amountText + '</div><div class="ctv5-evolution-percent">' + percentText + '</div></div><div class="ctv5-evolution-track" aria-hidden="true"><span class="ctv5-evolution-fill" style="--w:' + w + '%; width:' + w + '%"></span></div>' + (note ? '<div class="ctv5-evolution-note">' + escV5(note) + '</div>' : '') + '</div>'; }

  function summaryBeforeCompanyTaxesHtmlV5(){ var t = companyTaxesBeforeTotalsV5(); var marginClass = t.marginBeforeCompanyTaxes >= 0 ? 'positive' : 'negative'; return '<section class="ctv5-panel" aria-label="Company taxes"><div class="ctv5-grid"><div class="ctv5-main"><div class="ctv5-kpi income"><div class="ctv5-kpi-label">Income</div><div class="ctv5-kpi-value">' + fmtV5(t.income) + '</div></div><div class="ctv5-cost-stack">' + breakdownRowV5('Flat-rate revenue','',t.flatRateRevenue,t.income,'Share of Income') + breakdownRowV5('Reimbursables','',t.reimbursables,t.income,'Share of Income') + breakdownRowV5('Non-reimbursables','',t.nonReimbursables,t.income,'Share of Income') + '</div><div class="ctv5-divider"></div><div class="ctv5-kpi costs"><div class="ctv5-kpi-label">Costs/Expenses</div><div class="ctv5-kpi-value">' + fmtV5(t.costsExpenses) + '</div></div><div class="ctv5-cost-stack">' + breakdownRowV5('Flat-rate company cost','',t.flatCompanyCost,t.costsExpenses,'Share of Costs/Expenses') + breakdownRowV5('Reimbursables','',t.reimbursables,t.costsExpenses,'Share of Costs/Expenses') + breakdownRowV5('Non-reimbursables','',t.nonReimbursables,t.costsExpenses,'Share of Costs/Expenses') + '</div><div class="ctv5-margin-grid"><div class="ctv5-margin-card ' + marginClass + '"><div class="ctv5-kpi margin ' + marginClass + '"><div class="ctv5-kpi-label">Margin before company taxes</div><div class="ctv5-kpi-value">' + fmtV5(t.marginBeforeCompanyTaxes) + '</div></div></div><div class="ctv5-percent-card ' + marginClass + '"><div class="ctv5-kpi percent ' + marginClass + '"><div class="ctv5-kpi-label">Margin before company taxes %</div><div class="ctv5-kpi-value">' + pctV5(t.marginBeforeCompanyTaxesPercent) + '</div></div></div></div></div><aside class="ctv5-side"><div class="ctv5-evolution-card"><div class="ctv5-evolution-title">Margin evolution</div><div class="ctv5-evolution-stack">' + evolutionRowV5('flat','Flat-rate margin',t.flatRateMargin,t.flatRateMarginPercent,'Based on flat-rate revenue and flat-rate company cost.',false) + evolutionRowV5('before','Margin before company taxes',t.marginBeforeCompanyTaxes,t.marginBeforeCompanyTaxesPercent,'Current margin including reimbursables and non-reimbursables.',false) + evolutionRowV5('after','Margin after company taxes','',0,'To be defined.',true) + '</div></div></aside></div></section>'; }
  window.companyTaxesBeforeTotals = companyTaxesBeforeTotalsV5;
  window.renderStep6 = function(){ return '<div class="card company-taxes-step-card"><h2>Company taxes</h2>' + summaryBeforeCompanyTaxesHtmlV5() + (typeof navButtons === 'function' ? navButtons() : '') + '</div>'; };
  try { renderStep6 = window.renderStep6; } catch(_) {}
  try { if (typeof computeSummary === 'function') { var alignedSummary = function(){ var t = companyTaxesBeforeTotalsV5(); return { totalRevenue: t.income, totalCost: t.costsExpenses, totalMargin: t.marginBeforeCompanyTaxes, marginRate: t.income > 0 ? t.marginBeforeCompanyTaxes / t.income : 0 }; }; alignedSummary.companyTaxesAlignedV5 = true; computeSummary = alignedSummary; window.computeSummary = alignedSummary; } } catch(_) {}
  setTimeout(function(){ try { if (typeof currentStep !== 'undefined' && currentStep === 4 && typeof renderStep === 'function') renderStep(); } catch(_) {} }, 0);
})();

(function(){
  function num6(value){
    if (typeof n === 'function') return n(value);
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g, '');
    if (!s) return 0;
    var lastComma = s.lastIndexOf(',');
    var lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function fmt6(value){ try { if (typeof money === 'function') return money(num6(value)); } catch(_) {} return num6(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function pct6(value){ var x = num6(value); try { if (typeof formatPlainNumber === 'function') return formatPlainNumber(x) + '%'; } catch(_) {} return x.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}) + '%'; }
  function esc6(s){ return String(s == null ? '' : s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function rate6(v, fallback){ var x = num6(v != null && v !== '' ? v : fallback); return x / 100; }
  function modeAmount6(mode, value, base){ return String(mode || 'Percentage') === 'Amount' ? num6(value) : base * rate6(value, 0); }
  function flatRateTotals6(){ var totals = { companyCost:0, revenue:0 }; try { if (Array.isArray(flatRates)) flatRates.forEach(function(p){ try { var c = computePosition(p); totals.companyCost += num6(c.companyCost || 0); totals.revenue += num6(c.revenue || 0); } catch(_) {} }); } catch(_) {} return totals; }
  function reimbursablesTotal6(){ try { if (typeof computeReimbursablesTotal === 'function') return num6(computeReimbursablesTotal()); } catch(_) {} try { if (Array.isArray(reimbursables)) return reimbursables.reduce(function(sum, row){ return sum + num6(row.amount); }, 0); } catch(_) {} return 0; }
  function nonReimbursablesTotal6(){ try { if (typeof syncNonReimbFromInputs === 'function') syncNonReimbFromInputs(); } catch(_) {} try { if (typeof nonReimbGrandTotal === 'function') return num6(nonReimbGrandTotal()); } catch(_) {} try { if (Array.isArray(nonReimbursables)) return nonReimbursables.reduce(function(sum, row){ return sum + num6(row.amount); }, 0); } catch(_) {} return 0; }
  function companyTaxModel6(income, costsExpenses, marginBefore){
    var b = (typeof backstage !== 'undefined' && backstage) ? backstage : {};
    var mode = String(b.implementationMode || 'No Branch');
    var corporateIncomeTax = 0, whtTaxIncome = 0, whtTaxTransferPrices = 0, otherTax = 0, localCostAdjustment = 0;
    var taxBaseLabel = 'Income';
    if (mode === 'Branch performs contract') {
      var profitAbroadBase = income * rate6(b.companyBranchContractProfitAbroadRate, 5);
      var transferPricesBase = income * rate6(b.companyBranchContractTransferPricesRate, 20);
      taxBaseLabel = 'Profit abroad / transfer prices';
      corporateIncomeTax = profitAbroadBase * rate6(b.companyBranchContractCorporateIncomeTaxRate, 30);
      whtTaxTransferPrices = transferPricesBase * rate6(b.companyBranchContractNonResidentWhtRate, 15);
    } else if (mode === 'Branch for local support') {
      var localCosts = modeAmount6(b.companyLocalSupportLocalCostsMode, b.companyLocalSupportLocalCostsValue != null ? b.companyLocalSupportLocalCostsValue : 20, costsExpenses);
      var branchFee = modeAmount6(b.companyLocalSupportBranchFeeMode, b.companyLocalSupportBranchFeeValue != null ? b.companyLocalSupportBranchFeeValue : 6, localCosts);
      taxBaseLabel = 'Local support / branch fee';
      localCostAdjustment = localCosts;
      corporateIncomeTax = branchFee * rate6(b.companyLocalSupportCorporateIncomeTaxRate, 30);
      otherTax = branchFee * rate6(b.companyLocalSupportOtherTaxRate, 0);
    } else {
      var whtBase = income * rate6(b.companyNoBranchIncomeSubjectToNonResidentWhtRate, 100);
      var otherBase = income * rate6(b.companyNoBranchIncomeSubjectToOtherTaxRate, 100);
      whtTaxIncome = whtBase * rate6(b.companyNoBranchNonResidentWhtRate, 15);
      otherTax = otherBase * rate6(b.companyNoBranchOtherTaxRate, 0);
    }
    var whtTax = whtTaxIncome + whtTaxTransferPrices;
    var companyTaxes = corporateIncomeTax + whtTax + otherTax + localCostAdjustment;
    var marginAfterCompanyTaxes = marginBefore - companyTaxes;
    var companyTaxesPercent = income > 0 ? (companyTaxes / income) * 100 : 0;
    var marginAfterCompanyTaxesPercent = income > 0 ? (marginAfterCompanyTaxes / income) * 100 : 0;
    return { mode:mode, taxBaseLabel:taxBaseLabel, corporateIncomeTax:corporateIncomeTax, whtTaxIncome:whtTaxIncome, whtTaxTransferPrices:whtTaxTransferPrices, whtTax:whtTax, otherTax:otherTax, localCostAdjustment:localCostAdjustment, companyTaxes:companyTaxes, companyTaxesPercent:companyTaxesPercent, marginAfterCompanyTaxes:marginAfterCompanyTaxes, marginAfterCompanyTaxesPercent:marginAfterCompanyTaxesPercent };
  }
  function companyTaxesBeforeTotals6(){
    var flat = flatRateTotals6();
    var reimb = reimbursablesTotal6();
    var nonReimb = nonReimbursablesTotal6();
    var flatRateRevenue = flat.revenue;
    var income = flatRateRevenue + reimb + nonReimb;
    var flatCompanyCost = flat.companyCost;
    var costsExpenses = flatCompanyCost + reimb + nonReimb;
    var flatRateMargin = flatRateRevenue - flatCompanyCost;
    var flatRateMarginPercent = flatRateRevenue > 0 ? (flatRateMargin / flatRateRevenue) * 100 : 0;
    var marginBeforeCompanyTaxes = income - costsExpenses;
    var marginBeforeCompanyTaxesPercent = income > 0 ? (marginBeforeCompanyTaxes / income) * 100 : 0;
    var tax = companyTaxModel6(income, costsExpenses, marginBeforeCompanyTaxes);
    return { income:income, flatRateRevenue:flatRateRevenue, flatCompanyCost:flatCompanyCost, reimbursables:reimb, nonReimbursables:nonReimb, costsExpenses:costsExpenses, flatRateMargin:flatRateMargin, flatRateMarginPercent:flatRateMarginPercent, marginBeforeCompanyTaxes:marginBeforeCompanyTaxes, marginBeforeCompanyTaxesPercent:marginBeforeCompanyTaxesPercent, tax:tax, companyTaxes:tax.companyTaxes, companyTaxesPercent:tax.companyTaxesPercent, marginAfterCompanyTaxes:tax.marginAfterCompanyTaxes, marginAfterCompanyTaxesPercent:tax.marginAfterCompanyTaxesPercent };
  }
  function breakdownRow6(name, amount, total, shareLabel){ var share = total > 0 ? (num6(amount) / total) * 100 : 0; var barWidth = total > 0 ? Math.max(2, Math.min(100, Math.round(share))) : 0; return '<div class="ctv5-cost-card"><div class="ctv5-cost-top"><div><div class="ctv5-cost-name">' + esc6(name) + '</div></div><div class="ctv5-cost-amount">' + fmt6(amount) + '</div></div><div class="ctv5-cost-share"><span>' + esc6(shareLabel) + '</span><span>' + pct6(share) + '</span></div><div class="ctv5-cost-track" aria-hidden="true"><span style="--w:' + barWidth + '%"></span></div></div>'; }
  function marginTone6(percent){ var p = num6(percent); if (p < 0) return 'is-negative'; if (p > 25) return 'is-good'; return 'is-mid'; }
  function evolutionRow6(kind, label, amount, percent, note){ var p = num6(percent); var w = Math.max(0, Math.min(100, Math.abs(p))); var tone = kind === 'tax' ? '' : (' ' + marginTone6(p)); return '<div class="ctv5-evolution-item ' + kind + tone + '"><div class="ctv5-evolution-head"><div class="ctv5-evolution-label">' + esc6(label) + '</div><div class="ctv5-evolution-amount">' + fmt6(amount) + '</div><div class="ctv5-evolution-percent">' + pct6(percent) + '</div></div><div class="ctv5-evolution-track" aria-hidden="true"><span class="ctv5-evolution-fill" style="--w:' + w + '%; width:' + w + '%"></span></div>' + (note ? '<div class="ctv5-evolution-note">' + esc6(note) + '</div>' : '') + '</div>'; }
  function taxLine6(label, amount){ return '<div class="ctv6-tax-line"><span>' + esc6(label) + '</span><strong>' + fmt6(amount) + '</strong></div>'; }
  function taxBreakdown6(t){ return '<div class="ctv6-tax-row"><div class="ctv6-tax-title">Company taxes breakdown</div>' + taxLine6('Corporate income tax', t.tax.corporateIncomeTax) + taxLine6('WHT on income', t.tax.whtTaxIncome) + taxLine6('WHT on transfer prices', t.tax.whtTaxTransferPrices) + taxLine6('Other tax', t.tax.otherTax) + taxLine6('Local cost adjustment', t.tax.localCostAdjustment) + '</div>'; }
  function summaryBeforeCompanyTaxesHtml6(){
    var t = companyTaxesBeforeTotals6();
    return '<section class="ctv5-panel" aria-label="Company taxes"><div class="ctv5-grid"><div class="ctv5-main"><div class="ctv5-kpi income"><div class="ctv5-kpi-label">Income</div><div class="ctv5-kpi-value">' + fmt6(t.income) + '</div></div><div class="ctv5-cost-stack">' + breakdownRow6('Flat-rate revenue',t.flatRateRevenue,t.income,'Share of Income') + breakdownRow6('Reimbursables',t.reimbursables,t.income,'Share of Income') + breakdownRow6('Non-reimbursables',t.nonReimbursables,t.income,'Share of Income') + '</div><div class="ctv5-divider"></div><div class="ctv5-kpi costs"><div class="ctv5-kpi-label">Costs/Expenses</div><div class="ctv5-kpi-value">' + fmt6(t.costsExpenses) + '</div></div><div class="ctv5-cost-stack">' + breakdownRow6('Flat-rate company cost',t.flatCompanyCost,t.costsExpenses,'Share of Costs/Expenses') + breakdownRow6('Reimbursables',t.reimbursables,t.costsExpenses,'Share of Costs/Expenses') + breakdownRow6('Non-reimbursables',t.nonReimbursables,t.costsExpenses,'Share of Costs/Expenses') + '</div></div><aside class="ctv5-side"><div class="ctv5-evolution-card"><div class="ctv5-evolution-title">Margin evolution</div><div class="ctv5-evolution-stack">' + evolutionRow6('flat','Flat-rate margin',t.flatRateMargin,t.flatRateMarginPercent,'Flat-rate revenue minus flat-rate company cost.') + evolutionRow6('before','Margin before company taxes',t.marginBeforeCompanyTaxes,t.marginBeforeCompanyTaxesPercent,'Income minus Costs/Expenses.') + evolutionRow6('tax','Company taxes',t.companyTaxes,t.companyTaxesPercent,'Corporate income tax + WHT tax + Other tax + Local cost adjustment.') + evolutionRow6('after','Margin after company taxes',t.marginAfterCompanyTaxes,t.marginAfterCompanyTaxesPercent,'Margin before company taxes minus Company taxes.') + '</div>' + taxBreakdown6(t) + '</div></aside></div></section>';
  }
  window.companyTaxesBeforeTotals = companyTaxesBeforeTotals6;
  window.renderStep6 = function(){ return '<div class="card company-taxes-step-card">' + summaryBeforeCompanyTaxesHtml6() + (typeof navButtons === 'function' ? navButtons() : '') + '</div>'; };
  try { renderStep6 = window.renderStep6; } catch(_) {}
  try { if (typeof computeSummary === 'function') { var alignedSummary = function(){ var t = companyTaxesBeforeTotals6(); return { totalRevenue:t.income, totalCost:t.costsExpenses + t.companyTaxes, totalMargin:t.marginAfterCompanyTaxes, marginRate:t.income > 0 ? t.marginAfterCompanyTaxes / t.income : 0 }; }; alignedSummary.companyTaxesAlignedV6 = true; computeSummary = alignedSummary; window.computeSummary = alignedSummary; } } catch(_) {}
  setTimeout(function(){ try { if (typeof currentStep !== 'undefined' && currentStep === 4 && typeof renderStep === 'function') renderStep(); } catch(_) {} }, 0);
})();

/* ==========================================================================
   Original inline script block 30 | attrs: id="confirmation-checklist-and-flat-country-v7-script"
   ========================================================================== */
(function(){
  function escapeHtml7(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }
  function num7(value){
    if (typeof n === 'function') return n(value);
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g, '');
    if (!s) return 0;
    var lastComma = s.lastIndexOf(',');
    var lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function fmtMoney7(value){
    try { if (typeof money === 'function') return money(num7(value)); } catch(_) {}
    return num7(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function fmtPercent7(value){
    var x = num7(value);
    try { if (typeof formatPlainNumber === 'function') return formatPlainNumber(x) + '%'; } catch(_) {}
    return x.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}) + '%';
  }
  function marginTone7(percent){
    var p = num7(percent);
    if (p < 0) return 'bad';
    if (p > 25) return 'good';
    return 'mid';
  }
  function fallback7(value){
    var s = String(value == null ? '' : value).trim();
    return s || '—';
  }
  function positionTitle7(p, idx){
    try { if (typeof positionDisplayTitle === 'function') return positionDisplayTitle(p, idx); } catch(_) {}
    return p && p.title ? p.title : ('Position ' + (idx + 1));
  }
  function positionMargin7(p){
    try {
      if (typeof computePosition === 'function') {
        var c = computePosition(p);
        var amount = c.margin != null ? c.margin : ((c.revenue || 0) - (c.companyCost || 0));
        var percent = c.marginRateDecimal != null ? c.marginRateDecimal * 100 : (c.marginRate != null ? c.marginRate : num7(p.marginRate));
        return { amount: amount, percent: percent };
      }
    } catch(_) {}
    return { amount: 0, percent: num7(p && p.marginRate) };
  }
  function setupItem7(label, value){
    return '<div class="confirmation-setup-item"><span class="confirmation-tick">✓</span><div><div class="confirmation-item-label">' + escapeHtml7(label) + '</div><div class="confirmation-item-value">' + escapeHtml7(fallback7(value)) + '</div></div></div>';
  }
  function positionRows7(){
    var rows = [];
    try {
      if (Array.isArray(flatRates)) {
        rows = flatRates.map(function(p, idx){
          var m = positionMargin7(p || {});
          var pct = num7(m.percent);
          return '<tr>' +
            '<td><div class="pos-main">' + escapeHtml7(positionTitle7(p || {}, idx)) + '</div><div class="pos-sub">' + escapeHtml7((p && p.name) || ('Position ' + (idx + 1))) + '</div></td>' +
            '<td><span class="confirmation-margin-pill ' + marginTone7(pct) + '">' + escapeHtml7(fmtMoney7(m.amount)) + ' · ' + escapeHtml7(fmtPercent7(pct)) + '</span></td>' +
            '<td>' + escapeHtml7(fallback7(p && p.contractualType)) + '</td>' +
            '<td>' + escapeHtml7(fallback7(p && p.inputMode)) + '</td>' +
            '<td>' + escapeHtml7(fallback7(p && p.countryOfResidence)) + '</td>' +
            '<td><span class="confirmation-tick">✓</span></td>' +
          '</tr>';
        });
      }
    } catch(_) {}
    if (!rows.length) return '<div class="confirmation-empty">No flat-rate positions yet.</div>';
    return '<div class="confirmation-position-section"><div class="confirmation-position-title">Position checklist</div><div class="confirmation-table-wrap"><table class="confirmation-table"><thead><tr><th>Position</th><th>Margin</th><th>Provider type</th><th>Input mode</th><th>Country of residence</th><th>Check</th></tr></thead><tbody>' + rows.join('') + '</tbody></table></div></div>';
  }
  window.renderConfirmationChecklist7 = function(){
    var mode = '—';
    var implementationCountry = '—';
    try {
      if (typeof backstage !== 'undefined' && backstage) {
        mode = backstage.implementationMode || mode;
        implementationCountry = backstage.implementationCountry || implementationCountry;
      }
    } catch(_) {}
    return '<section class="confirmation-check-card" aria-label="Confirmation checklist">' +
      '<div class="confirmation-check-head"><div class="confirmation-check-kicker">Confirmation checklist</div><h3>Review before final confirmation.</h3><p>Use this checklist to confirm the implementation setup and the key flat-rate position details before moving forward.</p></div>' +
      '<div class="confirmation-check-body"><div class="confirmation-setup-grid">' +
        setupItem7('Mode of implementation', mode) +
        setupItem7('ITR country', implementationCountry) +
      '</div>' + positionRows7() + '</div>' +
    '</section>';
  };
  var previousRenderStep7 = (typeof window.renderStep7 === 'function') ? window.renderStep7 : (typeof renderStep7 === 'function' ? renderStep7 : null);
  window.renderStep7 = function(){
    var summaryHtml = '';
    try { if (previousRenderStep7) summaryHtml = previousRenderStep7(); } catch(_) {}
    var metrics = '';
    try {
      var s = (typeof computeSummary === 'function') ? computeSummary() : null;
      if (s) {
        metrics = '<div class="row cols-4">' +
          '<div class="metric"><div class="name">Total Revenue</div><div class="value">' + fmtMoney7(s.totalRevenue) + '</div></div>' +
          '<div class="metric"><div class="name">Total Cost</div><div class="value">' + fmtMoney7(s.totalCost) + '</div></div>' +
          '<div class="metric"><div class="name">Total Margin</div><div class="value">' + fmtMoney7(s.totalMargin) + '</div></div>' +
          '<div class="metric"><div class="name">Margin Rate</div><div class="value">' + fmtPercent7((s.marginRate || 0) * 100) + '</div></div>' +
        '</div>';
      }
    } catch(_) {}
    return '<div class="card confirmation-step-card"><h2>Confirmation</h2>' + metrics + window.renderConfirmationChecklist7() + (typeof navButtons === 'function' ? navButtons() : '') + '</div>';
  };
  try { renderStep7 = window.renderStep7; } catch(_) {}

  function countryOptions7(){
    try {
      if (typeof availableCountryValues === 'function') {
        var values = availableCountryValues();
        if (values && values.length) return values;
      }
    } catch(_) {}
    return ['Germany','France','Spain','Italy','Netherlands','Belgium','Austria','Switzerland','United Kingdom','United States','Brazil','India','Kenya','South Africa'];
  }
  function norm7(s){ return String(s || '').trim().toLowerCase(); }
  function flag7(country){
    try { if (typeof window.marginIqCountryFlagMarkup === 'function') return window.marginIqCountryFlagMarkup(country); } catch(_) {}
    return '';
  }
  function matches7(q){
    var query = norm7(q);
    var all = countryOptions7();
    if (!query) return all.slice(0, 14);
    return all.filter(function(c){ return norm7(c).indexOf(query) !== -1; }).slice(0, 14);
  }
  function ensureFlatCountryDropdown7(input){
    var wrap = input.closest('.country-autocomplete-field');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'country-autocomplete-field flat-country-enhanced';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
    } else {
      wrap.classList.add('flat-country-enhanced');
    }
    input.setAttribute('role','combobox');
    input.setAttribute('aria-autocomplete','list');
    input.setAttribute('aria-expanded','false');
    input.removeAttribute('list');
    if (!wrap.querySelector('.country-current-flag')) {
      var fl = document.createElement('span');
      fl.className = 'country-current-flag';
      wrap.insertBefore(fl, input);
    }
    var dd = wrap.querySelector('.country-suggest-dropdown');
    if (!dd) {
      dd = document.createElement('div');
      dd.className = 'country-suggest-dropdown';
      dd.hidden = true;
      wrap.appendChild(dd);
    }
    updateFlatCountryFlag7(input);
    return dd;
  }
  function updateFlatCountryFlag7(input){
    var wrap = input.closest('.country-autocomplete-field');
    var fl = wrap && wrap.querySelector('.country-current-flag');
    if (fl) fl.innerHTML = flag7(input.value || '');
  }
  function showFlatCountrySuggestions7(input){
    var dd = ensureFlatCountryDropdown7(input);
    var options = matches7(input.value);
    dd.innerHTML = options.length ? options.map(function(name, i){ return '<button type="button" class="country-suggest-option' + (i === 0 ? ' is-active' : '') + '" data-flat-country-value="' + escapeHtml7(name) + '"><span class="country-suggest-flag">' + flag7(name) + '</span><span class="country-suggest-name">' + escapeHtml7(name) + '</span></button>'; }).join('') : '<div class="country-suggest-empty">No matching country</div>';
    dd.hidden = false;
    input.setAttribute('aria-expanded','true');
    updateFlatCountryFlag7(input);
  }
  function hideFlatCountrySuggestions7(input){
    var wrap = input.closest('.country-autocomplete-field');
    var dd = wrap && wrap.querySelector('.country-suggest-dropdown');
    if (dd) dd.hidden = true;
    input.setAttribute('aria-expanded','false');
    updateFlatCountryFlag7(input);
  }
  function selectFlatCountry7(input, value){
    input.value = value;
    updateFlatCountryFlag7(input);
    input.dispatchEvent(new Event('input', {bubbles:true}));
    input.dispatchEvent(new Event('change', {bubbles:true}));
    hideFlatCountrySuggestions7(input);
  }
  function initFlatResidenceCountryAutocomplete7(){
    document.querySelectorAll('input[data-field="countryOfResidence"]').forEach(function(input){ ensureFlatCountryDropdown7(input); });
  }
  document.addEventListener('focusin', function(e){
    var input = e.target && e.target.matches && e.target.matches('input[data-field="countryOfResidence"]') ? e.target : null;
    if (input) showFlatCountrySuggestions7(input);
  });
  document.addEventListener('input', function(e){
    var input = e.target && e.target.matches && e.target.matches('input[data-field="countryOfResidence"]') ? e.target : null;
    if (input) showFlatCountrySuggestions7(input);
  });
  document.addEventListener('click', function(e){
    var opt = e.target.closest && e.target.closest('[data-flat-country-value]');
    if (opt) {
      var wrap = opt.closest('.country-autocomplete-field');
      var input = wrap && wrap.querySelector('input[data-field="countryOfResidence"]');
      if (input) selectFlatCountry7(input, opt.dataset.flatCountryValue || opt.textContent.trim());
      return;
    }
    document.querySelectorAll('input[data-field="countryOfResidence"]').forEach(function(input){
      var wrap = input.closest('.country-autocomplete-field');
      if (wrap && !wrap.contains(e.target)) hideFlatCountrySuggestions7(input);
    });
  });
  document.addEventListener('keydown', function(e){
    var input = e.target && e.target.matches && e.target.matches('input[data-field="countryOfResidence"]') ? e.target : null;
    if (!input) return;
    var dd = ensureFlatCountryDropdown7(input);
    var options = Array.from(dd.querySelectorAll('[data-flat-country-value]'));
    if (e.key === 'Escape') { hideFlatCountrySuggestions7(input); return; }
    if (!options.length) return;
    var current = Math.max(0, options.findIndex(function(o){ return o.classList.contains('is-active'); }));
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var next = e.key === 'ArrowDown' ? Math.min(options.length - 1, current + 1) : Math.max(0, current - 1);
      options.forEach(function(o){ o.classList.remove('is-active'); });
      options[next].classList.add('is-active');
      options[next].scrollIntoView({block:'nearest'});
    }
    if (e.key === 'Enter' && !dd.hidden) {
      var active = options.find(function(o){ return o.classList.contains('is-active'); }) || options[0];
      if (active) { e.preventDefault(); selectFlatCountry7(input, active.dataset.flatCountryValue || active.textContent.trim()); }
    }
  });
  var previousRenderStep = (typeof window.renderStep === 'function') ? window.renderStep : null;
  if (previousRenderStep && !previousRenderStep.confirmationCountryV7Wrapped) {
    var wrappedRenderStep = function(){
      var result = previousRenderStep.apply(this, arguments);
      setTimeout(initFlatResidenceCountryAutocomplete7, 0);
      return result;
    };
    wrappedRenderStep.confirmationCountryV7Wrapped = true;
    window.renderStep = wrappedRenderStep;
    try { renderStep = wrappedRenderStep; } catch(_) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initFlatResidenceCountryAutocomplete7, {once:true});
  else initFlatResidenceCountryAutocomplete7();
})();

/* ==========================================================================
   Original inline script block 31 | attrs: id="confirmation-interactive-checklist-v8-script"
   ========================================================================== */
(function(){
  var confirmationChecklistConfirmed8 = false;

  function esc8(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }
  function num8(value){
    if (typeof n === 'function') return n(value);
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g,'');
    if (!s) return 0;
    var lastComma = s.lastIndexOf(',');
    var lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) s = s.replace(/\./g,'').replace(',','.');
    else s = s.replace(/,/g,'');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function money8(value){
    try { if (typeof money === 'function') return money(num8(value)); } catch(_) {}
    return num8(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function pct8(value){
    var x = num8(value);
    try { if (typeof formatPlainNumber === 'function') return formatPlainNumber(x) + '%'; } catch(_) {}
    return x.toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:2}) + '%';
  }
  function fallback8(value){
    var s = String(value == null ? '' : value).trim();
    return s || '—';
  }
  function tone8(percent){
    var p = num8(percent);
    if (p < 0) return 'bad';
    if (p > 25) return 'good';
    return 'mid';
  }
  function positionTitle8(p, idx){
    try { if (typeof positionDisplayTitle === 'function') return positionDisplayTitle(p, idx); } catch(_) {}
    return (p && (p.title || p.name)) || ('Position ' + (idx + 1));
  }
  function positionMargin8(p){
    try {
      if (typeof computePosition === 'function') {
        var c = computePosition(p);
        var amount = c.margin != null ? c.margin : ((c.revenue || 0) - (c.companyCost || 0));
        var percent = c.marginRateDecimal != null ? c.marginRateDecimal * 100 : (c.marginRate != null ? c.marginRate : num8(p && p.marginRate));
        return {amount: amount, percent: percent};
      }
    } catch(_) {}
    return {amount:0, percent:num8(p && p.marginRate)};
  }
  function isContractOverwritten8(p){
    try { if (typeof hasContractingEntityOverwrite === 'function') return !!hasContractingEntityOverwrite(p); } catch(_) {}
    return !!(p && (p.contractingEntityOverwriteActive || p.contractingEntityOverwriteAccepted || p.contractingEntityOverwriteValue));
  }
  function currentContractingEntity8(p){
    try { if (isContractOverwritten8(p) && p.contractingEntityOverwriteValue) return p.contractingEntityOverwriteValue; } catch(_) {}
    try { if (typeof getAutoContractingEntity === 'function') return getAutoContractingEntity(p); } catch(_) {}
    return p && (p.contractingEntity || p.contractingEntityOverwriteValue) || '—';
  }
  function setupRow8(id, label, value, detail){
    return '<label class="confirmation-check-row">' +
      '<input type="checkbox" class="confirmation-required-check" data-confirmation-check="' + esc8(id) + '" onchange="window.updateConfirmationChecklist8 && window.updateConfirmationChecklist8()">' +
      '<span class="confirmation-check-text"><span class="confirmation-check-label">' + esc8(label) + '</span><span class="confirmation-check-detail">' + esc8(detail || 'Reviewed') + '</span></span>' +
      '<span class="confirmation-check-value">' + esc8(fallback8(value)) + '</span>' +
    '</label>';
  }
  function fact8(label, value, extraClass){
    return '<div class="confirmation-position-fact ' + (extraClass || '') + '"><div class="fact-label">' + esc8(label) + '</div><div class="fact-value">' + value + '</div></div>';
  }
  function positionCard8(p, idx){
    p = p || {};
    var m = positionMargin8(p);
    var marginHtml = '<span class="confirmation-margin-chip ' + tone8(m.percent) + '">' + esc8(money8(m.amount)) + ' · ' + esc8(pct8(m.percent)) + '</span>';
    var overwritten = isContractOverwritten8(p);
    var overwriteLabel = overwritten ? 'Contract overwritten' : 'Automatic contract';
    var contractValue = fallback8(currentContractingEntity8(p));
    return '<article class="confirmation-position-card">' +
      '<label class="confirmation-position-head">' +
        '<input type="checkbox" class="confirmation-required-check confirmation-position-check" data-confirmation-check="position-' + idx + '" onchange="window.updateConfirmationChecklist8 && window.updateConfirmationChecklist8()">' +
        '<span><span class="confirmation-position-title">' + esc8(positionTitle8(p, idx)) + '</span><span class="confirmation-position-sub">' + esc8(fallback8(p.name || ('Position ' + (idx + 1)))) + '</span></span>' +
        '<span class="confirmation-overwrite-pill ' + (overwritten ? 'overwritten' : 'automatic') + '">' + esc8(overwriteLabel) + '</span>' +
      '</label>' +
      '<div class="confirmation-position-grid">' +
        fact8('Margin', marginHtml) +
        fact8('Provider type', esc8(fallback8(p.contractualType))) +
        fact8('Input mode', esc8(fallback8(p.inputMode))) +
        fact8('Country of residence', esc8(fallback8(p.countryOfResidence))) +
        fact8('Contract entity', esc8(contractValue)) +
      '</div>' +
    '</article>';
  }
  function positionChecklist8(){
    var cards = [];
    try {
      if (Array.isArray(flatRates)) {
        cards = flatRates.map(function(p, idx){ return positionCard8(p, idx); });
      }
    } catch(_) {}
    if (!cards.length) return '<div class="confirmation-empty-state">No flat-rate positions yet.</div>';
    return '<div class="confirmation-review-group"><div class="confirmation-review-group-title">Position review</div><div class="confirmation-position-cards">' + cards.join('') + '</div></div>';
  }
  function setupChecklist8(){
    var mode = '—', implementationCountry = '—';
    try {
      if (typeof backstage !== 'undefined' && backstage) {
        mode = backstage.implementationMode || mode;
        implementationCountry = backstage.implementationCountry || implementationCountry;
      }
    } catch(_) {}
    return '<div class="confirmation-review-group"><div class="confirmation-review-group-title">Implementation review</div><div class="confirmation-check-list">' +
      setupRow8('implementation-mode','Mode of implementation',mode,'Confirm the selected implementation mode is correct.') +
      setupRow8('ITR-country','ITR country',implementationCountry,'Confirm the country used for the implementation setup.') +
    '</div></div>';
  }
  window.updateConfirmationChecklist8 = function(){
    var root = document.querySelector('.confirmation-review-card');
    if (!root) return;
    var checks = Array.from(root.querySelectorAll('.confirmation-required-check'));
    var checked = checks.filter(function(c){ return c.checked; }).length;
    var allChecked = checks.length > 0 && checked === checks.length;
    root.querySelectorAll('.confirmation-position-card').forEach(function(card){
      var input = card.querySelector('.confirmation-position-check');
      card.classList.toggle('is-checked', !!(input && input.checked));
    });
    var status = root.querySelector('[data-confirmation-status]');
    var button = root.querySelector('[data-confirmation-button]');
    if (confirmationChecklistConfirmed8) {
      if (status) { status.textContent = 'Confirmed. Checklist review completed.'; status.classList.add('confirmed'); }
      if (button) { button.textContent = 'Confirmed'; button.classList.add('confirmed'); button.disabled = true; }
      return;
    }
    if (status) {
      status.textContent = checked + ' of ' + checks.length + ' review items checked.';
      status.classList.toggle('confirmed', allChecked);
    }
    if (button) button.disabled = !allChecked;
  };
  window.confirmChecklist8 = function(){
    var root = document.querySelector('.confirmation-review-card');
    if (!root) return;
    var checks = Array.from(root.querySelectorAll('.confirmation-required-check'));
    var allChecked = checks.length > 0 && checks.every(function(c){ return c.checked; });
    if (!allChecked) {
      window.updateConfirmationChecklist8();
      return;
    }
    confirmationChecklistConfirmed8 = true;
    window.updateConfirmationChecklist8();
  };
  window.renderConfirmationChecklist8 = function(){
    return '<section class="confirmation-review-card" aria-label="Interactive confirmation checklist">' +
      '<div class="confirmation-review-head"><div class="confirmation-review-kicker">Confirmation</div><h3>Final review checklist</h3><p>Tick each item after reviewing the setup and every position. Confirmation is only available once all review items are checked.</p></div>' +
      '<div class="confirmation-review-body">' + setupChecklist8() + positionChecklist8() + '</div>' +
      '<div class="confirmation-review-footer"><div class="confirmation-review-status" data-confirmation-status>0 review items checked.</div><button type="button" class="confirmation-confirm-btn" data-confirmation-button onclick="window.confirmChecklist8()">Confirm review</button></div>' +
    '</section>';
  };
  window.renderStep7 = function(){
    return '<div class="card confirmation-step-card"><h2>Confirmation</h2>' + window.renderConfirmationChecklist8() + (typeof navButtons === 'function' ? navButtons() : '') + '</div>';
  };
  try { renderStep7 = window.renderStep7; } catch(_) {}
  setTimeout(function(){ try { window.updateConfirmationChecklist8(); } catch(_) {} }, 0);
  document.addEventListener('change', function(e){
    if (e.target && e.target.classList && e.target.classList.contains('confirmation-required-check')) {
      confirmationChecklistConfirmed8 = false;
      window.updateConfirmationChecklist8();
    }
  });
})();

(function(){
  function numDays(v){
    try { return (typeof n === 'function') ? n(v) : (parseFloat(String(v || '').replace(',', '.')) || 0); }
    catch(_) { return parseFloat(String(v || '').replace(',', '.')) || 0; }
  }
  function fmtDays(v){
    try { return (typeof formatPlainNumber === 'function') ? formatPlainNumber(v) : String(v || 0); }
    catch(_) { return String(v || 0); }
  }
  function html(s){
    try { return (typeof esc === 'function') ? esc(s) : String(s || '').replace(/[&<>\"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]; }); }
    catch(_) { return String(s || ''); }
  }
  function currentYear(){ return new Date().getFullYear(); }
  function ensureDistribution(p){
    if (!p.daysDistribution || typeof p.daysDistribution !== 'object') {
      var y = currentYear();
      p.daysDistribution = { startYear:y, approved:false, rows:[{year:y,days:0},{year:y+1,days:0},{year:y+2,days:0}] };
    }
    if (!Number.isFinite(Number(p.daysDistribution.startYear))) p.daysDistribution.startYear = currentYear();
    if (!Array.isArray(p.daysDistribution.rows) || !p.daysDistribution.rows.length) {
      var sy = Number(p.daysDistribution.startYear) || currentYear();
      p.daysDistribution.rows = [{year:sy,days:0},{year:sy+1,days:0},{year:sy+2,days:0}];
    }
    p.daysDistribution.rows = p.daysDistribution.rows.map(function(r, i){
      var sy = Number(p.daysDistribution.startYear) || currentYear();
      return { year: Number(r && r.year) || (sy + i), days: numDays(r && r.days) };
    }).sort(function(a,b){ return a.year - b.year; });
    return p.daysDistribution;
  }
  function totalQty(p){ return numDays(p && p.feeQty); }
  function distSum(d){ return (d.rows || []).reduce(function(a,r){ return a + numDays(r.days); }, 0); }
  function diffInfo(p){
    var d = ensureDistribution(p), total = totalQty(p), sum = distSum(d), diff = +(total - sum).toFixed(6);
    return { d:d, total:total, sum:sum, diff:diff, ok: Math.abs(diff) < 0.005 };
  }
  window.renderDaysDistribution = function(p, idx){
    var info = diffInfo(p);
    var readonly = ''; // Keep yearly distribution day fields editable even after approval
    var msgClass = info.ok ? 'ok' : (info.diff > 0 ? 'warn' : 'bad');
    var message = info.ok ? 'Distribution matches the total quantity.' : (info.diff > 0 ? ('Please distribute ' + fmtDays(info.diff) + ' more days.') : ('Distribution exceeds the total quantity by ' + fmtDays(Math.abs(info.diff)) + ' days.'));
    if (info.d.approved && !info.ok) message = 'Approved distribution needs review because the total quantity changed. ' + message;
    var rows = info.d.rows.map(function(r, rowIdx){
      return '<tr><td><span class="days-distribution-year">' + html(r.year) + '</span></td><td><input type="text" inputmode="decimal" class="flat-input formatted-number-input days-distribution-input" data-days-dist-idx="' + idx + '" data-days-dist-row="' + rowIdx + '" value="' + html(fmtDays(r.days)) + '"' + readonly + '></td></tr>';
    }).join('');
    return '<section class="days-distribution-card" aria-label="Distribution of days">' +
      '<div class="days-distribution-head"><div><div class="days-distribution-title">Distribution of days</div></div>' +
      (info.d.approved ? '<span class="days-distribution-lock">Approved · start year ' + html(info.d.startYear) + '</span>' : '<span class="days-distribution-lock">Start year ' + html(info.d.startYear) + '</span>') + '</div>' +
      '<div class="days-distribution-body">' +
        '<div class="days-distribution-summary"><div class="days-distribution-kpi"><div class="kpi-label">Total quantity</div><div class="kpi-value">' + html(fmtDays(info.total)) + ' days</div></div><div class="days-distribution-kpi"><div class="kpi-label">Distributed</div><div class="kpi-value">' + html(fmtDays(info.sum)) + ' days</div></div><div class="days-distribution-kpi"><div class="kpi-label">Remaining / over</div><div class="kpi-value">' + html(fmtDays(info.diff)) + ' days</div></div></div>' +
        '<table class="days-distribution-table"><thead><tr><th>Year</th><th>Days</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<div class="days-distribution-actions"><div class="days-distribution-message ' + msgClass + '">' + html(message) + '</div><div class="days-distribution-buttons">' +
          (info.d.approved ? '<button type="button" class="secondary small" onclick="editDaysDistribution(' + idx + ')">Edit distribution</button>' : '<button type="button" class="secondary small" onclick="addDaysDistributionYearBack(' + idx + ')">Add year back</button><button type="button" class="secondary small" onclick="addDaysDistributionYear(' + idx + ')">Add year forward</button><button type="button" class="secondary small" onclick="removeLastDaysDistributionYear(' + idx + ')">Remove last year</button><button type="button" class="small primary" onclick="approveDaysDistribution(' + idx + ')">Approve distribution</button>') +
        '</div></div>' +
      '</div></section>';
  };
  window.addDaysDistributionYearBack = function(idx){
    var p = flatRates && flatRates[idx]; if (!p) return;
    var d = ensureDistribution(p);
    if (d.approved) return;
    var first = d.rows.reduce(function(m,r){ return Math.min(m, Number(r.year) || currentYear()); }, Number(d.startYear) || currentYear());
    d.rows.unshift({year:first - 1, days:0});
    d.startYear = first - 1;
    p._saved = false; p._dirty = true;
    if (typeof renderAll === 'function') renderAll();
  };
  window.addDaysDistributionYear = function(idx){
    var p = flatRates && flatRates[idx]; if (!p) return;
    var d = ensureDistribution(p);
    if (d.approved) return;
    var last = d.rows.reduce(function(m,r){ return Math.max(m, Number(r.year) || 0); }, Number(d.startYear) || currentYear());
    d.rows.push({year:last + 1, days:0});
    p._saved = false; p._dirty = true;
    if (typeof renderAll === 'function') renderAll();
  };
  window.removeLastDaysDistributionYear = function(idx){
    var p = flatRates && flatRates[idx]; if (!p) return;
    var d = ensureDistribution(p);
    if (d.approved) return;
    if (d.rows.length <= 3) { alert('Keep at least the default 3 years.'); return; }
    var last = d.rows[d.rows.length - 1];
    if (numDays(last.days) !== 0 && !confirm('The last year has days entered. Remove it anyway?')) return;
    d.rows.pop();
    p._saved = false; p._dirty = true;
    if (typeof renderAll === 'function') renderAll();
  };
  window.editDaysDistribution = function(idx){
    var p = flatRates && flatRates[idx]; if (!p) return;
    var d = ensureDistribution(p);
    d.approved = false;
    p._saved = false; p._dirty = true;
    if (typeof renderAll === 'function') renderAll();
  };
  window.approveDaysDistribution = function(idx){
    var p = flatRates && flatRates[idx]; if (!p) return;
    var info = diffInfo(p);
    if (!info.ok) { alert('The distribution must equal the total quantity before approval. ' + (info.diff > 0 ? ('Please distribute ' + fmtDays(info.diff) + ' more days.') : ('Please reduce the distribution by ' + fmtDays(Math.abs(info.diff)) + ' days.'))); return; }
    info.d.approved = true;
    info.d.approvedAt = new Date().toISOString();
    info.d.lockedStartYear = info.d.startYear;
    p._saved = false; p._dirty = true;
    if (typeof renderAll === 'function') renderAll();
  };
  function markDistributionNeedsReview(idx){
    var p = flatRates && flatRates[idx]; if (!p || !p.daysDistribution) return;
    if (p.daysDistribution.approved) p.daysDistribution.approved = false;
  }
  document.addEventListener('input', function(e){
    var t = e.target;
    if (!t) return;
    if (t.matches && t.matches('.days-distribution-input')) {
      try { handleGermanLiveFormattedInput(e); } catch(_) {}
      return;
    }
    /* Base fee Qty changes should not unapprove Distribution automatically. */
  }, true);
  document.addEventListener('change', function(e){
    var t = e.target;
    if (!t) return;
    if (t.matches && t.matches('.days-distribution-input')) {
      var idx = parseInt(t.getAttribute('data-days-dist-idx'), 10);
      var rowIdx = parseInt(t.getAttribute('data-days-dist-row'), 10);
      var p = flatRates && flatRates[idx]; if (!p) return;
      var d = ensureDistribution(p); if (!d.rows[rowIdx]) return;
      var newDays = numDays(t.value);
      var oldDays = numDays(d.rows[rowIdx].days);
      if (Math.abs(newDays - oldDays) < 0.005) {
        if (typeof formatPlainNumber === 'function') t.value = formatPlainNumber(oldDays);
        return;
      }
      d.rows[rowIdx].days = newDays;
      d.approved = false;
      p._saved = false; p._dirty = true;
      if (typeof formatPlainNumber === 'function') t.value = formatPlainNumber(d.rows[rowIdx].days);
      if (typeof renderAll === 'function') renderAll();
      return;
    }
    /* Base fee Qty changes should not unapprove Distribution automatically. */
  }, true);
  var oldRenderFlatMetrics = (typeof renderFlatMetrics === 'function') ? renderFlatMetrics : null;
  if (oldRenderFlatMetrics) {
    window.renderFlatMetrics = function(c, idx){
      var base = oldRenderFlatMetrics(c, idx);
      var p = flatRates && flatRates[idx];
      return base + (p ? window.renderDaysDistribution(p, idx) : '');
    };
    try { renderFlatMetrics = window.renderFlatMetrics; } catch(_) {}
  }
})();

/* ==========================================================================
   Original inline script block 33 | attrs: id="base-fee-distribution-exit-guard"
   ========================================================================== */
(function(){
  function toNumber(v){
    try { return (typeof n === 'function') ? n(v) : (parseFloat(String(v || '').replace(/\./g, '').replace(',', '.')) || 0); }
    catch(_) { return parseFloat(String(v || '').replace(/\./g, '').replace(',', '.')) || 0; }
  }
  function fmt(v){
    try { return (typeof formatPlainNumber === 'function') ? formatPlainNumber(v) : String(v || 0); }
    catch(_) { return String(v || 0); }
  }
  function distRows(p){
    return p && p.daysDistribution && Array.isArray(p.daysDistribution.rows) ? p.daysDistribution.rows : [];
  }
  function distSum(p){
    return distRows(p).reduce(function(sum, row){ return sum + toNumber(row && row.days); }, 0);
  }
  function distIsApprovedAndMatching(p){
    var total = toNumber(p && p.feeQty);
    var d = p && p.daysDistribution;
    if (!d || !d.approved) return false;
    return Math.abs(total - distSum(p)) < 0.005;
  }
  function needsBaseFeeDistributionWarning(p){
    if (!p) return false;
    var total = toNumber(p.feeQty);
    if (total <= 0) return false;
    return !distIsApprovedAndMatching(p);
  }
  function positionName(p, idx){
    try { return (typeof positionDisplayTitle === 'function') ? positionDisplayTitle(p, idx) : ('Position ' + (idx + 1)); }
    catch(_) { return 'Position ' + (idx + 1); }
  }
  function warningText(p, idx){
    var total = toNumber(p && p.feeQty);
    var distributed = distSum(p);
    var diff = +(total - distributed).toFixed(6);
    var extra = diff > 0
      ? ('Remaining days to distribute: ' + fmt(diff) + '.')
      : diff < 0
        ? ('Distribution exceeds Base fee Qty by ' + fmt(Math.abs(diff)) + ' days.')
        : 'The days are distributed but not approved yet.';
    return 'The Base fee Qty for ' + positionName(p, idx) + ' is ' + fmt(total) + ' days, but the Distribution of days is not approved and matching.\n\n' + extra + '\n\nLeave/collapse this position anyway?';
  }
  function confirmLeavePosition(idx){
    var p = flatRates && flatRates[idx];
    if (!needsBaseFeeDistributionWarning(p)) return true;
    return confirm(warningText(p, idx));
  }
  function firstOpenProblemPosition(exceptIdx){
    if (!Array.isArray(flatRates)) return -1;
    for (var i = 0; i < flatRates.length; i++) {
      if (i === exceptIdx) continue;
      if (!flatRates[i]._collapsed && needsBaseFeeDistributionWarning(flatRates[i])) return i;
    }
    return -1;
  }
  function confirmLeavingOpenPosition(exceptIdx){
    var idx = firstOpenProblemPosition(exceptIdx);
    if (idx < 0) return true;
    return confirmLeavePosition(idx);
  }

  var oldCollapseFlat = window.collapseFlat || (typeof collapseFlat === 'function' ? collapseFlat : null);
  if (oldCollapseFlat) {
    window.collapseFlat = function(idx, force){
      if (!force && !confirmLeavePosition(idx)) return;
      return oldCollapseFlat.apply(this, arguments);
    };
    try { collapseFlat = window.collapseFlat; } catch(_) {}
  }

  var oldSaveFlat = window.saveFlat || (typeof saveFlat === 'function' ? saveFlat : null);
  if (oldSaveFlat) {
    window.saveFlat = function(idx){
      if (!confirmLeavePosition(idx)) return;
      return oldSaveFlat.apply(this, arguments);
    };
    try { saveFlat = window.saveFlat; } catch(_) {}
  }

  var oldOpenFlat = window.openFlat || (typeof openFlat === 'function' ? openFlat : null);
  if (oldOpenFlat) {
    window.openFlat = function(idx){
      if (!confirmLeavingOpenPosition(idx)) return;
      return oldOpenFlat.apply(this, arguments);
    };
    try { openFlat = window.openFlat; } catch(_) {}
  }

  var oldAddFlat = window.addFlat || (typeof addFlat === 'function' ? addFlat : null);
  if (oldAddFlat) {
    window.addFlat = function(){
      if (!confirmLeavingOpenPosition(-1)) return;
      return oldAddFlat.apply(this, arguments);
    };
    try { addFlat = window.addFlat; } catch(_) {}
  }

  var oldGoToStep = window.goToStep || (typeof goToStep === 'function' ? goToStep : null);
  if (oldGoToStep) {
    window.goToStep = function(step){
      if (currentStep === 1 && step !== 1 && !confirmLeavingOpenPosition(-1)) return;
      return oldGoToStep.apply(this, arguments);
    };
    try { goToStep = window.goToStep; } catch(_) {}
  }

  var oldNextStep = window.nextStep || (typeof nextStep === 'function' ? nextStep : null);
  if (oldNextStep) {
    window.nextStep = function(){
      if (currentStep === 1 && !confirmLeavingOpenPosition(-1)) return;
      return oldNextStep.apply(this, arguments);
    };
    try { nextStep = window.nextStep; } catch(_) {}
  }

  var oldPrevStep = window.prevStep || (typeof prevStep === 'function' ? prevStep : null);
  if (oldPrevStep) {
    window.prevStep = function(){
      if (currentStep === 1 && !confirmLeavingOpenPosition(-1)) return;
      return oldPrevStep.apply(this, arguments);
    };
    try { prevStep = window.prevStep; } catch(_) {}
  }

  var oldOpenBackstage = window.openBackstage || (typeof openBackstage === 'function' ? openBackstage : null);
  if (oldOpenBackstage) {
    window.openBackstage = function(){
      if (currentStep === 1 && !confirmLeavingOpenPosition(-1)) return;
      return oldOpenBackstage.apply(this, arguments);
    };
    try { openBackstage = window.openBackstage; } catch(_) {}
  }
})();

/* ==========================================================================
   Original inline script block 34 | attrs: id="budget-weighted-flat-rates-script-v2"
   ========================================================================== */
(function(){
  var previousOpenMenuItem = window.openMenuItem;
  var previousUpdateMainMenuState = window.updateMainMenuState;
  var previousRenderStep = window.renderStep;
  window.showBudgetPanel = window.showBudgetPanel || false;

  function toNum(value){
    try { if (typeof n === 'function') return n(value); } catch(_) {}
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g,'');
    if (!s) return 0;
    var lastComma = s.lastIndexOf(','), lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) s = s.replace(/\./g,'').replace(',','.'); else s = s.replace(/,/g,'');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function fmtMoney(value){
    try { if (typeof money === 'function') return money(toNum(value)); } catch(_) {}
    return '€ ' + toNum(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function escapeHtml(value){
    try { if (typeof esc === 'function') return esc(String(value == null ? '' : value)); } catch(_) {}
    return String(value == null ? '' : value).replace(/[&<>\"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]; });
  }
  function currentBudgetYear(){ return new Date().getFullYear(); }
  function positionName(p, idx){
    try { if (typeof positionDisplayTitle === 'function') return positionDisplayTitle(p, idx); } catch(_) {}
    return (p && (p.title || p.name)) || ('Position ' + (idx + 1));
  }
  function getDistributionRows(p){
    if (p && p.daysDistribution && Array.isArray(p.daysDistribution.rows) && p.daysDistribution.rows.length) {
      return p.daysDistribution.rows.map(function(r){ return { year:Number(r && r.year) || currentBudgetYear(), days:toNum(r && r.days) }; }).filter(function(r){ return r.days > 0; });
    }
    var y = (p && p.daysDistribution && Number(p.daysDistribution.startYear)) || currentBudgetYear();
    return [{year:y, days:toNum(p && p.feeQty) || 1}];
  }
  function newYearMap(years){
    var map = {};
    years.forEach(function(y){ map[String(y)] = 0; });
    return map;
  }
  function sumYearMap(map){ return Object.keys(map || {}).reduce(function(a,y){ return a + toNum(map[y]); }, 0); }
  function addToYearMap(map, year, amount){ map[String(year)] = toNum(map[String(year)]) + toNum(amount); }
  function firstYear(years){ return years && years.length ? String(years[0]) : String(currentBudgetYear()); }
  function reimbName(row, idx){
    var parts = [];
    if (row && row.item) parts.push(row.item);
    if (row && row.subItem) parts.push(row.subItem);
    if (row && row.reimbursementType) parts.push(row.reimbursementType);
    return parts.length ? parts.join(' - ') : ('Reimbursable ' + (idx + 1));
  }
  function reimbAmount(row){
    try { if (typeof computeReimbursableRow === 'function') return toNum(computeReimbursableRow(row || {})); } catch(_) {}
    return toNum(row && row.amount) || (toNum(row && row.number) * toNum(row && row.budgetPrice));
  }
  var BUDGET_BRANCH_ROWS = [
    { group:'Costs for opening the registration', name:'Legal fees', cost:2000, unit:'Once' },
    { group:'Costs for opening the registration', name:'Governmet fees', cost:2000, unit:'Once' },
    { group:'Costs for opening the registration', name:'Translation costs', cost:500, unit:'Once' },
    { group:'Costs for opening the registration', name:'Notary', cost:400, unit:'Once' },
    { group:'Costs for opening the registration', name:'Other costs', cost:100, unit:'Once' },
    { group:'Costs for managing the registration', name:'Accountant’s fees', cost:600, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Auditor’s fees', cost:200, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Accounting system fee.', cost:50, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Legal representative’s fees', cost:150, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Branch manager’s fees', cost:500, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Business license/similar costs', cost:100, unit:'Monthly' },
    { group:'Costs for managing the registration', name:'Other costs', cost:0, unit:'Monthly' }
  ];
  var BUDGET_BACKSTOPPING_ROWS = [
    { name:'Fee', unit:'Day' },
    { name:'Per diem', unit:'Day' },
    { name:'Accommodation', unit:'Day' },
    { name:'Flights', unit:'Times' }
  ];
  function modeIsNoBranchBudget(){
    var mode = typeof backstage !== 'undefined' ? String(backstage.implementationMode || 'No Branch') : 'No Branch';
    return mode === 'No Branch';
  }
  function budgetBranchCost(index){
    try {
      if (typeof backstage !== 'undefined' && backstage.branchRelatedCosts && backstage.branchRelatedCosts.rows && backstage.branchRelatedCosts.rows[index]) {
        return toNum(backstage.branchRelatedCosts.rows[index].cost != null ? backstage.branchRelatedCosts.rows[index].cost : backstage.branchRelatedCosts.rows[index].adviceCost);
      }
    } catch(_) {}
    return BUDGET_BRANCH_ROWS[index] ? toNum(BUDGET_BRANCH_ROWS[index].cost) : 0;
  }

  function buildBudgetRows(){
    try { if (typeof syncNonReimbFromInputs === 'function') syncNonReimbFromInputs(); } catch(_) {}
    var yearSet = {};
    if (Array.isArray(flatRates)) {
      flatRates.forEach(function(p){ getDistributionRows(p).forEach(function(r){ yearSet[String(r.year)] = true; }); });
    }
    var years = Object.keys(yearSet).sort(function(a,b){ return Number(a)-Number(b); });
    if (!years.length) years = [String(currentBudgetYear())];
    var anchorYear = firstYear(years);

    var groups = [
      { key:'flat', label:'Flat-rate', rows:[], total:newYearMap(years) },
      { key:'reimb', label:'Reimbursables', rows:[], total:newYearMap(years) },
      { key:'nonreimb', label:'Non-reimbursables', rows:[], total:newYearMap(years) }
    ];
    var flatGroup = groups[0], reimbGroup = groups[1], nonGroup = groups[2];

    if (Array.isArray(flatRates)) {
      flatRates.forEach(function(p, idx){
        var c;
        try { c = computePosition(p); } catch(_) { c = { revenue:0, companyCost:0, margin:0 }; }
        var amount = toNum(c && c.revenue);
        var rows = getDistributionRows(p);
        var distributedDays = rows.reduce(function(a,r){ return a + toNum(r.days); },0);
        var weightBase = distributedDays > 0 ? distributedDays : (toNum(p && p.feeQty) || 1);
        var map = newYearMap(years);
        rows.forEach(function(r){
          var weighted = weightBase > 0 ? amount * toNum(r.days) / weightBase : 0;
          addToYearMap(map, r.year, weighted);
          addToYearMap(flatGroup.total, r.year, weighted);
        });
        flatGroup.rows.push({ label:positionName(p, idx), amount:amount, years:map });
      });
    }

    if (Array.isArray(reimbursableRows) && reimbursableRows.length) {
      reimbursableRows.forEach(function(row, idx){
        var amount = reimbAmount(row);
        var map = newYearMap(years);
        addToYearMap(map, anchorYear, amount);
        addToYearMap(reimbGroup.total, anchorYear, amount);
        reimbGroup.rows.push({ label:reimbName(row, idx), amount:amount, years:map });
      });
    } else if (Array.isArray(reimbursables) && reimbursables.length) {
      reimbursables.forEach(function(row, idx){
        var amount = toNum(row && row.amount);
        var map = newYearMap(years);
        addToYearMap(map, anchorYear, amount);
        addToYearMap(reimbGroup.total, anchorYear, amount);
        reimbGroup.rows.push({ label:(row && (row.title || row.type)) || ('Reimbursable ' + (idx + 1)), amount:amount, years:map });
      });
    }

    var data = window.__nonReimbTableData || { backstopping:{}, branchQty:{} };
    BUDGET_BACKSTOPPING_ROWS.forEach(function(row, idx){
      var rec = (data.backstopping && data.backstopping[idx]) || { cost:0, quantity:0 };
      var amount = toNum(rec.cost) * toNum(rec.quantity);
      if (Math.abs(amount) > 0.005) {
        var map = newYearMap(years); addToYearMap(map, anchorYear, amount); addToYearMap(nonGroup.total, anchorYear, amount);
        nonGroup.rows.push({ label:'Backstopping - ' + row.name, amount:amount, years:map });
      }
    });
    if (!modeIsNoBranchBudget()) {
      BUDGET_BRANCH_ROWS.forEach(function(row, idx){
        var qty = toNum(data.branchQty && data.branchQty[idx]);
        var amount = budgetBranchCost(idx) * qty;
        if (Math.abs(amount) > 0.005) {
          var map = newYearMap(years); addToYearMap(map, anchorYear, amount); addToYearMap(nonGroup.total, anchorYear, amount);
          nonGroup.rows.push({ label:row.group + ' - ' + row.name, amount:amount, years:map });
        }
      });
    }
    if (!nonGroup.rows.length && Array.isArray(nonReimbursables) && nonReimbursables.length) {
      nonReimbursables.forEach(function(row, idx){
        var amount = toNum(row && row.amount);
        var map = newYearMap(years); addToYearMap(map, anchorYear, amount); addToYearMap(nonGroup.total, anchorYear, amount);
        nonGroup.rows.push({ label:(row && (row.title || row.type)) || ('Non-reimbursable ' + (idx + 1)), amount:amount, years:map });
      });
    }
    return { years:years, groups:groups };
  }

  function renderBudgetMatrix(data){
    var hasAny = data.groups.some(function(g){ return Math.abs(sumYearMap(g.total)) > 0.005 || g.rows.length; });
    if (!hasAny) return '<div class="budget-empty"></div>';
    var head = '<thead><tr><th></th>' + data.years.map(function(y){ return '<th>' + escapeHtml(y) + '</th>'; }).join('') + '</tr></thead>';
    var body = data.groups.map(function(g){
      var total = sumYearMap(g.total);
      var html = '<tr class="budget-kind-row"><td><div class="budget-row-label"><span class="budget-row-title">' + escapeHtml(g.label) + '</span><span class="budget-row-amount">' + escapeHtml(fmtMoney(total)) + '</span></div></td>' + data.years.map(function(y){ return '<td>' + escapeHtml(fmtMoney(g.total[y] || 0)) + '</td>'; }).join('') + '</tr>';
      html += g.rows.map(function(r){
        return '<tr class="budget-detail-row"><td><div class="budget-row-label"><span class="budget-row-title">' + escapeHtml(r.label) + '</span><span class="budget-row-amount">' + escapeHtml(fmtMoney(r.amount)) + '</span></div></td>' + data.years.map(function(y){ return '<td>' + escapeHtml(fmtMoney(r.years[y] || 0)) + '</td>'; }).join('') + '</tr>';
      }).join('');
      return html;
    }).join('');
    return '<div class="budget-table-wrap"><table class="budget-table">' + head + '<tbody>' + body + '</tbody></table></div>';
  }

  window.renderBudgetPanel = function(){
    var data = buildBudgetRows();
    return '<div class="card budget-panel"><h2 class="budget-title">Budget</h2><section class="budget-section">' + renderBudgetMatrix(data) + '</section></div>';
  };
  window.openMenuItem = function(action){
    if (action === 'budget') {
      window.showBudgetPanel = true;
      try { showBackstage = false; } catch(_) {}
      try { currentStep = 4; } catch(_) {}
      if (typeof renderAll === 'function') renderAll();
      else if (typeof renderStep === 'function') renderStep();
      return;
    }
    window.showBudgetPanel = false;
    if (typeof previousOpenMenuItem === 'function') return previousOpenMenuItem.apply(this, arguments);
  };
  window.updateMainMenuState = function(){
    if (typeof previousUpdateMainMenuState === 'function') previousUpdateMainMenuState.apply(this, arguments);
    var menu = document.getElementById('mainMenuPopover');
    if (!menu) return;
    var budgetItem = menu.querySelector('[data-menu-action="budget"]');
    if (budgetItem) {
      budgetItem.classList.remove('disabled');
      budgetItem.removeAttribute('aria-disabled');
      var status = budgetItem.querySelector('.menu-status');
      if (!status) { status = document.createElement('span'); status.className = 'menu-status'; budgetItem.appendChild(status); }
      status.textContent = window.showBudgetPanel ? 'Open' : '';
      if (window.showBudgetPanel) budgetItem.classList.add('active');
    }
  };
  window.renderStep = function(){
    if (window.showBudgetPanel) {
      var app = document.getElementById('app');
      if (app) app.innerHTML = window.renderBudgetPanel();
      if (typeof updateProgress === 'function') updateProgress();
      if (typeof updateMainMenuState === 'function') updateMainMenuState();
      return;
    }
    if (typeof previousRenderStep === 'function') return previousRenderStep.apply(this, arguments);
  };
})();

/* ==========================================================================
   Original inline script block 35 | attrs: id="final-budget-confirmation-repair-v1-script"
   ========================================================================== */
(function(){
  function toNumFinal(value){
    try { if (typeof n === 'function') return n(value); } catch(_) {}
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g,'');
    if (!s) return 0;
    var lastComma = s.lastIndexOf(','), lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) s = s.replace(/\./g,'').replace(',','.'); else s = s.replace(/,/g,'');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function moneyFinal(value){
    try { if (typeof money === 'function') return money(toNumFinal(value)); } catch(_) {}
    return '€ ' + toNumFinal(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function htmlFinal(value){
    try { if (typeof esc === 'function') return esc(String(value == null ? '' : value)); } catch(_) {}
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }
  function currentYearFinal(){ return new Date().getFullYear(); }
  function positionTitleFinal(p, idx){
    try { if (typeof positionDisplayTitle === 'function') return positionDisplayTitle(p, idx); } catch(_) {}
    return (p && (p.title || p.name)) || ('Position ' + (idx + 1));
  }
  function distributionRowsFinal(p){
    if (p && p.daysDistribution && Array.isArray(p.daysDistribution.rows) && p.daysDistribution.rows.length) {
      return p.daysDistribution.rows.map(function(r){ return {year:String(Number(r && r.year) || currentYearFinal()), days:toNumFinal(r && r.days)}; }).filter(function(r){ return r.days > 0; });
    }
    return [{year:String(currentYearFinal()), days:toNumFinal(p && p.feeQty) || 1}];
  }
  function newMapFinal(years){ var m = {}; years.forEach(function(y){ m[String(y)] = 0; }); return m; }
  function addFinal(m, y, v){ y = String(y); m[y] = toNumFinal(m[y]) + toNumFinal(v); }
  function sumMapFinal(m){ return Object.keys(m || {}).reduce(function(a,k){ return a + toNumFinal(m[k]); }, 0); }
  function rowAmountFinal(row){ return toNumFinal(row && row.amount) || (toNumFinal(row && row.number) * toNumFinal(row && row.budgetPrice)); }
  function reimbTitleFinal(row, idx){
    var parts = [];
    if (row && row.item) parts.push(row.item);
    if (row && row.subItem) parts.push(row.subItem);
    if (row && row.reimbursementType) parts.push(row.reimbursementType);
    return parts.length ? parts.join(' - ') : ((row && (row.title || row.type)) || ('Reimbursable ' + (idx + 1)));
  }
  function nonReimbTitleFinal(row, idx){ return (row && (row.title || row.type || row.name)) || ('Non-reimbursable ' + (idx + 1)); }

  function buildBudgetFinal(){
    var yearSet = {};
    try { if (Array.isArray(flatRates)) flatRates.forEach(function(p){ distributionRowsFinal(p).forEach(function(r){ yearSet[String(r.year)] = true; }); }); } catch(_) {}
    var years = Object.keys(yearSet).sort(function(a,b){ return Number(a)-Number(b); });
    if (!years.length) years = [String(currentYearFinal())];
    var anchorYear = years[0];
    var groups = [
      {label:'Flat-rate', rows:[], total:newMapFinal(years)},
      {label:'Reimbursables', rows:[], total:newMapFinal(years)},
      {label:'Non-reimbursables', rows:[], total:newMapFinal(years)}
    ];
    try {
      if (Array.isArray(flatRates)) flatRates.forEach(function(p, idx){
        var c = {};
        try { c = computePosition(p); } catch(_) {}
        var amount = toNumFinal(c.revenue);
        var rows = distributionRowsFinal(p);
        var totalDays = rows.reduce(function(a,r){ return a + toNumFinal(r.days); }, 0) || toNumFinal(p && p.feeQty) || 1;
        var map = newMapFinal(years);
        rows.forEach(function(r){
          var v = amount * toNumFinal(r.days) / totalDays;
          addFinal(map, r.year, v);
          addFinal(groups[0].total, r.year, v);
        });
        groups[0].rows.push({label:positionTitleFinal(p, idx), amount:amount, years:map});
      });
    } catch(_) {}
    try {
      var source = Array.isArray(reimbursableRows) ? reimbursableRows : (Array.isArray(reimbursables) ? reimbursables : []);
      source.forEach(function(row, idx){
        var amount = rowAmountFinal(row);
        var map = newMapFinal(years); addFinal(map, anchorYear, amount); addFinal(groups[1].total, anchorYear, amount);
        groups[1].rows.push({label:reimbTitleFinal(row, idx), amount:amount, years:map});
      });
    } catch(_) {}
    try {
      var nonRows = Array.isArray(nonReimbursables) ? nonReimbursables : [];
      if (nonRows.length) nonRows.forEach(function(row, idx){
        var amount = rowAmountFinal(row);
        var map = newMapFinal(years); addFinal(map, anchorYear, amount); addFinal(groups[2].total, anchorYear, amount);
        groups[2].rows.push({label:nonReimbTitleFinal(row, idx), amount:amount, years:map});
      });
      var data = window.__nonReimbTableData || null;
      if (data && data.backstopping) Object.keys(data.backstopping).forEach(function(k){
        var r = data.backstopping[k], amount = toNumFinal(r && r.cost) * toNumFinal(r && r.quantity);
        if (Math.abs(amount) > 0.005) { var map = newMapFinal(years); addFinal(map, anchorYear, amount); addFinal(groups[2].total, anchorYear, amount); groups[2].rows.push({label:'Backstopping ' + (Number(k)+1), amount:amount, years:map}); }
      });
    } catch(_) {}
    return {years:years, groups:groups};
  }
  window.renderBudgetPanelFinal = function(){
    var data = buildBudgetFinal();
    var hasAny = data.groups.some(function(g){ return g.rows.length || Math.abs(sumMapFinal(g.total)) > 0.005; });
    var body = '';
    if (!hasAny) body = '<div class="budget-empty"></div>';
    else {
      var head = '<thead><tr><th></th>' + data.years.map(function(y){ return '<th>' + htmlFinal(y) + '</th>'; }).join('') + '</tr></thead>';
      var rows = data.groups.map(function(g){
        var total = sumMapFinal(g.total);
        var html = '<tr class="budget-kind-row"><td><div class="budget-row-label"><span class="budget-row-title">' + htmlFinal(g.label) + '</span><span class="budget-row-amount">' + htmlFinal(moneyFinal(total)) + '</span></div></td>' + data.years.map(function(y){ return '<td>' + htmlFinal(moneyFinal(g.total[y] || 0)) + '</td>'; }).join('') + '</tr>';
        html += g.rows.map(function(r){ return '<tr class="budget-detail-row"><td><div class="budget-row-label"><span class="budget-row-title">' + htmlFinal(r.label) + '</span><span class="budget-row-amount">' + htmlFinal(moneyFinal(r.amount)) + '</span></div></td>' + data.years.map(function(y){ return '<td>' + htmlFinal(moneyFinal(r.years[y] || 0)) + '</td>'; }).join('') + '</tr>'; }).join('');
        return html;
      }).join('');
      body = '<div class="budget-table-wrap"><table class="budget-table">' + head + '<tbody>' + rows + '</tbody></table></div>';
    }
    return '<div class="card budget-panel final-budget-panel"><h2 class="budget-title">Budget</h2><section class="budget-section">' + body + '</section></div>';
  };
  window.renderConfirmationPanelFinal = function(){
    if (typeof window.renderConfirmationChecklist8 === 'function') {
      return '<div class="card confirmation-step-card"><h2>Confirmation</h2>' + window.renderConfirmationChecklist8() + (typeof navButtons === 'function' ? navButtons() : '') + '</div>';
    }
    var s = {};
    try { s = computeSummary(); } catch(_) { s = {totalRevenue:0,totalCost:0,totalMargin:0,marginRate:0}; }
    return '<div class="card"><h2>Confirmation</h2><div class="row cols-4"><div class="metric"><div class="name">Total Revenue</div><div class="value">' + moneyFinal(s.totalRevenue) + '</div></div><div class="metric"><div class="name">Total Cost</div><div class="value">' + moneyFinal(s.totalCost) + '</div></div><div class="metric"><div class="name">Total Margin</div><div class="value">' + moneyFinal(s.totalMargin) + '</div></div><div class="metric"><div class="name">Margin Rate</div><div class="value">' + ((toNumFinal(s.marginRate)*100).toFixed(1)) + '%</div></div></div>' + (typeof navButtons === 'function' ? navButtons() : '') + '</div>';
  };

  var previousOpen = window.openMenuItem;
  window.openMenuItem = function(action){
    if (action === 'budget') {
      window.showBudgetPanel = true;
      try { showBackstage = false; } catch(_) {}
      try { closeMainMenu && closeMainMenu(); } catch(_) {}
      if (typeof renderAll === 'function') renderAll(); else if (typeof window.renderStep === 'function') window.renderStep();
      return;
    }
    window.showBudgetPanel = false;
    return (typeof previousOpen === 'function') ? previousOpen.apply(this, arguments) : undefined;
  };

  var previousRender = window.renderStep;
  window.renderStep = function(){
    var el = document.getElementById('stepContent') || document.getElementById('app');
    if (window.showBudgetPanel) {
      document.body.classList.toggle('is-intro', false);
      var hero = document.querySelector('.hero'); if (hero) hero.style.display = '';
      var stepsBar = document.getElementById('stepsBar'); if (stepsBar) stepsBar.style.display = '';
      var progressWrap = document.querySelector('.progressWrap'); if (progressWrap) progressWrap.style.display = '';
      if (el) el.innerHTML = window.renderBudgetPanelFinal();
      if (typeof updateProgress === 'function') updateProgress();
      if (typeof updateMainMenuState === 'function') updateMainMenuState();
      return;
    }
    try {
      if (!showBackstage && typeof currentStep !== 'undefined' && Number(currentStep) === 5) {
        if (el) el.innerHTML = window.renderConfirmationPanelFinal();
        if (typeof updateProgress === 'function') updateProgress();
        if (typeof updateMainMenuState === 'function') updateMainMenuState();
        setTimeout(function(){ try { window.updateConfirmationChecklist8 && window.updateConfirmationChecklist8(); } catch(_) {} }, 0);
        return;
      }
    } catch(_) {}
    return (typeof previousRender === 'function') ? previousRender.apply(this, arguments) : undefined;
  };
  try { renderStep = window.renderStep; } catch(_) {}

  var previousUpdate = window.updateMainMenuState;
  window.updateMainMenuState = function(){
    if (typeof previousUpdate === 'function') previousUpdate.apply(this, arguments);
    var menu = document.getElementById('mainMenuPopover') || document.getElementById('mainMenuItems');
    if (!menu) return;
    var item = menu.querySelector('[data-menu-action="budget"]');
    if (!item) return;
    item.classList.remove('disabled');
    item.removeAttribute('aria-disabled');
    item.classList.toggle('active', !!window.showBudgetPanel);
    var status = item.querySelector('.menu-status');
    if (status) status.textContent = window.showBudgetPanel ? 'Open' : '';
  };
  try { updateMainMenuState = window.updateMainMenuState; } catch(_) {}
})();

(function(){
  function budgetNum(value){
    try { if (typeof n === 'function') return n(value); } catch(_) {}
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g,'');
    if (!s) return 0;
    var lastComma = s.lastIndexOf(','), lastDot = s.lastIndexOf('.');
    if (lastComma > lastDot) s = s.replace(/\./g,'').replace(',','.'); else s = s.replace(/,/g,'');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function budgetMoney(value){
    try { if (typeof money === 'function') return money(budgetNum(value)); } catch(_) {}
    return '€ ' + budgetNum(value).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function budgetEsc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }
  function currentBudgetYearV2(){ return new Date().getFullYear(); }
  function positionTitleV2(p, idx){
    try { if (typeof positionDisplayTitle === 'function') return positionDisplayTitle(p, idx); } catch(_) {}
    return (p && (p.title || p.name)) || ('Position ' + (idx + 1));
  }
  function distributionRowsV2(p){
    if (p && p.daysDistribution && Array.isArray(p.daysDistribution.rows) && p.daysDistribution.rows.length) {
      return p.daysDistribution.rows.map(function(r){
        return { year:String(Number(r && r.year) || currentBudgetYearV2()), days:budgetNum(r && r.days) };
      }).filter(function(r){ return r.days > 0; });
    }
    return [{ year:String(currentBudgetYearV2()), days:budgetNum(p && p.feeQty) || 1 }];
  }
  function mapForYears(years){ var m = {}; years.forEach(function(y){ m[String(y)] = 0; }); return m; }
  function addToMap(m, y, v){ y = String(y); m[y] = budgetNum(m[y]) + budgetNum(v); }
  function sumMap(m){ return Object.keys(m || {}).reduce(function(a,k){ return a + budgetNum(m[k]); }, 0); }
  function rowAmountV2(row){ return budgetNum(row && row.amount) || (budgetNum(row && row.number) * budgetNum(row && row.budgetPrice)); }
  function reimbTitleV2(row, idx){
    var parts = [];
    if (row && row.item) parts.push(row.item);
    if (row && row.subItem) parts.push(row.subItem);
    if (row && row.reimbursementType) parts.push(row.reimbursementType);
    return parts.length ? parts.join(' - ') : ((row && (row.title || row.type)) || ('Reimbursable ' + (idx + 1)));
  }
  function nonReimbTitleV2(row, idx){ return (row && (row.title || row.type || row.name)) || ('Non-reimbursable ' + (idx + 1)); }
  function sortedBudgetYears(){
    var yearSet = {};
    try { if (Array.isArray(flatRates)) flatRates.forEach(function(p){ distributionRowsV2(p).forEach(function(r){ yearSet[String(r.year)] = true; }); }); } catch(_) {}
    var years = Object.keys(yearSet).sort(function(a,b){ return Number(a) - Number(b); });
    if (!years.length) years = [String(currentBudgetYearV2())];
    return years;
  }
  function newGroups(years, labels){
    return labels.map(function(label){ return {label:label, rows:[], total:mapForYears(years)}; });
  }
  function pushDistributed(groups, groupLabel, label, amount, rows, years){
    var group = groups.find(function(g){ return g.label === groupLabel; });
    if (!group) return;
    var totalDays = rows.reduce(function(a,r){ return a + budgetNum(r.days); }, 0) || 1;
    var map = mapForYears(years);
    rows.forEach(function(r){
      var v = budgetNum(amount) * budgetNum(r.days) / totalDays;
      addToMap(map, r.year, v);
      addToMap(group.total, r.year, v);
    });
    group.rows.push({label:label, amount:budgetNum(amount), years:map});
  }
  function pushSingleYear(groups, groupLabel, label, amount, year, years){
    var group = groups.find(function(g){ return g.label === groupLabel; });
    if (!group) return;
    var map = mapForYears(years);
    addToMap(map, year, amount);
    addToMap(group.total, year, amount);
    group.rows.push({label:label, amount:budgetNum(amount), years:map});
  }
  function buildBudgetWorkbookData(){
    var years = sortedBudgetYears();
    var anchorYear = years[0];
    var incomeGroups = newGroups(years, ['Flat-rate', 'Reimbursables']);
    var costGroups = newGroups(years, ['Flat-rate', 'Reimbursables', 'Non-reimbursables']);

    try {
      if (Array.isArray(flatRates)) flatRates.forEach(function(p, idx){
        var c = {};
        try { c = computePosition(p); } catch(_) { c = {}; }
        var dist = distributionRowsV2(p);
        pushDistributed(incomeGroups, 'Flat-rate', positionTitleV2(p, idx), budgetNum(c.revenue), dist, years);
        pushDistributed(costGroups, 'Flat-rate', positionTitleV2(p, idx), budgetNum(c.companyCost), dist, years);
      });
    } catch(_) {}

    try {
      var reimbSource = Array.isArray(reimbursableRows) ? reimbursableRows : (Array.isArray(reimbursables) ? reimbursables : []);
      reimbSource.forEach(function(row, idx){
        var amount = rowAmountV2(row);
        pushSingleYear(incomeGroups, 'Reimbursables', reimbTitleV2(row, idx), amount, anchorYear, years);
        pushSingleYear(costGroups, 'Reimbursables', reimbTitleV2(row, idx), amount, anchorYear, years);
      });
    } catch(_) {}

    try {
      var nonRows = Array.isArray(nonReimbursables) ? nonReimbursables : [];
      nonRows.forEach(function(row, idx){
        var amount = rowAmountV2(row);
        pushSingleYear(costGroups, 'Non-reimbursables', nonReimbTitleV2(row, idx), amount, anchorYear, years);
      });
      var data = window.__nonReimbTableData || null;
      if (data && data.backstopping) Object.keys(data.backstopping).forEach(function(k){
        var r = data.backstopping[k], amount = budgetNum(r && r.cost) * budgetNum(r && r.quantity);
        if (Math.abs(amount) > 0.005) pushSingleYear(costGroups, 'Non-reimbursables', 'Backstopping ' + (Number(k) + 1), amount, anchorYear, years);
      });
    } catch(_) {}

    return {
      years: years,
      methodName: 'Flat-rates weighted yearly distribution',
      methodDescription: 'Flat-rate income and flat-rate cost/expenses are distributed across years according to each position\'s approved days distribution. Reimbursables and non-reimbursables are currently allocated in full to the first budget year shown.',
      incomeGroups: incomeGroups,
      costGroups: costGroups,
      incomeNote: 'Income budget includes flat-rate income and reimbursables. Non-reimbursables are cost-only items and are therefore shown in the Cost / expenses budget.',
      costNote: 'Cost / expenses budget includes flat-rate cost, reimbursables and non-reimbursables.'
    };
  }
  function groupsHaveData(groups){
    return (groups || []).some(function(g){ return (g.rows && g.rows.length) || Math.abs(sumMap(g.total)) > 0.005; });
  }
  function renderBudgetTable(title, groups, years, note){
    var head = '<thead><tr><th>Position kind / Position</th><th>Total</th>' + years.map(function(y){ return '<th>' + budgetEsc(y) + '</th>'; }).join('') + '</tr></thead>';
    var body = groups.map(function(g){
      var total = sumMap(g.total);
      var groupRow = '<tr class="budget-kind-row"><td>' +
        '<div class="budget-row-label"><span class="budget-row-title">' + budgetEsc(g.label) + '</span></div>' +
        '</td><td>' + budgetEsc(budgetMoney(total)) + '</td>' +
        years.map(function(y){ return '<td>' + budgetEsc(budgetMoney(g.total[y] || 0)) + '</td>'; }).join('') + '</tr>';
      var detailRows = (g.rows || []).map(function(r){
        return '<tr class="budget-detail-row"><td><div class="budget-row-label"><span class="budget-row-title">' + budgetEsc(r.label) + '</span></div></td><td>' + budgetEsc(budgetMoney(r.amount)) + '</td>' + years.map(function(y){ return '<td>' + budgetEsc(budgetMoney(r.years[y] || 0)) + '</td>'; }).join('') + '</tr>';
      }).join('');
      return groupRow + detailRows;
    }).join('');
    return '<section class="budget-subsection"><div class="budget-subhead"><h3 class="budget-subtitle">' + budgetEsc(title) + '</h3>' + (note ? '<p class="budget-subnote">' + budgetEsc(note) + '</p>' : '') + '</div><div class="budget-table-wrap"><table class="budget-table">' + head + '<tbody>' + body + '</tbody></table></div></section>';
  }
  function renderEmptyBudget(){
    return '<div class="budget-empty-state">No budget data is available yet. Add positions or budget rows to generate the yearly budget view.</div>';
  }
  window.renderBudgetPanelFinal = function(){
    var data = buildBudgetWorkbookData();
    var body = '';
    if (!groupsHaveData(data.incomeGroups) && !groupsHaveData(data.costGroups)) {
      body = renderEmptyBudget();
    } else {
      body = '<div class="budget-panels">' +
        renderBudgetTable('Income budget', data.incomeGroups, data.years, data.incomeNote) +
        renderBudgetTable('Cost / expenses budget', data.costGroups, data.years, data.costNote) +
        '</div>';
    }
    return '<div class="card budget-panel final-budget-panel">' +
      '<div class="budget-header">' +
        '<div class="budget-header-copy">' +
          '<h2 class="budget-title">Budget</h2>' +
          '<p class="budget-intro">Yearly budget by position kind and budget year.</p>' +
        '</div>' +
        '<button type="button" class="budget-export-btn" onclick="window.exportBudgetToExcel()">Extract to Excel</button>' +
      '</div>' +
      '<section class="budget-section">' +
        '<div class="budget-method-card">' +
          '<div class="budget-method-kicker">Distribution method</div>' +
          '<div class="budget-method-title">' + budgetEsc(data.methodName) + '</div>' +
          '<div class="budget-method-copy">' + budgetEsc(data.methodDescription) + '</div>' +
        '</div>' +
        body +
      '</section>' +
    '</div>';
  };

  function xmlEscape(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]; });
  }
  function xmlCell(value, type){
    if (value == null) return '<Cell/>';
    var cellType = type || 'String';
    return '<Cell><Data ss:Type="' + cellType + '">' + xmlEscape(value) + '</Data></Cell>';
  }
  function worksheetXml(name, rows){
    return '<Worksheet ss:Name="' + xmlEscape(name) + '"><Table>' + rows.map(function(row){
      return '<Row>' + row.map(function(cell){ return xmlCell(cell.value, cell.type); }).join('') + '</Row>';
    }).join('') + '</Table></Worksheet>';
  }
  function sectionRowsForExport(title, methodName, methodDescription, years, groups, note){
    var rows = [];
    rows.push([{value:title, type:'String'}]);
    rows.push([{value:'Distribution method', type:'String'}, {value:methodName, type:'String'}]);
    rows.push([{value:'Explanation', type:'String'}, {value:methodDescription, type:'String'}]);
    if (note) rows.push([{value:'Scope', type:'String'}, {value:note, type:'String'}]);
    rows.push([{value:'', type:'String'}]);
    var header = [{value:'Position kind / Position', type:'String'}, {value:'Total', type:'String'}];
    years.forEach(function(y){ header.push({value:String(y), type:'String'}); });
    rows.push(header);
    groups.forEach(function(g){
      var row = [{value:g.label, type:'String'}, {value:sumMap(g.total), type:'Number'}];
      years.forEach(function(y){ row.push({value:budgetNum(g.total[y] || 0), type:'Number'}); });
      rows.push(row);
      (g.rows || []).forEach(function(r){
        var detail = [{value:'  - ' + r.label, type:'String'}, {value:budgetNum(r.amount), type:'Number'}];
        years.forEach(function(y){ detail.push({value:budgetNum(r.years[y] || 0), type:'Number'}); });
        rows.push(detail);
      });
    });
    return rows;
  }
  window.exportBudgetToExcel = function(){
    var data = buildBudgetWorkbookData();
    var workbookXml = '<?xml version="1.0"?>' +
      '<?mso-application progid="Excel.Sheet"?>' +
      '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ' +
      'xmlns:o="urn:schemas-microsoft-com:office:office" ' +
      'xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
      'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" ' +
      'xmlns:html="http://www.w3.org/TR/REC-html40">' +
      '<Styles>' +
        '' +
      '</Styles>' +
      worksheetXml('Income budget', sectionRowsForExport('Income budget', data.methodName, data.methodDescription, data.years, data.incomeGroups, data.incomeNote)) +
      worksheetXml('Cost expenses budget', sectionRowsForExport('Cost / expenses budget', data.methodName, data.methodDescription, data.years, data.costGroups, data.costNote)) +
      '</Workbook>';
    var blob = new Blob([workbookXml], {type:'application/vnd.ms-excel'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var d = new Date();
    var stamp = [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('');
    a.href = url;
    a.download = 'budget_' + stamp + '.xls';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 0);
  };
})();

/* ==========================================================================
   Original inline script block 37 | attrs: id="budget-v3-position-year-fix"
   ========================================================================== */
(function(){
  function numB(v){ try { if (typeof n === 'function') return n(v); } catch(_) {} var s=String(v==null?'':v).replace(/[^0-9,.-]/g,''); if(!s) return 0; var c=s.lastIndexOf(','), d=s.lastIndexOf('.'); if(c>d) s=s.replace(/\./g,'').replace(',','.'); else s=s.replace(/,/g,''); var x=Number(s); return Number.isFinite(x)?x:0; }
  function moneyB(v){ try { if (typeof money === 'function') return money(numB(v)); } catch(_) {} return '€ ' + numB(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}); }
  function escB(v){ return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function currentY(){ return new Date().getFullYear(); }
  function posTitle(p,i){ try { if (typeof positionDisplayTitle === 'function') return positionDisplayTitle(p,i); } catch(_){} return (p && (p.title||p.name)) || ('Position '+(i+1)); }
  function distRows(p){
    var d=p && p.daysDistribution;
    if(d && Array.isArray(d.rows) && d.rows.length){
      return d.rows.map(function(r){return {year:String(numB(r && r.year)||currentY()), days:numB(r && r.days)};}).filter(function(r){return r.days>0;});
    }
    var y=(d && numB(d.startYear)) || currentY();
    var qty=numB(p && p.feeQty) || 1;
    return [{year:String(y),days:qty}];
  }
  function yearsFromFlat(){ var ys={}; try{ (Array.isArray(flatRates)?flatRates:[]).forEach(function(p){ distRows(p).forEach(function(r){ys[String(r.year)]=true;}); }); }catch(_){} var a=Object.keys(ys).sort(function(x,y){return Number(x)-Number(y);}); return a.length?a:[String(currentY())]; }
  function map(years){ var m={}; years.forEach(function(y){m[String(y)]=0;}); return m; }
  function add(m,y,v){ y=String(y); if(!(y in m)) m[y]=0; m[y]+=numB(v); }
  function sum(m){ return Object.keys(m||{}).reduce(function(a,k){return a+numB(m[k]);},0); }
  function groups(labels, years){ return labels.map(function(l){return {label:l,total:map(years),rows:[]};}); }
  function groupByLabel(gs,l){ return gs.filter(function(g){return g.label===l;})[0]; }
  function addDistributed(gs,kind,label,amount,rows,years){ var g=groupByLabel(gs,kind); if(!g)return; var totalDays=rows.reduce(function(a,r){return a+numB(r.days);},0)||1; var rm=map(years); rows.forEach(function(r){ var v=numB(amount)*numB(r.days)/totalDays; add(rm,r.year,v); add(g.total,r.year,v); }); g.rows.push({label:label,total:numB(amount),years:rm}); }
  function addOne(gs,kind,label,amount,year,years){ var g=groupByLabel(gs,kind); if(!g)return; var rm=map(years); add(rm,year,amount); add(g.total,year,amount); g.rows.push({label:label,total:numB(amount),years:rm}); }
  function rowAmount(row){ return numB(row && row.amount) || (numB(row && row.number)*numB(row && row.budgetPrice)); }
  function reimbTitle(row,i){ var p=[]; if(row&&row.item)p.push(row.item); if(row&&row.subItem)p.push(row.subItem); if(row&&row.reimbursementType)p.push(row.reimbursementType); return p.length?p.join(' - '):((row&&(row.title||row.type||row.name))||('Reimbursable '+(i+1))); }
  function nonTitle(row,i){ return (row&&(row.title||row.type||row.name||row.costItem))||('Non-reimbursable '+(i+1)); }
  window.buildBudgetWorkbookData = function(){
    var years=yearsFromFlat(), anchor=years[0];
    var inc=groups(['Flat-rate','Reimbursables'],years);
    var cost=groups(['Flat-rate','Reimbursables','Non-reimbursables'],years);
    try{ (Array.isArray(flatRates)?flatRates:[]).forEach(function(p,i){ var c={}; try{c=computePosition(p);}catch(_){} var dr=distRows(p); addDistributed(inc,'Flat-rate',posTitle(p,i),numB(c.revenue),dr,years); addDistributed(cost,'Flat-rate',posTitle(p,i),numB(c.companyCost),dr,years); }); }catch(_){}
    try{ var rr=Array.isArray(reimbursableRows)&&reimbursableRows.length?reimbursableRows:(Array.isArray(reimbursables)?reimbursables:[]); rr.forEach(function(r,i){ var a=rowAmount(r); addOne(inc,'Reimbursables',reimbTitle(r,i),a,anchor,years); addOne(cost,'Reimbursables',reimbTitle(r,i),a,anchor,years); }); }catch(_){}
    try{ var nr=Array.isArray(nonReimbursables)?nonReimbursables:[]; nr.forEach(function(r,i){ addOne(cost,'Non-reimbursables',nonTitle(r,i),rowAmount(r),anchor,years); }); var data=window.__nonReimbTableData; if(data&&data.backstopping){Object.keys(data.backstopping).forEach(function(k){var r=data.backstopping[k],a=numB(r&&r.cost)*numB(r&&r.quantity); if(Math.abs(a)>0.005)addOne(cost,'Non-reimbursables','Backstopping '+(Number(k)+1),a,anchor,years);});}}catch(_){}
    return {years:years,incomeGroups:inc,costGroups:cost,methodName:'Flat-rates weighted yearly distribution',methodDescription:'For Flat-rate positions, each position is distributed by year according to its approved Distribution of days. The same per-year weighting is applied to both the Income budget and the Cost / expenses budget, so every Flat-rate position appears as its own detail row under the Flat-rate total.'};
  };
  function hasData(gs){return gs.some(function(g){return g.rows.length||Math.abs(sum(g.total))>0.005;});}
  function tableHtml(title, gs, years, note){ var h='<thead><tr><th>Kind / single position</th><th>Total</th>'+years.map(function(y){return '<th>'+escB(y)+'</th>';}).join('')+'</tr></thead>'; var b=gs.map(function(g){ var s=sum(g.total); var html='<tr class="budget-kind-row"><td><strong>'+escB(g.label)+'</strong></td><td>'+escB(moneyB(s))+'</td>'+years.map(function(y){return '<td>'+escB(moneyB(g.total[y]||0))+'</td>';}).join('')+'</tr>'; html+=g.rows.map(function(r){return '<tr class="budget-detail-row"><td>'+escB(r.label)+'</td><td>'+escB(moneyB(r.total))+'</td>'+years.map(function(y){return '<td>'+escB(moneyB(r.years[y]||0))+'</td>';}).join('')+'</tr>';}).join(''); return html;}).join(''); return '<section class="budget-subsection"><div class="budget-subhead"><h3 class="budget-subtitle">'+escB(title)+'</h3><p class="budget-subnote">'+escB(note)+'</p></div><div class="budget-table-wrap"><table class="budget-table">'+h+'<tbody>'+b+'</tbody></table></div></section>'; }
  window.renderBudgetPanelFinal = function(){ var d=window.buildBudgetWorkbookData(); var body=(!hasData(d.incomeGroups)&&!hasData(d.costGroups))?'<div class="budget-empty-state">No budget data is available yet.</div>':'<div class="budget-panels">'+tableHtml('Income budget',d.incomeGroups,d.years,'Shows the total per income kind and each single income position per year.')+tableHtml('Cost / expenses budget',d.costGroups,d.years,'Shows the total per cost/expense kind and each single cost/expense position per year.')+'</div>'; return '<div class="card budget-panel final-budget-panel"><div class="budget-header"><div class="budget-header-copy"><h2 class="budget-title">Budget</h2><p class="budget-intro">Yearly budget by kind of position and single position.</p></div><button type="button" class="budget-export-btn" onclick="window.exportBudgetToExcel()">Extract to Excel</button></div><section class="budget-section"><div class="budget-method-card"><div class="budget-method-kicker">Distribution method</div><div class="budget-method-title">'+escB(d.methodName)+'</div><div class="budget-method-copy">'+escB(d.methodDescription)+'</div></div>'+body+'</section></div>'; };
  function x(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c];});}
  function cell(v,t){return '<Cell><Data ss:Type="'+(t||'String')+'">'+x(v)+'</Data></Cell>';}
  function rowsFor(title,gs,years,d){ var rows=[[{v:title,t:'String'}],[{v:'Distribution method',t:'String'},{v:d.methodName,t:'String'}],[{v:'Explanation',t:'String'},{v:d.methodDescription,t:'String'}],[],[{v:'Kind / single position',t:'String'},{v:'Total',t:'String'}].concat(years.map(function(y){return {v:y,t:'String'};}))]; gs.forEach(function(g){rows.push([{v:g.label,t:'String'},{v:sum(g.total),t:'Number'}].concat(years.map(function(y){return {v:numB(g.total[y]||0),t:'Number'};}))); g.rows.forEach(function(r){rows.push([{v:'  - '+r.label,t:'String'},{v:numB(r.total),t:'Number'}].concat(years.map(function(y){return {v:numB(r.years[y]||0),t:'Number'};})));});}); return rows; }
  function sheet(name,rows){return '<Worksheet ss:Name="'+x(name)+'"><Table>'+rows.map(function(r){return '<Row>'+r.map(function(c){return c&&c.v!==undefined?cell(c.v,c.t):'<Cell/>';}).join('')+'</Row>';}).join('')+'</Table></Worksheet>';}
  window.exportBudgetToExcel=function(){var d=window.buildBudgetWorkbookData(); var xml='<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'+sheet('Income budget',rowsFor('Income budget',d.incomeGroups,d.years,d))+sheet('Cost expenses budget',rowsFor('Cost / expenses budget',d.costGroups,d.years,d))+'</Workbook>'; var blob=new Blob([xml],{type:'application/vnd.ms-excel'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); var dt=new Date(); a.href=url; a.download='budget_'+dt.getFullYear()+String(dt.getMonth()+1).padStart(2,'0')+String(dt.getDate()).padStart(2,'0')+'.xls'; document.body.appendChild(a); a.click(); setTimeout(function(){URL.revokeObjectURL(url);a.remove();},0);};
})();

/* ==========================================================================
   Original inline script block 38 | attrs: id="au-live-distribution-and-excel-budget-fix"
   ========================================================================== */
(function(){
  function toNum(v){
    try { if (typeof n === 'function') return n(v); } catch(_) {}
    var s = String(v == null ? '' : v).replace(/[^0-9,.-]/g, '');
    if (!s) return 0;
    var c = s.lastIndexOf(','), d = s.lastIndexOf('.');
    if (c > d) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function fmtPlain(v){
    try { if (typeof formatPlainNumber === 'function') return formatPlainNumber(toNum(v)); } catch(_) {}
    return String(toNum(v));
  }
  function moneyFmt(v){
    try { if (typeof money === 'function') return money(toNum(v)); } catch(_) {}
    return '€ ' + toNum(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; });
  }
  function currentYear(){ return new Date().getFullYear(); }
  function ensureDist(p){
    if (!p.daysDistribution || typeof p.daysDistribution !== 'object') {
      var y = currentYear();
      p.daysDistribution = { startYear:y, approved:false, rows:[{year:y,days:0},{year:y+1,days:0},{year:y+2,days:0}] };
    }
    if (!Number.isFinite(Number(p.daysDistribution.startYear))) p.daysDistribution.startYear = currentYear();
    if (!Array.isArray(p.daysDistribution.rows) || !p.daysDistribution.rows.length) {
      var sy = Number(p.daysDistribution.startYear) || currentYear();
      p.daysDistribution.rows = [{year:sy,days:0},{year:sy+1,days:0},{year:sy+2,days:0}];
    }
    p.daysDistribution.rows = p.daysDistribution.rows.map(function(r, i){
      var sy = Number(p.daysDistribution.startYear) || currentYear();
      return { year: Number(r && r.year) || (sy + i), days: toNum(r && r.days) };
    }).sort(function(a,b){ return a.year - b.year; });
    return p.daysDistribution;
  }
  function distInfo(p){
    var d = ensureDist(p);
    var total = toNum(p && p.feeQty);
    var sum = (d.rows || []).reduce(function(a,r){ return a + toNum(r.days); }, 0);
    var diff = +(total - sum).toFixed(6);
    return { d:d, total:total, sum:sum, diff:diff, ok:Math.abs(diff) < 0.005 };
  }
  window.renderDaysDistribution = function(p, idx){
    var info = distInfo(p);
    var readonly = ''; // Keep yearly distribution day fields editable even after approval
    var msgClass = info.ok ? 'ok' : (info.diff > 0 ? 'warn' : 'bad');
    var message = info.ok ? 'Distribution matches the total quantity.' : (info.diff > 0 ? ('Please distribute ' + fmtPlain(info.diff) + ' more days.') : ('Distribution exceeds the total quantity by ' + fmtPlain(Math.abs(info.diff)) + ' days.'));
    if (info.d.approved && !info.ok) message = 'Approved distribution needs review because the total quantity changed. ' + message;
    var rows = info.d.rows.map(function(r, rowIdx){
      return '<tr><td><span class="days-distribution-year">' + esc(r.year) + '</span></td><td><input type="text" inputmode="decimal" class="flat-input formatted-number-input days-distribution-input" data-days-dist-idx="' + esc(idx) + '" data-days-dist-row="' + esc(rowIdx) + '" value="' + esc(fmtPlain(r.days)) + '"' + readonly + '></td></tr>';
    }).join('');
    return '<section class="days-distribution-card" data-days-dist-card="' + esc(idx) + '" aria-label="Distribution of days">' +
      '<div class="days-distribution-head"><div><div class="days-distribution-title">Distribution of days</div></div>' +
      (info.d.approved ? '<span class="days-distribution-lock">Approved · start year ' + esc(info.d.startYear) + '</span>' : '<span class="days-distribution-lock">Start year ' + esc(info.d.startYear) + '</span>') + '</div>' +
      '<div class="days-distribution-body">' +
        '<div class="days-distribution-summary"><div class="days-distribution-kpi"><div class="kpi-label">Total quantity</div><div class="kpi-value">' + esc(fmtPlain(info.total)) + ' days</div></div><div class="days-distribution-kpi"><div class="kpi-label">Distributed</div><div class="kpi-value">' + esc(fmtPlain(info.sum)) + ' days</div></div><div class="days-distribution-kpi"><div class="kpi-label">Remaining / over</div><div class="kpi-value">' + esc(fmtPlain(info.diff)) + ' days</div></div></div>' +
        '<table class="days-distribution-table"><thead><tr><th>Year</th><th>Days</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<div class="days-distribution-actions"><div class="days-distribution-message ' + msgClass + '">' + esc(message) + '</div><div class="days-distribution-buttons">' +
          (info.d.approved ? '<button type="button" class="secondary small" onclick="editDaysDistribution(' + idx + ')">Edit distribution</button>' : '<button type="button" class="secondary small" onclick="addDaysDistributionYearBack(' + idx + ')">Add year back</button><button type="button" class="secondary small" onclick="addDaysDistributionYear(' + idx + ')">Add year forward</button><button type="button" class="secondary small" onclick="removeLastDaysDistributionYear(' + idx + ')">Remove last year</button><button type="button" class="small primary" onclick="approveDaysDistribution(' + idx + ')">Approve distribution</button>') +
        '</div></div>' +
      '</div></section>';
  };
  function refreshDistributionCard(idx){
    var p = Array.isArray(window.flatRates) ? window.flatRates[idx] : null;
    if (!p || typeof window.renderDaysDistribution !== 'function') return;
    var next = window.renderDaysDistribution(p, idx);
    var card = document.querySelector('.days-distribution-card[data-days-dist-card="' + idx + '"]');
    if (!card) {
      var cards = document.querySelectorAll('.days-distribution-card');
      card = cards && cards[idx] ? cards[idx] : null;
    }
    if (card) card.outerHTML = next;
  }
  var oldUpdate = window.updateFlatPositionCalculatedOutputs;
  if (typeof oldUpdate === 'function') {
    window.updateFlatPositionCalculatedOutputs = function(idx){
      var result = oldUpdate.apply(this, arguments);
      refreshDistributionCard(Number(idx));
      return result;
    };
    try { updateFlatPositionCalculatedOutputs = window.updateFlatPositionCalculatedOutputs; } catch(_) {}
  }
  document.addEventListener('input', function(e){
    var t = e.target;
    if (!t || !t.matches || !t.matches('[data-field="feeQty"]')) return;
    var idx = parseInt(t.getAttribute('data-idx'), 10);
    if (!Number.isFinite(idx) || !Array.isArray(window.flatRates) || !window.flatRates[idx]) return;
    window.flatRates[idx].feeQty = toNum(t.value);
    /* Keep distribution approval when Base fee Qty or other unrelated fields refresh.
       If the quantity no longer matches, the card shows the review warning while preserving the approval state. */
    refreshDistributionCard(idx);
  }, false);

  function rowCategory(kind, label){
    var l = String(label || '').toLowerCase();
    if (String(kind || '').toLowerCase().indexOf('non-reimb') >= 0 && (l.indexOf('branch') >= 0 || l.indexOf('registration') >= 0 || l.indexOf('legal representative') >= 0 || l.indexOf('business license') >= 0 || l.indexOf('accounting system') >= 0 || l.indexOf('accountant') >= 0 || l.indexOf('auditor') >= 0)) return 'Branch';
    return 'Project';
  }
  function groupHasData(g){
    return (g && Array.isArray(g.rows) && g.rows.length) || Math.abs(Object.keys(g && g.total || {}).reduce(function(a,k){ return a + toNum(g.total[k]); },0)) > 0.005;
  }
  function mapSum(m){ return Object.keys(m || {}).reduce(function(a,k){ return a + toNum(m[k]); }, 0); }
  function budgetTable(title, groups, years, note){
    var colCount = 3 + years.length;
    var head = '<thead><tr><th class="budget-row-kind">Kind / single position</th><th>Cost Category</th><th>Total</th>' + years.map(function(y){ return '<th>' + esc(y) + '</th>'; }).join('') + '</tr></thead>';
    var body = (groups || []).map(function(g){
      var total = mapSum(g.total);
      var out = '<tr class="budget-kind-row"><td><strong>' + esc(g.label) + '</strong></td><td class="budget-category-cell"></td><td class="budget-total-cell">' + esc(moneyFmt(total)) + '</td>' + years.map(function(y){ return '<td class="budget-year-cell">' + esc(moneyFmt(g.total && g.total[y] || 0)) + '</td>'; }).join('') + '</tr>';
      out += (g.rows || []).map(function(r){
        var amount = r.total != null ? r.total : r.amount;
        return '<tr class="budget-detail-row"><td>' + esc(r.label) + '</td><td class="budget-category-cell">' + esc(rowCategory(g.label, r.label)) + '</td><td class="budget-total-cell">' + esc(moneyFmt(amount)) + '</td>' + years.map(function(y){ return '<td class="budget-year-cell">' + esc(moneyFmt(r.years && r.years[y] || 0)) + '</td>'; }).join('') + '</tr>';
      }).join('');
      return out;
    }).join('');
    return '<section class="budget-subsection"><div class="budget-subhead"><h3 class="budget-subtitle">' + esc(title) + '</h3><p class="budget-subnote">' + esc(note || '') + '</p></div><div class="budget-table-wrap"><table class="budget-table">' + head + '<tbody>' + body + '</tbody></table></div></section>';
  }
  function renderBudgetWorkbook(){
    var d = typeof window.buildBudgetWorkbookData === 'function' ? window.buildBudgetWorkbookData() : null;
    if (!d) return '<div class="card budget-panel"><h2 class="budget-title">Budget</h2><div class="budget-empty-state">No budget data is available yet.</div></div>';
    var hasData = (d.incomeGroups || []).some(groupHasData) || (d.costGroups || []).some(groupHasData);
    var body = hasData ? '<div class="budget-panels">' +
      budgetTable('Income budget', d.incomeGroups || [], d.years || [], 'Excel-style view by kind, single position, cost category and year.') +
      budgetTable('Cost / expenses budget', d.costGroups || [], d.years || [], 'Excel-style view by kind, single position, cost category and year.') +
      '</div>' : '<div class="budget-empty-state">No budget data is available yet.</div>';
    return '<div class="card budget-panel final-budget-panel"><div class="budget-header"><div class="budget-header-copy"><h2 class="budget-title">Budget</h2><p class="budget-intro">Yearly budget by kind of position, single position, cost category and year.</p></div><button type="button" class="budget-export-btn" onclick="window.exportBudgetToExcel()">Extract to Excel</button></div><section class="budget-section"><div class="budget-method-card"><div class="budget-method-kicker">Distribution method</div><div class="budget-method-title">' + esc(d.methodName || 'Yearly distribution') + '</div><div class="budget-method-copy">' + esc(d.methodDescription || '') + '</div></div>' + body + '</section></div>';
  }
  window.renderBudgetPanelFinal = renderBudgetWorkbook;
  window.renderBudgetPanel = renderBudgetWorkbook;
  function xmlEsc(v){ return String(v == null ? '' : v).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function cell(v, type){ return '<Cell><Data ss:Type="' + (type || 'String') + '">' + xmlEsc(v) + '</Data></Cell>'; }
  function rowsForExport(title, groups, years, d){
    var rows = [[{v:title}], [{v:'Distribution method'}, {v:d.methodName || ''}], [{v:'Explanation'}, {v:d.methodDescription || ''}], [], [{v:'Kind / single position'}, {v:'Cost Category'}, {v:'Total'}].concat((years || []).map(function(y){ return {v:y}; }))];
    (groups || []).forEach(function(g){
      rows.push([{v:g.label}, {v:''}, {v:mapSum(g.total), t:'Number'}].concat((years || []).map(function(y){ return {v:toNum(g.total && g.total[y] || 0), t:'Number'}; })));
      (g.rows || []).forEach(function(r){
        rows.push([{v:'  - ' + r.label}, {v:rowCategory(g.label, r.label)}, {v:toNum(r.total != null ? r.total : r.amount), t:'Number'}].concat((years || []).map(function(y){ return {v:toNum(r.years && r.years[y] || 0), t:'Number'}; })));
      });
    });
    return rows;
  }
  function worksheet(name, rows){
    return '<Worksheet ss:Name="' + xmlEsc(name) + '"><Table>' + rows.map(function(r){ return '<Row>' + r.map(function(c){ return c && c.v !== undefined ? cell(c.v, c.t) : '<Cell/>'; }).join('') + '</Row>'; }).join('') + '</Table></Worksheet>';
  }
  window.exportBudgetToExcel = function(){
    var d = typeof window.buildBudgetWorkbookData === 'function' ? window.buildBudgetWorkbookData() : {years:[], incomeGroups:[], costGroups:[]};
    var xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">' +
      worksheet('Income budget', rowsForExport('Income budget', d.incomeGroups || [], d.years || [], d)) +
      worksheet('Cost expenses budget', rowsForExport('Cost / expenses budget', d.costGroups || [], d.years || [], d)) +
      '</Workbook>';
    var blob = new Blob([xml], {type:'application/vnd.ms-excel'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var dt = new Date();
    a.href = url;
    a.download = 'budget_' + dt.getFullYear() + String(dt.getMonth()+1).padStart(2,'0') + String(dt.getDate()).padStart(2,'0') + '.xls';
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(url); a.remove(); }, 0);
  };
})();

/* ==========================================================================
   Original inline script block 39 | attrs: id="au-v2-live-base-qty-distribution-final-fix"
   ========================================================================== */
(function(){
  function toNum(v){
    try { if (typeof n === 'function') return n(v); } catch(_) {}
    var s = String(v == null ? '' : v).replace(/[^0-9,.-]/g, '');
    if (!s) return 0;
    var comma = s.lastIndexOf(','), dot = s.lastIndexOf('.');
    if (comma > dot) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function moneyFmt(v){
    try { if (typeof money === 'function') return money(toNum(v)); } catch(_) {}
    return '€ ' + toNum(v).toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function updateSectionTotals(idx){
    if (!Array.isArray(window.flatRates) || !window.flatRates[idx] || typeof window.computePosition !== 'function') return;
    var c = window.computePosition(window.flatRates[idx]);
    var anchor = document.querySelector('[data-idx="' + idx + '"][data-field="feeQty"]') || document.querySelector('[data-idx="' + idx + '"]');
    var scope = anchor && anchor.closest ? (anchor.closest('.position') || anchor.closest('.card') || document) : document;
    var totals = scope.querySelectorAll('.component-section .component-line.total .component-total');
    if (totals[0]) totals[0].textContent = moneyFmt(c.remunerationTotal || 0);
    if (totals[1]) totals[1].textContent = moneyFmt(c.nonRemunerationTotal || 0);
  }
  function refreshDays(idx){
    if (!Array.isArray(window.flatRates) || !window.flatRates[idx] || typeof window.renderDaysDistribution !== 'function') return;
    var html = window.renderDaysDistribution(window.flatRates[idx], idx);
    var card = document.querySelector('.days-distribution-card[data-days-dist-card="' + idx + '"]');
    if (!card) {
      var cards = document.querySelectorAll('.days-distribution-card');
      card = cards && cards[idx] ? cards[idx] : null;
    }
    if (card) card.outerHTML = html;
  }
  function syncBaseQtyFromInput(input){
    var idx = parseInt(input.getAttribute('data-idx'), 10);
    if (!Number.isFinite(idx) || !Array.isArray(window.flatRates) || !window.flatRates[idx]) return;
    var p = window.flatRates[idx];
    p.feeQty = toNum(input.value);
    p._saved = false;
    p._dirty = true;
    /* Do not automatically clear Distribution approval from Base fee Qty syncs or unrelated recalculations. */
    updateSectionTotals(idx);
    refreshDays(idx);
    setTimeout(function(){
      if (typeof window.updateFlatPositionCalculatedOutputs === 'function') {
        try { window.updateFlatPositionCalculatedOutputs(idx); } catch(_) {}
      }
      updateSectionTotals(idx);
      refreshDays(idx);
    }, 0);
  }
  ['input','change','keyup','blur'].forEach(function(evt){
    document.addEventListener(evt, function(e){
      var t = e.target;
      if (!t || !t.matches || !t.matches('[data-field="feeQty"]')) return;
      syncBaseQtyFromInput(t);
    }, true);
  });
})();

/* ==========================================================================
   Original inline script block 40 | attrs: id="au-v3-live-base-qty-distribution-lexical-fix"
   ========================================================================== */
(function(){
  function rates(){
    try { if (Array.isArray(flatRates)) return flatRates; } catch(_) {}
    try { if (Array.isArray(window.flatRates)) return window.flatRates; } catch(_) {}
    return null;
  }
  function parseNum(v){
    try { if (typeof n === 'function') return n(v); } catch(_) {}
    var s = String(v == null ? '' : v).replace(/[^0-9,.-]/g, '');
    if (!s || s === '-' || s === ',' || s === '.') return 0;
    var comma = s.lastIndexOf(','), dot = s.lastIndexOf('.');
    if (comma > dot) s = s.replace(/\./g, '').replace(',', '.');
    else if (dot > comma) s = s.replace(/,/g, '');
    else s = s.replace(',', '.');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }
  function fmt(v){
    try { if (typeof formatPlainNumber === 'function') return formatPlainNumber(parseNum(v)); } catch(_) {}
    return String(parseNum(v));
  }
  function moneyFmt(v){
    try { if (typeof money === 'function') return money(parseNum(v)); } catch(_) {}
    return '€ ' + parseNum(v).toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2});
  }
  function currentYear(){ return new Date().getFullYear(); }
  function getPosition(idx){ var r = rates(); return r && r[idx] ? r[idx] : null; }
  function ensureDist(p){
    if (!p.daysDistribution || typeof p.daysDistribution !== 'object') {
      var y = currentYear();
      p.daysDistribution = { startYear:y, approved:false, rows:[{year:y,days:0},{year:y+1,days:0},{year:y+2,days:0}] };
    }
    if (!Number.isFinite(Number(p.daysDistribution.startYear))) p.daysDistribution.startYear = currentYear();
    if (!Array.isArray(p.daysDistribution.rows) || !p.daysDistribution.rows.length) {
      var sy = Number(p.daysDistribution.startYear) || currentYear();
      p.daysDistribution.rows = [{year:sy,days:0},{year:sy+1,days:0},{year:sy+2,days:0}];
    }
    p.daysDistribution.rows = p.daysDistribution.rows.map(function(r,i){
      var sy = Number(p.daysDistribution.startYear) || currentYear();
      return { year:Number(r && r.year) || (sy + i), days:parseNum(r && r.days) };
    }).sort(function(a,b){ return a.year - b.year; });
    return p.daysDistribution;
  }
  function findFeeInput(idx){
    return document.querySelector('[data-idx="' + idx + '"][data-field="feeQty"]');
  }
  function liveFeeQty(idx, p){
    var input = findFeeInput(idx);
    if (input && document.contains(input)) return parseNum(input.value);
    return parseNum(p && p.feeQty);
  }
  function distInfo(p, idx){
    var d = ensureDist(p);
    var total = liveFeeQty(idx, p);
    var sum = (d.rows || []).reduce(function(a,r){ return a + parseNum(r.days); }, 0);
    var diff = +(total - sum).toFixed(6);
    return { d:d, total:total, sum:sum, diff:diff, ok:Math.abs(diff) < 0.005 };
  }
  function esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }

  window.renderDaysDistribution = function(p, idx){
    var info = distInfo(p, idx);
    var readonly = ''; // Keep yearly distribution day fields editable even after approval
    var msgClass = info.ok ? 'ok' : (info.diff > 0 ? 'warn' : 'bad');
    var message = info.ok ? 'Distribution matches the total quantity.' : (info.diff > 0 ? ('Please distribute ' + fmt(info.diff) + ' more days.') : ('Distribution exceeds the total quantity by ' + fmt(Math.abs(info.diff)) + ' days.'));
    if (info.d.approved && !info.ok) message = 'Approved distribution needs review because the total quantity changed. ' + message;
    var rows = info.d.rows.map(function(r, rowIdx){
      return '<tr><td><span class="days-distribution-year">' + esc(r.year) + '</span></td><td><input type="text" inputmode="decimal" class="flat-input formatted-number-input days-distribution-input" data-days-dist-idx="' + esc(idx) + '" data-days-dist-row="' + esc(rowIdx) + '" value="' + esc(fmt(r.days)) + '"' + readonly + '></td></tr>';
    }).join('');
    return '<section class="days-distribution-card" data-days-dist-card="' + esc(idx) + '" aria-label="Distribution of days">' +
      '<div class="days-distribution-head"><div><div class="days-distribution-title">Distribution of days</div></div>' +
      (info.d.approved ? '<span class="days-distribution-lock">Approved · start year ' + esc(info.d.startYear) + '</span>' : '<span class="days-distribution-lock">Start year ' + esc(info.d.startYear) + '</span>') + '</div>' +
      '<div class="days-distribution-body">' +
        '<div class="days-distribution-summary"><div class="days-distribution-kpi"><div class="kpi-label">Total quantity</div><div class="kpi-value">' + esc(fmt(info.total)) + ' days</div></div><div class="days-distribution-kpi"><div class="kpi-label">Distributed</div><div class="kpi-value">' + esc(fmt(info.sum)) + ' days</div></div><div class="days-distribution-kpi"><div class="kpi-label">Remaining / over</div><div class="kpi-value">' + esc(fmt(info.diff)) + ' days</div></div></div>' +
        '<table class="days-distribution-table"><thead><tr><th>Year</th><th>Days</th></tr></thead><tbody>' + rows + '</tbody></table>' +
        '<div class="days-distribution-actions"><div class="days-distribution-message ' + msgClass + '">' + esc(message) + '</div><div class="days-distribution-buttons">' +
          (info.d.approved ? '<button type="button" class="secondary small" onclick="editDaysDistribution(' + idx + ')">Edit distribution</button>' : '<button type="button" class="secondary small" onclick="addDaysDistributionYearBack(' + idx + ')">Add year back</button><button type="button" class="secondary small" onclick="addDaysDistributionYear(' + idx + ')">Add year forward</button><button type="button" class="secondary small" onclick="removeLastDaysDistributionYear(' + idx + ')">Remove last year</button><button type="button" class="small primary" onclick="approveDaysDistribution(' + idx + ')">Approve distribution</button>') +
        '</div></div>' +
      '</div></section>';
  };

  function refreshDays(idx){
    if (document.activeElement && document.activeElement.matches && document.activeElement.matches('.days-distribution-input')) return;
    var p = getPosition(idx); if (!p) return;
    var html = window.renderDaysDistribution(p, idx);
    var card = document.querySelector('.days-distribution-card[data-days-dist-card="' + idx + '"]');
    if (!card) {
      var input = findFeeInput(idx);
      var scope = input && input.closest ? input.closest('.position') : null;
      card = scope ? scope.querySelector('.days-distribution-card') : null;
    }
    if (!card) {
      var cards = document.querySelectorAll('.days-distribution-card');
      card = cards && cards[idx] ? cards[idx] : null;
    }
    if (card) card.outerHTML = html;
  }
  function updateSectionTotals(idx){
    var p = getPosition(idx); if (!p) return;
    try {
      var c = (typeof computePosition === 'function') ? computePosition(p) : (window.computePosition ? window.computePosition(p) : null);
      if (!c) return;
      var input = findFeeInput(idx);
      var scope = input && input.closest ? (input.closest('.position') || input.closest('.card') || document) : document;
      var totals = scope.querySelectorAll('.component-section .component-line.total .component-total');
      if (totals[0]) totals[0].textContent = moneyFmt(c.remunerationTotal || 0);
      if (totals[1]) totals[1].textContent = moneyFmt(c.nonRemunerationTotal || 0);
    } catch(_) {}
  }
  function sync(input){
    var idx = parseInt(input.getAttribute('data-idx'), 10);
    var p = getPosition(idx); if (!p) return;
    p.feeQty = parseNum(input.value);
    p._saved = false;
    p._dirty = true;
    /* Do not automatically clear Distribution approval from Base fee Qty syncs or unrelated recalculations. */
    updateSectionTotals(idx);
    refreshDays(idx);
  }
  ['beforeinput','input','keyup','change','blur','paste'].forEach(function(evt){
    document.addEventListener(evt, function(e){
      var t = e.target;
      if (!t || !t.matches || !t.matches('[data-field="feeQty"]')) return;
      setTimeout(function(){ sync(t); }, evt === 'beforeinput' || evt === 'paste' ? 0 : 0);
    }, true);
    document.addEventListener(evt, function(e){
      var t = e.target;
      if (!t || !t.matches || !t.matches('[data-field="feeQty"]')) return;
      setTimeout(function(){ sync(t); }, 0);
    }, false);
  });
  var oldUpdate = (typeof updateFlatPositionCalculatedOutputs === 'function') ? updateFlatPositionCalculatedOutputs : window.updateFlatPositionCalculatedOutputs;
  if (typeof oldUpdate === 'function') {
    window.updateFlatPositionCalculatedOutputs = function(idx){
      var out = oldUpdate.apply(this, arguments);
      try { refreshDays(Number(idx)); updateSectionTotals(Number(idx)); } catch(_) {}
      return out;
    };
    try { updateFlatPositionCalculatedOutputs = window.updateFlatPositionCalculatedOutputs; } catch(_) {}
  }
  /* Focus fix: do not rebuild the yearly distribution card every 500 ms.
     The old interval called sync(input) unconditionally, and sync() calls refreshDays(),
     which replaces the distribution card DOM. That makes active days inputs lose focus
     immediately when the user clicks or types. Only sync when the Base fee Qty value
     actually changed, and never while the user is editing a yearly distribution input. */
  var __lastFeeQtyValues = Object.create(null);
  setInterval(function(){
    if (document.activeElement && document.activeElement.matches && document.activeElement.matches('.days-distribution-input')) return;
    document.querySelectorAll('[data-field="feeQty"][data-idx]').forEach(function(input){
      var idx = input.getAttribute('data-idx') || '';
      var value = String(input.value);
      if (__lastFeeQtyValues[idx] !== value) {
        __lastFeeQtyValues[idx] = value;
        sync(input);
      }
    });
  }, 500);
})();

/* ==========================================================================
   Original inline script block 41 | attrs: id="au-v4-dom-live-days-total-hard-fix"
   ========================================================================== */
(function(){
  var lastSeen = Object.create(null);

  function parseNum(value){
    try { if (typeof n === 'function') return n(value); } catch(_) {}
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g, '');
    if (!s || s === '-' || s === ',' || s === '.') return 0;
    var comma = s.lastIndexOf(',');
    var dot = s.lastIndexOf('.');
    if (comma > dot) s = s.replace(/\./g, '').replace(',', '.');
    else if (dot > comma) s = s.replace(/,/g, '');
    else s = s.replace(',', '.');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }

  function fmt(value){
    try { if (typeof formatPlainNumber === 'function') return formatPlainNumber(parseNum(value)); } catch(_) {}
    return String(parseNum(value)).replace('.', ',');
  }

  function moneyFmt(value){
    try { if (typeof money === 'function') return money(parseNum(value)); } catch(_) {}
    return '€ ' + parseNum(value).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function getRates(){
    try { if (Array.isArray(flatRates)) return flatRates; } catch(_) {}
    try { if (Array.isArray(window.flatRates)) return window.flatRates; } catch(_) {}
    return null;
  }

  function getPosition(idx){
    var rates = getRates();
    return rates && rates[idx] ? rates[idx] : null;
  }

  function findScope(input){
    if (!input || !input.closest) return document;
    return input.closest('.position') || input.closest('.card') || document;
  }

  function findDaysCard(input, idx){
    var scope = findScope(input);
    var card = scope.querySelector('.days-distribution-card');
    if (card) return card;
    if (Number.isFinite(idx)) {
      card = document.querySelector('.days-distribution-card[data-days-dist-card="' + idx + '"]');
      if (card) return card;
      var cards = document.querySelectorAll('.days-distribution-card');
      if (cards && cards[idx]) return cards[idx];
    }
    return null;
  }

  function readDistributed(card){
    var sum = 0;
    if (!card) return 0;
    card.querySelectorAll('.days-distribution-input').forEach(function(el){ sum += parseNum(el.value); });
    return sum;
  }

  function syncDataObject(idx, total){
    var p = getPosition(idx);
    if (!p) return;
    p.feeQty = total;
    p._saved = false;
    p._dirty = true;
    /* Keep Distribution approval persistent when other fields recalculate (for example margin rate).
       Approval is only cleared when the user explicitly clicks Edit distribution or changes a distribution day value. */
  }

  function refreshKpis(card, total){
    if (!card) return;
    var distributed = readDistributed(card);
    var diff = +(total - distributed).toFixed(6);
    var values = card.querySelectorAll('.days-distribution-summary .kpi-value');
    if (values[0]) values[0].textContent = fmt(total) + ' days';
    if (values[1]) values[1].textContent = fmt(distributed) + ' days';
    if (values[2]) values[2].textContent = fmt(diff) + ' days';

    var message = card.querySelector('.days-distribution-message');
    if (message) {
      message.classList.remove('ok', 'warn', 'bad');
      if (Math.abs(diff) < 0.005) {
        message.classList.add('ok');
        message.textContent = 'Distribution matches the total quantity.';
      } else if (diff > 0) {
        message.classList.add('warn');
        message.textContent = 'Please distribute ' + fmt(diff) + ' more days.';
      } else {
        message.classList.add('bad');
        message.textContent = 'Distribution exceeds the total quantity by ' + fmt(Math.abs(diff)) + ' days.';
      }
    }
  }

  function refreshSectionTotals(input, idx){
    var p = getPosition(idx);
    if (!p) return;
    try {
      var c = (typeof computePosition === 'function') ? computePosition(p) : (window.computePosition ? window.computePosition(p) : null);
      if (!c) return;
      var scope = findScope(input);
      var totals = scope.querySelectorAll('.component-section .component-line.total .component-total');
      if (totals[0]) totals[0].textContent = moneyFmt(c.remunerationTotal || 0);
      if (totals[1]) totals[1].textContent = moneyFmt(c.nonRemunerationTotal || 0);
    } catch(_) {}
  }

  function syncFromFeeInput(input){
    if (!input) return;
    var idx = parseInt(input.getAttribute('data-idx'), 10);
    var total = parseNum(input.value);
    if (Number.isFinite(idx)) syncDataObject(idx, total);
    var card = findDaysCard(input, idx);
    refreshKpis(card, total);
    refreshSectionTotals(input, idx);
    lastSeen[idx] = String(input.value);
  }

  function syncAll(){
    document.querySelectorAll('[data-field="feeQty"][data-idx]').forEach(function(input){
      var idx = parseInt(input.getAttribute('data-idx'), 10);
      var key = Number.isFinite(idx) ? String(idx) : input.name || input.id || Math.random();
      var value = String(input.value);
      if (lastSeen[key] !== value || !lastSeen.__initialDone) syncFromFeeInput(input);
    });
    lastSeen.__initialDone = '1';
  }

  ['beforeinput','input','keyup','change','blur','paste'].forEach(function(evt){
    document.addEventListener(evt, function(e){
      var target = e.target;
      if (!target || !target.matches || !target.matches('[data-field="feeQty"][data-idx]')) return;
      setTimeout(function(){ syncFromFeeInput(target); }, 0);
    }, true);
  });

  var oldUpdate = (typeof updateFlatPositionCalculatedOutputs === 'function') ? updateFlatPositionCalculatedOutputs : window.updateFlatPositionCalculatedOutputs;
  if (typeof oldUpdate === 'function') {
    window.updateFlatPositionCalculatedOutputs = function(idx){
      var out = oldUpdate.apply(this, arguments);
      try {
        var input = document.querySelector('[data-field="feeQty"][data-idx="' + idx + '"]');
        if (input) syncFromFeeInput(input);
      } catch(_) {}
      return out;
    };
    try { updateFlatPositionCalculatedOutputs = window.updateFlatPositionCalculatedOutputs; } catch(_) {}
  }

  document.addEventListener('DOMContentLoaded', function(){ setTimeout(syncAll, 0); setTimeout(syncAll, 250); });
  setTimeout(syncAll, 0);
  setTimeout(syncAll, 250);
  setTimeout(syncAll, 1000);
  setInterval(syncAll, 250);
})();

/* ==========================================================================
   Original inline script block 42 | attrs: id="au-v4-live-yearly-distribution-kpis-fix"
   ========================================================================== */
(function(){
  function parseNum(value){
    try { if (typeof n === 'function') return n(value); } catch(_) {}
    var s = String(value == null ? '' : value).replace(/[^0-9,.-]/g, '');
    if (!s || s === '-' || s === ',' || s === '.') return 0;
    var comma = s.lastIndexOf(',');
    var dot = s.lastIndexOf('.');
    if (comma > dot) s = s.replace(/\./g, '').replace(',', '.');
    else if (dot > comma) s = s.replace(/,/g, '');
    else s = s.replace(',', '.');
    var x = Number(s);
    return Number.isFinite(x) ? x : 0;
  }

  function fmt(value){
    try { if (typeof formatPlainNumber === 'function') return formatPlainNumber(parseNum(value)); } catch(_) {}
    try { if (typeof fmtDays === 'function') return fmtDays(parseNum(value)); } catch(_) {}
    return parseNum(value).toLocaleString('de-DE', { maximumFractionDigits: 3 });
  }

  function getRates(){
    try { if (Array.isArray(flatRates)) return flatRates; } catch(_) {}
    try { if (Array.isArray(window.flatRates)) return window.flatRates; } catch(_) {}
    return null;
  }

  function getPosition(idx){
    var rates = getRates();
    return rates && Number.isFinite(idx) ? rates[idx] : null;
  }

  function findFeeInput(idx, card){
    var scope = card && card.closest ? (card.closest('.position') || card.closest('.card') || document) : document;
    var input = scope.querySelector('[data-field="feeQty"][data-idx="' + idx + '"]');
    return input || document.querySelector('[data-field="feeQty"][data-idx="' + idx + '"]');
  }

  function readDistributed(card){
    var sum = 0;
    if (!card) return 0;
    card.querySelectorAll('.days-distribution-input').forEach(function(el){
      sum += parseNum(el.value);
    });
    return sum;
  }

  function writeDataObject(input, idx, rowIdx){
    var p = getPosition(idx);
    if (!p) return;
    p.daysDistribution = p.daysDistribution || {};
    p.daysDistribution.rows = Array.isArray(p.daysDistribution.rows) ? p.daysDistribution.rows : [];
    p.daysDistribution.rows[rowIdx] = p.daysDistribution.rows[rowIdx] || {};
    p.daysDistribution.rows[rowIdx].days = parseNum(input.value);
    p.daysDistribution.approved = false;
    p._saved = false;
    p._dirty = true;
  }

  function refreshKpis(card, total){
    if (!card) return;
    var distributed = readDistributed(card);
    var diff = +(parseNum(total) - distributed).toFixed(6);
    var values = card.querySelectorAll('.days-distribution-summary .kpi-value');
    if (values[0]) values[0].textContent = fmt(total) + ' days';
    if (values[1]) values[1].textContent = fmt(distributed) + ' days';
    if (values[2]) values[2].textContent = fmt(diff) + ' days';

    var message = card.querySelector('.days-distribution-message');
    if (message) {
      message.classList.remove('ok', 'warn', 'bad');
      if (Math.abs(diff) < 0.005) {
        message.classList.add('ok');
        message.textContent = 'Distribution matches the total quantity.';
      } else if (diff > 0) {
        message.classList.add('warn');
        message.textContent = 'Please distribute ' + fmt(diff) + ' more days.';
      } else {
        message.classList.add('bad');
        message.textContent = 'Distribution exceeds the total quantity by ' + fmt(Math.abs(diff)) + ' days.';
      }
    }
  }

  function syncFromDaysInput(input){
    if (!input) return;
    var idx = parseInt(input.getAttribute('data-days-dist-idx'), 10);
    var rowIdx = parseInt(input.getAttribute('data-days-dist-row'), 10);
    if (Number.isFinite(idx) && Number.isFinite(rowIdx)) writeDataObject(input, idx, rowIdx);
    var card = input.closest ? input.closest('.days-distribution-card') : null;
    var feeInput = Number.isFinite(idx) ? findFeeInput(idx, card) : null;
    var total = feeInput ? parseNum(feeInput.value) : 0;
    refreshKpis(card, total);
  }

  ['input','keyup','change','paste','beforeinput'].forEach(function(evt){
    document.addEventListener(evt, function(e){
      var target = e.target;
      if (!target || !target.matches || !target.matches('.days-distribution-input')) return;
      setTimeout(function(){ syncFromDaysInput(target); }, 0);
    }, true);
  });
})();

/* ==========================================================================
   Original inline script block 43 | attrs: id="v59-center-hamburger-in-marginiq-header-script"
   ========================================================================== */
(function(){
  function centerMarginIqMenuButton(){
    if (document.body.classList.contains('is-intro')) return;
    var wrap = document.querySelector('.wrap');
    var hero = document.querySelector('.wrap > .hero');
    var shell = document.getElementById('mainMenuShell');
    if (!wrap || !hero || !shell) return;
    var isSmall = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
    var buttonSize = isSmall ? 56 : 64;
    var top = hero.offsetTop + Math.max(12, (hero.offsetHeight - buttonSize) / 2);
    wrap.style.setProperty('--marginiq-menu-top', Math.round(top) + 'px');
  }
  window.addEventListener('resize', centerMarginIqMenuButton);
  window.addEventListener('load', centerMarginIqMenuButton);
  document.addEventListener('DOMContentLoaded', centerMarginIqMenuButton);
  document.addEventListener('click', function(){ requestAnimationFrame(centerMarginIqMenuButton); }, true);
  var observer = new MutationObserver(centerMarginIqMenuButton);
  function observe(){
    var shell = document.getElementById('mainMenuShell');
    if (shell) observer.observe(shell, {attributes:true, attributeFilter:['class']});
    centerMarginIqMenuButton();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observe);
  else observe();
  setTimeout(centerMarginIqMenuButton, 50);
  setTimeout(centerMarginIqMenuButton, 300);
})();
