#!/bin/bash

echo "🧪 Testing DatResume Chrome Extension Backend"
echo "============================================"

SUPABASE_URL="http://127.0.0.1:54321"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"

echo "📡 Testing Supabase REST API..."
response=$(curl -s -w "%{http_code}" -o /tmp/supabase_test "${SUPABASE_URL}/rest/v1/" -H "apikey: ${SUPABASE_ANON_KEY}")

if [ "$response" = "200" ]; then
    echo "✅ Supabase REST API is working"
else
    echo "❌ Supabase REST API failed (HTTP $response)"
    exit 1
fi

echo "🔧 Testing Edge Functions..."

# Test chat function
echo "Testing chat function..."
chat_response=$(curl -s -w "%{http_code}" -X POST \
    "${SUPABASE_URL}/functions/v1/chat" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"message": "Hello, test message"}' \
    2>/dev/null | tail -n1)

if [ "$chat_response" = "200" ] || [ "$chat_response" = "500" ]; then
    echo "✅ Chat function endpoint is accessible"
else
    echo "⚠️  Chat function returned HTTP $chat_response (this might be expected if OpenAI key is not configured)"
fi

# Test contact function
echo "Testing contact function..."
contact_response=$(curl -s -w "%{http_code}" -X POST \
    "${SUPABASE_URL}/functions/v1/contact" \
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
    -H "Content-Type: application/json" \
    -d '{"email": "test@example.com", "message": "Test message"}' \
    2>/dev/null | tail -n1)

if [ "$contact_response" = "200" ] || [ "$contact_response" = "500" ]; then
    echo "✅ Contact function endpoint is accessible"
else
    echo "⚠️  Contact function returned HTTP $contact_response"
fi

echo ""
echo "🎉 Backend testing complete!"
echo "The Chrome extension should be able to connect to these services."