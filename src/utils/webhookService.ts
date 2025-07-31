interface WebhookData {
  event: string;
  userId: string;
  email: string;
  name: string;
  planType: string;
  registrationDate: string;
  trialEndDate: string | null;
  source: string;
}

export const sendToWebhook = async (data: WebhookData): Promise<boolean> => {
  const webhookUrl = 'https://hook.us2.make.com/2zd6obglo94brdjxribo1n1ct3g6j8oi';
  
  try {
    const payload = {
      data: data // Wrap the data in a 'data' object for better structure in Make.com
    };

    console.log('Sending webhook with data:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log('Webhook response status:', response.status);
    console.log('Webhook response:', responseText);

    if (!response.ok) {
      console.error(`Webhook error (${response.status}):`, responseText);
      return false;
    }

    console.log('Webhook sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending webhook:', error);
    return false;
  }
};
