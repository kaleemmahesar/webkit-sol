// WordPress API base URL
const WORDPRESS_API_URL = 'http://localhost/webkit-sol/wordpress/wp-json';
const CUSTOM_API_URL = 'http://localhost/webkit-sol/wordpress/wp-json/custom/v1';

// Helper function to decode HTML entities
function decodeHtmlEntities(text) {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

// User authentication
export const loginUser = async (email, password) => {
  const response = await fetch('http://localhost/webkit-sol/wordpress/wp-json/jwt-auth/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: email, password })
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// User registration - using our custom endpoint
export const registerUser = async (userData) => {
  // Register the user using our custom endpoint
  const registerResponse = await fetch(`${CUSTOM_API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: userData.email,
      email: userData.email,
      password: userData.password,
      first_name: userData.name.split(' ')[0] || userData.name,
      last_name: userData.name.split(' ').slice(1).join(' ') || ''
    })
  });
  
  if (!registerResponse.ok) {
    const errorData = await registerResponse.json();
    throw new Error(errorData.message || `HTTP error! status: ${registerResponse.status}`);
  }
  
  const registeredUser = await registerResponse.json();
  
  // Then, log in the user to get a JWT token
  const loginData = await loginUser(userData.email, userData.password);
  
  return {
    user: registeredUser,
    token: loginData.token
  };
};

// Fetch products
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const products = await response.json();
    
    // Transform the response to match our frontend structure
    return products.map(product => ({
      id: product.id,
      name: product.title.rendered,
      thumbnail: product.acf?.thumbnail || '📦',
      description: product.acf?.description || '',
      startingPrice: parseFloat(product.acf?.starting_price) || 0,
      features: product.acf?.features || [],
      plans: (product.acf?.plans || []).map(plan => ({
        id: `${product.id}-${plan.period}`, // Generate a unique ID
        name: plan.plan_name || `${plan.period} Plan`,
        price: parseFloat(plan.price) || 0,
        period: plan.period || 'monthly',
        features: plan.plan_features || []
      }))
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Fetch subscriptions for a user - using our custom endpoint
export const fetchSubscriptions = async (token) => {
  try {
    const response = await fetch(`${CUSTOM_API_URL}/subscriptions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // For 404, return empty array as it means no subscriptions exist yet
      if (response.status === 404) {
        return [];
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const subscriptions = await response.json();
    
    // Transform the response to match our frontend structure
    return subscriptions.map(sub => {
      // Extract plan information
      let planInfo = {
        id: sub.plan || 0,
        name: 'Unknown Plan',
        price: 0,
        period: 'monthly',
        features: []
      };
      
      // If plan is a string, try to extract period from it
      if (typeof sub.plan === 'string') {
        planInfo.name = sub.plan;
        // Try to extract period from string like "1-monthly"
        const periodMatch = sub.plan.match(/-(\w+)$/);
        if (periodMatch) {
          planInfo.period = periodMatch[1];
        }
      } else if (typeof sub.plan === 'number') {
        planInfo.name = `Plan ${sub.plan}`;
      }
      
      return {
        id: sub.id,
        userId: String(sub.user_id || ''),  // Keep as string to match API response
        product: typeof sub.product === 'object' ? sub.product.post_title : sub.product || 'Unknown Product',
        plan: planInfo,
        startDate: sub.start_date && sub.start_date !== 'Invalid Date' ? sub.start_date : '',
        nextBillingDate: sub.next_billing_date && sub.next_billing_date !== 'Invalid Date' ? sub.next_billing_date : '',
        status: sub.status || 'inactive'
      };
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    // Return empty array to prevent app crash
    return [];
  }
};

// Create subscription - using our custom endpoint
export const createSubscription = async (subscriptionData, token) => {
  try {
    const response = await fetch(`${CUSTOM_API_URL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product: subscriptionData.product,
        plan_id: parseInt(subscriptionData.planId, 10), // Convert to integer
        start_date: subscriptionData.startDate,
        next_billing_date: subscriptionData.nextBillingDate
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const subscription = await response.json();
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData, token) => {
  try {
    const response = await fetch(`${CUSTOM_API_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export { CUSTOM_API_URL };