async function runTest() {
  try {
    // 1. Register a test user
    const regRes = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'TestUser',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        profileImageUrl: ''
      })
    });
    const regData = await regRes.json();
    const token = regData.token;
    console.log('Registered, got token:', token.substring(0, 15) + '...');

    // 2. Call the AI endpoint
    const aiRes = await fetch('http://localhost:8000/api/ai/generate-questions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        role: 'Frontend Developer',
        experience: 2,
        topicsToFocus: 'React',
        numberOfQuestions: 2
      })
    });
    
    if (!aiRes.ok) {
        const err = await aiRes.text();
        console.error('Server returned error:', aiRes.status, err);
        return;
    }
    
    const aiData = await aiRes.json();
    console.log('AI Response:', JSON.stringify(aiData).substring(0, 100));

  } catch (error) {
    console.error('Request failed:', error.message);
  }
}
runTest();
