"""
Simple script to populate demo data.
Run with: python populate_data.py
"""
import os
import django
import random
from decimal import Decimal

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import transaction
from django.utils import timezone
from apps.catalog.models import Book, Unit, Asset
from apps.quiz.models import Question, Choice, Attempt, AttemptAnswer
from apps.users.models import User, Profile, Enrollment
from apps.common.enums import QuestionType, AssetType, UserRole


def clear_data():
    """Clear existing demo data."""
    print('Clearing existing data...')
    AttemptAnswer.objects.all().delete()
    Attempt.objects.all().delete()
    Enrollment.objects.all().delete()
    Choice.objects.all().delete()
    Question.objects.all().delete()
    Asset.objects.all().delete()
    Unit.objects.all().delete()
    Book.objects.all().delete()
    Profile.objects.all().delete()
    User.objects.filter(role=UserRole.STUDENT, email__startswith='student').delete()
    print('✓ Data cleared\n')


def create_users(count=10):
    """Create student users."""
    print(f'Creating {count} users...')
    users = []
    
    for i in range(1, count + 1):
        email = f'student{i}@example.com'
        
        # Skip if exists
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            users.append(user)
            print(f'  ✓ Found existing {email}')
            continue
        
        user = User.objects.create_user(
            email=email,
            password='password123',
            role=UserRole.STUDENT,
            is_active=True
        )
        
        # Create profile only if it doesn't exist
        profile, created = Profile.objects.get_or_create(
            user=user,
            defaults={
                'display_name': f'Student {i}',
                'bio': f'This is demo student account #{i}'
            }
        )
        
        users.append(user)
        print(f'  ✓ Created {email}')
    
    return users


def get_unit_title(number):
    """Generate unit title."""
    titles = [
        'Introduction and Basic Concepts',
        'Core Fundamentals',
        'Practical Applications',
        'Advanced Techniques',
        'Common Mistakes to Avoid',
        'Real-world Examples',
        'Practice and Exercises',
        'Review and Assessment',
        'Special Topics',
        'Final Project',
    ]
    return titles[number - 1] if number <= len(titles) else f'Topic {number}'


def get_transcript_content(number):
    """Generate transcript content."""
    return f"""# Lesson {number} Transcript

## Introduction
Welcome to this lesson. In this unit, we will explore important concepts and practice key skills.

## Main Content
Here we dive deep into the topic, providing detailed explanations and examples.

### Key Points
- Important concept 1
- Important concept 2
- Important concept 3

## Practice
Now let's practice what we've learned with some exercises.

## Summary
In this lesson, we covered the essential concepts and practiced applying them.
"""


def get_question_text(number, topic):
    """Generate question text."""
    questions = [
        f'What is the main purpose of {topic.lower()}?',
        f'Which of the following is correct regarding {topic.split()[0]}?',
        f'How would you apply this concept in real-world scenarios?',
        f'What are the key characteristics of this topic?',
        f'Which statement best describes the fundamental principle?',
        f'What should you avoid when practicing {topic.split()[0]}?',
        f'How can you improve your understanding of this concept?',
        f'What is the most effective strategy for mastering this?',
        f'Which example best illustrates the concept?',
        f'What are the common mistakes beginners make?',
    ]
    return questions[number - 1] if number <= len(questions) else f'Question {number} about {topic}'


def get_choice_text(number, question_num):
    """Generate choice text."""
    prefixes = ['Option', 'Answer', 'Choice', 'Alternative']
    prefix = prefixes[(question_num - 1) % len(prefixes)]
    return f'{prefix} {number}: This is a possible answer to the question.'


def get_explanation():
    """Generate explanation text."""
    explanations = [
        'The correct answer is based on the fundamental principles we discussed.',
        'This concept is important because it forms the foundation of understanding.',
        'Remember to apply this principle in practical situations.',
        'This is a key concept that you should master.',
        'Understanding this will help you in more advanced topics.',
    ]
    return random.choice(explanations)


def create_books(num_books=10, num_units=10, num_questions=10):
    """Create books with units, questions, and choices."""
    print(f'\nCreating {num_books} books...')
    books = []
    
    # Book topics
    topics = [
        'English Grammar Fundamentals',
        'Advanced English Vocabulary',
        'Business English Communication',
        'TOEIC Preparation Course',
        'IELTS Speaking Practice',
        'English Pronunciation Mastery',
        'Writing Skills Development',
        'Reading Comprehension Strategies',
        'Listening Skills Enhancement',
        'English for Academic Purposes',
    ]
    
    for i in range(1, num_books + 1):
        topic = topics[i - 1] if i <= len(topics) else f'English Course {i}'
        slug = f'book-{i}'
        
        # Skip if book exists
        if Book.objects.filter(slug=slug).exists():
            book = Book.objects.get(slug=slug)
            print(f'  [{i}/{num_books}] Found existing book: {topic}')
            books.append(book)
            continue
        
        book = Book.objects.create(
            title=topic,
            slug=slug,
            description=f'Comprehensive course on {topic.lower()}. This course includes {num_units} units covering various aspects of the topic with interactive quizzes.',
            price=Decimal(random.choice([0, 99000, 199000, 299000, 399000])),
            is_published=random.choice([True, True, False])  # 2/3 published
        )
        
        print(f'  [{i}/{num_books}] Created book: {topic}')
        
        # Create units for this book
        for j in range(1, num_units + 1):
            # Skip if unit exists
            if Unit.objects.filter(book=book, order=j).exists():
                continue
                
            unit = Unit.objects.create(
                book=book,
                title=f'Unit {j}: {get_unit_title(j)}',
                transcript=get_transcript_content(j),
                is_free=(j <= 2),  # First 2 units are free
                order=j,
                duration_sec=random.randint(300, 1800)  # 5-30 minutes
            )
            
            # Create audio asset for unit (without actual file)
            if not Asset.objects.filter(unit=unit, type=AssetType.AUDIO).exists():
                Asset.objects.create(
                    unit=unit,
                    type=AssetType.AUDIO,
                    file_path=f'/media/audio/book{i}_unit{j}.mp3',
                    bytes=random.randint(1000000, 5000000),
                    checksum=f'demo_checksum_{i}_{j}',
                    is_protected=True
                )
            
            # Create questions for this unit
            for k in range(1, num_questions + 1):
                # Skip if question exists
                if Question.objects.filter(unit=unit, order=k).exists():
                    continue
                    
                question_type = random.choice([QuestionType.SINGLE, QuestionType.MULTI])
                
                question = Question.objects.create(
                    unit=unit,
                    type=question_type,
                    text=get_question_text(k, topic),
                    explanation=f'This is the explanation for question {k}. {get_explanation()}',
                    order=k
                )
                
                # Create choices for this question
                if not Choice.objects.filter(question=question).exists():
                    num_choices = 4
                    if question_type == QuestionType.SINGLE:
                        correct_choice = random.randint(1, num_choices)
                        for c in range(1, num_choices + 1):
                            Choice.objects.create(
                                question=question,
                                text=get_choice_text(c, k),
                                is_correct=(c == correct_choice),
                                order=c
                            )
                    else:  # MULTI
                        num_correct = random.randint(1, 2)
                        correct_choices = random.sample(range(1, num_choices + 1), num_correct)
                        for c in range(1, num_choices + 1):
                            Choice.objects.create(
                                question=question,
                                text=get_choice_text(c, k),
                                is_correct=(c in correct_choices),
                                order=c
                            )
        
        books.append(book)
    
    return books


def create_enrollments(users, books):
    """Create enrollments for users in books."""
    print(f'\nCreating enrollments...')
    enrollments = []
    
    for user in users:
        # Each user enrolls in 3-7 random books
        num_enrollments = random.randint(3, min(7, len(books)))
        enrolled_books = random.sample(books, num_enrollments)
        
        for book in enrolled_books:
            # Skip if enrollment exists
            if not Enrollment.objects.filter(user=user, book=book).exists():
                enrollment = Enrollment.objects.create(
                    user=user,
                    book=book,
                    is_active=True
                )
                enrollments.append(enrollment)
    
    print(f'  ✓ Created {len(enrollments)} enrollments')
    return enrollments


def create_attempts(users, books):
    """Create quiz attempts for enrolled users."""
    print(f'\nCreating quiz attempts...')
    attempts = []
    
    for user in users:
        # Get user's enrolled books
        enrolled_books = Book.objects.filter(enrollments__user=user)
        
        for book in enrolled_books:
            # Attempt quizzes for some units (randomly)
            units = list(book.units.all())
            num_attempts = random.randint(1, min(5, len(units)))
            attempted_units = random.sample(units, num_attempts)
            
            for unit in attempted_units:
                questions = list(unit.questions.all())
                if not questions:
                    continue
                
                # Skip if attempt exists
                if Attempt.objects.filter(user=user, unit=unit).exists():
                    continue
                
                # Create attempt
                attempt = Attempt.objects.create(
                    user=user,
                    unit=unit,
                    started_at=timezone.now(),
                    submitted_at=timezone.now()
                )
                
                # Answer questions
                correct_count = 0
                for question in questions:
                    choices = list(question.choices.all())
                    correct_choices = [c.id for c in choices if c.is_correct]
                    
                    # Simulate answer (70% chance of correct)
                    if random.random() < 0.7:
                        selected = correct_choices
                        is_correct = True
                        correct_count += 1
                    else:
                        # Wrong answer
                        if question.type == QuestionType.SINGLE:
                            wrong_choices = [c.id for c in choices if not c.is_correct]
                            selected = [random.choice(wrong_choices)] if wrong_choices else [choices[0].id]
                        else:
                            selected = random.sample([c.id for c in choices], random.randint(1, len(choices)))
                        is_correct = False
                    
                    AttemptAnswer.objects.create(
                        attempt=attempt,
                        question=question,
                        selected_choices=selected,
                        is_correct=is_correct
                    )
                
                # Update score
                total_questions = len(questions)
                attempt.score_raw = correct_count
                attempt.score_pct = (correct_count / total_questions * 100) if total_questions > 0 else 0
                attempt.save()
                
                attempts.append(attempt)
    
    print(f'  ✓ Created {len(attempts)} quiz attempts')
    return attempts


def main():
    """Main function to populate data."""
    print('='*60)
    print('POPULATING DEMO DATA')
    print('='*60)
    
    # Uncomment to clear existing data
    # clear_data()
    
    with transaction.atomic():
        # Create users
        users = create_users(10)
        
        # Create books with units, questions, and assets
        books = create_books(10, 10, 10)
        
        # Create enrollments
        enrollments = create_enrollments(users, books)
        
        # Create attempts with answers
        attempts = create_attempts(users, books)
    
    print('\n' + '='*60)
    print('SUMMARY')
    print('='*60)
    print(f'Users:       {User.objects.filter(role=UserRole.STUDENT).count()}')
    print(f'Books:       {Book.objects.count()}')
    print(f'Units:       {Unit.objects.count()}')
    print(f'Assets:      {Asset.objects.count()}')
    print(f'Questions:   {Question.objects.count()}')
    print(f'Choices:     {Choice.objects.count()}')
    print(f'Enrollments: {Enrollment.objects.count()}')
    print(f'Attempts:    {Attempt.objects.count()}')
    print(f'Answers:     {AttemptAnswer.objects.count()}')
    print('='*60)
    print('✓ Demo data populated successfully!')
    print('='*60)


if __name__ == '__main__':
    main()

