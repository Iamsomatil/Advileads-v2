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
  const webhookUrl = 'https://hook.us2.make.com/ngxktsoxlku65i9e6pceti8xbjj0f4m7';
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Webhook error (${response.status}):`, errorText);
      return false;
    }

    console.log('Webhook sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending webhook:', error);
    // Don't throw the error to prevent registration from failing if webhook fails
    return false;
  }
};
