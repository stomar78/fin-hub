import os
import sys
from pathlib import Path

# Ensure Django project (apps/api) is on the Python path for pytest-django
ROOT = Path(__file__).resolve().parent
API_DIR = ROOT / "apps" / "api"
if str(API_DIR) not in sys.path:
    sys.path.insert(0, str(API_DIR))

# Default settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
