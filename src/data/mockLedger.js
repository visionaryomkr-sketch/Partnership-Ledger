export const partners = [
    { id: "om", name: "OM Kumar", role: "Developer", color: "#4A5FE8",
      hours: 324, invested: 62000, contribution: 386000, net: 159600, share: 40,
      detail: "Built the entire platform end-to-end: the astronomical calculation engine, Gun Milan matching system, PDF report generation, backend security, and deployment.",
      lastActive: "Today", entriesThisWeek: 5 },
    { id: "shubham", name: "Shubham Jain", role: "Ad Creative", color: "#D14F9C",
      hours: 60, invested: 18000, contribution: 78000, net: -91800, share: 30,
      detail: "Responsible for designing ad creatives, video content, and campaign visuals.",
      lastActive: "2 days ago", entriesThisWeek: 2 },
    { id: "ashwin", name: "Ashwin Pillai", role: "Marketing", color: "#E8734A",
      hours: 77, invested: 25000, contribution: 102000, net: -67800, share: 30,
      detail: "Responsible for running ad campaigns, audience targeting, and growth marketing.",
      lastActive: "3 days ago", entriesThisWeek: 1 }
  ];
  export const projectStartDate = "2026-06-15";
  export const workEntries = [
    { id: 1, date: "2026-08-31", partner: "OM Kumar", category: "Development", title: "Backend security overhaul", description: "Rotated exposed credentials and moved sensitive operations behind secured services.", hours: 34, proof: "https://github.com/", time: "2 hours ago" },
    { id: 2, date: "2026-08-29", partner: "OM Kumar", category: "Development", title: "Gun Milan matching system", description: "Completed matching logic and report output.", hours: 52, proof: "https://github.com/", time: "2 days ago" },
    { id: 3, date: "2026-08-28", partner: "Shubham Jain", category: "Ad Creative", title: "Launch creative concepts", description: "Prepared three campaign directions.", hours: 18, proof: "https://drive.google.com/", time: "3 days ago" },
    { id: 4, date: "2026-08-25", partner: "Ashwin Pillai", category: "Marketing", title: "Audience research", description: "Mapped initial high-intent audiences.", hours: 22, proof: "", time: "1 week ago" },
    { id: 5, date: "2026-08-20", partner: "OM Kumar", category: "Development", title: "PDF report generation", description: "Built personalized astrology report pipeline.", hours: 46, proof: "https://github.com/", time: "2 weeks ago" },
    { id: 6, date: "2026-08-15", partner: "OM Kumar", category: "Development", title: "Astronomical calculation engine", description: "Implemented planetary positions and chart calculations.", hours: 62, proof: "https://github.com/", time: "2 weeks ago" },
    { id: 7, date: "2026-08-10", partner: "OM Kumar", category: "Development", title: "Platform backend and access controls", description: "Built data services, authentication, and authorization boundaries.", hours: 48, proof: "https://github.com/", time: "3 weeks ago" },
    { id: 8, date: "2026-08-04", partner: "OM Kumar", category: "Development", title: "Production deployment", description: "Configured deployment, monitoring, and release workflow.", hours: 44, proof: "https://github.com/", time: "4 weeks ago" },
    { id: 9, date: "2026-08-22", partner: "Shubham Jain", category: "Ad Creative", title: "Ad video storyboard", description: "Created storyboard for first ad video.", hours: 14, proof: "https://drive.google.com/", time: "2 weeks ago" },
    { id: 10, date: "2026-08-18", partner: "Shubham Jain", category: "Ad Creative", title: "Brand identity assets", description: "Finalized logo, color palette, and typography.", hours: 16, proof: "https://drive.google.com/", time: "2 weeks ago" },
    { id: 11, date: "2026-08-14", partner: "Ashwin Pillai", category: "Marketing", title: "Competitor analysis", description: "Researched competing astrology platforms and pricing.", hours: 18, proof: "", time: "3 weeks ago" },
    { id: 12, date: "2026-08-08", partner: "Ashwin Pillai", category: "Marketing", title: "Landing page copy", description: "Drafted and refined landing page messaging.", hours: 17, proof: "", time: "3 weeks ago" },
    { id: 13, date: "2026-07-28", partner: "OM Kumar", category: "Development", title: "Database schema design", description: "Designed data models for user accounts and reports.", hours: 38, proof: "https://github.com/", time: "1 month ago" },
    { id: 14, date: "2026-07-20", partner: "Shubham Jain", category: "Ad Creative", title: "Social media templates", description: "Created reusable templates for organic posts.", hours: 12, proof: "https://drive.google.com/", time: "1 month ago" },
    { id: 15, date: "2026-07-15", partner: "Ashwin Pillai", category: "Marketing", title: "Marketing strategy document", description: "Defined channels, budget, and KPIs.", hours: 20, proof: "", time: "1 month ago" }
  ];
  export const expenseEntries = [
    { id: 1, date: "2026-08-30", partner: "OM Kumar", category: "Hosting", amount: 42000, description: "Annual hosting, database, and security services", proof: "invoice-aug.pdf", status: "Pending", updated: "" },
    { id: 2, date: "2026-08-24", partner: "Ashwin Pillai", category: "Ads Spend", amount: 25000, description: "Initial ad account funding", proof: "ad-receipt.pdf", status: "Adjusted", updated: "31 Aug 2026" },
    { id: 3, date: "2026-08-18", partner: "Shubham Jain", category: "Tools/Software", amount: 18000, description: "Creative production subscriptions", proof: "tools-invoice.pdf", status: "Not Needed", updated: "" },
    { id: 4, date: "2026-08-12", partner: "Shubham Jain", category: "Design Assets", amount: 8500, description: "Stock images and design templates", proof: "design-assets.pdf", status: "Pending", updated: "" },
    { id: 5, date: "2026-08-05", partner: "OM Kumar", category: "Domain", amount: 1200, description: "Domain registration jyotishfuture.in", proof: "domain-invoice.pdf", status: "Adjusted", updated: "10 Aug 2026" },
    { id: 6, date: "2026-07-28", partner: "OM Kumar", category: "Hosting", amount: 15000, description: "Development environment setup", proof: "dev-hosting.pdf", status: "Adjusted", updated: "1 Aug 2026" },
    { id: 7, date: "2026-07-20", partner: "Shubham Jain", category: "Tools/Software", amount: 9600, description: "Annual design tool license", proof: "design-tools.pdf", status: "Pending", updated: "" },
    { id: 8, date: "2026-07-15", partner: "Ashwin Pillai", category: "Ads Spend", amount: 5000, description: "Test campaign budget", proof: "test-ads.pdf", status: "Adjusted", updated: "20 Jul 2026" },
    { id: 9, date: "2026-07-10", partner: "OM Kumar", category: "Domain", amount: 800, description: "SSL certificate", proof: "ssl-invoice.pdf", status: "Not Needed", updated: "" },
    { id: 10, date: "2026-07-05", partner: "Shubham Jain", category: "Design Assets", amount: 3200, description: "Brand font licenses", proof: "font-license.pdf", status: "Pending", updated: "" }
  ];
  export const revenueEntries = [
    { id: 1, date: "2026-08-31", source: "Direct Sale", amount: 9950, customers: 50, notes: "Daily report sales", partner: "Shubham Jain" },
    { id: 2, date: "2026-08-29", source: "Direct Sale", amount: 1990, customers: 10, notes: "Private beta report purchases", partner: "Shubham Jain" },
    { id: 3, date: "2026-08-26", source: "Organic", amount: 5970, customers: 30, notes: "Early referral purchases", partner: "Ashwin Pillai" },
    { id: 4, date: "2026-08-24", source: "Direct Sale", amount: 7960, customers: 40, notes: "Weekend promotion sales", partner: "Shubham Jain" },
    { id: 5, date: "2026-08-20", source: "Organic", amount: 3980, customers: 20, notes: "Organic search traffic", partner: "Ashwin Pillai" },
    { id: 6, date: "2026-08-15", source: "Direct Sale", amount: 5985, customers: 30, notes: "Mid-month report sales", partner: "OM Kumar" },
    { id: 7, date: "2026-08-10", source: "Direct Sale", amount: 3980, customers: 20, notes: "Early access sales", partner: "Shubham Jain" },
    { id: 8, date: "2026-08-05", source: "Organic", amount: 1990, customers: 10, notes: "Word of mouth referrals", partner: "Ashwin Pillai" }
  ];
  export const monthComparison = { hours: { current: 391, previous: 70 }, invested: { current: 85000, previous: 20000 }, revenue: { current: 41805, previous: 0 } };
  export const hoursByCategory = [{ name: "Development", value: 324, color: "#4A5FE8" }, { name: "Ad Creative", value: 60, color: "#D14F9C" }, { name: "Marketing", value: 77, color: "#E8734A" }];
  export const expenseByCategory = [{ category: "Hosting", amount: 57000, color: "#4A5FE8" }, { category: "Ads Spend", amount: 30000, color: "#E8734A" }, { category: "Tools/Software", amount: 27600, color: "#D14F9C" }, { category: "Design Assets", amount: 11700, color: "#B7791F" }, { category: "Domain", amount: 2000, color: "#2D7D46" }];
  export const revenueBySource = [{ source: "Direct Sale", amount: 29865, color: "#2D7D46" }, { source: "Organic", amount: 11940, color: "#4A5FE8" }, { source: "Ads-driven", amount: 0, color: "#B7791F" }];
  export const timeline = [
    { date: "Jun 15, 2026", title: "Project started", desc: "Initial concept and business plan agreed by all three partners." },
    { date: "Jul 2, 2026", title: "Domain live", desc: "jyotishfuture.in registered and configured." },
    { date: "Jul 15, 2026", title: "Marketing strategy defined", desc: "Channels, budget, and KPIs established." },
    { date: "Aug 10, 2026", title: "Platform backend complete", desc: "Data services, authentication, and authorization built." },
    { date: "Aug 15, 2026", title: "Astronomical calculation engine", desc: "Core planetary position calculations operational." },
    { date: "Aug 20, 2026", title: "API key security incident", desc: "Exposed API key discovered — full backend security overhaul initiated." },
    { date: "Aug 28, 2026", title: "Platform development completed", desc: "All technical systems built, tested, and deployment-ready." },
    { date: "Sep 1, 2026", title: "₹50,000 upfront payment proposed", desc: "Fair acknowledgment of completed verifiable work ahead of revenue." }
  ];
  export const changeLog = [
    { who: "OM Kumar", field: "Hourly Rate", when: "28 Aug 2026, 6:42 PM", old: "₹800", next: "₹1,000" },
    { who: "Ashwin Pillai", field: "Profit Share", when: "20 Aug 2026, 11:15 AM", old: "34 / 33 / 33", next: "40 / 30 / 30" },
    { who: "Shubham Jain", field: "Profit Share", when: "15 Aug 2026, 3:20 PM", old: "33 / 34 / 33", next: "34 / 33 / 33" },
    { who: "OM Kumar", field: "Hourly Rate", when: "10 Aug 2026, 9:00 AM", old: "₹600", next: "₹800" },
    { who: "Ashwin Pillai", field: "Profit Share", when: "5 Aug 2026, 2:15 PM", old: "33 / 33 / 34", next: "33 / 34 / 33" },
    { who: "Shubham Jain", field: "Hourly Rate", when: "28 Jul 2026, 5:30 PM", old: "₹500", next: "₹600" },
    { who: "OM Kumar", field: "Profit Share", when: "20 Jul 2026, 10:00 AM", old: "35 / 35 / 30", next: "33 / 33 / 34" },
    { who: "Ashwin Pillai", field: "Hourly Rate", when: "15 Jul 2026, 4:45 PM", old: "₹400", next: "₹500" },
    { who: "Shubham Jain", field: "Profit Share", when: "10 Jul 2026, 1:00 PM", old: "40 / 30 / 30", next: "35 / 35 / 30" },
    { who: "OM Kumar", field: "Hourly Rate", when: "5 Jul 2026, 8:30 AM", old: "₹300", next: "₹400" },
    { who: "Ashwin Pillai", field: "Profit Share", when: "1 Jul 2026, 3:00 PM", old: "Initial setup", next: "40 / 30 / 30" },
    { who: "Shubham Jain", field: "Hourly Rate", when: "28 Jun 2026, 6:00 PM", old: "Initial setup", next: "₹300" }
  ];
  export const decisions = [
    { id: 1, date: "2026-06-15", title: "Initial profit split agreed: 33/33/33", description: "Equal split of profit share between all three co-founders.", agreedBy: ["OM Kumar", "Shubham Jain", "Ashwin Pillai"], status: "Superseded" },
    { id: 2, date: "2026-07-01", title: "Profit split revised to 40/30/30", description: "Adjusted to reflect OM's larger technical contribution and time investment.", agreedBy: ["OM Kumar", "Shubham Jain", "Ashwin Pillai"], status: "Agreed" },
    { id: 3, date: "2026-08-20", title: "API key security incident response", description: "Full backend security overhaul mandated after exposed API key discovered. OM authorized to carry out immediately.", agreedBy: ["OM Kumar", "Shubham Jain", "Ashwin Pillai"], status: "Agreed" },
    { id: 4, date: "2026-08-28", title: "Platform development marked complete", description: "All technical systems verified as built and deployment-ready. Launch gated on ad budget availability.", agreedBy: ["OM Kumar", "Shubham Jain", "Ashwin Pillai"], status: "Agreed" },
    { id: 5, date: "2026-09-01", title: "Domain and hosting costs reimbursed from first revenue", description: "All infrastructure costs to be settled from initial revenue before profit distribution.", agreedBy: ["OM Kumar", "Shubham Jain", "Ashwin Pillai"], status: "Agreed" },
    { id: 6, date: "2026-09-01", title: "₹50,000 upfront payment to OM before full launch", description: "Fair acknowledgment of completed verifiable development work ahead of revenue. Adjustable against OM's share once revenue starts.", agreedBy: ["OM Kumar", "Shubham Jain"], status: "Proposed" }
  ];
  export const milestones = [
    { id: 1, title: "Domain live", description: "jyotishfuture.in registered and configured.", date: "2026-07-02", targetDate: "", category: "Completed", owners: ["OM Kumar"] },
    { id: 2, title: "Platform built", description: "All technical systems complete and tested.", date: "2026-08-28", targetDate: "", category: "Completed", owners: ["OM Kumar"] },
    { id: 3, title: "Security audit completed", description: "Full backend security overhaul after API key incident.", date: "2026-08-31", targetDate: "", category: "Completed", owners: ["OM Kumar"] },
    { id: 4, title: "Awaiting ₹50k upfront payment", description: "Acknowledgment payment to OM pending partner agreement.", date: "", targetDate: "2026-09-05", category: "In Progress", owners: ["Shubham Jain", "Ashwin Pillai"] },
    { id: 5, title: "Awaiting ad budget", description: "Marketing cannot begin until ad spend is funded.", date: "", targetDate: "2026-09-10", category: "In Progress", owners: ["Ashwin Pillai"] },
    { id: 6, title: "Paid ad campaigns launch", description: "First paid advertising campaigns go live.", date: "", targetDate: "2026-09-15", category: "Upcoming", owners: ["Ashwin Pillai", "Shubham Jain"] },
    { id: 7, title: "First 100 customers", description: "Reach first 100 paying customers.", date: "", targetDate: "2026-10-01", category: "Upcoming", owners: ["Ashwin Pillai"] },
    { id: 8, title: "Break-even", description: "Total revenue covers total invested costs.", date: "", targetDate: "2026-11-01", category: "Upcoming", owners: ["OM Kumar", "Shubham Jain", "Ashwin Pillai"] }
  ];
  export const documents = [
    { id: 1, name: "Partnership Terms (Informal)", uploadedBy: "OM Kumar", date: "2026-06-15", type: "PDF", category: "Legal" },
    { id: 2, name: "Terms of Service — Jyotish App", uploadedBy: "OM Kumar", date: "2026-08-20", type: "HTML", category: "Legal" },
    { id: 3, name: "Privacy Policy — Jyotish App", uploadedBy: "OM Kumar", date: "2026-08-20", type: "HTML", category: "Legal" },
    { id: 4, name: "Refund Policy — Jyotish App", uploadedBy: "OM Kumar", date: "2026-08-20", type: "HTML", category: "Legal" },
    { id: 5, name: "Q3 Budget Projection", uploadedBy: "Ashwin Pillai", date: "2026-07-15", type: "XLSX", category: "Financial" },
    { id: 6, name: "Pitch Deck v2", uploadedBy: "Shubham Jain", date: "2026-08-01", type: "PDF", category: "Product" },
    { id: 7, name: "Ad Creative Briefs", uploadedBy: "Shubham Jain", date: "2026-08-22", type: "PDF", category: "Product" },
    { id: 8, name: "Security Audit Report", uploadedBy: "OM Kumar", date: "2026-08-31", type: "PDF", category: "Other" }
  ];
  export const roles = [
    { partner: "OM Kumar", responsibility: "Technical Development", deliverables: "Platform, calculation engine, security, deployment, PDF reports", authority: "Final say on technical architecture, code quality, and security decisions" },
    { partner: "Shubham Jain", responsibility: "Ad Creative Production", deliverables: "Ad creatives, video content, campaign visuals, brand identity", authority: "Final say on creative direction and visual brand identity" },
    { partner: "Ashwin Pillai", responsibility: "Marketing & Growth", deliverables: "Ad campaigns, audience targeting, growth strategy, marketing budget", authority: "Final say on ad spend allocation and marketing channels" }
  ];
  export const monthlyContributions = [
    { month: "Jun", om: 0, shubham: 0, ashwin: 0 },
    { month: "Jul", om: 54000, shubham: 22000, ashwin: 25000 },
    { month: "Aug", om: 332000, shubham: 56000, ashwin: 77000 }
  ];
  export const money = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;