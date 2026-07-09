function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('Advanced Landing Page Generator')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function generateLandingPage(data) {
  let templateName = '';
  
  if (data.businessType === 'Travel Agency') {
    templateName = 'Travel';
  } else if (data.businessType === 'Lending Company') {
    templateName = 'Lending';
  } else if (data.businessType === 'Cosmetic Toll Manufacturer') {
    templateName = 'Cosmetics';
  }

  let tmpl = HtmlService.createTemplateFromFile(templateName);
  
  // Base Global Parameters
  tmpl.companyName = data.companyName || 'Your Brand';
  tmpl.logoUrl = data.logoUrl || 'https://via.placeholder.com/150';
  tmpl.nature = data.nature || 'Premium Solutions';
  tmpl.heroTitle = data.heroTitle || 'Welcome to Next-Gen Services';
  tmpl.heroSubtitle = data.heroSubtitle || 'Tailored precisely to meet your standards.';
  tmpl.contactNumber = data.contactNumber || '123-456-7890';
  tmpl.emailAddress = data.emailAddress || 'info@brand.com';
  
  // Custom Color Configurations
  tmpl.primaryColor = data.primaryColor || '#2563eb';
  tmpl.secondaryColor = data.secondaryColor || '#f59e0b';

  // Format Dynamic Operational Bottlenecks Fields
  let bottlenecks = data.bottlenecks.split(',').map(b => b.trim()).filter(b => b.length > 0);
  let funnelHTML = '';
  bottlenecks.forEach(bottleneck => {
    funnelHTML += `
      <div class="mb-5 text-left">
          <label class="block text-sm font-bold opacity-90 mb-2">Specific Challenge with: ${bottleneck}?</label>
          <input type="text" required class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-slate-800 bg-slate-50" placeholder="Let us know how to tailor this for you...">
      </div>
    `;
  });
  tmpl.funnelFields = funnelHTML;

  // Process Niche-Specific Array / Object Inputs
  if (data.businessType === 'Travel Agency') {
    tmpl.pkg1Title = data.pkg1Title || 'Tropical Escape'; tmpl.pkg1Price = data.pkg1Price || '$599'; tmpl.pkg1Img = data.pkg1Img || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
    tmpl.pkg2Title = data.pkg2Title || 'Mountain Retreat'; tmpl.pkg2Price = data.pkg2Price || '$799'; tmpl.pkg2Img = data.pkg2Img || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b';
    tmpl.pkg3Title = data.pkg3Title || 'Urban Explorer'; tmpl.pkg3Price = data.pkg3Price || '$499'; tmpl.pkg3Img = data.pkg3Img || 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df';
  } 
  else if (data.businessType === 'Lending Company') {
    tmpl.interestRate = data.interestRate || '3.5';
    tmpl.maxTerm = data.maxTerm || '36';
  } 
  else if (data.businessType === 'Cosmetic Toll Manufacturer') {
    tmpl.prod1Title = data.prod1Title || 'Organic Hydrating Serum'; tmpl.prod1Cap = data.prod1Cap || 'Advanced anti-aging clear matrix skin solution.'; tmpl.prod1Img = data.prod1Img || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be';
    tmpl.prod2Title = data.prod2Title || 'Matte Velvet Lipstick'; tmpl.prod2Cap = data.prod2Cap || 'High pigment organic wear finish compounding.'; tmpl.prod2Img = data.prod2Img || 'https://images.unsplash.com/photo-1586495777744-4413f21062fa';
    tmpl.prod3Title = data.prod3Title || 'Botanical Cleansing Gel'; tmpl.prod3Cap = data.prod3Cap || 'Gentle foaming facial base formulas.'; tmpl.prod3Img = data.prod3Img || 'https://images.unsplash.com/photo-1556228720-195a672e8a03';
  }

  return tmpl.evaluate().getContent();
}