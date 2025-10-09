#!/usr/bin/env python
"""
Setup script for EduPlatform Enhanced Admin Dashboard
Run this after installing dependencies to ensure everything is configured correctly.
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model

User = get_user_model()

def print_header(text):
    """Print a formatted header."""
    print("\n" + "=" * 80)
    print(f"  {text}")
    print("=" * 80 + "\n")

def check_packages():
    """Check if all required packages are installed."""
    print_header("📦 Checking Required Packages")
    
    required_packages = [
        ('nested_admin', 'django-nested-admin'),
        ('adminsortable2', 'django-admin-sortable2'),
        ('import_export', 'django-import-export'),
        ('mutagen', 'mutagen'),
        ('itsdangerous', 'itsdangerous'),
    ]
    
    missing = []
    for module_name, package_name in required_packages:
        try:
            __import__(module_name)
            print(f"✓ {package_name} is installed")
        except ImportError:
            print(f"✗ {package_name} is MISSING")
            missing.append(package_name)
    
    if missing:
        print("\n⚠ Missing packages. Install with:")
        print(f"pip install {' '.join(missing)}")
        return False
    
    print("\n✓ All packages are installed!")
    return True

def run_migrations():
    """Run database migrations."""
    print_header("🔄 Running Database Migrations")
    
    try:
        call_command('migrate', verbosity=1)
        print("\n✓ Migrations completed successfully!")
        return True
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        return False

def collect_static():
    """Collect static files."""
    print_header("📁 Collecting Static Files")
    
    try:
        call_command('collectstatic', interactive=False, verbosity=1)
        print("\n✓ Static files collected successfully!")
        return True
    except Exception as e:
        print(f"\n✗ Static collection failed: {e}")
        return False

def create_superuser():
    """Create a superuser if none exists."""
    print_header("👤 Checking Superuser")
    
    if User.objects.filter(is_superuser=True).exists():
        print("✓ Superuser already exists")
        return True
    
    print("No superuser found. Creating one...")
    print("\nPlease enter superuser credentials:")
    
    try:
        call_command('createsuperuser')
        print("\n✓ Superuser created successfully!")
        return True
    except Exception as e:
        print(f"\n✗ Superuser creation failed: {e}")
        return False

def verify_admin_files():
    """Verify that all custom admin files exist."""
    print_header("📄 Verifying Custom Admin Files")
    
    files_to_check = [
        'apps/catalog/admin.py',
        'apps/quiz/admin.py',
        'apps/payments/admin.py',
        'apps/users/admin.py',
        'apps/progress/admin.py',
        'apps/common/utils/security.py',
        'apps/common/admin_site.py',
        'static/admin/css/custom_admin.css',
        'static/admin/js/custom_admin.js',
        'templates/admin/base_site.html',
        'templates/admin/index.html',
        'templates/admin/catalog/unit_change_form.html',
    ]
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    all_exist = True
    
    for file_path in files_to_check:
        full_path = os.path.join(base_dir, file_path)
        if os.path.exists(full_path):
            print(f"✓ {file_path}")
        else:
            print(f"✗ {file_path} - MISSING!")
            all_exist = False
    
    if all_exist:
        print("\n✓ All custom admin files are in place!")
    else:
        print("\n⚠ Some files are missing. Please check the setup.")
    
    return all_exist

def print_summary():
    """Print setup summary and next steps."""
    print_header("🎉 Setup Complete!")
    
    print("""
Admin Dashboard Features Enabled:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✨ Enhanced Features:
   • Nested inline editing (Question → Choice)
   • Drag & drop sorting for Units, Questions, Choices
   • Real-time validation for SINGLE/MULTI choice
   • Color-coded status indicators
   • Bulk actions (publish, shuffle, convert type)
   • Signed URL generation for protected media
   • Custom dashboard with statistics
   • Auto-save functionality
   • Keyboard shortcuts (Ctrl+S to save)

🎯 Next Steps:
   1. Start the development server:
      python manage.py runserver
   
   2. Access admin at:
      http://localhost:8000/admin/
   
   3. Read the complete guide:
      backend/ADMIN_DASHBOARD_GUIDE.md

📚 Quick Start Workflow:
   1. Create a Book (Catalog Management > Books)
   2. Add Units inline while creating Book
   3. Edit each Unit to:
      - Upload Audio (Assets tab)
      - Add Questions with nested Choices
      - Validate (check for green ✓)
   4. Publish Book when ready

🔧 Troubleshooting:
   • If nested admin doesn't work: Check URLs in config/urls.py
   • If CSS/JS doesn't load: Run collectstatic again
   • If validation fails: Check QuestionType (SINGLE must have exactly 1 correct)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Happy Content Creating! 🚀
""")

def main():
    """Main setup function."""
    print("""
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║              📚 EduPlatform Enhanced Admin Dashboard Setup                 ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
""")
    
    # Run all setup steps
    steps = [
        ("Checking packages", check_packages),
        ("Running migrations", run_migrations),
        ("Collecting static files", collect_static),
        ("Verifying admin files", verify_admin_files),
        ("Creating superuser", create_superuser),
    ]
    
    for step_name, step_func in steps:
        if not step_func():
            print(f"\n❌ Setup failed at: {step_name}")
            print("Please fix the errors above and run this script again.")
            sys.exit(1)
    
    print_summary()

if __name__ == '__main__':
    main()

