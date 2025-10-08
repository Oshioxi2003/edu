"""
Models for catalog (books, units, assets).
"""
from django.db import models
from django.utils.text import slugify
from apps.common.enums import AssetType
from apps.common.mixins import TimestampMixin, OrderingMixin


class Book(TimestampMixin):
    """Book/Course model."""
    
    title = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    description = models.TextField(blank=True)
    cover = models.ImageField(upload_to='covers/', null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_published = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'catalog_book'
        verbose_name = 'Book'
        verbose_name_plural = 'Books'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """Auto-generate slug from title if not provided."""
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def unit_count(self):
        """Return number of units in this book."""
        return self.units.count()

    @property
    def free_units_count(self):
        """Return number of free units."""
        return self.units.filter(is_free=True).count()


class Unit(TimestampMixin, OrderingMixin):
    """Unit/Lesson model within a book."""
    
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='units')
    title = models.CharField(max_length=200)
    transcript = models.TextField(blank=True, help_text='Transcript in markdown format')
    is_free = models.BooleanField(default=False, db_index=True)
    duration_sec = models.PositiveIntegerField(default=0, help_text='Duration in seconds')
    
    class Meta:
        db_table = 'catalog_unit'
        verbose_name = 'Unit'
        verbose_name_plural = 'Units'
        ordering = ['book', 'order']
        unique_together = [['book', 'order']]
        indexes = [
            models.Index(fields=['book', 'order']),
            models.Index(fields=['book', 'is_free']),
        ]

    def __str__(self):
        return f"{self.book.title} - {self.title}"

    @property
    def duration_formatted(self):
        """Return duration in MM:SS format."""
        minutes = self.duration_sec // 60
        seconds = self.duration_sec % 60
        return f"{minutes:02d}:{seconds:02d}"

    def has_quiz(self):
        """Check if unit has quiz questions."""
        return self.questions.exists()


class Asset(TimestampMixin):
    """Asset (audio, PDF, subtitle) for a unit."""
    
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='assets')
    type = models.CharField(max_length=20, choices=AssetType.choices, db_index=True)
    file = models.FileField(upload_to='assets/')
    file_path = models.CharField(max_length=500, blank=True)  # For external storage
    bytes = models.PositiveIntegerField(default=0)
    checksum = models.CharField(max_length=64, blank=True)
    is_protected = models.BooleanField(default=True, help_text='Require signed URL')
    
    class Meta:
        db_table = 'catalog_asset'
        verbose_name = 'Asset'
        verbose_name_plural = 'Assets'
        indexes = [
            models.Index(fields=['unit', 'type']),
        ]

    def __str__(self):
        return f"{self.unit.title} - {self.get_type_display()}"

    @property
    def size_formatted(self):
        """Return file size in human-readable format."""
        if self.bytes < 1024:
            return f"{self.bytes} B"
        elif self.bytes < 1024 * 1024:
            return f"{self.bytes / 1024:.2f} KB"
        else:
            return f"{self.bytes / (1024 * 1024):.2f} MB"

