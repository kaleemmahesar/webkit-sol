// Test script to check API responses
async function testAPI() {
  try {
    // Test login
    const loginResponse = await fetch('http://localhost/webkit-sol/wordpress/wp-json/jwt-auth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('Login failed:', await loginResponse.text());
      return;
    }
    
    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData);
    
    // Test fetching subscriptions
    const subscriptionsResponse = await fetch('http://localhost/webkit-sol/wordpress/wp-json/custom/v1/subscriptions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginData.token}`
      }
    });
    
    if (!subscriptionsResponse.ok) {
      console.log('Subscriptions fetch failed:', await subscriptionsResponse.text());
      return;
    }
    
    const subscriptionsData = await subscriptionsResponse.json();
    console.log('Subscriptions:', subscriptionsData);
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();