# 📊 Global Retail & E-Commerce Executive Sales Analytics
### 🎓 Data Analysis Diploma Graduation Project (مشروع تخرج دبلومة تحليل البيانات)
**Designed & Developed by:** Data Analyst Portfolio  
**Tools & Technologies:** Power BI Desktop, DAX, Power Query (M Language), Excel, Star Schema Modeling

---

## 📌 1. Project Overview & Business Background (نبذة عن المشروع وأهدافه)

In today's fast-moving retail and e-commerce landscape, business leaders face critical challenges in monitoring revenue streams, pinpointing profit leaks, evaluating regional performance, and optimizing product catalogs.

This graduation project delivers a comprehensive **End-to-End Business Intelligence solution** built using **Microsoft Power BI**. The dashboard provides senior stakeholders (C-Suite, Sales Directors, Regional Heads) with high-impact, actionable insights to track sales velocity, customer segments, discount effectiveness, and year-over-year (YoY) operational growth.

### 🎯 Key Business Questions Answered:
1. **Revenue & Profit Dynamics:** How are our sales and net profit trending across months and years (YoY, YTD, MTD)?
2. **Profit Margins vs. Discounts:** Are heavy discounts eating into our gross margins, and which subcategories suffer the most?
3. **Product Catalog Optimization:** Which top 10 products drive 80% of our profits (Pareto Principle), and which are operating at a net loss?
4. **Regional & Channel Efficiency:** Which geographic territories and sales channels (Online, In-Store, Distributor) yield the highest average order value (AOV)?
5. **Customer Segmentation:** How do buying behaviors differ between Consumer, Corporate, and Home Office segments?

---

## 🏗️ 2. Data Architecture & Star Schema Model (نمذجة البيانات)

Following the **Ralph Kimball Dimensional Modeling methodology**, the project is architected as a pure **Star Schema** to ensure maximum DAX query performance, intuitive drag-and-drop analysis, and scalable reporting.

### 📐 Entity-Relationship Diagram (ERD):

```
         +--------------------+              +--------------------+
         |    Dim_Customer    |              |     Dim_Region     |
         +--------------------+              +--------------------+
         | PK  CustomerID     |              | PK  RegionID       |
         |     CustomerName   |              |     RegionName     |
         |     Gender / Age   |              |     Country        |
         |     Segment / City |              |     Manager        |
         +---------+----------+              +---------+----------+
                   | 1                                 | 1
                   |                                   |
                   | *                                 | *
             +-----+-----------------------------------+-----+
             |                      Fact_Sales               |
             +-----------------------------------------------+
             | PK  OrderID                                   |
             | FK  CustomerID                                |
             | FK  ProductID                                 |
             | FK  RegionID                                  |
             | FK  OrderDate  ------------------+            |
             |     ShipDate                     |            |
             |     SalesChannel                 |            |
             |     Quantity, UnitPrice          |            |
             |     Discount, TotalSales         |            |
             |     TotalCost, TotalProfit       |            |
             +-----+----------------------------+------------+
                   | *                                 | *
                   |                                   |
                   | 1                                 | 1
         +---------+----------+              +---------+----------+
         |     Dim_Product    |              |      Dim_Date      |
         +--------------------+              +--------------------+
         | PK  ProductID      |              | PK  Date           |
         |     ProductName    |              |     Year / Quarter |
         |     Category       |              |     MonthNum / Name|
         |     SubCategory    |              |     Week / DayName |
         |     Cost & Retail  |              |     IsWeekend      |
         +--------------------+              +--------------------+
```

### ⚙️ Relationship Rules:
- **Cardinality:** All relationships are strictly **One-to-Many (`1:*`)** from Dimensions to the Fact table.
- **Cross-Filter Direction:** Single direction (`Dim -> Fact`), preventing circular filtering and optimizing VertiPaq engine compression.
- **Foreign Keys:** Hidden in report view to prevent accidental aggregations.
- **Calendar Table:** Marked officially as a **Date Table** in Power BI to ensure precise Time Intelligence calculations.

---

## 🧹 3. Data Extraction & Power Query ETL (تنظيف وتجهيز البيانات)

All data was extracted, validated, transformed, and loaded (ETL) through the **Power Query Editor**. 

### 🔧 Key Cleaning Operations:
1. **Data Type Casting:** Enforced strict schema types (Dates for `OrderDate`/`ShipDate`, Currency for `TotalSales`/`TotalProfit`, and Integers for `Quantity`).
2. **Text Normalization:** Applied `Text.Trim` and `Text.Clean` on customer names, city records, and categories to eliminate trailing spaces and non-printable characters.
3. **Handling Missing Values:** Imputed blank postal codes with `"N/A"` without dropping valid transactions.
4. **Deduplication:** Validated and enforced unique primary keys across all dimension tables (`CustomerID`, `ProductID`, `RegionID`).
5. **Feature Engineering:**
   - Created `ShippingDays = Duration.Days([ShipDate] - [OrderDate])` to analyze shipping latency.
   - Added standard margin columns in product dimension for comparative analysis.

---

## 🧮 4. DAX Calculations & Key Performance Indicators (حسابات ومقاييس DAX)

All business calculations are consolidated into a dedicated `_Measures` table organized into structured display folders.

| Measure Name | DAX Expression Summary | Business Value |
| :--- | :--- | :--- |
| **Total Sales** | `SUM(Fact_Sales[TotalSales])` | Core top-line revenue tracking |
| **Total Profit** | `[Total Sales] - [Total Cost]` | Bottom-line financial profitability |
| **Profit Margin %** | `DIVIDE([Total Profit], [Total Sales], 0)` | Operational margin efficiency |
| **Total Orders** | `DISTINCTCOUNT(Fact_Sales[OrderID])` | Order volume and transaction count |
| **Average Order Value (AOV)**| `DIVIDE([Total Sales], [Total Orders], 0)` | Customer basket purchasing power |
| **Sales YTD** | `TOTALYTD([Total Sales], Dim_Date[Date])` | Cumulative year-to-date performance |
| **Sales Prior Year (PY)** | `CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Dim_Date[Date]))`| Benchmark against previous fiscal year |
| **YoY Sales Growth %** | `DIVIDE([Total Sales] - [Sales PY], [Sales PY], 0)` | Year-over-Year expansion velocity |
| **YoY KPI Badge** | `Dynamic Unicode Badges (▲ / ▼)` | Instant executive status indicators |

---

## 🖥️ 5. Dashboard Architecture & User Experience (تصميم وتوزيع لوحات التحكم)

The dashboard is structured into a **3-tier executive report** using modern UI/UX design standards:
- **Palette:** Executive Slate Dark/Navy & Modern Teal/Emerald (`#1E293B`, `#00A86B`, `#3B82F6`).
- **Typography:** Segoe UI Semibold for titles, DIN for KPI metrics.
- **Interactivity:** Synchronized Slicers, Bookmarks for View Toggling, Custom Drill-through pages, and Dynamic Tooltips.

### 📑 Page Breakdown:

#### 1. Executive Summary (الملخص التنفيذي)
- **Top Bar:** 5 KPI Cards (Total Sales, Total Profit, Profit Margin %, AOV, YoY Growth %).
- **Main Area:** Line & Clustered Column Chart showing *Monthly Sales vs. Prior Year with Forecast*.
- **Left Panel:** Global slicers for Year, Quarter, Region, and Channel + Reset Filter Button.
- **Bottom Visuals:** Donut chart of Sales by Category, and Filled Map for Regional Performance.

#### 2. Product & Profitability Deep-Dive (أداء المنتجات والربحية)
- **Scatter Matrix:** Sales vs. Profit Margin % by Subcategory (Quadrant analysis: Stars, Cash Cows, Question Marks, Dogs).
- **Top / Bottom 10:** Bar charts displaying most profitable products vs. loss-making SKUs.
- **Discount Impact Analysis:** Line chart showing how increasing discount rates affect net margin.

#### 3. Customer & Regional Insights (تحليل العملاء والتوزيع الجغرافي)
- **Customer Segmentation:** Breakdown of Revenue and Orders across Consumer, Corporate, and Home Office.
- **Manager Performance Table:** Matrix visual ranking Regional Managers by quota attainment and profit contribution.
- **Fulfillment Time:** Average shipping delay segmented by region and shipping method.

---

## 💡 6. Strategic Business Insights & Recommendations (أبرز الرؤى والتوصيات)

1. **Re-evaluate High-Discount Policies:** Products sold with discounts exceeding **15%** exhibited a **42% reduction in net margin** without generating proportional volume lift.
2. **Double Down on High-Yield Subcategories:** Laptops & Developer Workstations account for over 50% of Technology revenue; introducing bundled accessories will improve Average Order Value (AOV).
3. **Corporate Segment Retention:** The Corporate sector represents 35% of total volume with a 28% higher AOV than Consumer clients. Instituting dedicated account managers can drive recurring revenue.
4. **Logistics Bottlenecks in Southern Region:** Shipping turnaround in the South region averages 4.8 days versus 2.1 days in Central; optimizing regional warehousing will elevate customer satisfaction.

---

## 🚀 7. How to Reproduce & Run this Project (طريقة تشغيل المشروع)

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/abdalluhj-s/powerbi-retail-analytics.git
   ```
2. **Open Data Folder:**
   All cleaned CSV tables (`Dim_Customer.csv`, `Dim_Product.csv`, `Dim_Region.csv`, `Fact_Sales.csv`) are located in `/data`.
3. **Open Power BI Desktop:**
   - Import the 4 CSV files via **Get Data -> Text/CSV**.
   - Create the `Dim_Date` table using the script in `DAX_Measures.dax`.
   - Set up relationships in the **Model View** matching the Star Schema diagram above.
   - Copy the measures from `DAX_Measures.dax` into your `_Measures` table.
   - Build or open the `.pbix` template.

---

## 📬 Contact & Connect (بيانات التواصل)
- **Author:** Data Analyst Portfolio
- **GitHub Repository:** [github.com/abdalluhj-s/powerbi-retail-analytics](https://github.com/abdalluhj-s/powerbi-retail-analytics)
- **Live Interactive Dashboard (Direct Link without VPN):** [abdalluhj-s.github.io/powerbi-retail-analytics](https://abdalluhj-s.github.io/powerbi-retail-analytics/)

