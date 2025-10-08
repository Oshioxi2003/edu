"""
Management command to seed demo data.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from apps.catalog.models import Book, Unit, Asset
from apps.quiz.models import Question, Choice
from apps.common.enums import AssetType, QuestionType, UserRole

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with demo data'

    def handle(self, *args, **options):
        self.stdout.write('Seeding demo data...')

        # Create admin user
        if not User.objects.filter(email='admin@edu.vn').exists():
            admin = User.objects.create_superuser(
                email='admin@edu.vn',
                password='admin123',
                role=UserRole.ADMIN
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Created admin user: {admin.email}'))

        # Create test student
        if not User.objects.filter(email='student@test.com').exists():
            student = User.objects.create_user(
                email='student@test.com',
                password='student123',
                role=UserRole.STUDENT
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Created student user: {student.email}'))

        # Create demo book
        book, created = Book.objects.get_or_create(
            slug='ielts-listening-fundamentals',
            defaults={
                'title': 'IELTS Listening Fundamentals',
                'description': 'Master IELTS Listening with this comprehensive course covering all question types and strategies.',
                'price': 299000,
                'is_published': True,
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'✓ Created book: {book.title}'))

        # Create units
        units_data = [
            {
                'title': 'Introduction to IELTS Listening',
                'order': 1,
                'is_free': True,
                'duration_sec': 600,
                'transcript': '# Introduction\n\nWelcome to IELTS Listening course...'
            },
            {
                'title': 'Section 1: Multiple Choice Questions',
                'order': 2,
                'is_free': True,
                'duration_sec': 900,
                'transcript': '# Multiple Choice\n\nLearn how to tackle multiple choice questions...'
            },
            {
                'title': 'Section 2: Form Completion',
                'order': 3,
                'is_free': False,
                'duration_sec': 1200,
                'transcript': '# Form Completion\n\nMaster form completion techniques...'
            },
            {
                'title': 'Section 3: Note Completion',
                'order': 4,
                'is_free': False,
                'duration_sec': 1500,
                'transcript': '# Note Completion\n\nAdvanced note-taking skills...'
            },
        ]

        for unit_data in units_data:
            unit, created = Unit.objects.get_or_create(
                book=book,
                order=unit_data['order'],
                defaults=unit_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✓ Created unit: {unit.title}'))

                # Create quiz questions for free units
                if unit.is_free:
                    self._create_quiz_questions(unit)

        self.stdout.write(self.style.SUCCESS('\n✓ Demo data seeded successfully!'))
        self.stdout.write('\nLogin credentials:')
        self.stdout.write('  Admin: admin@edu.vn / admin123')
        self.stdout.write('  Student: student@test.com / student123')

    def _create_quiz_questions(self, unit):
        """Create sample quiz questions for a unit."""
        # Question 1
        q1, created = Question.objects.get_or_create(
            unit=unit,
            order=1,
            defaults={
                'type': QuestionType.SINGLE,
                'text': 'What is the main topic of this section?',
                'explanation': 'The correct answer focuses on the primary subject discussed.'
            }
        )
        if created:
            Choice.objects.create(question=q1, order=1, text='IELTS Speaking', is_correct=False)
            Choice.objects.create(question=q1, order=2, text='IELTS Listening', is_correct=True)
            Choice.objects.create(question=q1, order=3, text='IELTS Reading', is_correct=False)
            Choice.objects.create(question=q1, order=4, text='IELTS Writing', is_correct=False)

        # Question 2
        q2, created = Question.objects.get_or_create(
            unit=unit,
            order=2,
            defaults={
                'type': QuestionType.MULTI,
                'text': 'Which of the following are key strategies? (Select 2)',
                'explanation': 'Both active listening and note-taking are essential strategies.'
            }
        )
        if created:
            Choice.objects.create(question=q2, order=1, text='Active listening', is_correct=True)
            Choice.objects.create(question=q2, order=2, text='Speed reading', is_correct=False)
            Choice.objects.create(question=q2, order=3, text='Note-taking', is_correct=True)
            Choice.objects.create(question=q2, order=4, text='Guessing', is_correct=False)

