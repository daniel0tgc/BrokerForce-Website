#!/bin/bash

# BrokerForce Development Server Startup Script
# This script starts both the Google Auth backend and React frontend

echo "🚀 Starting BrokerForce Development Servers..."
echo ""

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "❌ Port $1 is already in use. Please stop the service using port $1 and try again."
        exit 1
    fi
}

# Check if ports are available
echo "🔍 Checking if ports are available..."
check_port 3001
check_port 5173
echo "✅ Ports are available"
echo ""

# Start the Google Auth backend server
echo "🔐 Starting Google Auth Backend Server..."
cd google-login-demo
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found in google-login-demo/"
    echo "   Please copy env.example to .env and configure your Google OAuth credentials"
    echo "   See GOOGLE_LOGIN_SETUP.md for detailed instructions"
    echo ""
fi

# Start backend in background
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start the React frontend
echo "⚛️  Starting React Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 Both servers are starting up!"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔐 Backend:  http://localhost:3001"
echo ""
echo "📖 Setup Guide: GOOGLE_LOGIN_SETUP.md"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
