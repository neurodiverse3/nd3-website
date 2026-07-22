export const runtime = 'nodejs';

const POLAR_ENV = process.env.NEXT_PUBLIC_POLAR_ENV || 'sandbox';
const POLAR_API_BASE = POLAR_ENV === 'production' 
  ? 'https://api.polar.sh' 
  : 'https://sandbox-api.polar.sh';

export async function POST(request) {
  try {
    const { cartItems } = await request.json();
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart is empty or invalid.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = process.env.POLAR_ACCESS_TOKEN;
    const productId = process.env.POLAR_PRODUCT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (!token || token === 'replace-with-polar-access-token' || token === 'polar_at_mock_placeholder_for_development') {
      return new Response(JSON.stringify({ 
        error: 'Polar API configuration is missing or using placeholder in .env.local. Please set POLAR_ACCESS_TOKEN.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!productId || productId === 'replace-with-polar-generic-product-id' || productId === 'prod_mock_placeholder_for_development') {
      return new Response(JSON.stringify({ 
        error: 'Polar Product ID is missing or using placeholder in .env.local. Please set POLAR_PRODUCT_ID.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Calculate total price in cents/pence (Polar requires integers in smallest unit)
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const totalAmountCents = Math.round(totalAmount * 100);

    const successUrl = `${appUrl}/store/success?checkout_id={CHECKOUT_ID}`;
    
    const payload = {
      products: [productId],
      prices: {
        [productId]: [
          {
            amount_type: 'fixed',
            price_amount: totalAmountCents,
            price_currency: 'gbp' // default currency to GBP
          }
        ]
      },
      success_url: successUrl,
      metadata: {
        product_slugs: cartItems.map(item => item.slug).join(','),
        product_ids: cartItems.map(item => item.id).join(','),
        product_names: cartItems.map(item => item.title).join(',')
      }
    };

    console.log(`[Polar API] Creating checkout session at ${POLAR_API_BASE}/v1/checkouts/ with payload:`, JSON.stringify(payload));

    const response = await fetch(`${POLAR_API_BASE}/v1/checkouts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Polar API Error] ${response.status} ${response.statusText}:`, errorText);
      return new Response(JSON.stringify({ error: `Polar API error: ${errorText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify({ url: data.url, id: data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[Checkout Route Error]', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const checkoutId = searchParams.get('checkout_id');

    if (!checkoutId) {
      return new Response(JSON.stringify({ error: 'Missing checkout_id parameter.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = process.env.POLAR_ACCESS_TOKEN;

    if (!token || token === 'replace-with-polar-access-token' || token === 'polar_at_mock_placeholder_for_development') {
      return new Response(JSON.stringify({ error: 'Polar API credentials missing.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`${POLAR_API_BASE}/v1/checkouts/${checkoutId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `Polar API error: ${errorText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify({ 
      status: data.status, 
      metadata: data.metadata,
      product_id: data.product_id,
      product: data.product,
      products: data.products
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[Checkout Status Route Error]', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
