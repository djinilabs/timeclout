// Simple test to demonstrate translation system
async function testTranslation() {
  console.log('Testing translation system...');
  
  try {
    // Test locale detection
    const { getLocaleFromHeaders } = await import('./i18n.js');
    
    console.log('Locale from "en-US,en;q=0.9,pt;q=0.8":', getLocaleFromHeaders('en-US,en;q=0.9,pt;q=0.8'));
    console.log('Locale from "pt-BR,pt;q=0.9,en;q=0.8":', getLocaleFromHeaders('pt-BR,pt;q=0.9,en;q=0.8'));
    console.log('Locale from undefined:', getLocaleFromHeaders(undefined));
    
    console.log('Translation system is working!');
  } catch (error) {
    console.error('Error testing translation system:', error);
  }
}

// Run test
testTranslation(); 