const sendFeedbackToGoogleSheet = async (count: number, type: string): Promise<void> => {
    const GOOGLE_SHEET_API_URL = 'https://script.google.com/macros/s/AKfycbygDZxra86g-gSrY8TPWW1-t2UlaU6OgPQfR2QuKtwDXg5FxYCEeM62sEEmJ-KabqF1/exec'
    const url = `${GOOGLE_SHEET_API_URL}?count=${count}&type=${type}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors', // Using no-cors mode
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      // Note: You won't be able to read the response due to no-cors mode
      console.log('Request sent:', response);
    } catch (err) {
      // Type guard to check if err is an instance of Error
      if (err instanceof Error) {
        console.error('Error sending data:', err.message);
        throw new Error(err.message);
      } else {
        console.error('Unexpected error:', err);
        throw new Error('Unexpected error occurred');
      }
    }
  };
  
  export default sendFeedbackToGoogleSheet;