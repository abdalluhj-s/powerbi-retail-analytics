// =============================================================================
//                    POWER QUERY (M CODE) CLEANING & ETL RECIPES
//               Project: Global Retail & E-Commerce Executive Analytics
// =============================================================================

/*
   INSTRUCTIONS:
   In Power BI Desktop:
   1. Click "Get Data" -> "Text/CSV" and load each file from the data folder.
   2. Click "Transform Data" to open Power Query Editor.
   3. Check the steps below or open Advanced Editor and compare the M code.
*/

// =============================================================================
// 1. DIM_CUSTOMER CLEANING SCRIPT
// =============================================================================
/*
   Cleaned Steps:
   - Trim and Clean whitespace in CustomerName.
   - Replace empty/null PostalCode with "N/A".
   - Validate Age range and correct data types.
*/

let
    Source = Csv.Document(File.Contents("C:\Users\dell\.gemini\antigravity\scratch\powerbi-graduation-project\data\Dim_Customer.csv"), [Delimiter=",", Columns=9, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"CustomerID", type text}, 
        {"CustomerName", type text}, 
        {"Gender", type text}, 
        {"Age", Int64.Type}, 
        {"CustomerSegment", type text}, 
        {"Country", type text}, 
        {"State", type text}, 
        {"City", type text}, 
        {"PostalCode", type text}
    }),
    #"Trimmed Text" = Table.TransformColumns(#"Changed Type",{{"CustomerName", Text.Trim, type text}, {"City", Text.Trim, type text}}),
    #"Cleaned Text" = Table.TransformColumns(#"Trimmed Text",{{"CustomerName", Text.Clean, type text}}),
    #"Replaced Blank Postal" = Table.ReplaceValue(#"Cleaned Text","", "N/A", Replacer.ReplaceValue, {"PostalCode"}),
    #"Removed Duplicates" = Table.Distinct(#"Replaced Blank Postal", {"CustomerID"})
in
    #"Removed Duplicates"


// =============================================================================
// 2. DIM_PRODUCT CLEANING SCRIPT
// =============================================================================
/*
   Cleaned Steps:
   - Validate numeric datatypes for CostPrice and RetailPrice.
   - Ensure Category & SubCategory are capitalized properly.
   - Add a calculated column for Markup % or Base Margin %.
*/

let
    Source = Csv.Document(File.Contents("C:\Users\dell\.gemini\antigravity\scratch\powerbi-graduation-project\data\Dim_Product.csv"), [Delimiter=",", Columns=6, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"ProductID", type text}, 
        {"ProductName", type text}, 
        {"Category", type text}, 
        {"SubCategory", type text}, 
        {"CostPrice", type number}, 
        {"RetailPrice", type number}
    }),
    #"Added Profit Margin Column" = Table.AddColumn(#"Changed Type", "StandardMarginPct", each ([RetailPrice] - [CostPrice]) / [RetailPrice], type number),
    #"Capitalized Category" = Table.TransformColumns(#"Added Profit Margin Column",{{"Category", Text.Proper, type text}, {"SubCategory", Text.Proper, type text}}),
    #"Distinct Products" = Table.Distinct(#"Capitalized Category", {"ProductID"})
in
    #"Distinct Products"


// =============================================================================
// 3. DIM_REGION CLEANING SCRIPT
// =============================================================================

let
    Source = Csv.Document(File.Contents("C:\Users\dell\.gemini\antigravity\scratch\powerbi-graduation-project\data\Dim_Region.csv"), [Delimiter=",", Columns=4, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"RegionID", type text}, 
        {"RegionName", type text}, 
        {"Country", type text}, 
        {"RegionalManager", type text}
    }),
    #"Trimmed Text" = Table.TransformColumns(#"Changed Type",{{"RegionName", Text.Trim, type text}, {"RegionalManager", Text.Trim, type text}}),
    #"Distinct Regions" = Table.Distinct(#"Trimmed Text", {"RegionID"})
in
    #"Distinct Regions"


// =============================================================================
// 4. FACT_SALES CLEANING SCRIPT
// =============================================================================
/*
   Cleaned Steps:
   - Convert OrderDate and ShipDate to proper Date types.
   - Enforce Decimal/Currency types for Financial columns.
   - Add Delivery Lead Time (Days to Ship = ShipDate - OrderDate).
   - Filter out invalid negative or zero quantities.
*/

let
    Source = Csv.Document(File.Contents("C:\Users\dell\.gemini\antigravity\scratch\powerbi-graduation-project\data\Fact_Sales.csv"), [Delimiter=",", Columns=14, Encoding=65001, QuoteStyle=QuoteStyle.Csv]),
    #"Promoted Headers" = Table.PromoteHeaders(Source, [PromoteAllScalars=true]),
    #"Changed Type" = Table.TransformColumnTypes(#"Promoted Headers",{
        {"OrderID", type text}, 
        {"OrderDate", type date}, 
        {"ShipDate", type date}, 
        {"CustomerID", type text}, 
        {"ProductID", type text}, 
        {"RegionID", type text}, 
        {"SalesChannel", type text}, 
        {"PaymentMethod", type text}, 
        {"Quantity", Int64.Type}, 
        {"UnitPrice", type number}, 
        {"Discount", type number}, 
        {"TotalSales", type number}, 
        {"TotalCost", type number}, 
        {"TotalProfit", type number}
    }),
    #"Added Shipping Duration" = Table.AddColumn(#"Changed Type", "ShippingDays", each Duration.Days([ShipDate] - [OrderDate]), Int64.Type),
    #"Filtered Valid Records" = Table.SelectRows(#"Added Shipping Duration", each [Quantity] > 0 and [TotalSales] >= 0)
in
    #"Filtered Valid Records"
