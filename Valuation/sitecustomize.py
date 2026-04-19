# Ensure Django project path is importable for pytest and scripts
import sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent
API_DIR = ROOT / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))
