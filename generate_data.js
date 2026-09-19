const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Regions
const regions = [
    { RegionID: "R101", RegionName: "North America - East", Country: "United States", RegionalManager: "Sarah Jenkins" },
    { RegionID: "R102", RegionName: "North America - West", Country: "United States", RegionalManager: "Michael Chang" },
    { RegionID: "R103", RegionName: "North America - Central", Country: "United States", RegionalManager: "David Ross" },
    { RegionID: "R104", RegionName: "North America - South", Country: "United States", RegionalManager: "Elena Rodriguez" },
    { RegionID: "R105", RegionName: "Europe - UK & Ireland", Country: "United Kingdom", RegionalManager: "James Wilson" },
    { RegionID: "R106", RegionName: "Europe - Central", Country: "Germany", RegionalManager: "Hans Mueller" },
    { RegionID: "R107", RegionName: "Middle East - GCC", Country: "United Arab Emirates", RegionalManager: "Ahmed Al-Mansoor" },
    { RegionID: "R108", RegionName: "Middle East - Levant", Country: "Jordan", RegionalManager: "Rania Haddad" }
];

let regionCsv = "RegionID,RegionName,Country,RegionalManager\n";
regions.forEach(r => {
    regionCsv += `${r.RegionID},${r.RegionName},${r.Country},${r.RegionalManager}\n`;
});
fs.writeFileSync(path.join(dataDir, 'Dim_Region.csv'), regionCsv, 'utf8');

// 2. Products
const categories = [
    {
        Category: "Technology",
        SubCategories: [
            { SubCategory: "Laptops & Computers", items: [
                { name: "ProBook Ultrabook 15", cost: 650, price: 999 },
                { name: "Apex Gaming Desktop", cost: 1100, price: 1699 },
                { name: "Business Slim Laptop 14", cost: 480, price: 749 },
                { name: "Developer Workstation Pro", cost: 1400, price: 2199 }
            ]},
            { SubCategory: "Accessories", items: [
                { name: "Wireless Ergonomic Mouse", cost: 15, price: 39 },
                { name: "Mechanical RGB Keyboard", cost: 35, price: 89 },
                { name: "Noise-Cancelling Headset", cost: 55, price: 129 },
                { name: "USB-C Multi-Port Hub", cost: 18, price: 49 },
                { name: "4K Dual Monitor 27-inch", cost: 180, price: 329 }
            ]},
            { SubCategory: "Smartphones & Tablets", items: [
                { name: "Alpha Smartphone 5G", cost: 420, price: 799 },
                { name: "TabPro 11-inch Tablet", cost: 260, price: 499 },
                { name: "Smart Fitness Watch Gen 4", cost: 90, price: 199 }
            ]}
        ]
    },
    {
        Category: "Office Supplies",
        SubCategories: [
            { SubCategory: "Paper & Stationery", items: [
                { name: "Premium Laser Paper A4 (5 Reams)", cost: 14, price: 28 },
                { name: "Executive Notebook Set", cost: 8, price: 22 },
                { name: "Gel Pen Box (Assorted 24pk)", cost: 5, price: 15 }
            ]},
            { SubCategory: "Organization", items: [
                { name: "Mesh Desk Organizer Caddy", cost: 9, price: 24 },
                { name: "Heavy Duty Document Shredder", cost: 65, price: 139 },
                { name: "Laminating Machine Pro", cost: 40, price: 85 }
            ]},
            { SubCategory: "Storage & Presentation", items: [
                { name: "Magnetic Glass Whiteboard", cost: 75, price: 175 },
                { name: "Locking Storage Cabinet 2-Door", cost: 110, price: 230 }
            ]}
        ]
    },
    {
        Category: "Furniture",
        SubCategories: [
            { SubCategory: "Chairs", items: [
                { name: "ErgoComfort High-Back Mesh Chair", cost: 120, price: 289 },
                { name: "Executive Leather Recliner Chair", cost: 210, price: 450 },
                { name: "Drafting Stool with Foot Ring", cost: 65, price: 149 }
            ]},
            { SubCategory: "Desks", items: [
                { name: "Electric Height-Adjustable Standing Desk", cost: 240, price: 549 },
                { name: "Corner L-Shaped Executive Desk", cost: 290, price: 620 },
                { name: "Compact Home Office Desk", cost: 95, price: 210 }
            ]},
            { SubCategory: "Bookcases", items: [
                { name: "Solid Wood 5-Tier Bookshelf", cost: 115, price: 260 },
                { name: "Modular Cube Storage Shelf", cost: 60, price: 135 }
            ]}
        ]
    }
];

let products = [];
let prodIdCounter = 1;
categories.forEach(cat => {
    cat.SubCategories.forEach(sub => {
        sub.items.forEach(item => {
            products.push({
                ProductID: `PRD-${String(prodIdCounter++).padStart(3, '0')}`,
                ProductName: item.name,
                Category: cat.Category,
                SubCategory: sub.SubCategory,
                CostPrice: item.cost,
                RetailPrice: item.price
            });
        });
    });
});

let productCsv = "ProductID,ProductName,Category,SubCategory,CostPrice,RetailPrice\n";
products.forEach(p => {
    productCsv += `${p.ProductID},"${p.ProductName}",${p.Category},${p.SubCategory},${p.CostPrice},${p.RetailPrice}\n`;
});
fs.writeFileSync(path.join(dataDir, 'Dim_Product.csv'), productCsv, 'utf8');

// 3. Customers
const firstNames = ["Ahmed", "Mohamed", "Fatima", "Omar", "Sara", "Ali", "Mariam", "Youssef", "Nour", "Khaled", "Zainab", "Hassan", "Lina", "Tarek", "Layla", "John", "Emily", "David", "Jessica", "Robert", "Sophia", "William", "Olivia", "James", "Emma", "Daniel", "Chloe", "Alexander", "Mia", "Benjamin"];
const lastNames = ["Al-Otaibi", "El-Sayed", "Mansour", "Haddad", "Al-Fassi", "Khoury", "Ghanem", "Al-Ghamdi", "Nasser", "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Clark"];
const segments = ["Consumer", "Corporate", "Home Office"];
const cities = [
    { city: "New York", state: "NY", country: "United States", postal: "10001" },
    { city: "Los Angeles", state: "CA", country: "United States", postal: "90001" },
    { city: "Chicago", state: "IL", country: "United States", postal: "60601" },
    { city: "Houston", state: "TX", country: "United States", postal: "77001" },
    { city: "London", state: "England", country: "United Kingdom", postal: "EC1A" },
    { city: "Manchester", state: "Greater Manchester", country: "United Kingdom", postal: "M1 1AE" },
    { city: "Berlin", state: "Berlin", country: "Germany", postal: "10115" },
    { city: "Munich", state: "Bavaria", country: "Germany", postal: "80331" },
    { city: "Dubai", state: "Dubai", country: "United Arab Emirates", postal: "" },
    { city: "Abu Dhabi", state: "Abu Dhabi", country: "United Arab Emirates", postal: "" },
    { city: "Amman", state: "Amman", country: "Jordan", postal: "11181" },
    { city: "Riyadh", state: "Riyadh", country: "Saudi Arabia", postal: "12211" }
];

let customers = [];
for (let i = 1; i <= 250; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const seg = segments[Math.floor(Math.random() * segments.length)];
    const loc = cities[Math.floor(Math.random() * cities.length)];
    const age = 21 + Math.floor(Math.random() * 50);
    const gender = (i % 2 === 0) ? "Male" : "Female";

    customers.push({
        CustomerID: `CUST-${String(i).padStart(4, '0')}`,
        CustomerName: `${fn} ${ln}`,
        Gender: gender,
        Age: age,
        CustomerSegment: seg,
        Country: loc.country,
        State: loc.state,
        City: loc.city,
        PostalCode: loc.postal || ""
    });
}

let customerCsv = "CustomerID,CustomerName,Gender,Age,CustomerSegment,Country,State,City,PostalCode\n";
customers.forEach(c => {
    // Intentionally adding a tiny trailing space on a couple for real-world cleaning demo
    const nameFormatted = (c.CustomerID === "CUST-0005" || c.CustomerID === "CUST-0020") ? `"${c.CustomerName} "` : `"${c.CustomerName}"`;
    customerCsv += `${c.CustomerID},${nameFormatted},${c.Gender},${c.Age},${c.CustomerSegment},${c.Country},${c.State},${c.City},${c.PostalCode}\n`;
});
fs.writeFileSync(path.join(dataDir, 'Dim_Customer.csv'), customerCsv, 'utf8');

// 4. Fact Sales (from 2023-01-01 to 2025-12-31)
const channels = ["Online", "In-Store", "Distributor"];
const paymentMethods = ["Credit Card", "PayPal", "Bank Transfer", "Cash"];
const discounts = [0, 0, 0, 0.05, 0.05, 0.1, 0.15, 0.2];

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const startDate = new Date(2023, 0, 1);
const endDate = new Date(2025, 11, 31);

let salesRecords = [];
const numOrders = 3500;

for (let i = 1; i <= numOrders; i++) {
    const oDate = randomDate(startDate, endDate);
    // Ship date 1 to 5 days later
    const sDate = new Date(oDate.getTime() + (1 + Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000);
    
    const cust = customers[Math.floor(Math.random() * customers.length)];
    const prod = products[Math.floor(Math.random() * products.length)];
    const reg = regions[Math.floor(Math.random() * regions.length)];
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const payment = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const qty = 1 + Math.floor(Math.random() * 6); // 1 to 6 units
    const discount = discounts[Math.floor(Math.random() * discounts.length)];

    const unitPrice = prod.RetailPrice;
    const unitCost = prod.CostPrice;
    const grossAmount = qty * unitPrice;
    const discountAmount = Math.round(grossAmount * discount * 100) / 100;
    const totalSales = Math.round((grossAmount - discountAmount) * 100) / 100;
    const totalCost = qty * unitCost;
    const profit = Math.round((totalSales - totalCost) * 100) / 100;

    const orderId = `ORD-${oDate.getFullYear()}-${String(i).padStart(5, '0')}`;
    const orderDateStr = oDate.toISOString().split('T')[0];
    const shipDateStr = sDate.toISOString().split('T')[0];

    salesRecords.push({
        OrderID: orderId,
        OrderDate: orderDateStr,
        ShipDate: shipDateStr,
        CustomerID: cust.CustomerID,
        ProductID: prod.ProductID,
        RegionID: reg.RegionID,
        SalesChannel: channel,
        PaymentMethod: payment,
        Quantity: qty,
        UnitPrice: unitPrice,
        Discount: discount,
        TotalSales: totalSales,
        TotalCost: totalCost,
        TotalProfit: profit
    });
}

// Sort by OrderDate ascending
salesRecords.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));

let salesCsv = "OrderID,OrderDate,ShipDate,CustomerID,ProductID,RegionID,SalesChannel,PaymentMethod,Quantity,UnitPrice,Discount,TotalSales,TotalCost,TotalProfit\n";
salesRecords.forEach(s => {
    salesCsv += `${s.OrderID},${s.OrderDate},${s.ShipDate},${s.CustomerID},${s.ProductID},${s.RegionID},${s.SalesChannel},${s.PaymentMethod},${s.Quantity},${s.UnitPrice},${s.Discount},${s.TotalSales},${s.TotalCost},${s.TotalProfit}\n`;
});
fs.writeFileSync(path.join(dataDir, 'Fact_Sales.csv'), salesCsv, 'utf8');

console.log("Mock data generated successfully in:", dataDir);
console.log(`Regions: ${regions.length}, Products: ${products.length}, Customers: ${customers.length}, Sales: ${salesRecords.length}`);
