const mongoose = require("mongoose");
require("../utils/logger.js");
// const Crowdsale = require('./crowdsale.js')
// const redis = require('../db/redis.js')
const Sec_Listing_Schema = mongoose.Schema({
  // guid: { type: String, default: String(new Date()), unique: true, index: true },
  enclosure: {
    url: { type: String, default: "" },
    length: { type: String, default: "" },
    type: { type: String, default: "" }
  },
  content: { type: String, default: "" },
  guid: { type: String, default: "" },
  title: { type: String, default: "" },
  pubDate: { type: String, default: "" },
  guid: { type: String, default: "" },
  cik: { type: String, default: "" },
  CIK: { type: String, default: "" },
  companyName: { type: String, default: "" },
  formType: { type: String, default: "" },
  filingDate: { type: String, default: "" },
  cikString: { type: String, default: "" },
  accessionString: { type: String, default: "" },
  fileString: { type: String, default: "" },
  acceptanceDatetime: { type: String, default: "" },
  period: { type: String, default: "" },
  assistantDirector: { type: String, default: "" },
  assignedSic: { type: String, default: "" },
  fiscalYearEnd: { type: String, default: "" },

  EntityRegistrantName: { type: String, default: "" },
  CurrentFiscalYearEndDate: { type: String, default: "" },
  EntityCentralIndexKey: { type: String, default: "" },
  EntityFilerCategory: { type: String, default: "" },
  TradingSymbol: { type: String, default: "" },
  DocumentPeriodEndDate: { type: String, default: "" },
  DocumentFiscalYearFocus: { type: String, default: "" },
  DocumentFiscalPeriodFocus: { type: String, default: "" },
  DocumentFiscalYearFocusContext: { type: String, default: "" },
  DocumentFiscalPeriodFocusContext: { type: String, default: "" },
  DocumentType: { type: String, default: "" },
  BalanceSheetDate: { type: String, default: "" },
  IncomeStatementPeriodYTD: { type: String, default: "" },
  ContextForInstants: { type: String, default: "" },
  ContextForDurations: { type: String, default: "" },
  Assets: { type: String, default:'' },
  CurrentAssets: { type: String, default:'' },
  NoncurrentAssets: { type: String, default:'' },
  LiabilitiesAndEquity: { type: String, default:'' },
  Liabilities: { type: String, default:'' },
  CurrentLiabilities: { type: String, default:'' },
  NoncurrentLiabilities: { type: String, default:'' },
  CommitmentsAndContingencies: { type: String, default:'' },
  TemporaryEquity: { type: String, default:'' },
  Equity: { type: String, default:'' },
  EquityAttributableToNoncontrollingInterest: { type: String, default:'' },
  EquityAttributableToParent: { type: String, default:'' },
  Revenues: { type: String, default:'' },
  CostOfRevenue: { type: String, default:'' },
  GrossProfit: { type: String, default:'' },
  OperatingExpenses: { type: String, default:'' },
  CostsAndExpenses: { type: String, default:'' },
  OtherOperatingIncome: { type: String, default:'' },
  OperatingIncomeLoss: { type: String, default:'' },
  NonoperatingIncomeLoss: { type: String, default:'' },
  InterestAndDebtExpense: { type: String, default:'' },
  IncomeBeforeEquityMethodInvestments: { type: String, default:'' },
  IncomeFromEquityMethodInvestments: { type: String, default:'' },
  IncomeFromContinuingOperationsBeforeTax: { type: String, default:'' },
  IncomeTaxExpenseBenefit: { type: String, default:'' },
  IncomeFromContinuingOperationsAfterTax: { type: String, default:'' },
  IncomeFromDiscontinuedOperations: { type: String, default:'' },
  ExtraordaryItemsGainLoss: { type: String, default:'' },
  NetIncomeLoss: { type: String, default:'' },
  NetIncomeAvailableToCommonStockholdersBasic: { type: String, default:'' },
  PreferredStockDividendsAndOtherAdjustments: { type: String, default:'' },
  NetIncomeAttributableToNoncontrollingInterest: { type: String, default:'' },
  NetIncomeAttributableToParent: { type: String, default:'' },
  OtherComprehensiveIncome: { type: String, default:'' },
  ComprehensiveIncome: { type: String, default:'' },
  ComprehensiveIncomeAttributableToParent: { type: String, default:'' },
  ComprehensiveIncomeAttributableToNoncontrollingInterest: {
    type: String,
    default:''
  },
  NonoperatingIncomeLossPlusInterestAndDebtExpense: {
    type: String,
    default:''
  },
  NonoperatingIncomePlusInterestAndDebtExpensePlusIncomeFromEquityMethodInvestments: {
    type: String,
    default:''
  },
  NetCashFlow: { type: String, default:'' },
  NetCashFlowsOperating: { type: String, default:'' },
  NetCashFlowsInvesting: { type: String, default:'' },
  NetCashFlowsFinancing: { type: String, default:'' },
  NetCashFlowsOperatingContinuing: { type: String, default:'' },
  NetCashFlowsInvestingContinuing: { type: String, default:'' },
  NetCashFlowsFinancingContinuing: { type: String, default:'' },
  NetCashFlowsOperatingDiscontinued: { type: String, default:'' },
  NetCashFlowsInvestingDiscontinued: { type: String, default:'' },
  NetCashFlowsFinancingDiscontinued: { type: String, default:'' },
  NetCashFlowsDiscontinued: { type: String, default:'' },
  ExchangeGainsLosses: { type: String, default:'' },
  NetCashFlowsContinuing: { type: String, default:'' },
  SGR: { type: String, default:'' },
  ROA: { type: String, default:'' },
  ROE: { type: String, default:'' },
  ROS: { type: String, default:'' },
  year_month: {type: [String], default: []},
  xml_filename:{type: String, default:'', require:true, unique:true},
  files_downloaded: { type: Boolean, default: false },
  error_msg:{type:String, default:''}
});

const Sec_Listing = mongoose.model("Sec_Listing", Sec_Listing_Schema);
module.exports = Sec_Listing;
Sec_Listing.add_listing = add_listing;
Sec_Listing.last_saved_filing = last_saved_filing;

async function last_saved_filing() {
  let last_filing = await Sec_Listing.find({})
    .sort({ _id: -1 })
    .limit(1);
  if (last_filing.length) return last_filing[0].guid;
}
async function add_listing(listing) {
  /* upsert style saving, find and update */

  try {
    logger.log("addddd listing");
    // logger.log(listing);
    let new_listing = await Sec_Listing.findOneAndUpdate(
      {xml_filename:listing.xml_filename}, {
        ...listing
      }, {upsert:true}
    )
    // let new_listing = new Sec_Listing(listing);
    // let saved = await new_listing.save({ new: true });
    // logger.log({ saved });
    // return saved;
  } catch (err) {
    logger.log("err".bgRed);
    logger.log(err)
    if (err.errmsg &&
      !err.errmsg.includes(
        "E11000 duplicate key error collection: SEC_FILLING.sec_listings"
      )
    ) {
      logger.log(err);
    }
  }
}
