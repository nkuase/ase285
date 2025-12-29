#!/usr/bin/env python3
"""
Simple Socket.IO CLI Test Client
Install: pip install python-socketio[client]
Run: python test-cli.py
"""

import socketio
import time

# Create a Socket.IO client
sio = socketio.Client()

# Connection events
@sio.event
def connect():
    print('✓ Connected to server')
    print(f'✓ Socket ID: {sio.sid}\n')

@sio.event
def disconnect():
    print('✗ Disconnected from server')

# Response handlers
@sio.on('echo-response')
def on_echo_response(message):
    print(f'[Echo Response] {message}')

@sio.on('broadcast-message')
def on_broadcast_message(data):
    print(f"[Broadcast] From {data['from']}: {data['message']}")

@sio.on('room-joined')
def on_room_joined(room_name):
    print(f'[Room] Joined: {room_name}')

@sio.on('room-message-received')
def on_room_message_received(data):
    print(f"[Room Message] From {data['from']}: {data['message']}")

@sio.on('current-time')
def on_current_time(time_str):
    print(f'[Server Time] {time_str}\n')

def run_tests():
    """Run all API tests"""
    print('--- Running API Tests ---\n')
    
    # Test 1: Echo
    time.sleep(0.5)
    print('Test 1: Echo API')
    sio.emit('echo', 'Hello from Python CLI!')
    
    # Test 2: Broadcast
    time.sleep(1)
    print('\nTest 2: Broadcast API')
    sio.emit('broadcast', 'Broadcasting from Python CLI!')
    
    # Test 3: Room
    time.sleep(1)
    print('\nTest 3: Room API')
    sio.emit('join-room', 'test-room')
    
    time.sleep(0.5)
    sio.emit('room-message', {
        'room': 'test-room',
        'message': 'Hello room from Python CLI!'
    })
    
    # Test 4: Get Time
    time.sleep(0.5)
    print('\nTest 4: Get Time API')
    sio.emit('get-time')
    
    # Wait for responses
    time.sleep(1)
    print('\n--- Tests Complete ---')

if __name__ == '__main__':
    try:
        print('Connecting to Socket.IO server...\n')
        
        # Connect to server
        sio.connect('http://localhost:5000')
        
        # Run tests
        run_tests()
        
        # Disconnect
        sio.disconnect()
        
    except Exception as e:
        print(f'Error: {e}')
