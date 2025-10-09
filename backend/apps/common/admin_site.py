"""
Custom admin site with organized app groups and enhanced navigation.
"""
from django.contrib import admin
from django.utils.translation import gettext_lazy as _


class CustomAdminSite(admin.AdminSite):
    """
    Custom admin site with better organization and branding.
    """
    site_header = "📚 EduPlatform Administration"
    site_title = "EduPlatform Admin"
    index_title = "Content Management Dashboard"
    
    def get_app_list(self, request):
        """
        Organize apps into logical groups.
        
        Groups:
        - Catalog: Book, Unit, Asset
        - Quiz: Question, Choice, Attempt
        - Payments: Order, Transaction
        - Users: User, Profile, Enrollment
        - Progress: UserProgress, ListeningSession
        - System: Site, etc.
        """
        app_dict = self._build_app_dict(request)
        
        # Define custom app groups
        app_groups = {
            '📖 Catalog Management': [
                ('catalog', 'Book'),
                ('catalog', 'Unit'),
                ('catalog', 'Asset'),
            ],
            '❓ Quiz & Questions': [
                ('quiz', 'Question'),
                ('quiz', 'Choice'),
                ('quiz', 'Attempt'),
                ('quiz', 'Attempt Answer'),
            ],
            '💰 Payments & Orders': [
                ('payments', 'Order'),
                ('payments', 'Transaction'),
            ],
            '👥 Users & Access': [
                ('users', 'User'),
                ('users', 'Profile'),
                ('users', 'Enrollment'),
            ],
            '📊 Progress & Analytics': [
                ('progress', 'User Progress'),
                ('progress', 'Listening Session'),
            ],
            '⚙️ System': [
                ('auth', 'Group'),
                ('sites', 'Site'),
            ],
        }
        
        # Build organized app list
        organized_list = []
        
        for group_name, models_list in app_groups.items():
            group_models = []
            
            for app_label, model_name in models_list:
                # Find the model in app_dict
                if app_label in app_dict:
                    app = app_dict[app_label]
                    for model in app['models']:
                        if model['name'] == model_name or model['object_name'] == model_name:
                            group_models.append(model)
                            break
            
            if group_models:
                organized_list.append({
                    'name': group_name,
                    'app_label': group_name.lower().replace(' ', '_'),
                    'app_url': '#',
                    'has_module_perms': True,
                    'models': group_models,
                })
        
        # Add any remaining apps that weren't categorized
        categorized_apps = {app_label for _, models in app_groups.items() for app_label, _ in models}
        for app_label, app in app_dict.items():
            if app_label not in categorized_apps and app['models']:
                organized_list.append(app)
        
        return organized_list
    
    def each_context(self, request):
        """
        Add custom context to admin templates.
        """
        context = super().each_context(request)
        
        # Add quick stats if on index page
        if request.path == '/admin/' or request.path == '/admin':
            try:
                from django.db.models import Sum
                from apps.catalog.models import Book, Unit
                from apps.users.models import User, Enrollment
                from apps.payments.models import Order
                from apps.common.enums import OrderStatus
                
                context['quick_stats'] = {
                    'total_books': Book.objects.count(),
                    'published_books': Book.objects.filter(is_published=True).count(),
                    'total_units': Unit.objects.count(),
                    'total_users': User.objects.filter(is_active=True).count(),
                    'active_enrollments': Enrollment.objects.filter(is_active=True).count(),
                    'pending_orders': Order.objects.filter(status=OrderStatus.PENDING).count(),
                    'total_revenue': Order.objects.filter(status=OrderStatus.PAID).aggregate(
                        total=Sum('amount')
                    )['total'] or 0,
                }
            except Exception:
                context['quick_stats'] = {}
        
        return context


# Create custom admin site instance
custom_admin_site = CustomAdminSite(name='custom_admin')

