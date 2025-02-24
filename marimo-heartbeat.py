import websocket
import sys
import time
from contextlib import closing
import subprocess

def test_websocket_connection(url, timeout=5):
    """
    Test if a WebSocket connection can be established.
    Returns True if successful, False otherwise.
    Times out after the specified timeout (in seconds).
    """
    try:
        with closing(websocket.create_connection(url, timeout=timeout)) as ws:
            value = ws.recv()
            print("✓ Connection successful!")
            print("Received value:", value)
            return True
    except (websocket.WebSocketException, ConnectionRefusedError) as e:
        print(f"✗ Connection failed: {e}")
        return False
    except Exception as e:
        print(f"✗ Unexpected error: {e}")
        return False
def clean_start_marimo():
    try:
        subprocess.run(["pkill", "-f", "marimo"], check=True)
    except subprocess.CalledProcessError:
        # Ignore error if no marimo processes found to kill
        pass
    
    try:        
        # Start marimo server with appropriate flags
        # Use full path to marimo executable to avoid path issues

        subprocess.Popen(
            ["marimo", "-d", "edit", "--no-token", "--headless", "--allow-origins", "*"],
            cwd="ide",  # Set working directory
            stdout=open("ide/output.log", "w"),  # Update path for log file
            stderr=subprocess.STDOUT  # Redirect stderr to stdout
        )
        # Give the server time to start up
        time.sleep(2)
    except Exception as e:
        print(f"Error starting marimo: {e}")
        raise

if __name__ == "__main__":
    url = "ws://localhost:2718/ws?file=fathom-pylon.py&user_id=8a4fb888-37a9-4185-af84-aba3748062bf&notebook_id=eb56021f-546c-4b15-a853-1bd64fdb5fc6&session_id=s_t5iesi"
    
    if test_websocket_connection(url):
        print("WebSocket connection is working correctly.")
    else:
        print("WebSocket connection failed. Running fallback commands...")
        clean_start_marimo()
