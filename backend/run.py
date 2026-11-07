import sys
import os
from pathlib import Path

# Add project root directory to sys.path and PYTHONPATH
project_root = Path(__file__).resolve().parent.parent
if str(project_root) not in sys.path:
    sys.path.insert(0, str(project_root))

if "PYTHONPATH" in os.environ:
    os.environ["PYTHONPATH"] = f"{project_root};{os.environ['PYTHONPATH']}"
else:
    os.environ["PYTHONPATH"] = str(project_root)

import uvicorn
from backend.app.config import HOST, PORT

if __name__ == "__main__":
    print(f"Starting FinNova FastAPI Backend on http://{HOST}:{PORT}")
    print(f"Interactive API Docs: http://{HOST}:{PORT}/docs")
    uvicorn.run("backend.app.main:app", host=HOST, port=PORT, reload=False, app_dir=str(project_root))
